# Second Life — Project Context

## Project Goal
Second Life is a circular economy platform that helps users discover the best next life for unwanted items instead of immediately discarding them.

## Core Problem
People often do not know whether an unwanted item should be reused, donated, repaired, resold, upcycled, or recycled, and they may not know where to take it.

## Core Solution Flow

1. User assesses an unwanted item.
2. The item is evaluated across circular pathways.
3. The platform recommends the most suitable next-life pathway.
4. Relevant prototype opportunities are filtered based on the pathway, item category, and selected location.
5. The user can connect with an opportunity by sending a request.

Core flow:

Analyze → Recommend → Match → Connect → Act

## Four Circular Pathways

1. Reuse / Donate
2. Repair
3. Resell / Upcycle
4. Responsible Recycle

## Current Technology

- React
- Vite
- JavaScript
- Plain CSS
- React Router
- Browser Geolocation API
- localStorage
- Deterministic Circular Recommendation Engine (`src/utils/recommendationEngine.js`)

## Current Project Status

Completed:
- Home page
- Item assessment flow
- Image preview
- Item details input
- Sample item selection
- Deterministic pathway recommendation engine evaluating category & condition across 4 pathways
- Analysis/report page with transparent score breakdown and explainable reasons
- Location selection flow
- Dynamic prototype opportunity filtering
- Connect & Act request flow
- My Requests view using localStorage

Prototype limitations:
- No backend/database
- No authentication
- No real AI/ML image recognition (recommendations are transparently rule-based)
- No real-time chat
- No real business/partner API
- Opportunity data is currently mock/prototype data
- Distances are not real GPS-calculated distances unless an actual implementation exists
- Requests are stored locally using localStorage

## Important Design Rules

- Preserve the existing warm cream and forest green design system.
- Keep the interface clean, premium, minimal, and sustainable.
- Do not introduce neon or futuristic cyberpunk styling.
- Avoid unnecessary redesigns.
- Reuse existing components where possible.

## Development Rules

- Do not rebuild working features unnecessarily.
- Before adding a major feature, inspect the existing project structure.
- Keep code modular and beginner-friendly.
- Avoid unnecessary dependencies.
- Do not claim mock functionality is real.
- Preserve existing working flows while adding new features.

## Collaboration Notes

The project is being developed collaboratively.

Use GitHub for version control.

For new major features:
1. Inspect existing code.
2. Avoid modifying unrelated features.
3. Test the feature.
4. Commit changes with a meaningful commit message.
5. Do not overwrite another contributor’s work.
