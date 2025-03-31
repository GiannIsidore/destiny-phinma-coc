<?php
include_once 'connection.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST,GET,PUT,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

class Faq
{
  private $conn;

  public function __construct($conn)
  {
    $this->conn = $conn;
  }

  public function getFaqs()
  {
    try {
      $stmt = $this->conn->query("
        SELECT * FROM faq_table
      ");
      $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);
      return ['status' => 'success', 'data' => $faqs];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function addFaq($data)
  {
    try {
      $stmt = $this->conn->prepare("
        INSERT INTO faq_table (question, answer, links)
        VALUES (:question, :answer, :links)
      ");
      $stmt->bindParam(':question', $data['question'], PDO::PARAM_STR);
      $stmt->bindParam(':answer', $data['answer'], PDO::PARAM_STR);
      $stmt->bindParam(':links', $data['links'], PDO::PARAM_STR);
      $stmt->execute();

      return ['status' => 'success', 'message' => 'FAQ added successfully'];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function updateFaq($data)
  {
    try {
      $stmt = $this->conn->prepare("
        UPDATE faq_table
        SET question = :question, answer = :answer, links = :links
        WHERE id = :id
      ");
      $stmt->bindParam(':question', $data['question'], PDO::PARAM_STR);
      $stmt->bindParam(':answer', $data['answer'], PDO::PARAM_STR);
      $stmt->bindParam(':links', $data['links'], PDO::PARAM_STR);
      $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);
      $stmt->execute();

      return ['status' => 'success', 'message' => 'FAQ updated successfully'];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function deleteFaq($id)
  {
    try {
      $stmt = $this->conn->prepare("DELETE FROM faq_table WHERE id = :id");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->execute();

      return ['status' => 'success', 'message' => 'FAQ deleted successfully'];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }
}

// Get JSON data from request body for POST requests
$input = json_decode(file_get_contents('php://input'), true);
if ($input) {
  $operation = $input['operation'] ?? '';
  $json = $input['json'] ?? null;
} else {
  $operation = $_GET['operation'] ?? '';
  $json = isset($_GET['json']) ? json_decode($_GET['json'], true) : null;
}

$faq = new Faq($conn);

switch ($operation) {
  case 'getFaqs':
    echo json_encode($faq->getFaqs());
    break;
  case 'addFaq':
    echo json_encode($faq->addFaq($json));
    break;
  case 'updateFaq':
    echo json_encode($faq->updateFaq($json));
    break;
  case 'deleteFaq':
    echo json_encode($faq->deleteFaq($json['id']));
    break;
  default:
    echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
    break;
}
