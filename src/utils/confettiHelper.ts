import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  // Center punch explosion
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#fbbf24', '#ffffff'],
    shapes: ['circle', 'square'],
    scalar: 1.2,
  });

  // Left cannon
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 70,
    origin: { x: 0, y: 0.7 },
    colors: ['#ffd700', '#ff4500', '#1e90ff', '#ffffff'],
  });

  // Right cannon
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 70,
    origin: { x: 1, y: 0.7 },
    colors: ['#ffd700', '#ff4500', '#1e90ff', '#ffffff'],
  });

  // Secondary delayed star blast
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 140,
      origin: { y: 0.45 },
      colors: ['#ffd700', '#f59e0b', '#ffffff'],
      shapes: ['star'],
      scalar: 1.4,
    });
  }, 400);

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 65,
      spread: 60,
      origin: { x: 0.1, y: 0.8 },
      colors: ['#3b82f6', '#ef4444', '#ffd700'],
    });
    confetti({
      particleCount: 50,
      angle: 115,
      spread: 60,
      origin: { x: 0.9, y: 0.8 },
      colors: ['#3b82f6', '#ef4444', '#ffd700'],
    });
  }, 900);
}
