# Instagram Profile Viewer

A modern, responsive web application for viewing Instagram profiles with a clean interface, dark mode support, and enhanced user experience.

## Features

- Search and view Instagram profiles
-  Dark/Light theme toggle with persistent preferences
-  Fully responsive design (mobile, tablet, desktop)
-  Fast development with Vite
-  Styled with Tailwind CSS
-  Built with React 18
-  Accessible UI components
-  Loading states and error handling
-  Input validation for usernames

## Prerequisites

- Node.js 16.x or later
- npm 8.x or later
- Git (optional)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Vatsa10/IG-Feed 
   cd instagram-webview
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

## Technologies Used

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React 18](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [React Context API](https://reactjs.org/docs/context.html) - State management for theme
- Custom Hooks - useLocalStorage for persistent preferences

## Project Structure

```
instagram-profile-viewer/
├── src/
│   ├── components/       # React components
│   │   ├── ErrorMessage.jsx
│   │   ├── InstagramWebView.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── SearchForm.jsx
│   │   └── ThemeToggle.jsx
│   ├── contexts/         # React contexts
│   │   └── ThemeContext.jsx
│   ├── hooks/            # Custom hooks
│   │   └── useLocalStorage.jsx
│   ├── utils/            # Utility functions
│   │   └── validation.js
│   ├── App.jsx           # Main App component
│   ├── index.css         # Global styles
│   └── index.js          # Application entry point
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```

## Usage

1. Enter an Instagram username in the search field
2. Click "Search" or press Enter
3. View the Instagram profile in the embedded viewer
4. Toggle between light and dark themes using the theme button
5. The app remembers your theme preference

## Components

- **SearchForm** - Username search with validation
- **InstagramWebView** - Embedded Instagram profile viewer with loading states
- **ThemeToggle** - Dark/Light mode switcher
- **LoadingSpinner** - Loading indicator
- **ErrorMessage** - Error display with retry functionality
- **ThemeContext** - Global theme state management

## Notes

- This application embeds Instagram's web interface
- Some features may be limited due to Instagram's restrictions and browser security policies
- Private profiles require Instagram login
- The app uses localStorage to persist theme preferences

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
