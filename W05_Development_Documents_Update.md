# Week 05 — DevScope

## Professional Development Experience

Planned and began an individual web application using modular frontend architecture and a third-party API. This work established the foundation for a developer-focused portfolio-style project built in vanilla JavaScript.

Evidence:
- DevScope project structure created under WDD330/devscope
- Git-based project organization started for the project deliverable
- Week 05 Trello plan mapped to MVP tasks for GitHub search and profile exploration
- README and project architecture documentation created for the project

## Technical Skill Development

Practiced the following during Week 05:
- Fetch API usage for public GitHub data
- async/await request flow
- HTTP status handling for API success and failure states
- modular JavaScript organization through separate API and component files
- DOM rendering for profile and repository results
- responsive CSS layout and accessible UI patterns
- loading and error states for user feedback

Evidence:
- js/api/github.js contains centralized GitHub API requests
- js/components/profileCard.js renders the GitHub user profile card
- js/components/repositoryList.js renders repository cards
- js/components/statusMessage.js manages loading and error states
- index.html and css/styles.css establish responsive project structure

## Problem Solving

One practical issue encountered during implementation was ensuring the application handled both valid GitHub requests and invalid or failed responses without leaving the form stuck in a loading state. This was resolved by using a request token and a centralized error-handling flow in the main controller, so old requests do not overwrite newer ones and the status message resets gracefully after failures.

## Reflection

This Week 05 work established the core DevScope MVP around GitHub developer search. The project now supports a clean search form, profile and repository rendering, and user-friendly loading and error states. Building the app as modular vanilla JavaScript helped clarify how frontend architecture can stay maintainable as more features are added. I also confirmed that the project remains focused on the Week 05 learning goal without prematurely adding future Stack Exchange or final-project features. The next step is to expand the interface with additional polish and stronger validation while staying within the course scope.

## Production Deployment and Validation

DevScope was published to GitHub and deployed as a Render Static Site during Week 05. The public repository is https://github.com/kennethduron/devscope and the deployed production site is https://devscope-etxx.onrender.com.

The production app was browser-tested after deployment to confirm the page loads, the search form is visible, blank input shows a validation message, the octocat search loads profile and repository data, invalid usernames display a friendly error, and a second valid search replaces the previous results cleanly. The project also remained responsive across the required mobile and desktop viewport widths without major layout issues. This verified the Week 05 MVP behavior in a live production environment.
