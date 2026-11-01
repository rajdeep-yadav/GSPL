import React, { useId } from "react";

export const ParticleBackground: React.FC = () => {
  const maskId = useId();

  // Pure SVG high-performance floating glowing embers
  const particles = [
    { cx: "10%", cy: "20%", r: 2.5, color: "#FF5722", delay: "0s", duration: "7s" },
    { cx: "25%", cy: "70%", r: 3, color: "#FFAA45", delay: "1.5s", duration: "9s" },
    { cx: "45%", cy: "30%", r: 1.5, color: "#FF7938", delay: "0.8s", duration: "6s" },
    { cx: "65%", cy: "60%", r: 3.5, color: "#FF5722", delay: "2s", duration: "10s" },
    { cx: "80%", cy: "15%", r: 2, color: "#E53935", delay: "1s", duration: "8s" },
    { cx: "88%", cy: "80%", r: 3, color: "#FFAA45", delay: "2.5s", duration: "7.5s" },
    { cx: "35%", cy: "85%", r: 2, color: "#FF7938", delay: "3s", duration: "11s" },
    { cx: "55%", cy: "15%", r: 2.5, color: "#FF5722", delay: "0.5s", duration: "8.5s" },
    { cx: "75%", cy: "45%", r: 1.8, color: "#FFAA45", delay: "1.8s", duration: "9.5s" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`glow-${maskId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5722" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF5722" stopOpacity="0" />
          </radialGradient>
        </defs>
        {particles.map((p, idx) => (
          <circle
            key={idx}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={p.color}
            opacity="0.5"
            className="animate-pulse"
            style={{
              animationDelay: p.delay,
              animationDuration: p.duration,
              filter: `drop-shadow(0 0 6px ${p.color})`,
            }}
          />
        ))}
      </svg>
    </div>
  );
};
