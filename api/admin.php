<?php
include_once 'connection.php';
include_once 'cors_headers.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST,GET,PUT,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

class Admin
{
  private $pdo;

  public function __construct($pdo)
  {
    $this->pdo = $pdo;
  }

  public function functionName($json)
  {
    try {
    } catch (PDOException $e) {
    }
  }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  $operation = isset($_GET['operation']) ? $_GET['operation'] : '';
  $json = isset($_GET['json']) ? json_decode($_GET['json'], true) : null;
}
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $operation = isset($_POST['operation']) ? $_POST['operation'] : '';
  $json = isset($_POST['json']) ? json_decode($_POST['json'], true) : null;
}

$admin = new Admin($pdo);

switch ($operation) {
  case 'functionNameFromFrontEnd':
    $admin->functionName($json);
    break;
  default:
    echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
    break;
}


//USERS TABLE
// CREATE TABLE `user_tble`(
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `school_id` VARCHAR(150) NOT NULL,
//   `fname` VARCHAR(150) NOT NULL,
//   `lname` VARCHAR(150) NOT NULL,
//   `mname` VARCHAR(50) NOT NULL,
//   `suffix` VARCHAR(50) NOT NULL,
//   `extension` VARCHAR(30) NOT NULL,
//   `status` BOOLEAN NOT NULL,
//   PRIMARY KEY(`id`)
// )
