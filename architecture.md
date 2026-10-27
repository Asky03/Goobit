┌───────────────────────────────┐
│        GoBit Mobile App       │
│       React Native / Expo     │
└───────────────┬───────────────┘
                │
                │ HTTP requests
                ▼
┌───────────────────────────────┐
│          GoBit API            │
│       Node.js + Express       │
│                               │
│   Authentication              │
│   Validation                  │
│   Business logic              │
└───────────────┬───────────────┘
                │
                │ SQL queries through
                │ a database client/ORM
                ▼
┌───────────────────────────────┐
│         PostgreSQL            │
│        Docker container       │
│                               │
│   Tables and workout records  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│     Docker named volume       │
│       Persistent data         │
└───────────────────────────────┘