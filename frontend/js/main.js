document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const executeBtn = document.getElementById('executeBtn');
    const resultContainer = document.getElementById('resultContainer');
    const shortUrl = document.getElementById('shortUrl');
    const copyBtn = document.getElementById('copyBtn');
    const statusText = document.getElementById('statusText');

    /* Parallax for the single glow */
    const glow = document.querySelector('.single-glow');
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (glow && finePointer && !reduced) {
        let tx = 0, ty = 0, cx = 0, cy = 0;
        window.addEventListener('mousemove', (e) => {
            tx = e.clientX / window.innerWidth - 0.5;
            ty = e.clientY / window.innerHeight - 0.5;
        }, { passive: true });
        (function drift() {
            cx += (tx - cx) * 0.045;
            cy += (ty - cy) * 0.045;
            glow.style.transform =
                `translate(calc(-50% + ${cx * 36}px), calc(-50% + ${cy * 24}px))`;
            requestAnimationFrame(drift);
        })();
    }

    const restoreButtonIcons = () => {
        executeBtn.innerHTML = `
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4H16V12C16 14.5 14 16 12 16C10 16 8 14.5 8 12V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="rgba(196, 149, 58, 0.3)"/>
                <path d="M10 2H14V4H10V2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.5 9C8.5 9 10 12 12 12C14 12 15.5 9 15.5 9" stroke="#c4953a" stroke-width="2" fill="none" opacity="0.9"/>
                <path d="M12 16V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Kindle the Bonfire
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4C8 4 6 8 6 12C6 16 9 18 12 18C15 18 18 16 18 12C18 8 16 4 12 4Z" fill="rgba(155, 17, 30, 0.5)" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 8C10.5 8 10 10 10 11C10 12 11 13 12 13C13 13 14 12 14 11C14 10 13.5 8 12 8Z" fill="currentColor" opacity="0.8"/>
                <path d="M8 16C8 16 9.5 18 12 18C14.5 18 16 16 16 16" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
                <circle cx="11" cy="12" r="0.5" fill="#c4953a" opacity="0.8"/>
                <circle cx="13" cy="12" r="0.5" fill="#c4953a" opacity="0.8"/>
            </svg>
        `;
    };

    executeBtn.addEventListener('click', () => {
        // Trigger the igniting pulse
        executeBtn.classList.remove('bonfire-ignite');
        void executeBtn.offsetWidth;
        executeBtn.classList.add('bonfire-ignite');

        // Sparks fly from the button!
        if (window.embers) {
            const r = executeBtn.getBoundingClientRect();
            window.embers.burst(r.left + r.width / 2, r.top + r.height / 2, 18);
        }

        const url = urlInput.value.trim();
        if (!url) {
            statusText.textContent = 'The link remains hollow...';
            statusText.className = 'font-lore text-lg italic tracking-widest text-[#9b111e] drop-shadow-[0_0_8px_rgba(155,17,30,0.4)]';
            setTimeout(() => {
                statusText.textContent = 'The flame sleeps...';
                statusText.className = 'font-lore text-lg italic tracking-widest text-[#8a6a2a] drop-shadow-[0_0_2px_rgba(138,106,42,0.3)]';
            }, 2000);
            return;
        }

        executeBtn.textContent = 'KINDLING...';
        executeBtn.disabled = true;
        statusText.textContent = 'The flame is stirred...';
        statusText.className = 'font-lore text-lg italic tracking-widest text-[#b8a898] drop-shadow-[0_0_4px_rgba(184,168,152,0.2)]';

        // TODO: Link the real backend later
        //Mock Backend Delay
        setTimeout(() => {
            const slug = Math.random().toString(36).substring(2, 8);
            shortUrl.textContent = 'goshort.com/' + slug;
            resultContainer.classList.remove('hidden');

            restoreButtonIcons();
            executeBtn.disabled = false;

            statusText.textContent = 'A new flame is lit.';
            statusText.className = 'font-lore text-lg italic tracking-widest text-[#c4953a] drop-shadow-[0_0_8px_rgba(196,149,58,0.4)]';

            setTimeout(() => {
                statusText.textContent = 'The flame sleeps...';
                statusText.className = 'font-lore text-lg italic tracking-widest text-[#8a6a2a] drop-shadow-[0_0_2px_rgba(138,106,42,0.3)]';
            }, 3000);
        }, 1000);
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(shortUrl.textContent).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Sealed';
            setTimeout(() => copyBtn.textContent = orig, 1500);
        });
    });

    urlInput.addEventListener('keypress', e => { if (e.key === 'Enter') executeBtn.click(); });
});
