## 2025-05-15 - Stored XSS in Product Descriptions
**Vulnerability:** Found `dangerouslySetInnerHTML` used to render product descriptions with manual newline replacement, allowing Stored XSS if descriptions contained malicious HTML.
**Learning:** Developers attempted to format text (add `<br/>`) but forgot to escape the original content, assuming it was safe or plain text.
**Prevention:** Always escape untrusted input before wrapping it in HTML structure, or use a sanitizer library like `dompurify` if rich text is required. Added `escapeHtml` utility.

## 2025-05-15 - Hardcoded Firebase Credentials
**Vulnerability:** Found hardcoded Firebase API keys and configuration in `src/firebase.js`.
**Learning:** Credentials were likely hardcoded for ease of development but expose the application to misuse if the repository is public or leaked.
**Prevention:** Use environment variables (`process.env.NEXT_PUBLIC_...`) for all sensitive configuration. Store these in `.env` files which should be gitignored.
