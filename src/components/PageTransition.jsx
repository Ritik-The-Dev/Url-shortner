import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function PageTransition({ children }) {
  const wrapRef = useRef(null);
  const location = useLocation();

  useGSAP(
    () => {
      gsap.fromTo(
        wrapRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
      );
    },
    { dependencies: [location.pathname], scope: wrapRef }
  );

  return (
    <div ref={wrapRef} className="page-transition">
      {children}
    </div>
  );
}

export default PageTransition;
