<?php
// Database configuration
$db_host = 'localhost';  // Use localhost since MySQL is on the same machine
$db_name = 'destiny-coc'; // Your database name (with hyphen, not underscore)
$db_user = 'root';       // Your MySQL username
$db_pass = '';          // Your MySQL password

try {
  $conn = new PDO(
    "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4",
    $db_user,
    $db_pass,
    array(
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_PERSISTENT => true,
      PDO::ATTR_TIMEOUT => 30,
      PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
      PDO::ATTR_EMULATE_PREPARES => false
    )
  );
} catch (PDOException $e) {
  // Return JSON error response
  header('Content-Type: application/json');
  echo json_encode([
    'status' => 'error',
    'message' => 'Database connection failed: ' . $e->getMessage()
  ]);
  exit;
}