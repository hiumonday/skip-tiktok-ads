# TikTok Auto-Skip Ads – Chrome Extension

A lightweight Chrome extension that automatically skips sponsored / ad videos on TikTok by scrolling to the next video as soon as an ad enters the viewport.

## How it works

1. An `IntersectionObserver` watches every `article[data-e2e="recommend-list-item-container"]` element on the TikTok feed.
2. When a video that is **50% or more visible** is detected as an ad (via `data-e2e="ad-tag"`, `data-e2e="ttam-ads-cta"`, or the text "Sponsored" / "Được tài trợ"), the extension immediately calls `scrollIntoView` on the **next** article.
3. If the ad is still on-screen after the scroll animation (checked after 400 ms), the scroll is retried – up to 10 times.
4. A `MutationObserver` re-runs the setup whenever TikTok loads new videos via infinite scroll.

## Installation (Developer / Unpacked mode)

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the root folder of this repository.
5. Open [https://www.tiktok.com](https://www.tiktok.com) – ads will be skipped automatically.

## File structure

```
├── manifest.json   # Chrome Extension Manifest V3
├── content.js      # Content script injected into TikTok pages
├── popup.html      # Extension popup UI
├── popup.css       # Popup styles
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Permissions

This extension requires **no special permissions**. It only runs on `https://www.tiktok.com/*` pages and does not access any external APIs or send any data anywhere.

## Version

7.0
