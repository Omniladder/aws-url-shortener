/**
 * The redirect itself happens in the API (GET /r/{code}, see docs/arch/0020).
 * The API answers unknown codes with its own "Link not found" page (ADR 0023),
 * so this page is only shown when someone opens /redirect.html directly.
 */
document.querySelector('[data-loading]').hidden = true;
document.querySelector('[data-not-found]').hidden = false;
