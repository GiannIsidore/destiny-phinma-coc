<?php
include_once 'connection.php';
include_once 'cors_headers.php';

class Services
{
  private $conn;

  public function __construct($conn)
  {
    $this->conn = $conn;
  }

  public function getServices()
  {
    try {
      $stmt = $this->conn->query("
                SELECT id, service_name, service_desc, service_img
                FROM services
            ");
      $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

      return ['status' => 'success', 'data' => $services];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function getServiceById($id)
  {
    try {
      $stmt = $this->conn->prepare("
                SELECT id, service_name, service_desc, service_img
                FROM services
                WHERE id = :id
            ");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->execute();
      $service = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($service) {
        return ['status' => 'success', 'data' => $service];
      }

      return ['status' => 'error', 'message' => 'Service not found'];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function addService($data)
  {
    try {
      $stmt = $this->conn->prepare("
                INSERT INTO services (service_name, service_desc, service_img)
                VALUES (:service_name, :service_desc, :service_img)
            ");
      $stmt->execute([
        ':service_name' => $data['service_name'],
        ':service_desc' => $data['service_desc'] ?? null,
        ':service_img' => $data['service_img'] ?? null
      ]);
      return ['status' => 'success', 'id' => $this->conn->lastInsertId()];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function updateService($data)
  {
    try {
      $stmt = $this->conn->prepare("
                UPDATE services
                SET service_name = :service_name,
                    service_desc = :service_desc,
                    service_img = :service_img
                WHERE id = :id
            ");
      $stmt->execute([
        ':id' => $data['id'],
        ':service_name' => $data['service_name'],
        ':service_desc' => $data['service_desc'] ?? null,
        ':service_img' => $data['service_img'] ?? null
      ]);
      return ['status' => 'success'];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function deleteService($id)
  {
    try {
      $stmt = $this->conn->prepare("DELETE FROM services WHERE id = :id");
      $stmt->execute([':id' => $id]);
      return ['status' => 'success'];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }
}

// Request handling
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  $operation = $_GET['operation'] ?? '';
  $json = isset($_GET['json']) ? json_decode($_GET['json'], true) : null;
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $operation = $_POST['operation'] ?? '';
  $json = isset($_POST['json']) ? json_decode($_POST['json'], true) : null;
}

$services = new Services($conn);

switch ($operation) {
  case 'getServices':
    echo json_encode($services->getServices());
    break;
  case 'getServiceById':
    echo json_encode($services->getServiceById($json['id']));
    break;
  case 'addService':
    echo json_encode($services->addService($json));
    break;
  case 'updateService':
    echo json_encode($services->updateService($json));
    break;
  case 'deleteService':
    echo json_encode($services->deleteService($json['id']));
    break;
  default:
    echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
    break;
}