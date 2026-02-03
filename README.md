# AI Article Summariser - Chrome Extension

A powerful Chrome extension that uses Google's Gemini AI to summarize web articles with multiple summary formats. Get quick insights from any article on the web with just one click!

## 🎥 Demo Video

[![Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

*Replace `YOUR_VIDEO_ID` with your actual YouTube video ID, or add your video link here*

## ✨ Features

- **Multiple Summary Types:**
  - 📝 Brief Summary (2-3 sentences)
  - 📄 Detailed Summary (comprehensive overview)
  - 📋 Bullet Points (5-7 key points)

- **Smart Content Extraction:** Automatically extracts article content from web pages
- **One-Click Summarization:** Generate summaries instantly with a single click
- **Copy to Clipboard:** Easily copy summaries for use elsewhere
- **Secure API Key Storage:** Your API key is stored securely in Chrome's sync storage
- **Works on Any Website:** Compatible with most article-based websites

## 🚀 Installation

### Method 1: Load Unpacked Extension (Development)

1. Clone this repository:
   ```bash
   git clone https://github.com/alwaysprince05/AI-Article-Summariser.git
   cd AI-Article-Summariser
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in the top right)

4. Click "Load unpacked" and select the extension directory

5. The extension icon should now appear in your Chrome toolbar

### Method 2: Install from Chrome Web Store
*Coming soon...*

## ⚙️ Setup

1. **Get a Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key

2. **Configure the Extension:**
   - Click on the extension icon in your Chrome toolbar
   - Click on the settings/options (or right-click extension → Options)
   - Paste your Gemini API key
   - Click "Save"

## 📖 How to Use

1. **Navigate to any article** on the web
2. **Click the extension icon** in your Chrome toolbar
3. **Select your preferred summary type:**
   - Brief Summary
   - Detailed Summary
   - Bullet Points
4. **Click "Summarize This Page"**
5. **Wait for the summary** to be generated
6. **Copy the summary** using the "Copy Summary" button if needed

## 🛠️ Technical Details

### Technologies Used
- **JavaScript** (Vanilla JS)
- **Chrome Extension Manifest V3**
- **Google Gemini AI API** (v1beta)
- **Chrome Storage API**

### Files Structure
```
AI-Article-Summariser/
├── manifest.json       # Extension configuration
├── popup.html          # Extension popup UI
├── popup.js            # Main logic and API calls
├── content.js          # Content script for article extraction
├── background.js       # Service worker
├── options.html        # Settings page
├── options.js          # Settings page logic
├── icon.png            # Extension icon
└── README.md           # This file
```

### API Models Used
The extension automatically tries multiple Gemini models in order:
- `gemini-2.5-flash` (Primary)
- `gemini-3-flash-preview` (Fallback)
- `gemini-2.5-flash-lite` (Fallback)
- `gemini-1.5-flash-001` (Fallback)
- `gemini-1.5-flash` (Last resort)

## 🔒 Privacy & Security

- Your API key is stored locally in Chrome's sync storage
- No data is sent to third-party servers except Google's Gemini API
- Article content is only sent to Gemini API for summarization
- No tracking or analytics are implemented

## 🐛 Troubleshooting

### Extension not working?
- Make sure you've entered a valid Gemini API key
- Check that you have an active internet connection
- Verify the page has sufficient content to summarize
- Try reloading the extension from `chrome://extensions/`

### API Errors?
- Verify your API key is correct and active
- Check if you've exceeded your API quota
- Ensure you have access to Gemini API models

### Summary not generating?
- The page might not have enough content
- Try a different article or website
- Check the browser console for error messages

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**alwaysprince05**
- GitHub: [@alwaysprince05](https://github.com/alwaysprince05)
- Repository: [AI-Article-Summariser](https://github.com/alwaysprince05/AI-Article-Summariser)

## 🙏 Acknowledgments

- Google Gemini AI for providing the summarization API
- Chrome Extension API documentation
- All contributors and users of this extension

## 📧 Support

If you encounter any issues or have questions, please open an issue on the [GitHub repository](https://github.com/alwaysprince05/AI-Article-Summariser/issues).

---

⭐ If you find this extension useful, please consider giving it a star on GitHub!

