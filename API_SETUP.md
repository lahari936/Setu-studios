# API Setup Guide

## Google Gemini API Setup

To use the Idea Analyzer with real AI analysis, you need to set up a Google Gemini API key:

### 1. Get Your API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables
Create a `.env` file in the root directory with:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Restart Development Server
After adding the API key, restart your development server:

```bash
npm run dev
```

### 4. Test the Idea Analyzer
1. Go to the Idea Analyzer page
2. Enter a startup idea name and description
3. Click "Analyze Idea"
4. The system will now use real Google Gemini AI for analysis

## Features Available

### With API Key:
- ✅ Real AI-powered startup analysis
- ✅ Comprehensive business strategy generation
- ✅ Market analysis and competitor research
- ✅ Financial projections and funding recommendations
- ✅ Go-to-market strategy
- ✅ Pitch deck outlines

### Without API Key (Fallback):
- ✅ Mock analysis for development
- ✅ Basic structure demonstration
- ✅ UI/UX testing

## Troubleshooting

### Common Issues:
1. **"API request failed"** - Check your API key is correct
2. **"No text content found"** - API key might be invalid or expired
3. **Rate limiting** - You may have hit API usage limits

### Getting Help:
- Check the browser console for detailed error messages
- Verify your API key is correctly set in the `.env` file
- Ensure you have sufficient API quota in your Google Cloud Console
