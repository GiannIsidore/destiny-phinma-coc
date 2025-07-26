# Project Overview

This document provides a high-level overview of the Destiny PHINMA COC Library Management System, including its purpose, main features, and technology stack.

## Purpose

The Destiny PHINMA COC Library Management System is designed to streamline library operations, facilitate book/event/service management, and provide a user-friendly interface for both administrators and library users.

## Main Features
- **User Management:** Admins can add, edit, and remove users (students, staff, etc.) using their school IDs.
- **Book Management:** CRUD operations for books, including details, images, and categorization.
- **Event Management:** Admins can create, edit, and manage library events.
- **Service Management:** Admins can manage library services, including adding, editing, and removing services.
- **FAQ & Chat:** Users can access frequently asked questions and interact with a chat-based FAQ system.
- **Authentication:** Secure login for administrators and users.
- **Responsive UI:** Modern, mobile-friendly interface built with React and Tailwind CSS.

## Technology Stack
- **Frontend:** React (TypeScript), Vite, Tailwind CSS
- **Backend:** PHP (RESTful API endpoints in `api/`)
- **State Management:** React Context/State
- **Build Tools:** Vite, PostCSS

## Directory Structure
- `src/` — Frontend source code (components, pages, services, utils)
- `api/` — PHP backend API endpoints
- `public/` — Static assets and images
- `docs/` — Project documentation (this folder)

For more details, see the other documentation files in this folder.