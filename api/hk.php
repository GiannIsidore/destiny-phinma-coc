<?php
include_once 'connection.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST,GET,PUT,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

class HawakKamay
{
  private $conn;
  private $maxRetries = 3;
  private $retryDelay = 1; // seconds

  public function __construct($conn)
  {
    $this->conn = $conn;
    // Set connection timeout and other settings
    $this->conn->setAttribute(PDO::ATTR_TIMEOUT, 30);
    $this->conn->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAMES utf8mb4");
  }

  private function ensureConnection()
  {
    try {
      // Test the connection
      $this->conn->query("SELECT 1");
    } catch (PDOException $e) {
      // If connection is lost, try to reconnect
      $this->conn = new PDO(
        "mysql:host=" . $GLOBALS['db_host'] . ";dbname=" . $GLOBALS['db_name'],
        $GLOBALS['db_user'],
        $GLOBALS['db_pass'],
        array(
          PDO::ATTR_TIMEOUT => 30,
          PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        )
      );
    }
  }

  public function getHK()
  {
    try {
      $stmt = $this->conn->query("
        SELECT h.*, hb.hk_image
        FROM hk h
        LEFT JOIN hk_blob hb ON h.img_id = hb.id
        ORDER BY h.month DESC
        LIMIT 1
      ");
      $hk = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($hk && $hk['hk_image']) {
        $hk['hk_image'] = base64_encode($hk['hk_image']);
      }

      return ['status' => 'success', 'data' => $hk];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function addHK($data)
  {
    $retries = 0;
    while ($retries < $this->maxRetries) {
      try {
        $this->ensureConnection();
        $this->conn->beginTransaction();

        // Insert image into hk_blob
        $stmt = $this->conn->prepare("INSERT INTO hk_blob (hk_image) VALUES (:hk_image)");
        $imageData = base64_decode($data['hk_image']);
        $stmt->bindParam(':hk_image', $imageData, PDO::PARAM_LOB);
        $stmt->execute();
        $imgId = $this->conn->lastInsertId();

        // Insert HK into hk table
        $stmt = $this->conn->prepare("
          INSERT INTO hk (fname, lname, mname, suffix, caption, month, course, img_id)
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
        return ['status' => 'success', 'message' => 'Scholar added successfully'];
      } catch (PDOException $e) {
        if ($this->conn->inTransaction()) {
          $this->conn->rollBack();
        }

        // Check if it's a connection error
        if ($e->getCode() == 'HY000' && strpos($e->getMessage(), 'MySQL server has gone away') !== false) {
          $retries++;
          if ($retries < $this->maxRetries) {
            sleep($this->retryDelay);
            continue;
          }
        }

        return ['status' => 'error', 'message' => $e->getMessage()];
      }
    }

    return ['status' => 'error', 'message' => 'Failed to add after multiple retries'];
  }

  public function updateHK($data)
  {
    $retries = 0;
    while ($retries < $this->maxRetries) {
      try {
        $this->ensureConnection();
        $this->conn->beginTransaction();

        if (isset($data['hk_image'])) {
          // Update image in hk_blob
          $stmt = $this->conn->prepare("UPDATE hk_blob SET hk_image = :hk_image WHERE id = :img_id");
          $imageData = base64_decode($data['hk_image']);
          $stmt->bindParam(':hk_image', $imageData, PDO::PARAM_LOB);
          $stmt->bindParam(':img_id', $data['img_id'], PDO::PARAM_INT);
          $stmt->execute();
        }

        // Update HK in hk table
        $stmt = $this->conn->prepare("
          UPDATE hk
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
        return ['status' => 'success', 'message' => 'Housekeeper updated successfully'];
      } catch (PDOException $e) {
        if ($this->conn->inTransaction()) {
          $this->conn->rollBack();
        }

        // Check if it's a connection error
        if ($e->getCode() == 'HY000' && strpos($e->getMessage(), 'MySQL server has gone away') !== false) {
          $retries++;
          if ($retries < $this->maxRetries) {
            sleep($this->retryDelay);
            continue;
          }
        }

        return ['status' => 'error', 'message' => $e->getMessage()];
      }
    }

    return ['status' => 'error', 'message' => 'Failed to update after multiple retries'];
  }

  public function deleteHK($id)
  {
    try {
      // Get img_id first
      $stmt = $this->conn->prepare("SELECT img_id FROM hk WHERE id = :id");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->execute();
      $hk = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($hk) {
        // Delete from hk table (this will cascade delete from hk_blob)
        $stmt = $this->conn->prepare("DELETE FROM hk WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return ['status' => 'success', 'message' => 'Housekeeper deleted successfully'];
      }

      return ['status' => 'error', 'message' => 'Housekeeper not found'];
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

$hk = new HawakKamay($conn);


switch ($operation) {
  case 'getHK':
    echo json_encode($hk->getHK());
    break;
  case 'addHK':
    echo json_encode($hk->addHK($json));
    break;
  case 'updateHK':
    echo json_encode($hk->updateHK($json));
    break;
  case 'deleteHK':
    echo json_encode($hk->deleteHK($json['id']));
    break;
  default:
    echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
    break;
}
