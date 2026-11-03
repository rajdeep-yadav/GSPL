import React from 'react';

export const FireAtmosphereBackground: React.FC = () => {
  // Spark particles with random rising positions and delays
  const sparks = [
    { left: '8%', delay: '0s', duration: '9s', size: 3, color: '#F5C042' },
    { left: '18%', delay: '2.5s', duration: '12s', size: 4, color: '#FF5A1F' },
    { left: '27%', delay: '1.2s', duration: '10s', size: 2.5, color: '#FFE272' },
    { left: '38%', delay: '4s', duration: '14s', size: 3.5, color: '#E02424' },
    { left: '49%', delay: '0.5s', duration: '8.5s', size: 2, color: '#F5C042' },
    { left: '59%', delay: '3.2s', duration: '11s', size: 4, color: '#FF5A1F' },
    { left: '68%', delay: '1.8s', duration: '13s', size: 2.5, color: '#FFE272' },
    { left: '79%', delay: '4.8s', duration: '9.5s', size: 3, color: '#FF5A1F' },
    { left: '88%', delay: '2s', duration: '12.5s', size: 3.5, color: '#F5C042' },
    { left: '94%', delay: '3.7s', duration: '10.5s', size: 2, color: '#E02424' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dark mode soft ambient glowing backdrops (Only visible in dark mode to preserve 100% light mode contrast) */}
      <div 
        className="hidden dark:block absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[550px] rounded-full blur-[160px] opacity-25"
        style={{
          background: 'radial-gradient(circle, #F5C042 0%, #FF5A1F 50%, #E02424 90%, transparent 100%)'
        }}
      />
      <div 
        className="hidden dark:block absolute top-1/2 -left-40 w-[550px] h-[550px] rounded-full blur-[180px] opacity-20"
        style={{
          background: 'radial-gradient(circle, #FF5A1F 0%, #E02424 70%, transparent 100%)'
        }}
      />

      {/* Upward Rising Live Sparks (Active in Dark Mode) */}
      <div className="hidden dark:block absolute inset-0">
        {sparks.map((spark, idx) => (
          <div
            key={idx}
            className="absolute bottom-0 rounded-full animate-spark-rise pointer-events-none"
            style={{
              left: spark.left,
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              backgroundColor: spark.color,
              boxShadow: `0 0 ${spark.size * 3}px ${spark.color}`,
              animationDelay: spark.delay,
              animationDuration: spark.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
};
