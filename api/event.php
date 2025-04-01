<?php
include_once 'connection.php';
include_once 'cors_headers.php';

class Event
{
  private $conn;

  public function __construct($conn)
  {
    $this->conn = $conn;
  }

  public function getEvents()
  {
    try {
      $stmt = $this->conn->query("
        SELECT e.*, eb.event_image
        FROM events e
        LEFT JOIN event_blob eb ON e.img_id = eb.id
        ORDER BY e.created_at DESC
      ");
      $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

      // Encode image data to base64 for each event
      foreach ($events as &$event) {
        if ($event['event_image']) {
          // Force PDO to return the raw binary data
          $stmt = $this->conn->prepare("SELECT event_image FROM event_blob WHERE id = ?");
          $stmt->execute([$event['img_id']]);
          $row = $stmt->fetch(PDO::FETCH_ASSOC);
          if ($row && $row['event_image']) {
            $event['event_image'] = base64_encode($row['event_image']);
          }
        }
      }

      return ['status' => 'success', 'data' => $events];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function addEvent($data)
  {
    try {
      $this->conn->beginTransaction();

      // Insert image into event_blob
      $stmt = $this->conn->prepare("INSERT INTO event_blob (event_image) VALUES (:event_image)");
      $imageData = base64_decode($data['event_image']);
      $stmt->bindParam(':event_image', $imageData, PDO::PARAM_LOB);
      $stmt->execute();
      $imgId = $this->conn->lastInsertId();

      // Insert event into events table
      $stmt = $this->conn->prepare("
        INSERT INTO events (title, descrip, link, created_at, img_id)
        VALUES (:title, :descrip, :link, NOW(), :img_id)
      ");
      $stmt->bindParam(':title', $data['title'], PDO::PARAM_STR);
      $stmt->bindParam(':descrip', $data['descrip'], PDO::PARAM_STR);
      $stmt->bindParam(':link', $data['link'], PDO::PARAM_STR);
      $stmt->bindParam(':img_id', $imgId, PDO::PARAM_INT);
      $stmt->execute();

      $this->conn->commit();
      return ['status' => 'success', 'message' => 'Event added successfully'];
    } catch (PDOException $e) {
      $this->conn->rollBack();
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function updateEvent($data)
  {
    try {
      $this->conn->beginTransaction();

      if (isset($data['event_image'])) {
        // Update image in event_blob
        $stmt = $this->conn->prepare("UPDATE event_blob SET event_image = :event_image WHERE id = :img_id");
        $imageData = base64_decode($data['event_image']);
        $stmt->bindParam(':event_image', $imageData, PDO::PARAM_LOB);
        $stmt->bindParam(':img_id', $data['img_id'], PDO::PARAM_INT);
        $stmt->execute();
      }

      // Update event in events table
      $stmt = $this->conn->prepare("
        UPDATE events
        SET title = :title, descrip = :descrip, link = :link
        WHERE id = :id
      ");
      $stmt->bindParam(':title', $data['title'], PDO::PARAM_STR);
      $stmt->bindParam(':descrip', $data['descrip'], PDO::PARAM_STR);
      $stmt->bindParam(':link', $data['link'], PDO::PARAM_STR);
      $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);
      $stmt->execute();

      $this->conn->commit();
      return ['status' => 'success', 'message' => 'Event updated successfully'];
    } catch (PDOException $e) {
      $this->conn->rollBack();
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function deleteEvent($id)
  {
    try {
      // Get img_id first
      $stmt = $this->conn->prepare("SELECT img_id FROM events WHERE id = :id");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->execute();
      $event = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($event) {
        // Delete from events table (this will cascade delete from event_blob)
        $stmt = $this->conn->prepare("DELETE FROM events WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return ['status' => 'success', 'message' => 'Event deleted successfully'];
      }

      return ['status' => 'error', 'message' => 'Event not found'];
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

$event = new Event($conn);

switch ($operation) {
  case 'getEvents':
    echo json_encode($event->getEvents());
    break;
  case 'addEvent':
    echo json_encode($event->addEvent($json));
    break;
  case 'updateEvent':
    echo json_encode($event->updateEvent($json));
    break;
  case 'deleteEvent':
    echo json_encode($event->deleteEvent($json['id']));
    break;
  default:
    echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
    break;
}
