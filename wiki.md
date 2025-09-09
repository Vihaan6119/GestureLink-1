# Project Summary
GestureLink is a mobile web application that enhances communication for the hearing impaired through real-time sign language detection and translation. Utilizing advanced computer vision techniques, it recognizes sign language gestures and translates them into text and speech. The app features a user-friendly interface with conversation history and saved phrases, aiming to improve the accuracy of sign language recognition and provide an effective communication tool.

# Project Module Description
- **Authentication System**: Secure user login and account management.
- **Main Interface**: Camera capture for sign language detection, conversation history, and a simplified layout.
- **Hamburger Menu**: Access to account settings, app settings, and saved phrases.
- **Sign Language Detection**: Real-time gesture recognition using native browser APIs.
- **Conversation History**: Stores past translations for user reference.
- **Saved Phrases**: Allows users to save frequently used phrases, accessible via the hamburger menu.
- **PWA Support**: Progressive Web App features including installability and offline capabilities.

# Directory Tree
```
shadcn-ui/
├── README.md                # Project documentation
├── components.json          # Component metadata
├── eslint.config.js         # ESLint configuration
├── index.html               # Main HTML file with PWA manifest link
├── package.json             # Project dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── public/                  # Public assets
│   ├── favicon.svg          # Favicon for the app
│   └── manifest.json        # PWA manifest file
├── src/                     # Source code
│   ├── App.css              # Global styles
│   ├── App.tsx              # Main app component
│   ├── components/          # React components
│   ├── contexts/            # Context API for state management
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   ├── utils/               # Utility functions
│   └── vite-env.d.ts        # Vite environment types
├── tailwind.config.ts       # Tailwind CSS configuration
├── template_config.json      # Template configuration
├── tsconfig.app.json        # TypeScript configuration for app
├── tsconfig.json            # Base TypeScript configuration
├── tsconfig.node.json       # TypeScript configuration for Node
└── vite.config.ts           # Vite configuration
```

# File Description Inventory
- `README.md`: Overview of the project, setup instructions, and usage guidelines.
- `package.json`: Project dependencies and scripts for building and running the app.
- `src/App.tsx`: Main application component that houses the overall structure.
- `src/components/`: Contains all reusable UI components for the app.
- `src/contexts/AuthContext.tsx`: Manages authentication state and user data.
- `src/hooks/`: Contains custom hooks for managing component logic.
- `src/pages/`: Contains various pages of the application.
- `src/utils/handGestureDetection.ts`: Implements custom hand gesture detection using the Canvas API.
- `public/manifest.json`: PWA manifest file providing metadata for the app.
- `tailwind.config.ts`: Configuration for Tailwind CSS styling.
- `vite.config.ts`: Configuration for Vite, the build tool used.

# Technology Stack
- **React**: Frontend library for building user interfaces.
- **TypeScript**: Superset of JavaScript for type safety.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Vite**: Build tool for faster development and hot module replacement.
- **Context API**: For state management across components.
- **Web Speech API**: For speech recognition and synthesis.
- **Canvas API**: For real-time video frame analysis and gesture detection.

# Usage
1. **Install Dependencies**: Run `pnpm install` in the project directory.
2. **Build the Project**: Use `pnpm run build` to create a production build.
3. **Run the Development Server**: Use `pnpm run dev` to start the development server.
