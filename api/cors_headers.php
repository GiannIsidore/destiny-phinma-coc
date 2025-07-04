<?php
// Set Content-Type for all responses
header("Content-Type: application/json; charset=UTF-8");

// Allow specific origins - IMPORTANT: Replace with your actual frontend URL
$allowed_origins = [
    "https://phinma-coc-lib.netlify.app",
    "http://localhost:5173",
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5174",
];

$origin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";

if (in_array($origin, $allowed_origins)) {
    // Set the specific origin instead of wildcard
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header(
        "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    header("Access-Control-Max-Age: 3600"); // Cache preflight for 1 hour

    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
// If the origin is not in the allowed list, no CORS headers are sent.
// The browser's Same-Origin Policy will then block the request.
