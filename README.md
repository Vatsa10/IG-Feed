# Instagram WebView

A modern web application that displays Instagram profiles with a clean, responsive interface.

## Features

- View public Instagram profiles
- Mobile-optimized responsive design
- Fast development with Vite
- Styled with Tailwind CSS
- Built with React 18

## Prerequisites

- Node.js 16.x or later
- npm 8.x or later
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

## Running the Application

### Development Mode

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5173
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
- [TypeScript](https://www.typescriptlang.org/) - TypeScript is a typed superset of JavaScript

## Project Structure

```
instagram-webview/
├── public/          # Static files
├── src/             # Source files
│   ├── components/  # React components
│   ├── styles/      # Global styles
│   ├── App.jsx      # Main App component
│   └── main.jsx     # Application entry point
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Notes

- This application uses Instagram's mobile web interface for better compatibility
- Some features may be limited due to Instagram's restrictions
- You need to be logged in to view private profiles

## License

MIT
