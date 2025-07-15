<?php
require_once 'cors_headers.php';
require_once 'connection.php';

class ContentManager {
    private $conn;
    
    public function __construct($connection) {
        $this->conn = $connection;
    }
    
    public function getContent($type = null) {
        try {
            if ($type) {
                $stmt = $this->conn->prepare("SELECT * FROM content_settings WHERE content_type = :type");
                $stmt->bindParam(':type', $type);
            } else {
                $stmt = $this->conn->prepare("SELECT * FROM content_settings ORDER BY content_type");
            }
            
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if ($type && count($result) > 0) {
                return $result[0];
            }
            
            return $result;
        } catch (PDOException $e) {
            throw new Exception("Error fetching content: " . $e->getMessage());
        }
    }
    
    public function updateContent($type, $title, $content) {
        try {
            // Check if content exists
            $stmt = $this->conn->prepare("SELECT id FROM content_settings WHERE content_type = :type");
            $stmt->bindParam(':type', $type);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                // Update existing content
                $stmt = $this->conn->prepare("UPDATE content_settings SET title = :title, content = :content, updated_at = NOW() WHERE content_type = :type");
            } else {
                // Insert new content
                $stmt = $this->conn->prepare("INSERT INTO content_settings (content_type, title, content, created_at, updated_at) VALUES (:type, :title, :content, NOW(), NOW())");
            }
            
            $stmt->bindParam(':type', $type);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':content', $content);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error updating content: " . $e->getMessage());
        }
    }
}

$contentManager = new ContentManager($conn);

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            $type = isset($_GET['type']) ? $_GET['type'] : null;
            $content = $contentManager->getContent($type);
            
            echo json_encode([
                'status' => 'success',
                'data' => $content
            ]);
            break;
            
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['type']) || !isset($input['title']) || !isset($input['content'])) {
                throw new Exception("Missing required fields: type, title, content");
            }
            
            $result = $contentManager->updateContent(
                $input['type'],
                $input['title'],
                $input['content']
            );
            
            if ($result) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Content updated successfully'
                ]);
            } else {
                throw new Exception("Failed to update content");
            }
            break;
            
        default:
            throw new Exception("Method not allowed");
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>