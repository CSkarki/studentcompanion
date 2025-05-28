# Student Companion App

A comprehensive academic workflow management platform for students.

## Features

- Document Management
- Smart Study Assistant
- Handwritten Notes Processing
- Email Integration
- OFAC Compliance Tools
- Invoice Management
- Study Tools
- Voice Assistant

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

3. Start the development server:
```bash
npm start
```

## Tech Stack

- React
- TypeScript
- Firebase (Authentication, Firestore, Storage)
- TailwindCSS
- Lucide Icons

## Project Structure

- `src/`
  - `components/` - React components
  - `firebase.ts` - Firebase configuration
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions
  - `hooks/` - Custom React hooks
  - `context/` - React context providers

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 