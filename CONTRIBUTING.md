# Contributing to Matchet Marketplace

This project is being built by a team, so the main goal of these guidelines is to make sure everyone's work can come together without unnecessary conflicts or different implementations of the same idea.

## Before you start

Read the GitHub issue assigned to you before writing code. The issue is the main reference for what needs to be built, how it should connect to the rest of the application, and what needs to be completed before the work is considered done.

If something in the issue is unclear, ask in the group before choosing your own approach. Do not create a separate implementation simply because it seems easier.

## File ownership

When you create a source file, add these comments at the top of the file where the file type supports comments:

```text
Created by: Full Name
Edited by: Full Name
```

The creator's name should remain in the file. If another teammate makes a meaningful change to the file, update the `Edited by` line with your name. Do not remove the original creator's name.

## Environment variables and secrets

Never put passwords, API keys, database credentials, JWT secrets, tokens, or other private credentials directly in the code.

Use `.env` for local environment values. The real `.env` file must be included in `.gitignore` and must never be pushed to GitHub.

Every environment variable required by the application must also be listed in `.env.example`. The example file should contain the variable names but not real credentials.

For example:

```text
PORT=
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
```

If you add a new environment variable, update `.env.example` in the same pull request.

Before pushing, check that you are not accidentally committing a `.env` file or any credential.

## Git branches

Do not work directly on `main`.

Create a branch for the issue you are working on. Use a simple name that tells the team what the branch is for.

Examples:

```text
feature/user-login
feature/provider-onboarding
feature/product-listings
fix/search-filter
```

Keep the branch focused on the assigned issue. If you discover another problem, create a separate issue unless it is necessary to complete the current task.

## Pull requests

When your work is ready, open a pull request into `main`.

The pull request should:

1. Reference the GitHub issue being completed.
2. Explain what was implemented.
3. Mention any important decisions or changes other teammates need to know.
4. State how the work was tested.
5. Include screenshots for meaningful UI changes.
6. Mention any new environment variables or setup changes.

Do not merge work that has not been tested locally.

## Frontend and backend structure

The React frontend and Express backend should remain separate and communicate through the agreed API.

Frontend pages should not contain hardcoded application records that are supposed to come from MongoDB. Use the shared API client/service structure to request data from the backend.

Backend routes should not contain large amounts of business logic. Keep routes, controllers, models, middleware, services, and configuration in their agreed locations.

Before creating a new folder, component, utility, API pattern, or model, check whether an existing one can be reused.

## Shared data

Use the existing MongoDB models and identifiers established by previous issues.

Do not create another version of a user, provider, product, service, conversation, review, or other record when an existing model already represents it.

For example, product detail pages, search results, provider dashboards, messaging, and reviews should all use the same listing and provider identifiers. This is important so the different parts of the application connect correctly later.

## API consistency

All backend features must follow the API response, validation, authentication, and error-handling conventions already established in the project.

Do not create a different response format just because it is convenient for one feature. If an existing API convention does not support what you need, discuss the change with the team before introducing it.

Authentication and authorization must be enforced on the backend. Hiding a button or route in React is not enough to protect an action.

## UI implementation

Use the approved Matchet UI references in the repository as the visual source for the application.

Reuse shared components for buttons, inputs, cards, modals, breadcrumbs, feedback messages, layouts, and other repeated patterns.

Do not create a one-off version of a component when the same pattern already exists.

If a new component is needed and it is likely to be used in more than one place, add it to the shared component area instead of keeping it inside one page.

For UI work, check desktop and smaller screen layouts before opening the pull request.

## Testing before completion

A task is not finished just because the page loads or the code compiles.

Before opening a pull request, test the actual flow described in the issue. Check successful actions as well as validation errors, loading states, empty states, permission errors, and failed API requests where they apply.

If your change affects an existing feature, test that existing feature too.

## Working with other teammates

When your work depends on another issue, use the structures and API contracts already established there instead of making temporary replacements that may later need to be removed.

If you need another teammate's work to continue, communicate what you need clearly in the group and reference the relevant GitHub issue.

Keep your commits and pull requests understandable so another teammate can trace what changed.

## Definition of Done

A task can be considered complete when:

- The implementation matches the GitHub issue and approved UI.
- The code follows the existing project structure.
- Shared components, models, API clients, and utilities are reused where appropriate.
- Authentication and ownership rules are enforced correctly.
- Environment variables and secrets are handled correctly.
- Validation, loading, empty, success, and error states are handled where relevant.
- The feature has been tested locally.
- The creator and editor information has been added to new or substantially edited source files where supported.
- The pull request explains the work and references the issue.
- The pull request is reviewed and merged into `main`.
