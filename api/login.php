<?php
include 'connection.php';
include 'cors_headers.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"), true);

  // Check for required fields
  if (!isset($data['school_id']) || !isset($data['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
  }

  try {
    $stmt = $conn->prepare("SELECT * FROM user_tble WHERE school_id = :school_id");
    $stmt->bindParam(':school_id', $data['school_id'], PDO::PARAM_STR);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($data['password'], $user['password'])) {
      // Remove password from response
      unset($user['password']);

      echo json_encode([
        'status' => 'success',
        'message' => 'Login successful',
        'user' => $user
      ]);
    } else {
      echo json_encode([
        'status' => 'error',
        'message' => 'Invalid credentials'
      ]);
    }
  } catch (PDOException $e) {
    echo json_encode([
      'status' => 'error',
      'message' => 'Database error: ' . $e->getMessage()
    ]);
  }
} else {
  echo json_encode([
    'status' => 'error',
    'message' => 'Invalid request method'
  ]);
}
