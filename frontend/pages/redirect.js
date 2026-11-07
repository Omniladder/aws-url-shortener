/**
 * The redirect itself happens in the API (GET /r/{code}, see docs/arch/0020).
 * The browser only lands here when the code is unknown, so this page shows
 * the "Link not found" message.
 */
document.querySelector('[data-loading]').hidden = true;
document.querySelector('[data-not-found]').hidden = false;
