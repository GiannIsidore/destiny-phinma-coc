<?php
include_once 'connection.php';
include_once 'cors_headers.php';

class UnitLibraries
{
  private $conn;

  public function __construct($conn)
  {
    $this->conn = $conn;
  }

  public function getLibraries()
  {
    try {
      $stmt = $this->conn->query("
                SELECT
                    id AS library_id,
                    unit_name AS library_name,
                    about AS library_description
                FROM `unit_libraries`
            ");
      $unitLibraries = $stmt->fetchAll(PDO::FETCH_ASSOC);

      return [
        'status' => 'success',
        'data' => $unitLibraries ?: []
      ];
    } catch (PDOException $e) {
      return [
        'status' => 'error',
        'message' => $e->getMessage()
      ];
    }
  }

  public function getLibraryById($id)
  {
    try {
      // Get library details
      $stmt = $this->conn->prepare("
                SELECT
                    id AS library_id,
                    unit_name AS library_name,
                    about AS library_description
                FROM unit_libraries
                WHERE id = :id
            ");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->execute();
      $library = $stmt->fetch(PDO::FETCH_ASSOC);

      if (!$library) {
        return [
          'status' => 'error',
          'message' => 'Library not found'
        ];
      }

      // Get associated sections
      $stmt = $this->conn->prepare("
                SELECT
                    id AS section_id,
                    section_name,
                    section_desc AS section_description,
                    section_image
                FROM sections
                WHERE unit_lib_id = :id
            ");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->execute();
      $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);

      // Combine results
      $library['sections'] = $sections ?: [];

      return [
        'status' => 'success',
        'data' => $library
      ];
    } catch (PDOException $e) {
      return [
        'status' => 'error',
        'message' => $e->getMessage()
      ];
    }
  }

  public function addLibrary($data)
  {
    try {
      $stmt = $this->conn->prepare("
                INSERT INTO unit_libraries (unit_name, about)
                VALUES (:unit_name, :about)
            ");
      $stmt->execute([
        ':unit_name' => $data['unit_name'],
        ':about' => $data['about']
      ]);
      return [
        'status' => 'success',
        'id' => $this->conn->lastInsertId()
      ];
    } catch (PDOException $e) {
      return [
        'status' => 'error',
        'message' => $e->getMessage()
      ];
    }
  }

  public function updateLibrary($data)
  {
    try {
      $stmt = $this->conn->prepare("
                UPDATE unit_libraries
                SET unit_name = :unit_name, about = :about
                WHERE id = :id
            ");
      $stmt->execute([
        ':id' => $data['id'],
        ':unit_name' => $data['unit_name'],
        ':about' => $data['about']
      ]);
      return [
        'status' => 'success'
      ];
    } catch (PDOException $e) {
      return [
        'status' => 'error',
        'message' => $e->getMessage()
      ];
    }
  }

  public function deleteLibrary($id)
  {
    try {
      $stmt = $this->conn->prepare("
                DELETE FROM unit_libraries
                WHERE id = :id
            ");
      $stmt->execute([':id' => $id]);
      return [
        'status' => 'success'
      ];
    } catch (PDOException $e) {
      return [
        'status' => 'error',
        'message' => $e->getMessage()
      ];
    }
  }

  public function addSection($data)
  {
    try {
      $stmt = $this->conn->prepare("
                INSERT INTO sections (
                    section_name,
                    section_desc,
                    section_image,
                    unit_lib_id
                ) VALUES (
                    :section_name,
                    :section_desc,
                    :section_image,
                    :unit_lib_id
                )
            ");
      $stmt->execute([
        ':section_name' => $data['section_name'],
        ':section_desc' => $data['section_desc'],
        ':section_image' => $data['section_image'] ?? null,
        ':unit_lib_id' => $data['unit_lib_id']
      ]);
      return [
        'status' => 'success',
        'id' => $this->conn->lastInsertId()
      ];
    } catch (PDOException $e) {
      return [
        'status' => 'error',
        'message' => $e->getMessage()
      ];
    }
  }

  public function updateSection($data)
  {
    try {
      $stmt = $this->conn->prepare("
                UPDATE sections
                SET
                    section_name = :section_name,
                    section_desc = :section_desc,
                    section_image = :section_image
                WHERE id = :id
            ");
      $stmt->execute([
        ':id' => $data['id'],
        ':section_name' => $data['section_name'],
        ':section_desc' => $data['section_desc'],
        ':section_image' => $data['section_image'] ?? null
      ]);
      return [
        'status' => 'success'
      ];
    } catch (PDOException $e) {
      return [
        'status' => 'error',
        'message' => $e->getMessage()
      ];
    }
  }

  public function deleteSection($id)
  {
    try {
      $stmt = $this->conn->prepare("
                DELETE FROM sections
                WHERE id = :id
            ");
      $stmt->execute([':id' => $id]);
      return [
        'status' => 'success'
      ];
    } catch (PDOException $e) {
      return [
        'status' => 'error',
        'message' => $e->getMessage()
      ];
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

$unitLibraries = new UnitLibraries($conn);

switch ($operation) {
  case 'getLibraries':
    echo json_encode($unitLibraries->getLibraries());
    break;
  case 'getLibraryById':
    echo json_encode($unitLibraries->getLibraryById($json['id']));
    break;
  case 'addLibrary':
    echo json_encode($unitLibraries->addLibrary($json));
    break;
  case 'updateLibrary':
    echo json_encode($unitLibraries->updateLibrary($json));
    break;
  case 'deleteLibrary':
    echo json_encode($unitLibraries->deleteLibrary($json['id']));
    break;
  case 'addSection':
    echo json_encode($unitLibraries->addSection($json));
    break;
  case 'updateSection':
    echo json_encode($unitLibraries->updateSection($json));
    break;
  case 'deleteSection':
    echo json_encode($unitLibraries->deleteSection($json['id']));
    break;
  default:
    echo json_encode([
      'status' => 'error',
      'message' => 'Invalid operation'
    ]);
    break;
}