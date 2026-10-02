# Contributing to GoBit

Thank you for contributing to GoBit!

## Development Workflow

1. Clone the repository.
2. Install dependencies.
3. Create a feature or fix branch.
4. Make your changes.
5. Run the local checks.
6. Commit your changes.
7. Push your branch.
8. Open a Pull Request.
9. Wait for CI checks and code review.
10. Merge only after the required checks pass.

## Branch Naming

Use descriptive branch names.

Examples:

- feature/workout-tracking
- feature/history-screen
- feature/location-tracking
- feature/dashboard
- fix/navigation
- fix/activity-card
- chore/dependency-update
- docs/update-readme

## Before Opening a Pull Request

Run:

```bash
npm ci
npx tsc --noEmit
npx expo-doctor
npx expo config --type public