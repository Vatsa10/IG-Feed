# Instagram WebView

A desktop application that displays Instagram profiles in a WebView, providing a mobile-like experience.

## Features

- View public Instagram profiles
- Mobile-optimized view
- Cross-platform (Windows, macOS, Linux)
- Simple and intuitive interface

## Prerequisites

- Node.js 14.x or later
- npm 6.x or later
- Git (optional)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/instagram-webview.git
   cd instagram-webview
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Tailwind CSS and its peer dependencies:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

## Running the Application

### Development Mode

1. Start the development server and Electron app:
   ```bash
   npm run electron-dev
   ```

### Building for Production

1. Build the application:
   ```bash
   npm run build
   npm run electron-build
   ```

2. The built application will be available in the `dist` folder.

## Usage

1. Enter an Instagram username in the input field
2. Click "View Profile" to load the profile
3. Log in to Instagram in the WebView if prompted

## Notes

- This application uses Instagram's mobile web interface for better compatibility
- Some features may be limited due to Instagram's restrictions
- You need to be logged in to view private profiles

## License

MIT
