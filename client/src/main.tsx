import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Check if language was already selected, otherwise go to language selector
const selectedLanguage = localStorage.getItem('language');
if (!selectedLanguage) {
  // Redirect to language selector on first visit
  window.location.href = '/select-language';
}

createRoot(document.getElementById("root")!).render(<App />);
