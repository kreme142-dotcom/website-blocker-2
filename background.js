chrome.runtime.onInstalled.addListener(() => {
  updateBlockingRules();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.blockedSites) {
    updateBlockingRules();
  }
});

function updateBlockingRules() {
  chrome.storage.local.get(["blockedSites"], (result) => {
    const sites = result.blockedSites || [];

    const rules = sites.map((site, index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: "redirect",
        redirect: { extensionPath: "/blocked.html" }
        // redirect: { url: chrome.runtime.getURL("blocked.html") }
        // redirect: { extensionPath: "/blocked.html" }
      },
      condition: {
        urlFilter: site,
        resourceTypes: ["main_frame"]
      }
    }));

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map(rule => rule.id),
      addRules: rules
    });
  });
}