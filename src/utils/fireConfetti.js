import confetti from 'canvas-confetti';

/**
 * Full-viewport celebration burst (canvas-confetti).
 */
export function fireConfetti() {
    const count = 200;
    const defaults = {
        origin: { y: 0.62 },
        zIndex: 99999,
        disableForReducedMotion: true
    };

    function burst(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
        });
    }

    burst(0.25, { spread: 26, startVelocity: 55 });
    burst(0.2, { spread: 60 });
    burst(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    burst(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    burst(0.1, { spread: 120, startVelocity: 45 });
}
