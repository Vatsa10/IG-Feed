# Quick Start Guide

Get the Instagram Profile Viewer running in 3 simple steps!

## Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages including Puppeteer for the proxy server.

## Step 2: Start the Application

### Option A: Run Everything Together (Easiest)

```bash
npm run dev:all
```

This starts both the frontend and backend server simultaneously.

### Option B: Run Separately

**Terminal 1:**
```bash
npm run server
```

**Terminal 2:**
```bash
npm run dev
```

## Step 3: Open in Browser

Navigate to: **http://localhost:3000**

## Using the Application

### Embed Mode (Default)
1. Enter an Instagram username
2. Click "Search"
3. View the embedded profile (limited to ~6 posts)

### Proxy Mode (Full Profile)
1. Click "Proxy Mode" toggle button
2. Enter an Instagram username
3. Click "Search"
4. View the full Instagram profile with all posts

## Switching Between Modes

Use the toggle buttons above the profile viewer:
- **Embed Mode** - Fast, limited posts, no backend needed
- **Proxy Mode** - Full profile, requires backend server

## Troubleshooting

**"Failed to load Instagram profile"**
- Make sure the backend server is running (`npm run server`)
- Check that port 5000 is not in use

**Puppeteer installation fails**
- On Linux, install Chrome dependencies (see SERVER_SETUP.md)
- Try: `npm install puppeteer --unsafe-perm=true`

**Port already in use**
- Frontend (3000): Change in `vite.config.js`
- Backend (5000): Change in `server.js`

## Next Steps

- Read [SERVER_SETUP.md](SERVER_SETUP.md) for detailed server configuration
- Read [README.md](README.md) for full documentation
- Customize the device frames in `src/components/DeviceFrame.jsx`

## Need Help?

Open an issue on [GitHub](https://github.com/Vatsa10/IG-Feed/issues)

---

**Happy viewing! 🎉**
