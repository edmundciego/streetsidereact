## 2025-05-15 - Stored XSS in Product Descriptions
**Vulnerability:** Found `dangerouslySetInnerHTML` used to render product descriptions with manual newline replacement, allowing Stored XSS if descriptions contained malicious HTML.
**Learning:** Developers attempted to format text (add `<br/>`) but forgot to escape the original content, assuming it was safe or plain text.
**Prevention:** Always escape untrusted input before wrapping it in HTML structure, or use a sanitizer library like `dompurify` if rich text is required. Added `escapeHtml` utility.

## 2025-05-15 - Hardcoded Firebase Secrets
**Vulnerability:** Hardcoded Firebase API keys and configuration found in `src/firebase.js`.
**Learning:** Even client-side keys should not be hardcoded to prevent accidental exposure and to allow environment-specific configuration. Committing `.env` files with these keys to the repo (even for dev) is a security violation.
**Prevention:** Use `process.env` (or `import.meta.env`) for all configuration. Document required variables in `.env.example`. Never commit `.env` files containing secrets.
