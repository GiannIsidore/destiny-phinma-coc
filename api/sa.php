<?php
include_once 'connection.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST,GET,PUT,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

class StudentAssistant
{
  private $conn;

  public function __construct($conn)
  {
    $this->conn = $conn;
  }

  public function getSA()
  {
    try {
      $stmt = $this->conn->query("
        SELECT s.*, sb.sa_image
        FROM sa s
        LEFT JOIN sa_blob sb ON s.img_id = sb.id
        ORDER BY s.month DESC
        LIMIT 1
      ");
      $sa = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($sa && $sa['sa_image']) {
        $sa['sa_image'] = base64_encode($sa['sa_image']);
      }

      return ['status' => 'success', 'data' => $sa];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function addSA($data)
  {
    try {
      $this->conn->beginTransaction();

      // Insert image into sa_blob
      $stmt = $this->conn->prepare("INSERT INTO sa_blob (sa_image) VALUES (:sa_image)");
      $imageData = base64_decode($data['sa_image']);
      $stmt->bindParam(':sa_image', $imageData, PDO::PARAM_LOB);
      $stmt->execute();
      $imgId = $this->conn->lastInsertId();

      // Insert SA into sa table
      $stmt = $this->conn->prepare("
        INSERT INTO sa (fname, lname, mname, suffix, caption, month, course, img_id)
        VALUES (:fname, :lname, :mname, :suffix, :caption, :month, :course, :img_id)
      ");
      $stmt->bindParam(':fname', $data['fname'], PDO::PARAM_STR);
      $stmt->bindParam(':lname', $data['lname'], PDO::PARAM_STR);
      $stmt->bindParam(':mname', $data['mname'], PDO::PARAM_STR);
      $stmt->bindParam(':suffix', $data['suffix'], PDO::PARAM_STR);
      $stmt->bindParam(':caption', $data['caption'], PDO::PARAM_STR);
      $stmt->bindParam(':month', $data['month'], PDO::PARAM_STR);
      $stmt->bindParam(':course', $data['course'], PDO::PARAM_STR);
      $stmt->bindParam(':img_id', $imgId, PDO::PARAM_INT);
      $stmt->execute();

      $this->conn->commit();
      return ['status' => 'success', 'message' => 'Student Assistant added successfully'];
    } catch (PDOException $e) {
      $this->conn->rollBack();
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function updateSA($data)
  {
    try {
      $this->conn->beginTransaction();

      if (isset($data['sa_image'])) {
        // Update image in sa_blob
        $stmt = $this->conn->prepare("UPDATE sa_blob SET sa_image = :sa_image WHERE id = :img_id");
        $imageData = base64_decode($data['sa_image']);
        $stmt->bindParam(':sa_image', $imageData, PDO::PARAM_LOB);
        $stmt->bindParam(':img_id', $data['img_id'], PDO::PARAM_INT);
        $stmt->execute();
      }

      // Update SA in sa table
      $stmt = $this->conn->prepare("
        UPDATE sa
        SET fname = :fname, lname = :lname, mname = :mname,
            suffix = :suffix, caption = :caption, month = :month,
            course = :course
        WHERE id = :id
      ");
      $stmt->bindParam(':fname', $data['fname'], PDO::PARAM_STR);
      $stmt->bindParam(':lname', $data['lname'], PDO::PARAM_STR);
      $stmt->bindParam(':mname', $data['mname'], PDO::PARAM_STR);
      $stmt->bindParam(':suffix', $data['suffix'], PDO::PARAM_STR);
      $stmt->bindParam(':caption', $data['caption'], PDO::PARAM_STR);
      $stmt->bindParam(':month', $data['month'], PDO::PARAM_STR);
      $stmt->bindParam(':course', $data['course'], PDO::PARAM_STR);
      $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);
      $stmt->execute();

      $this->conn->commit();
      return ['status' => 'success', 'message' => 'Student Assistant updated successfully'];
    } catch (PDOException $e) {
      $this->conn->rollBack();
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function deleteSA($id)
  {
    try {
      // Get img_id first
      $stmt = $this->conn->prepare("SELECT img_id FROM sa WHERE id = :id");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->execute();
      $sa = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($sa) {
        // Delete from sa table (this will cascade delete from sa_blob)
        $stmt = $this->conn->prepare("DELETE FROM sa WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return ['status' => 'success', 'message' => 'Student Assistant deleted successfully'];
      }

      return ['status' => 'error', 'message' => 'Student Assistant not found'];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  $operation = isset($_GET['operation']) ? $_GET['operation'] : '';
  $json = isset($_GET['json']) ? json_decode($_GET['json'], true) : null;
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $operation = isset($_POST['operation']) ? $_POST['operation'] : '';
  $json = isset($_POST['json']) ? json_decode($_POST['json'], true) : null;
}

$sa = new StudentAssistant($conn);

switch ($operation) {
  case 'getSA':
    echo json_encode($sa->getSA());
    break;
  case 'addSA':
    echo json_encode($sa->addSA($json));
    break;
  case 'updateSA':
    echo json_encode($sa->updateSA($json));
    break;
  case 'deleteSA':
    echo json_encode($sa->deleteSA($json['id']));
    break;
  default:
    echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
    break;
}
