# GoBit

**GoBit** is an open-source, privacy-first fitness tracking application
built with React Native and Expo.

The goal of GoBit is to provide a modern fitness-tracking experience
using the user's smartphone, without requiring a wearable device. The
application is designed to track workouts, movement, GPS routes, steps,
distance, duration, pace, estimated calories, and daily activity
history.

GoBit is being developed as a full-stack engineering project, covering:

-   React Native mobile development
-   Device sensors and GPS
-   Local-first/offline tracking
-   Health-data interoperability
-   Secure backend APIs
-   Authentication
-   PostgreSQL
-   Automated testing
-   CI/CD
-   Docker
-   Android APK/AAB builds
-   Accessibility
-   Privacy and security
-   Open-source development
-   Google Play preparation

> **Project status:** Early development / V1 frontend foundation.

------------------------------------------------------------------------

## Table of Contents

-   [Vision](#vision)
-   [Core Goals](#core-goals)
-   [Planned Features](#planned-features)
-   [Architecture](#architecture)
-   [Technology Stack](#technology-stack)
-   [Repository Structure](#repository-structure)
-   [Current Mobile Structure](#current-mobile-structure)
-   [Development Roadmap](#development-roadmap)
-   [Getting Started](#getting-started)
-   [Running the Mobile App](#running-the-mobile-app)
-   [Development Builds](#development-builds)
-   [Backend](#backend)
-   [Health Integrations](#health-integrations)
-   [Privacy and Security](#privacy-and-security)
-   [Accessibility](#accessibility)
-   [Testing](#testing)
-   [DevOps and CI/CD](#devops-and-cicd)
-   [APK and Play Store Builds](#apk-and-play-store-builds)
-   [Open Source](#open-source)
-   [Contributing](#contributing)
-   [Project Disclaimer](#project-disclaimer)
-   [License](#license)

------------------------------------------------------------------------

# Vision

GoBit aims to become a complete mobile fitness-tracking platform rather
than only a fitness dashboard.

The long-term experience is:

``` text
             ┌──────────────────────┐
             │        GoBit         │
             │    Mobile App       │
             └──────────┬───────────┘
                        │
             ┌──────────┴──────────┐
             │                     │
       Phone Sensors          GPS / Location
             │                     │
       Steps / Motion         Route / Distance
             │                     │
             └──────────┬──────────┘
                        │
                  Tracking Engine
                        │
          ┌─────────────┼─────────────┐
          │             │             │
       Duration      Distance       Calories
          │             │             │
          └─────────────┼─────────────┘
                        │
                  Workout Record
                        │
              ┌─────────┴─────────┐
              │                   │
        Local Storage         Backend API
              │                   │
              │              PostgreSQL
              │                   │
              └─────────┬─────────┘
                        │
                 GoBit Dashboard
```

Optional health-data integrations can later provide data from supported
health platforms.

------------------------------------------------------------------------

# Core Goals

## 1. Smartphone-first tracking

GoBit should be useful even when the user does not own a smartwatch or
fitness band.

The phone should be able to support activities such as:

-   Running
-   Walking
-   Cycling
-   Outdoor workouts
-   General activity tracking

------------------------------------------------------------------------

## 2. Real-time workout tracking

A workout should provide live information such as:

-   Elapsed time
-   Distance
-   Current speed
-   Current pace
-   Average pace
-   Steps
-   Estimated calories
-   GPS accuracy
-   Route
-   Elevation where available

Example:

``` text
RUNNING

00:24:37

Distance
3.42 km

Pace
7:12 /km

Steps
4,821

Calories
286 kcal
```

Fitness measurements such as calories are estimates and should be
presented as such.

------------------------------------------------------------------------

## 3. Local-first operation

A workout should not be lost just because the internet disappears.

The application should eventually support:

``` text
Tracking
   ↓
Local storage
   ↓
Internet unavailable
   ↓
Continue tracking
   ↓
Internet returns
   ↓
Synchronize
```

Synchronization states:

``` text
pending
syncing
synced
failed
```

------------------------------------------------------------------------

## 4. Privacy-first health tracking

GoBit should collect only the data required for its features.

Principles:

``` text
Collect minimum
       ↓
Use minimum
       ↓
Store minimum
       ↓
Share minimum
       ↓
Delete when requested
```

Health and location data must never be treated as ordinary application
data.

------------------------------------------------------------------------

# Planned Features

## Dashboard

-   Today's steps
-   Distance
-   Calories
-   Active time
-   Workout count
-   Recent workouts
-   Daily progress
-   Weekly statistics
-   Monthly statistics

## Workout Tracking

-   Start
-   Pause
-   Resume
-   Stop
-   Workout timer
-   Distance
-   Pace
-   Speed
-   Steps
-   Estimated calories
-   GPS route
-   Workout summary

## Workout History

-   List previous workouts
-   Filter by activity
-   Search workouts
-   Workout details
-   Route visualization
-   Statistics

## GPS

-   Latitude
-   Longitude
-   Timestamp
-   Accuracy
-   Speed
-   Altitude where available
-   Route points
-   Distance calculation
-   GPS outlier filtering

## Health Data

Planned integrations include:

-   Android Health Connect
-   Google Health API
-   Fitbit-related health data through the current Google health-data
    architecture

External integrations are optional. GoBit should continue functioning as
a standalone phone-based tracker.

## Authentication

Planned:

-   Google authentication
-   Secure sessions
-   Logout
-   Token refresh
-   Account deletion

## Accessibility

The application will target:

-   Large touch targets
-   Screen-reader support
-   High contrast
-   Scalable text
-   Reduced-motion support
-   Clear focus states
-   Accessible forms
-   Accessible charts
-   Accessible workout controls
-   Meaningful labels
-   No color-only communication

------------------------------------------------------------------------

# Architecture

The long-term architecture is planned as:

``` text
                    ┌───────────────────┐
                    │   React Native    │
                    │    GoBit App      │
                    └─────────┬─────────┘
                              │
                         HTTPS / API
                              │
                    ┌─────────▼─────────┐
                    │    GoBit API      │
                    │ Node.js/Express    │
                    └─────────┬─────────┘
                              │
                 ┌────────────┼────────────┐
                 │            │            │
               Auth       Tracking      Health
                 │            │            │
                 └────────────┼────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    PostgreSQL     │
                    └───────────────────┘
```

The mobile application will also have local storage so active workouts
do not depend on continuous internet connectivity.

------------------------------------------------------------------------

# Technology Stack

## Mobile

-   React Native
-   Expo
-   TypeScript
-   Expo development builds
-   Expo Location
-   Expo Sensors
-   React Navigation / Expo Router as architecture is finalized
-   Local persistence
-   Secure storage
-   Health Connect integration where required
-   Map provider abstraction

## Backend

-   Node.js
-   TypeScript
-   Express
-   PostgreSQL
-   Prisma
-   Zod
-   Authentication/OAuth
-   Rate limiting
-   Security middleware

## DevOps

-   Git
-   GitHub
-   GitHub Actions
-   Docker
-   Docker Compose
-   EAS Build
-   Automated testing
-   CI/CD

------------------------------------------------------------------------

# Repository Structure

The planned repository is:

``` text
GoBit/
│
├── mobile/
│   ├── app/
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── features/
│   │   │   ├── activity/
│   │   │   ├── tracking/
│   │   │   ├── health/
│   │   │   ├── maps/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   └── auth/
│   │   │
│   │   ├── services/
│   │   │   ├── api/
│   │   │   ├── location/
│   │   │   ├── sensors/
│   │   │   ├── health/
│   │   │   ├── storage/
│   │   │   └── auth/
│   │   │
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── models/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── constants/
│   │   └── theme/
│   │
│   ├── assets/
│   ├── app.json
│   ├── eas.json
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── auth/
│   │   ├── tracking/
│   │   ├── health/
│   │   ├── integrations/
│   │   ├── config/
│   │   └── utils/
│   │
│   ├── prisma/
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── security/
│   ├── privacy/
│   └── testing/
│
├── .github/
│   └── workflows/
│       ├── mobile-ci.yml
│       ├── backend-ci.yml
│       └── release.yml
│
├── docker-compose.yml
├── README.md
├── LICENSE
├── SECURITY.md
├── PRIVACY.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── .env.example
```

This is the target architecture. The folders will be introduced
gradually rather than creating the entire repository on day one.

------------------------------------------------------------------------

# Current Mobile Structure

The current V1 Expo project is intentionally smaller:

``` text
GoBit/
│
├── assets/
│
├── src/
│   ├── components/
│   │   ├── ActivityCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── SummaryCard.tsx
│   │
│   ├── constants/
│   │   └── colors.ts
│   │
│   ├── models/
│   │   └── Activity.ts
│   │
│   └── screens/
│       └── HomeScreen.tsx
│
├── App.tsx
├── app.json
├── package.json
└── tsconfig.json
```

This is the current foundation.

The project should grow from this structure rather than repeatedly
creating new Expo projects.

------------------------------------------------------------------------

# Development Roadmap

## Phase 0 --- Foundation

-   Expo project
-   TypeScript
-   Git
-   Folder architecture
-   Theme
-   Basic reusable components

## Phase 1 --- GoBit V1 UI

-   Dashboard
-   Activity cards
-   Activity badges
-   Search
-   Add activity
-   Delete activity
-   Navigation
-   Light/dark theme

## Phase 2 --- Workout System

-   Add workout form
-   Edit workout
-   Delete workout
-   Activity types
-   Date/time
-   Workout validation
-   Workout state machine

## Phase 3 --- Device Tracking

-   Pedometer
-   Motion data
-   GPS
-   Distance
-   Speed
-   Pace
-   Workout timer
-   Estimated calories

## Phase 4 --- GPS Maps

-   Live route
-   Route history
-   Route points
-   GPS accuracy
-   Route filtering
-   Distance calculation
-   Map abstraction

## Phase 5 --- Local-First Storage

-   Local database/storage
-   Offline workout tracking
-   Pending synchronization
-   Recovery after interruption
-   Data migration

## Phase 6 --- Backend

-   Node.js
-   Express
-   PostgreSQL
-   Prisma
-   REST API
-   Authentication
-   Authorization
-   Workout synchronization

## Phase 7 --- Health Integrations

-   Android Health Connect
-   Google Health API
-   Fitbit-related integration
-   OAuth
-   Permission management
-   Source attribution
-   Health synchronization

## Phase 8 --- Security

-   Threat model
-   Secure storage
-   Permission minimization
-   Rate limiting
-   Input validation
-   Security headers
-   Audit logging
-   Dependency auditing
-   Privacy controls

## Phase 9 --- Testing

-   Unit tests
-   Component tests
-   API tests
-   Integration tests
-   Device testing
-   Offline testing
-   Permission testing
-   Security testing

## Phase 10 --- DevOps

-   Docker
-   GitHub Actions
-   CI
-   CD
-   Backend deployment
-   Development builds
-   Preview builds
-   Production builds

## Phase 11 --- Distribution

-   APK
-   AAB
-   Internal testing
-   Closed testing
-   Production release preparation
-   Play Store listing
-   Privacy policy
-   Data safety information
-   Health-related declarations

------------------------------------------------------------------------

# Getting Started

## Requirements

Recommended development environment:

-   Windows
-   Node.js
-   npm
-   Java/JDK
-   Android SDK
-   Android platform tools
-   Android phone or emulator
-   Expo CLI through `npx`
-   Git

Verify:

``` powershell
node --version
npm --version
java --version
adb version
```

------------------------------------------------------------------------

# Running the Mobile App

From the mobile project directory:

``` powershell
npm install
```

Check the Expo project:

``` powershell
npx expo-doctor
```

Start development:

``` powershell
npx expo start
```

LAN mode:

``` powershell
npx expo start --lan
```

Tunnel mode:

``` powershell
npx expo start --tunnel
```

Clear Metro cache if required:

``` powershell
npx expo start --clear
```

------------------------------------------------------------------------

# Development Builds

Expo Go is useful during early UI development.

Some native functionality requires a development build instead of Expo
Go, particularly features involving custom native modules, background
behavior, or health-data integrations.

The project will therefore transition to Expo development builds as
native functionality is introduced.

Example:

``` powershell
npx expo run:android
```

or, when using EAS:

``` powershell
eas build --platform android --profile development
```

------------------------------------------------------------------------

# Backend

The backend will eventually provide:

``` text
Authentication
User profile
Workout APIs
Workout history
Statistics
Health synchronization
Connected providers
Account deletion
```

Example planned API structure:

``` text
/api/v1/auth
/api/v1/users
/api/v1/workouts
/api/v1/activity
/api/v1/statistics
/api/v1/health
/api/v1/integrations
```

The mobile client must never be treated as a trusted source.

Every backend request must be validated and authorized server-side.

------------------------------------------------------------------------

# Health Integrations

GoBit will support health integrations as optional sources of
information.

The application should distinguish between:

``` text
GoBit phone tracking
Health Connect
Google Health
Fitbit-related data
```

Every imported record should have source information.

Example:

``` json
{
  "steps": 8421,
  "source": "health_connect",
  "timestamp": "2026-01-01T10:00:00Z"
}
```

The application must not claim that health metrics are perfectly
accurate.

Users should be able to:

-   Grant permissions
-   Deny permissions
-   Review permissions
-   Disconnect integrations
-   Delete synchronized data where applicable

The legacy Fitbit Web API should not be used as the long-term
integration architecture.

------------------------------------------------------------------------

# Privacy and Security

GoBit is intended to handle potentially sensitive:

-   Health data
-   Location data
-   Workout data
-   Account data
-   Authentication data

Security principles:

``` text
Least privilege
Secure defaults
Data minimization
Explicit consent
Encryption in transit
Secure credential handling
Input validation
Authorization
Auditability
User controlled deletion
```

Never commit:

``` text
.env
OAuth secrets
API secrets
Private keys
Signing credentials
Access tokens
Refresh tokens
```

Use:

``` text
.env.example
```

for documenting required configuration.

------------------------------------------------------------------------

# Accessibility

Accessibility is part of the product design from the beginning.

The UI should support:

-   Large touch targets
-   Screen readers
-   High contrast
-   Scalable text
-   Reduced motion
-   Clear labels
-   Accessible forms
-   Accessible charts
-   Accessible navigation
-   Clear error states

The application must not depend on color alone to communicate
information.

For example, an activity should display:

``` text
Running
```

rather than communicating "Running" only through a colored badge.

------------------------------------------------------------------------

# Testing

Testing will cover both software logic and real device behavior.

## Unit Tests

Examples:

``` text
Distance calculation
Pace calculation
Calorie estimation
Time formatting
GPS filtering
Workout state transitions
```

## Component Tests

Examples:

``` text
Dashboard
Workout card
Start button
Pause button
Forms
Navigation
```

## Integration Tests

Examples:

``` text
Start workout
Receive GPS updates
Pause
Resume
Stop
Save
Synchronize
```

## Device Tests

Test scenarios include:

``` text
GPS disabled
Location permission denied
Health permission denied
No internet
Internet restored
Phone locked
Application backgrounded
Low GPS accuracy
Low battery
Unexpected application termination
```

------------------------------------------------------------------------

# DevOps and CI/CD

The intended development pipeline is:

``` text
Developer
    ↓
Git
    ↓
GitHub
    ↓
Pull Request
    ↓
GitHub Actions
    ↓
Lint
    ↓
Type Check
    ↓
Tests
    ↓
Build
    ↓
Deployment / Release
```

Backend infrastructure will be containerized using Docker.

Local development will use Docker Compose for services such as
PostgreSQL.

------------------------------------------------------------------------

# APK and Play Store Builds

GoBit will support two major Android distribution artifacts.

## APK

Used for:

-   Personal testing
-   Device testing
-   Internal distribution
-   Demonstrations

Example EAS profile:

``` powershell
eas build --platform android --profile preview
```

## AAB

Used for Google Play distribution.

Example:

``` powershell
eas build --platform android --profile production
```

Play Store release preparation will include:

-   Application ID
-   App signing
-   Privacy policy
-   Data Safety information
-   Health related declarations where applicable
-   Location permission disclosures
-   Store screenshots
-   App icon
-   Feature graphic
-   Content rating
-   Testing tracks
-   Release notes

Play Store approval cannot be guaranteed by the project itself;
compliance requirements must be reviewed against the current Google Play
policies at release time.

------------------------------------------------------------------------

# Open Source

GoBit is intended to be open source.

The repository should include:

``` text
LICENSE
README.md
CONTRIBUTING.md
CODE_OF_CONDUCT.md
SECURITY.md
PRIVACY.md
```

Contributions should follow the project's contribution guidelines.

Security vulnerabilities should be reported through the process
documented in `SECURITY.md` rather than being publicly disclosed before
a fix is available.

------------------------------------------------------------------------

# Contributing

Before contributing:

1.  Fork the repository.
2.  Create a feature branch.
3.  Install dependencies.
4.  Run tests.
5.  Run linting and type checks.
6.  Make the change.
7.  Add or update tests.
8.  Open a pull request.

Example:

``` bash
git checkout -b feature/workout-tracking
```

Commit changes:

``` bash
git add .
git commit -m "feat: add workout tracking"
```

Push:

``` bash
git push origin feature/workout-tracking
```

------------------------------------------------------------------------

# Project Disclaimer

GoBit is a software engineering project.

Fitness metrics such as calories, pace, distance, and other measurements
may be estimates and can vary depending on device sensors, GPS
conditions, user information, algorithms, and external health-data
sources.

GoBit is not intended to diagnose, treat, or prevent medical conditions.

Users should not rely on estimated fitness measurements as medical
advice.

------------------------------------------------------------------------

# License

GoBit is planned to be released under the MIT License.

See `LICENSE` for the complete license text.
