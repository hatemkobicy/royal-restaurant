import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeTheme } from "./utils/theme";

// Initialize with Turkish as default language if none is selected
if (!localStorage.getItem('language')) {
  localStorage.setItem('language', 'tr');
}

// Initialize theme based on saved preference or system preference
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
