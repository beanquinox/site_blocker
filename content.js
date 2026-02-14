// CONTENT.JS --------------------------------------
// This code checks the requested page's title for
// blocked keywords and, if one is found, redirects
// the user to the block page (blocked.html)
// -------------------------------------------------

const browserAPI = typeof browser !== "undefined" ? browser : chrome;

const blockIfForbidden = async () => {
  const data = await browserAPI.storage.local.get("blockedKeywords");
  const blockedWords = data.blockedKeywords || [];
  const rawTitleTag = document.querySelector("title")?.innerText || "";
  const pageTitle = (document.title || rawTitleTag).toLowerCase();
  const isForbidden = blockedWords.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(pageTitle);
  });
  const forbiddenWord = blockedWords.find((word) =>
    pageTitle.includes(word.toLowerCase()),
  );
  if (isForbidden) {
    window.stop();
    const encodedWord = encodeURIComponent(forbiddenWord);
    window.location.href = browserAPI.runtime.getURL(
      `blocked.html?blockedWord=${encodedWord}`,
    );
  }
};

blockIfForbidden();

const target = document.querySelector("head") || document.documentElement;
const observer = new MutationObserver(() => {
  blockIfForbidden();
});
observer.observe(target, { subtree: true, childList: true });
