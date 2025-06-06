<?php
// // Set Content-Type for all responses
// header("Content-Type: application/json; charset=UTF-8");

// // Allow specific origins
// $allowed_origins = [
//   'https://phinma-coc-lib.netlify.app',
//   'http://localhost:5173',
//   'http://localhost'
// ];

// $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// if (in_array($origin, $allowed_origins)) {
//   // Set the specific origin instead of wildcard
//   header("Access-Control-Allow-Origin: $origin");
//   header("Access-Control-Allow-Credentials: true");
//   header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
//   header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   header("Access-Control-Max-Age: 3600"); // Cache preflight for 1 hour
// }

// // Handle preflight OPTIONS request
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//   http_response_code(200);
//   exit();
// }
// header("Content-Type: application/json; charset=UTF-8");
header ("Access-Control-Allow-Origin: *");
header ("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header ("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header ("Access-Control-Allow-Credentials: true");