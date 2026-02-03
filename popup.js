document.getElementById("summarize").addEventListener("click", async () => {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = '<div class="loading"><div class="loader"></div></div>';

  const summaryType = document.getElementById("summary-type").value;

  // Get API key from storage
  chrome.storage.sync.get(["geminiApiKey"], async (result) => {
    if (!result.geminiApiKey) {
      resultDiv.innerHTML =
        "API key not found. Please <a href='javascript:chrome.runtime.openOptionsPage()'>set your API key</a> in the extension options.";
      return;
    }

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      chrome.tabs.sendMessage(
        tab.id,
        { type: "GET_ARTICLE_TEXT" },
        async (res) => {
          if (chrome.runtime.lastError) {
            resultDiv.innerText =
              "Error: Could not access page content. This page may not be accessible by the extension.";
            return;
          }

          if (!res || !res.text) {
            resultDiv.innerText =
              res?.error || "Could not extract article text from this page. Please ensure the page has sufficient content.";
            return;
          }

          try {
            const summary = await getGeminiSummary(
              res.text,
              summaryType,
              result.geminiApiKey
            );
            resultDiv.innerText = summary;
          } catch (error) {
            resultDiv.innerText = `Error: ${
              error.message || "Failed to generate summary. Please try again."
            }`;
          }
        }
      );
    } catch (error) {
      resultDiv.innerText = `Error: ${error.message || "Failed to process this page."}`;
    }
  });
});

document.getElementById("copy-btn").addEventListener("click", () => {
  const resultDiv = document.getElementById("result");
  const summaryText = resultDiv.innerText;

  if (!summaryText || summaryText.trim() === "" || summaryText.includes("Select a summary type") || summaryText.includes("Error:")) {
    alert("No valid summary to copy. Please generate a summary first.");
    return;
  }

  navigator.clipboard
    .writeText(summaryText)
    .then(() => {
      const copyBtn = document.getElementById("copy-btn");
      const originalText = copyBtn.innerText;

      copyBtn.innerText = "Copied!";
      setTimeout(() => {
        copyBtn.innerText = originalText;
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy text to clipboard.");
    });
});

async function getGeminiSummary(text, summaryType, apiKey) {
  if (!text || text.trim().length === 0) {
    throw new Error("No content to summarize");
  }

  // Validate API key format
  if (!apiKey || apiKey.trim().length < 20) {
    throw new Error("Invalid API key. Please check your settings.");
  }

  // Truncate very long texts to avoid API limits (typically around 30K tokens)
  const maxLength = 20000;
  const truncatedText =
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  let prompt;
  switch (summaryType) {
    case "brief":
      prompt = `Provide a brief summary of the following article in 2-3 sentences:\n\n${truncatedText}`;
      break;
    case "detailed":
      prompt = `Provide a detailed summary of the following article, covering all main points and key details:\n\n${truncatedText}`;
      break;
    case "bullets":
      prompt = `Summarize the following article in 5-7 key points. Format each point as a line starting with "- " (dash followed by a space). Do not use asterisks or other bullet symbols, only use the dash. Keep each point concise and focused on a single key insight from the article:\n\n${truncatedText}`;
      break;
    default:
      prompt = `Summarize the following article:\n\n${truncatedText}`;
  }

  // Try multiple model names as fallback (using current Gemini models)
  // Using v1beta API as it has the best model support
  const modelConfigs = [
    { apiVersion: "v1beta", model: "gemini-2.5-flash" },
    { apiVersion: "v1beta", model: "gemini-3-flash-preview" },
    { apiVersion: "v1beta", model: "gemini-2.5-flash-lite" },
    { apiVersion: "v1beta", model: "gemini-1.5-flash-001" },
    { apiVersion: "v1beta", model: "gemini-1.5-flash" },
  ];
  
  let lastError = null;
  
  for (const { apiVersion, model } of modelConfigs) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }],
                },
              ],
              safetySettings: [
                {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_NONE",
                },
                {
                  category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                  threshold: "BLOCK_NONE",
                },
                {
                  category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                  threshold: "BLOCK_NONE",
                },
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_NONE",
                },
                {
                  category: "HARM_CATEGORY_CIVIC_INTEGRITY",
                  threshold: "BLOCK_NONE",
                },
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 2048,
              },
            }),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          const errorMessage = errorData?.error?.message || "API request failed";
          
          // If it's a model not found error, try next model
          if (errorMessage.includes("not found") || errorMessage.includes("not supported")) {
            lastError = new Error(errorMessage);
            continue; // Try next model
          }
          
          if (errorMessage.includes("API key") || errorMessage.includes("authentication")) {
            throw new Error("Invalid API key. Please check your settings.");
          } else if (errorMessage.includes("quota")) {
            throw new Error("API quota exceeded. Please try again later.");
          }
          throw new Error(errorMessage);
        }

        const data = await res.json();
        const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!summary) {
          throw new Error("No summary generated. Please try again.");
        }
        
        return summary;
      } catch (error) {
        // If it's not a model-related error, throw immediately
        const errorMsg = error.message || String(error);
        if (!errorMsg.includes("not found") && !errorMsg.includes("not supported") && !errorMsg.includes("is not found")) {
          console.error("Error calling Gemini API:", error);
          throw error;
        }
        lastError = error;
        continue; // Try next model
      }
  }
  
  // If all models failed, throw the last error
  console.error("All model attempts failed. Last error:", lastError);
  throw lastError || new Error("Failed to connect to Gemini API. Please check your API key and try again.");
}