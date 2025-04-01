<?php
include_once 'connection.php';
include_once 'cors_headers.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST,OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"), true);

  // Validate required fields
  $required_fields = ['school_id', 'fname', 'lname', 'password'];
  foreach ($required_fields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
      echo json_encode(['status' => 'error', 'message' => ucfirst($field) . ' is required']);
      exit;
    }
  }

  try {
    // Check if school_id already exists
    $check = $conn->prepare("SELECT id FROM user_tble WHERE school_id = :school_id");
    $check->bindParam(':school_id', $data['school_id']);
    $check->execute();

    if ($check->fetch()) {
      echo json_encode(['status' => 'error', 'message' => 'School ID already exists']);
      exit;
    }

    // Hash the password
    $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);

    // Prepare values with defaults
    $school_id = $data['school_id'];
    $fname = $data['fname'];
    $lname = $data['lname'];
    $mname = isset($data['mname']) ? $data['mname'] : '';
    $suffix = isset($data['suffix']) ? $data['suffix'] : '';
    $extension = isset($data['extension']) ? $data['extension'] : '';
    $status = isset($data['status']) ? $data['status'] : '1';

    // Insert new user
    $stmt = $conn->prepare("
            INSERT INTO user_tble (school_id, fname, lname, mname, suffix, extension, status, password)
            VALUES (:school_id, :fname, :lname, :mname, :suffix, :extension, :status, :password)
        ");

    $stmt->bindParam(':school_id', $school_id);
    $stmt->bindParam(':fname', $fname);
    $stmt->bindParam(':lname', $lname);
    $stmt->bindParam(':mname', $mname);
    $stmt->bindParam(':suffix', $suffix);
    $stmt->bindParam(':extension', $extension);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':password', $hashed_password);


    $stmt->execute();

    echo json_encode([
      'status' => 'success',
      'message' => 'User registered successfully'
    ]);
  } catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
  }
} else {
  echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

// {
//     "school_id": "02-2021-04543",
//     "fname": "Giann Isidore",
//     "lname": "Legaspi",
//     "password": "Giann_#1515",
//     "status": "1"
// }
