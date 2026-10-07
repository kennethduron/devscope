# Week 06 — DevScope

## Professional Development Experience

This Week 06 work extended the DevScope app from a single GitHub search into a more complete developer-insights dashboard. The project kept its existing Vite + vanilla JavaScript structure while bringing in a second public API, additional UI states, and browser persistence.

Evidence:
- Stack Exchange API integration added in `js/api/stackexchange.js`
- Stack Overflow profile cards render alongside GitHub data in the main application flow
- repository controls were added to filter and sort already loaded GitHub results
- localStorage favorites were introduced to save and reopen developer profiles
- the app was validated locally in the browser against live GitHub and Stack Overflow requests

## Technical Skill Development

Practiced the following during Week 06:
- working with a second external API
- normalizing API responses
- combining data from multiple services
- asynchronous JavaScript coordination across separate fetch flows
- API error and rate-limit handling
- repository filtering and sorting on locally loaded data
- browser localStorage persistence
- responsive UI improvement
- accessibility considerations in labels, buttons, and focus states
- testing a production-oriented web application

Evidence:
- `js/api/github.js` handles GitHub request validation and status handling
- `js/api/stackexchange.js` normalizes Stack Overflow user results
- `js/main.js` coordinates the GitHub + Stack Overflow view and repository controls
- `js/utils/storage.js` manages persisted favorites safely
- `index.html` and `css/styles.css` add UI and accessibility improvements for the expanded interface

## Problem Solving

One key challenge was keeping the GitHub and Stack Overflow features independent while still presenting them in one developer overview. The solution was to keep GitHub as the primary search flow, allow a separate Stack Overflow lookup with explicit user confirmation, and update the display without overwriting valid data from the other API. Another issue involved preserving the current repository state during new searches while ensuring filters reset correctly between developers. This was managed by resetting the filtering state whenever a new GitHub profile loads and re-rendering the repository list from the current local data set.

## Reflection

This Week 06 implementation strengthened DevScope from a focused GitHub profile viewer into a combined developer insight app. I confirmed that public APIs can be combined without forcing unsupported identity assumptions, and that clearer loading, filtering, and persistence patterns make the interface feel more robust. The work also reinforced the value of validating live API behavior in the browser, especially when handling empty result states, invalid searches, rate limits, and browser storage recovery.

## Production Validation

The local app was run in a browser and verified against live public API data. The Week 06 work included checking valid and invalid GitHub usernames, a real Stack Overflow search, no-results handling, repository filtering and sorting, and favorite persistence through browser reloads. The app remained functional and consistent with the existing design while keeping the interface responsive and accessible for standard desktop and mobile viewport widths.
