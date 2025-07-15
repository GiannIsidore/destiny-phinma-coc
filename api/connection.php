<?php
// Database configuration
$db_host = 'localhost';
$db_name = 'destiny-coc';
$db_user = 'root';
$db_pass = '';

// Don't output anything before headers
try {
  $conn = new PDO(
    "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4",
    $db_user,
    $db_pass,
    array(
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_PERSISTENT => true,
      PDO::ATTR_EMULATE_PREPARES => false
    )
  );
  
  // Note: max_allowed_packet is handled by aggressive image compression
  // If you need to increase it globally, add this to your MySQL config:
  // max_allowed_packet = 64M
} catch (PDOException $e) {
  // Ensure no output has been sent before headers
  if (!headers_sent()) {
    header('Content-Type: application/json');
  }
  die(json_encode([
    'status' => 'error',
    'message' => 'Database connection failed: ' . $e->getMessage()
  ]));
}