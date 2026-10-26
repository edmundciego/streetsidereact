// scrollIntoView can also scroll the document. Move only the tab strip so
// mounting a header cannot disturb a restored browsing position.
export const scrollActiveTabIntoView = (container) => {
  const tab = container?.querySelector("[data-active='true']");
  if (!tab) return;
  const containerRect = container.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();
  container.scrollTo({
    left:
      container.scrollLeft +
      tabRect.left +
      tabRect.width / 2 -
      containerRect.left -
      containerRect.width / 2,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
};
