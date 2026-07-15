# Design QA — live project button

- Source visual truth: `C:/Users/apdir/AppData/Local/Temp/codex-clipboard-6c3a9e0c-f833-4c10-bbd3-a9f8407837c8.png`
- Implementation screenshot: `D:/my-portfolio/artifacts/button-black-implementation.png`
- Viewport: 1280 × 720
- State: dark theme, Somali National Women Organization project dialog open

## Full-view comparison evidence

The implementation preserves the reference button's lime pill background, rounded shape, compact bold label, spacing, and northeast arrow. Per the user's explicit annotation, the label and arrow intentionally change from white to black. Browser-computed styles report `rgb(0, 0, 0)` for both text and icon and `rgb(200, 250, 70)` for the background.

## Focused-region evidence

A separate focused capture is unnecessary because the only requested component is clearly readable in the full-view screenshot. The exact foreground colors were additionally checked from the rendered button and its SVG icon.

## Required fidelity surfaces

- Fonts and typography: unchanged from the existing button.
- Spacing and layout rhythm: unchanged from the existing button.
- Colors and visual tokens: black foreground confirmed on the existing lime accent background.
- Image quality and asset fidelity: no image assets changed.
- Copy and content: “View live project” remains unchanged.

## Findings

No actionable P0, P1, or P2 differences remain for the requested color change.

## Interaction and runtime checks

- Opened and closed a project dialog, then opened a project containing the live-project link.
- Confirmed the link is present and uniquely addressable.
- Console errors: none.

## Comparison history

- Initial issue: the more-specific inherited link color overrode the accent-button foreground.
- Fix: increased the accent-button selector specificity and set its foreground to black.
- Post-fix evidence: rendered text and SVG icon both compute to `rgb(0, 0, 0)`.

final result: passed
