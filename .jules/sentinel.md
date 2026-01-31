## 2025-05-15 - Stored XSS in Product Descriptions
**Vulnerability:** Found `dangerouslySetInnerHTML` used to render product descriptions with manual newline replacement, allowing Stored XSS if descriptions contained malicious HTML.
**Learning:** Developers attempted to format text (add `<br/>`) but forgot to escape the original content, assuming it was safe or plain text.
**Prevention:** Always escape untrusted input before wrapping it in HTML structure, or use a sanitizer library like `dompurify` if rich text is required. Added `escapeHtml` utility.

## 2025-05-30 - Tracked Sensitive Environment Files
**Vulnerability:** `.env.development` and `.env.production` files containing API keys were tracked by git despite being in `.gitignore`.
**Learning:** Adding files to `.gitignore` does not remove them from the repository if they were already committed. This creates a false sense of security.
**Prevention:** Use `git rm --cached` to stop tracking sensitive files and use `.env.example` templates for documentation. Verify file tracking status with `git ls-files`.
