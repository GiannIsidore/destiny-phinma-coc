# API Usage Guide

This document describes the REST API endpoints provided by the Destiny PHINMA COC Library Management System backend (PHP in the `api/` folder).

## Authentication
- **Endpoint:** `api/login.php`
- **Method:** POST
- **Request Body:** `{ "school_id": string, "password": string }`
- **Response:** User object or error message

## User Management
- **Get Users:**
  - `GET api/user.php` — List all users
- **Add User:**
  - `POST api/user.php` — Add a new user (fields: `school_id`, `name`, etc.)
- **Edit User:**
  - `PUT api/user.php` — Update user details
- **Delete User:**
  - `DELETE api/user.php?id=...` — Remove a user by ID

## Book Management
- **Get Books:**
  - `GET api/book.php` — List all books
- **Add Book:**
  - `POST api/book.php` — Add a new book
- **Edit Book:**
  - `PUT api/book.php` — Update book details
- **Delete Book:**
  - `DELETE api/book.php?id=...` — Remove a book by ID

## Event Management
- **Get Events:**
  - `GET api/event.php` — List all events
- **Add Event:**
  - `POST api/event.php` — Add a new event
- **Edit Event:**
  - `PUT api/event.php` — Update event details
- **Delete Event:**
  - `DELETE api/event.php?id=...` — Remove an event by ID

## Service Management
- **Get Services:**
  - `GET api/services.php` — List all services
- **Add Service:**
  - `POST api/services.php` — Add a new service
- **Edit Service:**
  - `PUT api/services.php` — Update service details
- **Delete Service:**
  - `DELETE api/services.php?id=...` — Remove a service by ID

## FAQ Management
- **Get FAQs:**
  - `GET api/faq.php` — List all FAQs
- **Add FAQ:**
  - `POST api/faq.php` — Add a new FAQ
- **Edit FAQ:**
  - `PUT api/faq.php` — Update FAQ details
- **Delete FAQ:**
  - `DELETE api/faq.php?id=...` — Remove a FAQ by ID

## Notes
- All endpoints return JSON responses.
- Some endpoints may require authentication (session or token-based).
- For more details, see the source code in the `api/` folder or contact the developer.

---
For setup and development instructions, see `developer_setup.md` in this folder.