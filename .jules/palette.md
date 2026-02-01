## 2026-02-01 - IconButtons with Tooltips
**Learning:** Material UI `IconButton` components containing a `Tooltip` do not automatically expose the tooltip text as the accessible name to screen readers; they remain "button" without a label.
**Action:** Always add an explicit `aria-label` attribute to the `IconButton` (or the interactive element) that matches the tooltip text.
