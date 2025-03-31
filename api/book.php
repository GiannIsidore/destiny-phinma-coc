<?php
include_once 'connection.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST,GET,PUT,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

class Book
{
  private $conn;

  public function __construct($conn)
  {
    $this->conn = $conn;
  }

  public function getBooks()
  {
    try {
      $stmt = $this->conn->query("
        SELECT b.*, bb.book_img
        FROM books_tble b
        LEFT JOIN book_blob bb ON b.img_id = bb.id
        ORDER BY b.added_at DESC
      ");
      $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

      // Encode image data to base64 for each book
      foreach ($books as &$book) {
        if ($book['book_img']) {
          // Force PDO to return the raw binary data
          $stmt = $this->conn->prepare("SELECT book_img FROM book_blob WHERE id = ?");
          $stmt->execute([$book['img_id']]);
          $row = $stmt->fetch(PDO::FETCH_ASSOC);
          if ($row && $row['book_img']) {
            $book['book_img'] = base64_encode($row['book_img']);
          }
        }
      }

      return ['status' => 'success', 'data' => $books];
    } catch (PDOException $e) {
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function addBook($data)
  {
    try {
      $this->conn->beginTransaction();

      // Insert image into book_blob
      $stmt = $this->conn->prepare("INSERT INTO book_blob (book_img) VALUES (:book_img)");
      $imageData = base64_decode($data['book_img']);
      $stmt->bindParam(':book_img', $imageData, PDO::PARAM_LOB);
      $stmt->execute();
      $imgId = $this->conn->lastInsertId();

      // Insert book into books_tble
      $stmt = $this->conn->prepare("
        INSERT INTO books_tble (title, destiny_url, added_at, bib_id, img_id)
        VALUES (:title, :destiny_url, NOW(), :bib_id, :img_id)
      ");
      $stmt->bindParam(':title', $data['title'], PDO::PARAM_STR);
      $stmt->bindParam(':destiny_url', $data['destiny_url'], PDO::PARAM_STR);
      $stmt->bindParam(':bib_id', $data['bib_id'], PDO::PARAM_STR);
      $stmt->bindParam(':img_id', $imgId, PDO::PARAM_INT);
      $stmt->execute();

      $this->conn->commit();
      return ['status' => 'success', 'message' => 'Book added successfully'];
    } catch (PDOException $e) {
      $this->conn->rollBack();
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function updateBook($data)
  {
    try {
      $this->conn->beginTransaction();

      if (isset($data['book_img'])) {
        // Update image in book_blob
        $stmt = $this->conn->prepare("UPDATE book_blob SET book_img = :book_img WHERE id = :img_id");
        $imageData = base64_decode($data['book_img']);
        $stmt->bindParam(':book_img', $imageData, PDO::PARAM_LOB);
        $stmt->bindParam(':img_id', $data['img_id'], PDO::PARAM_INT);
        $stmt->execute();
      }

      // Update book in books_tble
      $stmt = $this->conn->prepare("
        UPDATE books_tble
        SET title = :title, destiny_url = :destiny_url, bib_id = :bib_id
        WHERE id = :id
      ");
      $stmt->bindParam(':title', $data['title'], PDO::PARAM_STR);
      $stmt->bindParam(':destiny_url', $data['destiny_url'], PDO::PARAM_STR);
      $stmt->bindParam(':bib_id', $data['bib_id'], PDO::PARAM_STR);
      $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);
      $stmt->execute();

      $this->conn->commit();
      return ['status' => 'success', 'message' => 'Book updated successfully'];
    } catch (PDOException $e) {
      $this->conn->rollBack();
      return ['status' => 'error', 'message' => $e->getMessage()];
    }
  }

  public function deleteBook($id)
  {
    try {
      // Get img_id first
      $stmt = $this->conn->prepare("SELECT img_id FROM books_tble WHERE id = :id");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->execute();
      $book = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($book) {
        // Delete from books_tble (this will cascade delete from book_blob)
        $stmt = $this->conn->prepare("DELETE FROM books_tble WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return ['status' => 'success', 'message' => 'Book deleted successfully'];
      }

      return ['status' => 'error', 'message' => 'Book not found'];
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

$book = new Book($conn);

switch ($operation) {
  case 'getBooks':
    echo json_encode($book->getBooks());
    break;
  case 'addBook':
    echo json_encode($book->addBook($json));
    break;
  case 'updateBook':
    echo json_encode($book->updateBook($json));
    break;
  case 'deleteBook':
    echo json_encode($book->deleteBook($json['id']));
    break;
  default:
    echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
    break;
}