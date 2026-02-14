// BACKGROUND.JS -----------------------------------------
// This code enables the user to open the options page
// by clicking on the extension icon
// -------------------------------------------------------

const browserAPI = typeof browser !== "undefined" ? browser : chrome;

browserAPI.browserAction.onClicked.addListener(() => {
  // Opens the page defined in manifest's "options_ui"
  if (browserAPI.runtime.openOptionsPage) {
    browserAPI.runtime.openOptionsPage();
  } else {
    // Fallback for very old environments
    browserAPI.tabs.create({
      url: browserAPI.runtime.getURL("options.html"),
    });
  }
});

let blockedDomainsList = [];
let blockedKeywordsList = [];
let allowedPagesList = [];

browserAPI.storage.local.get("blockedDomains").then((data) => {
  if (data.blockedDomainsList) {
    blockedDomainsList = data.blockedDomains;
  }
});
browserAPI.storage.local.get("blockedKeywords").then((data) => {
  if (data.blockedKeywordsList) {
    blockedKeywordsList = data.blockedKeywords;
  }
});
browserAPI.storage.local.get("allowedPages").then((data) => {
  if (data.allowedPagesList) {
    allowedPagesList = data.allowedPages;
  }
});

browserAPI.storage.onChanged.addListener((changes) => {
  if (changes.blockedDomains) {
    blockedDomainsList = changes.blockedDomains.newValue;
  }
});
browserAPI.storage.onChanged.addListener((changes) => {
  if (changes.blockedKeywords) {
    blockedKeywordsList = changes.blockedKeywords.newValue;
  }
});
browserAPI.storage.onChanged.addListener((changes) => {
  if (changes.allowedPages) {
    allowedPagesList = changes.allowedPages.newValue;
  }
});

browserAPI.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);

    const isBlockedDomain = blockedDomainsList.some(
      (domain) =>
        url.hostname === domain || url.hostname.endsWith(".", +domain),
    );

    const isAllowedPage = allowedPagesList.some((page) => {
      console.log(url.href.includes(page));
      return url.href.includes(page);
    });

    if (isBlockedDomain && !isAllowedPage) {
      console.log("Blocked Domain: ", url.hostname);
      return { redirectUrl: browser.runtime.getURL("blocked.html") };
    }
  },
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["blocking"],
);
