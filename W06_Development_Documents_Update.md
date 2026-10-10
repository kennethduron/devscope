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

## Week 06 Development Time Log

The instructor authorized an estimated/projected time log for the final-project development record. The entries below document the Week 06 project work and total exactly 12.0 hours.

| Development activity | Time | Work completed |
|---|---:|---|
| Planning and Week 06 project review | 1.0 hour | Reviewed the existing DevScope architecture, identified Week 06 requirements, and planned API integration and new user features. |
| Stack Exchange / Stack Overflow API integration | 2.0 hours | Connected to the Stack Exchange API, implemented Stack Overflow user search, parsed and normalized API responses, and handled API quota and backoff behavior. |
| Stack Overflow profile component | 1.5 hours | Created the Stack Overflow profile UI to display reputation, badges, location, avatar, and profile link, and integrated it with live API results. |
| GitHub + Stack Overflow combined experience | 1.5 hours | Combined GitHub and Stack Overflow developer information, kept the two data sources clearly separated in the UI, and coordinated asynchronous data display. |
| Repository filtering and sorting | 1.5 hours | Added repository language filtering and Recently Updated, Most Stars, and Name A-Z sorting; reset filters appropriately after new searches. |
| Loading states and API error handling | 1.5 hours | Added loading messages, disabled relevant controls during requests, added friendly GitHub error states and Stack Exchange error/no-results states, and handled invalid searches and API failures. |
| Favorites with localStorage | 1.5 hours | Added developer favorites persisted with localStorage, prevented duplicate favorites, added removal functionality, tested persistence across reloads, and handled corrupted localStorage safely. |
| Testing, responsive validation, and documentation | 1.5 hours | Tested GitHub and Stack Overflow searches, favorites, filtering, and sorting; validated 320, 375, 768, 1024, and 1440 pixel widths; checked accessibility and console errors; updated the README and Week 06 development documentation; and documented Trello progress. |
| **Total Week 06 Final Project Development Time** | **12.0 hours** | **Instructor-authorized estimated/projected total.** |

Time calculation: 1.0 + 2.0 + 1.5 + 1.5 + 1.5 + 1.5 + 1.5 + 1.5 = **12.0 hours**.

## Professional Development Insights

Week 06 strengthened my ability to:

- Work with multiple third-party APIs while keeping each source's data and error states understandable to users.
- Coordinate asynchronous JavaScript requests and normalize API responses before displaying them.
- Account for API quotas, backoff behavior, invalid searches, empty results, and request failures.
- Manage client-side state with localStorage, including persistence, duplicate prevention, removal, and recovery from corrupted stored data.
- Filter and sort repository data in response to user choices, and reset that state when a new search changes the data set.
- Apply responsive web design and accessibility considerations across the interface.
- Test behavior in the browser at mobile, tablet, and desktop widths, and check for console errors.
- Treat deployment verification as distinct from local testing by checking that the deployed experience reflects the intended build and configuration.
