// OPTIONS.JS -------------------------------------
// This code takes the domains, pages, and keywords
// entered by the user, converts them into rules,
// and saves them to the browser's local storage.
// All navigation will be subject to these rules,
// so any pages that match a rule will be blocked.
// ------------------------------------------------

const browserAPI = typeof browser !== "undefined" ? browser : chrome;
const saveBtn = document.getElementById("saveBtn");

browserAPI.storage.local.get(
  ["blockedDomains", "allowedPages", "blockedKeywords", "blockReasons"],
  (result) => {
    if (result.blockedDomains) {
      document.getElementById("domainList").value = result.blockedDomains
        .toString()
        .split(",")
        .join("\n");
    }
    if (result.allowedPages) {
      document.getElementById("allowList").value = result.allowedPages
        .toString()
        .split(",")
        .join("\n");
    }
    if (result.blockedKeywords) {
      document.getElementById("keywordList").value = result.blockedKeywords
        .toString()
        .split(",")
        .join("\n");
    }
  },
);

saveBtn.onclick = () => {
  let blockedText = document.getElementById("domainList").value;
  let blockedDomainsList = blockedText
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  let keywordText = document.getElementById("keywordList").value;
  let blockedKeywordsList = keywordText
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  let allowedText = document.getElementById("allowList").value;
  let allowedPagesList = allowedText
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  browserAPI.storage.local.set({
    blockedDomains: blockedDomainsList,
    blockedKeywords: blockedKeywordsList,
    allowedPages: allowedPagesList,
  });
  alert("Rules updated!");
};

/*
// When save button is clicked, text box content
// is converted into dynamic rules that are saved
// to the browser's local storage. The rules determine
// if a webpage is allowed or blocked.
document.getElementById("saveBtn").addEventListener("click", () => {
  const blockedText = document.getElementById("siteList").value;
  const allowedText = document.getElementById("allowList").value;
  const keywordText = document.getElementById("keywordList").value;

  const blockedDomains = blockedText
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const allowedPaths = allowedText
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const blockedKeywords = keywordText
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  let rules = [];
  let reasonMap = {};
  let keywordToIdMap = {};

  // Even if the domain is allowed, if the page title
  // contains one of these keywords, the page will be blocked
  blockedKeywords.forEach((word, index) => {
    const ruleID = index + 1;
    const blockPageURL = browserAPI.runtime.getURL(
      `blocked.html?ruleID=${ruleID}`,
    );
    rules.push({
      id: ruleID,
      priority: 2,
      action: {
        type: "redirect",
        redirect: { url: blockPageURL },
      },
      condition: {
        regexFilter: `^.*[^a-z0-9]${word}[^a-z0-9].*$`,
        resourceTypes: ["main_frame"],
      },
    });
    reasonMap[ruleID] = `Blocked keyword: ${word}`;
    keywordToIdMap[word.toLowerCase()] = ruleID;
  });

  // Domains and pages contained here will be allowed
  // by the extension, even if a blocked keyword is present
  allowedPaths.forEach((path, index) => {
    const allowID = index + blockedKeywords.length + 1;
    rules.push({
      id: allowID,
      priority: 3,
      action: { type: "allow" },
      condition: {
        urlFilter: `*://${path}*`,
        resourceTypes: ["main_frame"],
      },
    });
    reasonMap[allowID] = `Allowed page: ${path}`;
  });

  // Any domains or pages contained here will be blocked
  blockedDomains.forEach((domain, index) => {
    const blockID = index + blockedKeywords.length + allowedPaths.length + 1;
    const blockPageURL = browserAPI.runtime.getURL(
      `blocked.html?ruleID=${blockID}`,
    );
    rules.push({
      id: blockID,
      priority: 1,
      action: {
        type: "redirect",
        redirect: { url: blockPageURL },
      },
      condition: {
        urlFilter: `*://${domain}/*`,
        resourceTypes: ["main_frame"],
      },
    });
    reasonMap[blockID] = `Blocked domain: ${domain}`;
  });

  // Take the rules created above and apply them to the browser.
  // Rules are also saved to local storage for persistence
  browserAPI.declarativeNetRequest.getDynamicRules((oldRules) => {
    const oldIds = oldRules.map((rule) => rule.id);
    browserAPI.declarativeNetRequest.updateDynamicRules(
      {
        removeRuleIds: oldIds,
        addRules: rules,
      },
      () => {
        browserAPI.storage.local.set(
          {
            blockedDomains: blockedText,
            allowedPaths: allowedText,
            blockedKeywords: keywordText,
            blockReasons: reasonMap,
            keywordToIdMap: keywordToIdMap,
          },
          () => {
            alert("Rules updated!");
          },
        );
      },
    );
  });
});

// Upon opening the options page, it will load the existing rules
// into the text boxes so the user can easily make changes
browserAPI.storage.local.get(
  ["blockedDomains", "allowedPaths", "blockedKeywords", "blockReasons"],
  (result) => {
    if (result.blockedDomains)
      document.getElementById("siteList").value = result.blockedDomains;
    if (result.allowedPaths)
      document.getElementById("allowList").value = result.allowedPaths;
    if (result.blockedKeywords)
      document.getElementById("keywordList").value = result.blockedKeywords;
  },
);
*/
