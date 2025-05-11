import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize with Turkish as default language if none is selected
if (!localStorage.getItem('language')) {
  localStorage.setItem('language', 'tr');
}

createRoot(document.getElementById("root")!).render(<App />);
