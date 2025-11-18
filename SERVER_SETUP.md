# Instagram Proxy Server Setup

This document explains how to set up and use the Puppeteer-based proxy server for full Instagram profile viewing.

## Overview

The proxy server uses Puppeteer (headless Chrome) to fetch Instagram profiles and serve them to the frontend, bypassing iframe embedding restrictions.

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Sufficient system resources (Puppeteer runs a headless browser)

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

   This will install:
   - `express` - Web server framework
   - `puppeteer` - Headless browser automation
   - `cors` - Cross-origin resource sharing
   - `concurrently` - Run multiple commands simultaneously

## Running the Application

### Option 1: Run Both Frontend and Backend Together (Recommended)

```bash
npm run dev:all
```

This starts:
- Frontend (Vite) on `http://localhost:3000`
- Backend (Express + Puppeteer) on `http://localhost:5000`

### Option 2: Run Separately

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## API Endpoints

### GET /api/instagram/:username

Fetches the full HTML content of an Instagram profile.

**Example:**
```bash
curl http://localhost:5000/api/instagram/instagram
```

**Query Parameters:**
- `mobile` (boolean) - Set to `true` for mobile viewport

### GET /api/instagram/:username/screenshot

Takes a screenshot of the Instagram profile.

**Example:**
```bash
curl http://localhost:5000/api/instagram/instagram/screenshot > profile.png
```

### GET /api/health

Health check endpoint to verify server is running.

**Example:**
```bash
curl http://localhost:5000/api/health
```

## Usage in Frontend

The application provides two viewing modes:

### 1. Embed Mode (Default)
- Uses Instagram's official embed endpoint
- Limited to ~6 posts
- No backend required
- Faster loading

### 2. Proxy Mode (Full Access)
- Uses Puppeteer proxy server
- Shows full profile with all posts
- Requires backend server running
- Slower initial load

**Switching Modes:**
- Use the toggle buttons above the profile viewer
- "Embed Mode" - Standard iframe embedding
- "Proxy Mode" - Full profile via Puppeteer

## Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Ensure all dependencies are installed: `npm install`

### Puppeteer installation issues
- On Linux, you may need additional dependencies:
  ```bash
  sudo apt-get install -y \
    chromium-browser \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libnss3 \
    libcups2 \
    libxss1 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgtk-3-0
  ```

### CORS errors
- Ensure the backend server is running
- Check that CORS is enabled in `server.js`

### Slow loading
- Puppeteer needs to launch a browser and load Instagram
- First load is slower; subsequent loads use cached browser instance
- Consider implementing caching for frequently accessed profiles

## Performance Optimization

### Browser Instance Caching
The server maintains a single browser instance across requests to improve performance.

### Viewport Configuration
- Mobile viewport: 375x812px
- Desktop viewport: 1200x800px

### Timeout Settings
- Page navigation: 30 seconds
- Element waiting: 10 seconds

## Security Considerations

⚠️ **Important Notes:**

1. **Rate Limiting**: Instagram may rate-limit or block requests if too many are made
2. **Terms of Service**: Ensure compliance with Instagram's Terms of Service
3. **Production Use**: This is a development tool; production use requires additional security measures
4. **Authentication**: The proxy doesn't handle Instagram login; only public profiles are accessible

## Production Deployment

For production deployment:

1. **Add rate limiting**
   ```bash
   npm install express-rate-limit
   ```

2. **Add caching**
   ```bash
   npm install node-cache
   ```

3. **Use environment variables**
   ```bash
   PORT=5000
   NODE_ENV=production
   ```

4. **Deploy backend separately** (e.g., Heroku, AWS, DigitalOcean)

5. **Update frontend API URL** to point to production backend

## License

MIT
