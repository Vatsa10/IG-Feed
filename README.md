# Instagram Profile Viewer

A modern, feature-rich web application designed to provide seamless Instagram profile viewing with an intuitive interface, adaptive theming, and responsive design across all devices.

## Overview

Instagram Profile Viewer is a lightweight, high-performance React application that enables users to explore Instagram profiles through an embedded viewer. Built with modern web technologies and best practices, it delivers a smooth user experience with intelligent error handling and accessibility features.

## Key Features

### Core Functionality
- **Profile Search & Discovery** - Search any public Instagram profile with real-time validation
- **Dual Viewing Modes** - Switch between embedded viewer and full proxy mode
- **Device Frame Mockups** - View profiles in realistic laptop and mobile device frames
- **Intelligent Loading States** - Smooth transitions with visual feedback during content loading

### Viewing Modes
- **Embed Mode** - Fast, lightweight Instagram embed integration
- **Proxy Mode** - Full Instagram profile rendering via Puppeteer with base64 image embedding
  - Bypasses Instagram CDN restrictions by converting images to base64 data URLs
  - Removes login modals and popups for uninterrupted viewing
  - Renders complete profile with all posts and content

### User Experience
- **Adaptive Theme System** - Toggle between light and dark modes with automatic preference persistence
- **Responsive Design** - Optimized layouts for mobile, tablet, and desktop viewports
- **Device Frames** - Realistic laptop and mobile mockups for professional presentation
- **Accessible Interface** - WCAG-compliant components with proper ARIA labels and keyboard navigation
- **Input Validation** - Real-time username validation with helpful error messages

### Technical Highlights
- **Lightning-Fast Performance** - Powered by Vite for instant hot module replacement
- **Puppeteer Integration** - Headless browser automation for full profile scraping
- **Base64 Image Embedding** - Converts Instagram CDN images to embedded data URLs to bypass 403 errors
- **Modern React Architecture** - Built with React 18 and functional components with hooks
- **Utility-First Styling** - Tailwind CSS v4 for maintainable and scalable styles
- **State Management** - Context API for global theme state with localStorage persistence

## System Requirements

- **Node.js** - Version 16.x or higher
- **npm** - Version 8.x or higher
- **Git** - For version control (optional)
- **Modern Web Browser** - Chrome, Firefox, Safari, or Edge (latest versions)

## Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vatsa10/IG-Feed.git
   cd IG-Feed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will install all required packages including React, Vite, Tailwind CSS, Puppeteer, and development dependencies.

### Development

**Important:** This application requires two servers to run:

1. **Start the proxy server** (for full profile viewing):
   ```bash
   npm run server
   ```
   The proxy server will run on `http://localhost:5000`

2. **Start the development server** (in a new terminal):
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

**Note:** The embed mode works without the proxy server, but proxy mode requires both servers running.

### Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Code Quality

Run ESLint to check code quality:

```bash
npm run lint
```

## Technology Stack

### Frontend Framework
- **[React 18](https://reactjs.org/)** - Modern JavaScript library for building user interfaces with concurrent features
- **[Vite 4](https://vitejs.dev/)** - Next-generation frontend build tool with lightning-fast HMR

### Backend & Automation
- **[Express](https://expressjs.com/)** - Fast, minimalist web framework for Node.js
- **[Puppeteer](https://pptr.dev/)** - Headless Chrome automation for web scraping
- **[CORS](https://www.npmjs.com/package/cors)** - Cross-origin resource sharing middleware
- **[node-fetch](https://www.npmjs.com/package/node-fetch)** - Fetch API implementation for Node.js

### Styling & UI
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework for rapid UI development
- **[PostCSS](https://postcss.org/)** - CSS transformation and optimization
- **Custom Design System** - Consistent color palette and spacing for light/dark themes
- **Device Frames** - Realistic laptop and mobile mockups

### State Management
- **React Context API** - Lightweight global state management for theme preferences
- **Custom Hooks** - Reusable logic for localStorage persistence and form handling

### Development Tools
- **ESLint** - Code quality and consistency enforcement
- **Autoprefixer** - Automatic vendor prefix handling for CSS

## Project Structure

```
instagram-profile-viewer/
├── src/
│   ├── components/       # React components
│   │   ├── DeviceFrame.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── InstagramProxyView.jsx
│   │   ├── InstagramWebView.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── SearchForm.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── ViewModeToggle.jsx
│   ├── contexts/         # React contexts
│   │   └── ThemeContext.jsx
│   ├── hooks/            # Custom hooks
│   │   └── useLocalStorage.jsx
│   ├── utils/            # Utility functions
│   │   └── validation.js
│   ├── App.jsx           # Main App component
│   ├── index.css         # Global styles
│   └── index.js          # Application entry point
├── server.js             # Express + Puppeteer proxy server
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```

## Usage Guide

### Searching for Profiles

1. **Enter Username** - Type an Instagram username in the search field (e.g., "instagram", "cristiano")
2. **Submit Search** - Click the "Search" button or press Enter
3. **View Content** - The Instagram profile will load in the selected viewing mode

### Viewing Modes

- **Embed Mode** - Fast, lightweight Instagram embed (default)
  - Quick loading
  - Lower resource usage
  - Works without proxy server
  
- **Proxy Mode** - Full profile rendering with Puppeteer
  - Complete profile with all posts
  - No login popups or restrictions
  - Images embedded as base64 to bypass CDN restrictions
  - Requires proxy server running (`npm run server`)

### Device Frames

- **Laptop View** - Professional MacBook-style frame for desktop presentation
- **Mobile View** - iPhone-style frame for mobile presentation
- Toggle between frames using the device icons in the header

### Theme Customization

- **Toggle Theme** - Click the sun/moon icon in the header to switch between light and dark modes
- **Automatic Persistence** - Your theme preference is automatically saved to localStorage
- **System Integration** - Smooth transitions between themes with 300ms animations

### Error Handling

If a profile fails to load:
- **Retry Option** - Click "Try Again" to reload the content
- **Direct Access** - Use "Open profile in new tab" to view the profile directly on Instagram
- **Validation Feedback** - Real-time error messages for invalid usernames

## Architecture

### Component Structure

#### Core Components
- **`App.jsx`** - Main application container with state management and layout orchestration
- **`InstagramWebView.jsx`** - Embedded iframe viewer with intelligent loading detection and error handling
- **`InstagramProxyView.jsx`** - Full profile viewer using Puppeteer proxy with base64 image embedding
- **`SearchForm.jsx`** - Controlled form component with real-time validation and accessibility features

#### UI Components
- **`DeviceFrame.jsx`** - Realistic device mockups (laptop and mobile) for professional presentation
- **`ViewModeToggle.jsx`** - Switch between embed and proxy viewing modes
- **`ThemeToggle.jsx`** - Theme switcher with animated icons and ARIA labels
- **`LoadingSpinner.jsx`** - Reusable loading indicator with customizable size and messaging
- **`ErrorMessage.jsx`** - Error display component with retry functionality and user-friendly messages

#### Backend
- **`server.js`** - Express server with Puppeteer integration
  - Instagram profile scraping with headless Chrome
  - Base64 image conversion to bypass CDN restrictions
  - Login modal removal and content cleanup
  - CORS-enabled proxy endpoints

#### Context & Hooks
- **`ThemeContext.jsx`** - Global theme state provider with localStorage integration
- **`useLocalStorage.jsx`** - Custom hook for persistent state management
- **`validation.js`** - Username validation utilities with comprehensive error messages

## Important Notes

### Instagram Integration

**Embed Mode:**
- Uses Instagram's official embed endpoint (`/embed/`)
- Content availability depends on Instagram's embedding policies
- Some profiles may have restricted embedding capabilities

**Proxy Mode:**
- Uses Puppeteer to render full Instagram profiles
- Converts images to base64 data URLs to bypass CDN 403 errors
- Removes login modals and popups automatically
- Requires proxy server running on port 5000

### Image Loading Solution
The proxy mode solves Instagram CDN restrictions by:
1. Loading the profile in Puppeteer's authenticated browser context
2. Converting all images to base64 data URLs using canvas
3. Embedding images directly in HTML to eliminate external CDN requests
4. This bypasses 403 Forbidden errors from Instagram's CDN

### Browser Compatibility
- Modern browsers with ES6+ support are required
- Cross-origin restrictions may apply based on browser security settings
- localStorage must be enabled for theme persistence
- Canvas API required for base64 image conversion

### Privacy & Security
- No user data is collected or stored on external servers
- Theme preferences are stored locally in the browser
- Proxy server runs locally and doesn't store any data
- All Instagram interactions occur through official Instagram domains

### Limitations
- Private profiles require Instagram authentication
- Embedding restrictions may vary by profile and content type
- Network connectivity affects loading performance
- Proxy mode has longer initial load time due to image conversion
- Puppeteer requires Chrome/Chromium to be installed

## Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the repository** and create your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes** with clear, descriptive commits
   ```bash
   git commit -m "Add: amazing new feature"
   ```

3. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

4. **Open a Pull Request** with a comprehensive description of changes

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons and design inspiration from modern UI/UX principles

## Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/Vatsa10/IG-Feed/issues)
- Check existing issues before creating new ones
- Provide detailed information for bug reports

---

**Made by [Vatsa10](https://github.com/Vatsa10)**
