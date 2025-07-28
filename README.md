# Destiny PHINMA COC Library Management System

## Overview

Destiny PHINMA COC is a full-stack web application for managing the library resources, users, events, and services of PHINMA Cagayan de Oro College. It provides a modern, user-friendly interface for students, staff, and administrators to interact with the library system.

- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** PHP (REST-style API endpoints)
- **Database:** (assumed MySQL, see PHP code)

## Features

### User Management
- User registration (signup) and login (signin) using school ID
- Admin user management: add, edit, delete, and search users
- User roles and status (active/inactive)

### Book Management
- View all books and book details
- Add, edit, and delete books (admin)
- Book images and metadata

### Event Management
- View all events and event details
- Add, edit, and delete events (admin)
- Event images and metadata

### Library Services & Sections
- View library services and policies
- Manage unit libraries and their sections (admin)
- Library history, mission, vision, and policies

### Student Assistants & Housekeepers
- Manage student assistants and housekeepers (admin)

### FAQ and Chat
- FAQ page and interactive chat (Ask Virla)

### Other Features
- Responsive UI with modern components (cards, dialogs, forms, etc.)
- Authentication-protected admin routes
- Search and filter for users, books, and events
- Integration with external resources (OPAC, eJournals, EBSCO, etc.)

## Project Structure

```
api/                # PHP backend API endpoints
public/             # Static assets (images, redirects)
src/
  components/       # React UI components
  lib/              # Config and utility libraries
  pages/            # Main page components (Admin, Books, Events, etc.)
  services/         # API service wrappers (api.ts)
  utils/            # Utility functions (sessionManager, etc.)
  App.tsx           # Main app entry
  main.tsx          # React entry point
```

## Main Pages
- `LoginPage.tsx` — User login
- `AdminUser.tsx` — Admin user management
- `BooksPage.tsx`, `BookDetailsPage.tsx` — Book browsing
- `EventsPage.tsx` — Event browsing
- `AdminLibraries.tsx` — Manage unit libraries and sections
- `AdminServices.tsx` — Manage library services
- `FAQ.tsx`, `FaqChat.tsx` — FAQ and chat
- `LibraryHistory.tsx`, `LibraryPolicies.tsx`, `LibrarySections.tsx`, `LibraryServices.tsx` — Library info
- `ContactsPage.tsx` — Contact information

## API Endpoints
- `user.php` — User management (signup, signin, get, update, delete)
- `book.php` — Book management
- `event.php` — Event management
- `faq.php` — FAQ
- `sa.php` — Student assistants
- `hk.php` — Hawak Kamay
- `services.php` — Library services
- `unit_libraries.php` — Unit libraries and sections

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```
4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Customization
- Update API URLs in `src/lib/config.ts` as needed
- Add or modify PHP endpoints in `api/`
- Update UI components in `src/components/`

## Dependencies
- React, React Router, Axios, TailwindCSS, Radix UI, Lucide Icons, Framer Motion, React Toastify, etc.

## Assets
- Logos, backgrounds, and images are in `public/`

## Contribution
Pull requests and issues are welcome!

---

For more details, see the code and comments in each file.
