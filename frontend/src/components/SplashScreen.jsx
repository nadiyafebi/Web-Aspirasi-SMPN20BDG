const css = `
.splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #24574a;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.4s ease;
}

.splash-leaving {
  opacity: 0;
  pointer-events: none;
}

.splash-logo {
  width: 180px;
  max-width: 55vw;
  height: auto;
  animation: splashIn 0.6s ease both, splashPulse 1.8s ease-in-out 0.6s infinite;
}

@keyframes splashIn {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes splashPulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
}
`;

export default function SplashScreen({ leaving = false }) {
  return (
    <>
      <style>{css}</style>
      <div className={`splash ${leaving ? 'splash-leaving' : ''}`}>
        <img src="/logo-aspirasi.png" alt="Aspirasi" className="splash-logo" />
      </div>
    </>
  );
}