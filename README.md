# CardCraft AI

A lightweight web application that generates structured product card content (title, description, and keywords) using AI and renders it in a clean, responsive card layout.

## Features
* **Input Form:** Accepts a product name and category with client-side validation and length constraints.
* **AI Content Generation:** Generates a catchy marketing title, a concise 2-sentence description, and 4–5 lowercase keyword tags on demand.
* **Visual Product Card:** Renders the generated copy in a minimal, responsive card with loading skeletons, empty states, and a one-click copy option.
* **Resilient UX:** Includes input sanitization, structured JSON validation, user-triggered request cancellation (`AbortController`), and clear error messaging.

## Tech Stack
* **Frontend:** React (Vite)
* **Styling:** Vanilla CSS (`App.css`)
* **AI Integration:** Google Gemini REST API

## Design Choices
* **Zero Unnecessary Complexity:** Built with React (`useState`, `useRef`, `useEffect`) and plain CSS custom properties—avoiding external state libraries (like Redux Toolkit) or heavy UI frameworks (like Tailwind CSS) to keep bundle size small and development fast.
* **Code Segregation:** Separates API networking, prompt construction, and response validation (`src/services/aiService.js`) from presentational UI components (`ProductForm.jsx`, `ProductCard.jsx`).
* **User-Controlled Cancellation:** Avoids aggressive auto-timeouts that could waste free-tier API quota, instead showing a non-intrusive status banner after 15 seconds with a manual **Cancel** button.
* **Security & Validation:** API keys are isolated in environment variables (`.env`), user inputs are trimmed and length-capped before requests, and AI responses are strictly validated before rendering.

## Where AI Was Used
* **Application Runtime:** Integrated via a direct REST `POST` request in `aiService.js` when the user submits the form. It sends the sanitized product name and category as a structured prompt with `responseMimeType: "application/json"` to return ready-to-render `title`, `description`, and `keywords` fields.

## Quick Setup
```bash
npm install
cp .env.example .env   # Add your VITE_GEMINI_API_KEY
npm run dev