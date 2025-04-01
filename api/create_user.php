<?php
include_once 'connection.php';
include_once 'cors_headers.php';

$user_data = [
  'school_id' => '02-2021-04543',
  'fname' => 'Giann Isidore',
  'lname' => 'Legaspi',
  'mname' => '',
  'suffix' => '',
  'extension' => '',
  'password' => 'Giann_#1515'
];

try {
  // Check if user already exists
  $stmt = $conn->prepare("SELECT id FROM user_tble WHERE school_id = :school_id");
  $stmt->bindParam(':school_id', $user_data['school_id'], PDO::PARAM_STR);
  $stmt->execute();

  if ($stmt->fetch()) {
    echo "User already exists\n";
    exit;
  }

  // Hash the password
  $hashed_password = password_hash($user_data['password'], PASSWORD_DEFAULT);

  // Insert new user
  $stmt = $conn->prepare("
        INSERT INTO user_tble (school_id, fname, lname, mname, suffix, extension, status, password)
        VALUES (:school_id, :fname, :lname, :mname, :suffix, :extension, 1, :password)
    ");

  $stmt->bindParam(':school_id', $user_data['school_id'], PDO::PARAM_STR);
  $stmt->bindParam(':fname', $user_data['fname'], PDO::PARAM_STR);
  $stmt->bindParam(':lname', $user_data['lname'], PDO::PARAM_STR);
  $stmt->bindParam(':mname', $user_data['mname'], PDO::PARAM_STR);
  $stmt->bindParam(':suffix', $user_data['suffix'], PDO::PARAM_STR);
  $stmt->bindParam(':extension', $user_data['extension'], PDO::PARAM_STR);
  $stmt->bindParam(':password', $hashed_password, PDO::PARAM_STR);

  $stmt->execute();
  echo "User created successfully\n";
} catch (PDOException $e) {
  echo "Error: " . $e->getMessage() . "\n";
}
