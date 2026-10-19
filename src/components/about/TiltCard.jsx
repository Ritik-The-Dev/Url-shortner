import React, { useRef } from "react";
import gsap from "gsap";

function TiltCard({ children, className = "" }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 14;
    const rotateX = ((y / rect.height) - 0.5) * -10;

    gsap.to(el, {
      rotateX,
      rotateY,
      transformPerspective: 900,
      duration: 0.35,
      ease: "power2.out",
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.55,
        x: x - rect.width / 2,
        y: y - rect.height / 2,
        duration: 0.3,
      });
    }
  };

  const onLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.6)",
    });
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <span ref={glowRef} className="tilt-card-glow" />
      {children}
    </div>
  );
}

export default TiltCard;
