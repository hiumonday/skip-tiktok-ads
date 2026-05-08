// TikTok Auto-Skip Ads - Content Script
// Automatically scrolls past ad videos on TikTok

(function () {
    'use strict';

    let isProcessing = false;

    const forceScrollToNext = (adElement, attempt = 1) => {
        if (attempt > 10) {
            isProcessing = false;
            return;
        }

        const articles = Array.from(
            document.querySelectorAll('article[data-e2e="recommend-list-item-container"]')
        );
        const currentIndex = articles.indexOf(adElement);
        const nextArticle = articles[currentIndex + 1];

        if (nextArticle) {
            nextArticle.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Check whether the ad has left the viewport after scrolling
            setTimeout(() => {
                const rect = adElement.getBoundingClientRect();
                if (rect.bottom > 100 && rect.top < window.innerHeight - 100) {
                    // Ad still visible – retry
                    forceScrollToNext(adElement, attempt + 1);
                } else {
                    // Successfully scrolled past the ad
                    setTimeout(() => { isProcessing = false; }, 500);
                }
            }, 400); // Wait for smooth scroll to finish
        } else {
            // Last video in the list – dispatch ArrowDown so TikTok loads more
            window.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true })
            );
            isProcessing = false;
        }
    };

    const isAd = (el) => {
        return (
            el.querySelector('[data-e2e="ad-tag"]') ||
            el.querySelector('[data-e2e="ttam-ads-cta"]') ||
            el.innerText.includes('Được tài trợ') ||
            el.innerText.includes('Sponsored')
        );
    };

    const observer = new IntersectionObserver((entries) => {
        if (isProcessing) return;

        entries.forEach((entry) => {
            if (entry.isIntersecting && isAd(entry.target)) {
                isProcessing = true;
                forceScrollToNext(entry.target);
            }
        });
    }, { threshold: 0.5 }); // Start processing when 50% of the ad is visible

    const setup = () => {
        document
            .querySelectorAll('article[data-e2e="recommend-list-item-container"]')
            .forEach((el) => observer.observe(el));
    };

    // Watch for new videos loaded by TikTok's infinite scroll
    new MutationObserver(setup).observe(document.body, { childList: true, subtree: true });
    setup();
})();
