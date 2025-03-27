<?php
include_once 'connection.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST,GET,PUT,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

class User
{
  private $conn;

  public function __construct($conn)
  {
    $this->conn = $conn;
  }

  public function signup($data)
  {
    try {
      // Check if school_id already exists
      $stmt = $this->conn->prepare("SELECT id FROM user_tble WHERE school_id = :school_id");
      $stmt->bindParam(':school_id', $data['school_id'], PDO::PARAM_STR);
      $stmt->execute();

      if ($stmt->rowCount() > 0) {
        return ['status' => 'error', 'message' => 'School ID already exists'];
      }

      // Hash password
      $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

      // Insert new user with null status
      $stmt = $this->conn->prepare("INSERT INTO user_tble (school_id, fname, lname, mname, suffix, extension, status, password)
                                  VALUES (:school_id, :fname, :lname, :mname, :suffix, :extension, NULL, :password)");

      $stmt->bindParam(':school_id', $data['school_id'], PDO::PARAM_STR);
      $stmt->bindParam(':fname', $data['fname'], PDO::PARAM_STR);
      $stmt->bindParam(':lname', $data['lname'], PDO::PARAM_STR);
      $stmt->bindParam(':mname', $data['mname'], PDO::PARAM_STR);
      $stmt->bindParam(':suffix', $data['suffix'], PDO::PARAM_STR);
      $stmt->bindParam(':extension', $data['extension'], PDO::PARAM_STR);
      $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);

      $stmt->execute();

      return ['status' => 'success', 'message' => 'User registered successfully'];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function signin($data)
  {
    try {
      $stmt = $this->conn->prepare("SELECT * FROM user_tble WHERE school_id = :school_id");
      $stmt->bindParam(':school_id', $data['school_id'], PDO::PARAM_STR);
      $stmt->execute();

      $user = $stmt->fetch(PDO::FETCH_ASSOC);

      if (!$user || !password_verify($data['password'], $user['password'])) {
        return ['status' => 'error', 'message' => 'Invalid credentials'];
      }

      // if ($user['status'] === null) {
      //   return ['status' => 'error', 'message' => 'Account pending approval'];
      // }

      // if (!$user['status']) {
      //   return ['status' => 'error', 'message' => 'Account is deactivated'];
      // }

      // Remove password from response
      unset($user['password']);
      return ['status' => 'success', 'data' => $user];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $operation = isset($_POST['operation']) ? $_POST['operation'] : '';
  $json = isset($_POST['json']) ? json_decode($_POST['json'], true) : null;
}

$user = new User($conn);

switch ($operation) {
  case 'signup':
    echo json_encode($user->signup($json));
    break;
  case 'signin':
    echo json_encode($user->signin($json));
    break;
  default:
    echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
    break;
}
