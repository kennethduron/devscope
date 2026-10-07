# DevScope

DevScope is a lightweight developer profile explorer built with vanilla JavaScript and public GitHub + Stack Overflow APIs.

## Live Site

https://devscope-etxx.onrender.com

## Repository

https://github.com/kennethduron/devscope

## Current capabilities

- GitHub developer search
- GitHub profile data
- GitHub repository cards
- repository language filter
- repository sorting
- Stack Overflow developer lookup
- Stack Overflow reputation and badge display
- combined GitHub + Stack Overflow developer overview
- favorites saved with localStorage
- loading, empty, and error states
- responsive design

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

The Week 06 implementation adds a second public API and favorites workflow while keeping the project in the existing Vite + vanilla JavaScript architecture. The app validates user input, handles rate limits and network failures gracefully, and preserves a clean, accessible interface across desktop and mobile widths.
