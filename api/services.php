<?php
include_once 'connection.php';
include_once 'cors_headers.php';
include_once 'image_handler.php';

class Services
{
  private $conn;

  public function __construct($conn)
  {
    $this->conn = $conn;
  }

  /**
   * Check if image_type column exists in services table
   */
  private function checkImageTypeColumn()
  {
    try {
      $stmt = $this->conn->query("SHOW COLUMNS FROM services LIKE 'image_type'");
      return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
      return false;
    }
  }

  public function getServices()
  {
    try {
      $columnExists = $this->checkImageTypeColumn();
      
      if ($columnExists) {
        $stmt = $this->conn->query("
                  SELECT id, service_name, service_desc, service_img, image_type
                  FROM services
              ");
      } else {
        $stmt = $this->conn->query("
                  SELECT id, service_name, service_desc, service_img, 'base64' as image_type
                  FROM services
              ");
      }
      
      $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
      
      // Process images for frontend consumption
      $imageHandler = new ImageHandler();
      foreach ($services as &$service) {
        if ($service['service_img']) {
          if ($service['image_type'] === 'file') {
            // Convert file path to full URL
            $service['service_img_url'] = $imageHandler->getImageUrl($service['service_img']);
            $service['service_img'] = null; // Don't send file path to frontend
          } else {
            // Keep base64 data as is
            $service['service_img_url'] = null;
          }
        } else {
          $service['service_img_url'] = null;
        }
      }

      return ['status' => 'success', 'data' => $services];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function getServiceById($id)
  {
    try {
      $columnExists = $this->checkImageTypeColumn();
      
      if ($columnExists) {
        $stmt = $this->conn->prepare("
                  SELECT id, service_name, service_desc, service_img, image_type
                  FROM services
                  WHERE id = :id
              ");
      } else {
        $stmt = $this->conn->prepare("
                  SELECT id, service_name, service_desc, service_img, 'base64' as image_type
                  FROM services
                  WHERE id = :id
              ");
      }
      
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->execute();
      $service = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($service) {
        // Process image for frontend consumption
        $imageHandler = new ImageHandler();
        if ($service['service_img']) {
          if ($service['image_type'] === 'file') {
            $service['service_img_url'] = $imageHandler->getImageUrl($service['service_img']);
            $service['service_img'] = null; // Don't send file path to frontend
          } else {
            $service['service_img_url'] = null;
          }
        } else {
          $service['service_img_url'] = null;
        }
        
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
      $imageHandler = new ImageHandler();
      $processedImage = null;
      
      if (!empty($data['service_img'])) {
        try {
          // Try file system storage first (recommended)
          $filename = $imageHandler->saveImageFile($data['service_img']);
          $processedImage = $filename;
        } catch (Exception $e) {
          // Fallback to heavily compressed base64 storage
          try {
            $processedImage = $imageHandler->compressBase64Image($data['service_img'], 40);
          } catch (Exception $e2) {
            // If both fail, log error but continue without image
            error_log("Image processing failed: " . $e2->getMessage());
            $processedImage = null;
          }
        }
      }
      
      // Check if image_type column exists
      $columnExists = $this->checkImageTypeColumn();
      
      if ($columnExists) {
        $stmt = $this->conn->prepare("
                  INSERT INTO services (service_name, service_desc, service_img, image_type)
                  VALUES (:service_name, :service_desc, :service_img, :image_type)
              ");
        
        $imageType = null;
        if ($processedImage) {
          $imageType = $imageHandler->isBase64Image($processedImage) ? 'base64' : 'file';
        }
        
        $stmt->execute([
          ':service_name' => $data['service_name'],
          ':service_desc' => $data['service_desc'] ?? null,
          ':service_img' => $processedImage,
          ':image_type' => $imageType
        ]);
      } else {
        // Fallback for old schema without image_type column
        $stmt = $this->conn->prepare("
                  INSERT INTO services (service_name, service_desc, service_img)
                  VALUES (:service_name, :service_desc, :service_img)
              ");
        
        $stmt->execute([
          ':service_name' => $data['service_name'],
          ':service_desc' => $data['service_desc'] ?? null,
          ':service_img' => $processedImage
        ]);
      }
      
      return ['status' => 'success', 'id' => $this->conn->lastInsertId()];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function updateService($data)
  {
    try {
      $imageHandler = new ImageHandler();
      
      // Get current service data to handle image deletion
      $columnExists = $this->checkImageTypeColumn();
      
      if ($columnExists) {
        $currentStmt = $this->conn->prepare("SELECT service_img, image_type FROM services WHERE id = :id");
      } else {
        $currentStmt = $this->conn->prepare("SELECT service_img, 'base64' as image_type FROM services WHERE id = :id");
      }
      
      $currentStmt->execute([':id' => $data['id']]);
      $currentService = $currentStmt->fetch(PDO::FETCH_ASSOC);
      
      $processedImage = $data['service_img'] ?? null;
      $imageType = null;
      
      // Only process image if a new one is provided
      if (!empty($data['service_img']) && $data['service_img'] !== $currentService['service_img']) {
        try {
          // Try file system storage first
          $filename = $imageHandler->saveImageFile($data['service_img']);
          $processedImage = $filename;
          $imageType = 'file';
          
          // Delete old file if it exists
          if ($currentService['image_type'] === 'file' && $currentService['service_img']) {
            $imageHandler->deleteImageFile($currentService['service_img']);
          }
        } catch (Exception $e) {
          // Fallback to heavily compressed base64 storage
          try {
            $processedImage = $imageHandler->compressBase64Image($data['service_img'], 40);
            $imageType = 'base64';
          } catch (Exception $e2) {
            error_log("Image processing failed: " . $e2->getMessage());
            $processedImage = $currentService['service_img']; // Keep existing image
            $imageType = $currentService['image_type'];
          }
        }
      } else {
        // Keep existing image
        $processedImage = $currentService['service_img'];
        $imageType = $currentService['image_type'];
      }
      
      if ($columnExists) {
        $stmt = $this->conn->prepare("
                  UPDATE services
                  SET service_name = :service_name,
                      service_desc = :service_desc,
                      service_img = :service_img,
                      image_type = :image_type
                  WHERE id = :id
              ");
        $stmt->execute([
          ':id' => $data['id'],
          ':service_name' => $data['service_name'],
          ':service_desc' => $data['service_desc'] ?? null,
          ':service_img' => $processedImage,
          ':image_type' => $imageType
        ]);
      } else {
        // Fallback for old schema without image_type column
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
          ':service_img' => $processedImage
        ]);
      }
      
      return ['status' => 'success'];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function deleteService($id)
  {
    try {
      // Get service data to delete associated image file
      $columnExists = $this->checkImageTypeColumn();
      
      if ($columnExists) {
        $stmt = $this->conn->prepare("SELECT service_img, image_type FROM services WHERE id = :id");
      } else {
        $stmt = $this->conn->prepare("SELECT service_img, 'base64' as image_type FROM services WHERE id = :id");
      }
      
      $stmt->execute([':id' => $id]);
      $service = $stmt->fetch(PDO::FETCH_ASSOC);
      
      // Delete the service record
      $deleteStmt = $this->conn->prepare("DELETE FROM services WHERE id = :id");
      $deleteStmt->execute([':id' => $id]);
      
      // Delete associated image file if it exists
      if ($service && $service['image_type'] === 'file' && $service['service_img']) {
        $imageHandler = new ImageHandler();
        $imageHandler->deleteImageFile($service['service_img']);
      }
      
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