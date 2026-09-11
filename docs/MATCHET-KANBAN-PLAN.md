# Matchet Marketplace: 4-Week Kanban Plan

This board translates the CSE 499 project plan into an actionable four-sprint implementation plan. Core requirements must be completed; enhancements are attempted after the core is stable.

## Product goal
Build a 3-tier marketplace where buyers can discover products/services and connect with sellers/providers, while sellers/providers can manage listings and communicate with buyers.

## Locked stack
- Frontend: React (HTML, CSS, JavaScript)
- Backend: Node.js + Express REST API
- Database: MongoDB
- Version control: Git + GitHub
- Deployment: Vercel/Netlify + Render/Railway

## Sprint 1: Foundation
**Milestone:** Repository/board setup, stack finalized, authentication and profiles working, base UI following the approved Matchet designs.

Core tasks:
- Repository structure and development conventions
- Frontend React app setup
- Backend Express API setup
- MongoDB connection and environment configuration
- Base application layout and routing
- Shared UI components and responsive styles
- Authentication: register, login, logout, protected routes
- User profile create/view/edit
- User roles: buyer and seller/provider
- Provider onboarding foundation
- Initial API error handling and validation
- Seed/demo data strategy for development
- Deploy frontend and backend development environments

## Sprint 2: Marketplace listings and discovery
**Milestone:** Listing management plus search and filters working.

Core tasks:
- Listing data model
- Create listing
- Edit listing
- Delete listing
- Seller/provider listing management UI
- Public product/service listing cards
- Search by keyword
- Filter by category
- Filter by location
- Filter by price
- Filter by rating
- Listing detail page
- Pagination or load-more behavior
- Empty/loading/error states

## Sprint 3: Communication and trust
**Milestone:** Buyer-seller messaging, ratings/reviews, and solid backend API coverage.

Core tasks:
- Conversation data model
- Send message API
- Receive/view messages
- Conversation history
- Buyer messaging UI
- Provider messaging UI
- Review data model
- Leave review after completed match
- Display average rating and reviews
- Seller/provider response to review
- Review validation and ownership rules
- Backend endpoint audit and cleanup
- Authentication/authorization checks across APIs

## Sprint 4: Enhancement + stabilization
**Milestone:** One enhancement, complete integration testing, bug fixes, demo video, and worksheet preparation.

Preferred enhancement order:
1. Matching/recommendation engine
2. Notifications

Core/stability tasks:
- End-to-end testing against every core requirement and user story
- Cross-page/user-flow testing
- Data validation and error handling review
- UI polish against approved designs
- Accessibility and responsive checks
- Performance cleanup where practical
- Deployment verification
- Bug triage and fixes
- Demo script/video
- Final course worksheet/documentation

## Kanban columns
Use these columns in GitHub Projects:
1. Backlog
2. Ready
3. In Progress
4. Review / Testing
5. Done

## Working rules
- Every implementation task should be represented by a GitHub issue.
- Keep issues small enough to finish within a few working sessions.
- Link PRs to issues and use the issue/PR for progress notes.
- Do not start enhancement work while unfinished core requirements are at risk.
- UI implementation should follow the approved Matchet designs in the shared UI/design reference folder.
- The frontend communicates with the backend through API calls; do not hardcode application data into the frontend.

## Definition of Done
A task is Done when the implementation works, the relevant UI state is handled, basic validation/error states are covered, the change is reviewed/tested, and the branch is merged to the agreed base branch.

## Core requirements from the course plan
- User Authentication & Profiles
- Listing Management
- Search & Filter
- Buyer-Seller Messaging
- Ratings & Reviews

## Enhancements from the course plan
- Matching/Recommendation Engine
- Notifications
