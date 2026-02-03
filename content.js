function getArticleText() {
  // Try to get article from common article selectors
  const selectors = [
    "article",
    "[role='main']",
    "main",
    ".article-content",
    ".post-content",
    ".entry-content",
    "[itemtype*='Article']"
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.innerText?.trim();
      if (text && text.length > 100) {
        return text;
      }
    }
  }

  // Remove script, style, and nav elements
  const clone = document.documentElement.cloneNode(true);
  const elementsToRemove = clone.querySelectorAll("script, style, nav, footer, .sidebar, .navigation");
  elementsToRemove.forEach(el => el.remove());

  // Get all paragraphs
  const paragraphs = Array.from(clone.querySelectorAll("p"));
  const text = paragraphs
    .map((p) => p.innerText?.trim())
    .filter((text) => text && text.length > 0)
    .join("\n");

  if (text && text.length > 100) {
    return text;
  }

  // Last resort: get body text
  return document.body.innerText || "No content found";
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  try {
    if (req.type === "GET_ARTICLE_TEXT") {
      const text = getArticleText();
      if (!text || text.length < 50) {
        sendResponse({ text: "", error: "Not enough content found on this page" });
      } else {
        sendResponse({ text, error: null });
      }
    }
  } catch (error) {
    sendResponse({ text: "", error: error.message || "Error extracting text" });
  }
  return true;
});