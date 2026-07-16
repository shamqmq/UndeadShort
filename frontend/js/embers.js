/* Ambient embers — one canvas. */
(function () {
    const canvas = document.getElementById('emberCanvas');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const AMBIENT = isCoarse ? 22 : 44;

    let w = 0, h = 0;
    let embers = [];
    let running = true;
    let rafId = null;

    const COLORS = [[196, 149, 58], [255, 140, 40], [155, 17, 30], [255, 210, 120]];

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth; h = window.innerHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function sourcePoint() {
        return { x: w * 0.5, y: h * 0.52 };
    }

    function spawnAmbient() {
        const s = sourcePoint();
        return {
            x: s.x + (Math.random() - 0.5) * Math.min(w * 0.5, 320),
            y: s.y + Math.random() * h * 0.1,
            vx: (Math.random() - 0.5) * 0.25,
            vy: -(0.25 + Math.random() * 0.65),
            r: 0.7 + Math.random() * 1.7,
            life: 1,
            decay: 0.0018 + Math.random() * 0.003,
            wob: Math.random() * Math.PI * 2,
            wobSpeed: 0.008 + Math.random() * 0.02,
            tw: Math.random() * Math.PI * 2,
            twSpeed: 0.02 + Math.random() * 0.05,
            c: COLORS[(Math.random() * COLORS.length) | 0],
            burst: false
        };
    }

    function drawEmber(p, alpha) {
        const [r, g, b] = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.18})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
    }

    function frame() {
        if (!running) return;
        ctx.clearRect(0, 0, w, h);

        while (embers.filter(e => !e.burst).length < AMBIENT) embers.push(spawnAmbient());

        for (let i = embers.length - 1; i >= 0; i--) {
            const p = embers[i];
            p.wob += p.wobSpeed;
            p.tw += p.twSpeed;
            p.x += p.vx + Math.sin(p.wob) * 0.35;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.life <= 0 || p.y < -12) {
                if (p.burst) { embers.splice(i, 1); continue; }
                embers[i] = spawnAmbient();
                continue;
            }
            const twinkle = 0.55 + 0.45 * Math.sin(p.tw);
            drawEmber(p, Math.min(1, p.life * 1.4) * 0.75 * twinkle);
        }
        rafId = requestAnimationFrame(frame);
    }

    function burst(x, y, n) {
        for (let i = 0; i < (n || 16); i++) {
            const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
            const sp = 1.5 + Math.random() * 3.5;
            embers.push({
                x, y,
                vx: Math.cos(a) * sp,
                vy: Math.sin(a) * sp,
                r: 0.8 + Math.random() * 1.6,
                life: 1,
                decay: 0.015 + Math.random() * 0.02,
                wob: Math.random() * Math.PI * 2,
                wobSpeed: 0.05,
                tw: 0, twSpeed: 0.12,
                c: COLORS[(Math.random() * COLORS.length) | 0],
                burst: true
            });
        }
    }

    document.addEventListener('visibilitychange', () => {
        running = !document.hidden;
        if (running) { rafId = requestAnimationFrame(frame); }
        else if (rafId) cancelAnimationFrame(rafId);
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 120);
    });

    resize();
    rafId = requestAnimationFrame(frame);

    window.embers = { burst };
})();
