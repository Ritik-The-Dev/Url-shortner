import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RecoilRoot } from "recoil";
import { BrowserRouter as Router } from "react-router-dom";
import { RxCrossCircled } from "react-icons/rx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
    <RecoilRoot>
      <Router>
        <App />
        <Toaster
        position="top-center"
        toastOptions={{
          success: {
            icon: (
              <div className="toast-icon-container">
                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#1B48DA"/>
                </svg>
              </div>
            ),
            style: {
              fontFamily: "Poppins",
              background: "white",
              color: "black",
              padding: "12px 20px",
              fontWeight: "bold",
              borderRadius: "10px",
              border: "2px solid #1B48DA",
            },
          },
          error: {
            icon: (
              <div className="toast-icon-container">
                <RxCrossCircled style={{
                  color: "#DC3545",
                }}/>
              </div>
            ),
            style: {
              fontFamily: "Poppins",
              background: "white",
              color: "black",
              fontWeight: "bold",
              padding: "12px 20px",
              border: "2px solid #dc3545",
              borderRadius: "10px",
            },
          },
        }}
      />
      </Router>
    </RecoilRoot>
);