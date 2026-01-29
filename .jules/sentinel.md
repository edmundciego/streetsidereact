## 2025-05-15 - Stored XSS in Product Descriptions
**Vulnerability:** Found `dangerouslySetInnerHTML` used to render product descriptions with manual newline replacement, allowing Stored XSS if descriptions contained malicious HTML.
**Learning:** Developers attempted to format text (add `<br/>`) but forgot to escape the original content, assuming it was safe or plain text.
**Prevention:** Always escape untrusted input before wrapping it in HTML structure, or use a sanitizer library like `dompurify` if rich text is required. Added `escapeHtml` utility.
