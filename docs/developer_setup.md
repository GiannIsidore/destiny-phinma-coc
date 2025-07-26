# Developer Setup Guide

This guide explains how to set up the Destiny PHINMA COC Library Management System for local development.

## Prerequisites
- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **PHP** (for backend API)
- **XAMPP/LAMPP** or similar (for local PHP server)

## Frontend Setup
1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173` (or as indicated in the terminal).

## Backend Setup
1. **Ensure XAMPP/LAMPP is running.**
2. **Place the project in your web server's root directory** (e.g., `/opt/lampp/htdocs/`).
3. **Access PHP API endpoints** via `http://localhost/destiny-phinma-coc/api/`.

## Environment Variables
- No custom `.env` file is required for basic local development.
- For production, configure your PHP server and database credentials as needed.

## Build for Production
```bash
npm run build
# or
yarn build
```
The output will be in the `dist/` folder.

## Linting & Formatting
- Run `npm run lint` to check code style.
- Tailwind CSS and ESLint are used for code quality.

## Troubleshooting
- If you encounter CORS issues, check `api/cors_headers.php`.
- For TypeScript errors, ensure your `tsconfig.json` is correct and dependencies are up to date.
- For PHP errors, check your XAMPP/LAMPP logs.

---
For more information, see the other documentation files in the `docs/` folder.