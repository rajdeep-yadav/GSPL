import React from 'react';

export const FireAtmosphereBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Warm Ambient Radial Gradients */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[650px] rounded-full blur-[160px] opacity-25 dark:opacity-40 animate-fire-breath"
        style={{
          background: 'radial-gradient(circle, #F5C042 0%, #FF5A1F 45%, #E02424 80%, transparent 100%)'
        }}
      />
      <div 
        className="absolute top-1/2 -left-40 w-[600px] h-[600px] rounded-full blur-[180px] opacity-20 dark:opacity-30"
        style={{
          background: 'radial-gradient(circle, #FF5A1F 0%, #E02424 60%, transparent 100%)'
        }}
      />
      <div 
        className="absolute bottom-10 -right-40 w-[650px] h-[650px] rounded-full blur-[190px] opacity-15 dark:opacity-25"
        style={{
          background: 'radial-gradient(circle, #F5C042 0%, #FF8A00 50%, transparent 100%)'
        }}
      />

      {/* Floating Spark Embers Layer */}
      <svg className="w-full h-full opacity-40 dark:opacity-70" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12%" cy="18%" r="2" fill="#F5C042" className="animate-pulse" style={{ animationDuration: '4s' }} />
        <circle cx="28%" cy="72%" r="2.5" fill="#FF5A1F" className="animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <circle cx="48%" cy="28%" r="1.5" fill="#FFE272" className="animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        <circle cx="68%" cy="65%" r="3" fill="#E02424" className="animate-pulse" style={{ animationDuration: '7s', animationDelay: '1.5s' }} />
        <circle cx="82%" cy="22%" r="2" fill="#F5C042" className="animate-pulse" style={{ animationDuration: '5.5s' }} />
        <circle cx="90%" cy="82%" r="2.5" fill="#FF5A1F" className="animate-pulse" style={{ animationDuration: '6.5s', animationDelay: '0.5s' }} />
        <circle cx="38%" cy="90%" r="1.8" fill="#F5C042" className="animate-pulse" style={{ animationDuration: '8s' }} />
        <circle cx="58%" cy="12%" r="2" fill="#FFE272" className="animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '3s' }} />
        <circle cx="75%" cy="48%" r="1.5" fill="#FF5A1F" className="animate-pulse" style={{ animationDuration: '7s' }} />
      </svg>
    </div>
  );
};
