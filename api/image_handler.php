<?php
/**
 * Image Handler Class
 * Handles both file system storage and base64 storage for images
 */
class ImageHandler {
    private $uploadDir;
    private $maxFileSize;
    private $allowedTypes;
    
    public function __construct() {
        $this->uploadDir = __DIR__ . '/uploads/services/';
        $this->maxFileSize = 10 * 1024 * 1024; // 10MB
        $this->allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        // Create upload directory if it doesn't exist
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
    }
    
    /**
     * Process and store image (file system approach)
     */
    public function saveImageFile($base64Data, $filename = null) {
        try {
            // Decode base64
            $imageData = base64_decode($base64Data);
            if ($imageData === false) {
                throw new Exception('Invalid base64 data');
            }
            
            // Check file size
            if (strlen($imageData) > $this->maxFileSize) {
                throw new Exception('File size exceeds limit');
            }
            
            // Create image resource for processing
            $image = imagecreatefromstring($imageData);
            if ($image === false) {
                throw new Exception('Invalid image data');
            }
            
            // Compress and resize if needed
            $compressedImage = $this->compressImage($image);
            
            // Generate filename if not provided
            if (!$filename) {
                $filename = uniqid('service_') . '.jpg';
            }
            
            $filepath = $this->uploadDir . $filename;
            
            // Save compressed image
            if (imagejpeg($compressedImage, $filepath, 85)) {
                imagedestroy($image);
                imagedestroy($compressedImage);
                return $filename; // Return just the filename
            } else {
                throw new Exception('Failed to save image');
            }
            
        } catch (Exception $e) {
            throw new Exception('Image processing failed: ' . $e->getMessage());
        }
    }
    
    /**
     * Compress and resize image
     */
    private function compressImage($image) {
        $width = imagesx($image);
        $height = imagesy($image);
        
        // Maximum dimensions for database storage (smaller to reduce packet size)
        $maxWidth = 600;
        $maxHeight = 400;
        
        // Calculate new dimensions
        if ($width > $maxWidth || $height > $maxHeight) {
            $ratio = min($maxWidth / $width, $maxHeight / $height);
            $newWidth = intval($width * $ratio);
            $newHeight = intval($height * $ratio);
            
            // Create new image with new dimensions
            $newImage = imagecreatetruecolor($newWidth, $newHeight);
            imagecopyresampled($newImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            
            return $newImage;
        }
        
        return $image;
    }
    
    /**
     * Compress base64 image for database storage with aggressive compression
     */
    public function compressBase64Image($base64Data, $quality = 50) {
        try {
            $imageData = base64_decode($base64Data);
            if ($imageData === false) {
                throw new Exception('Invalid base64 data');
            }
            
            $image = imagecreatefromstring($imageData);
            if ($image === false) {
                throw new Exception('Invalid image data');
            }
            
            $compressedImage = $this->compressImage($image);
            
            // Convert back to base64
            ob_start();
            imagejpeg($compressedImage, null, $quality);
            $compressedData = ob_get_contents();
            ob_end_clean();
            
            imagedestroy($image);
            imagedestroy($compressedImage);
            
            return base64_encode($compressedData);
            
        } catch (Exception $e) {
            throw new Exception('Image compression failed: ' . $e->getMessage());
        }
    }
    
    /**
     * Delete image file
     */
    public function deleteImageFile($filename) {
        if ($filename && file_exists($this->uploadDir . $filename)) {
            return unlink($this->uploadDir . $filename);
        }
        return true;
    }
    
    /**
     * Get image URL for file system stored images
     */
    public function getImageUrl($filename) {
        if ($filename && file_exists($this->uploadDir . $filename)) {
            // Use the serve_image.php script for secure access
            return '/api/serve_image.php?type=services&file=' . urlencode($filename);
        }
        return null;
    }
    
    /**
     * Check if string is base64 encoded image
     */
    public function isBase64Image($data) {
        if (!$data) return false;
        
        // Check if it's already a base64 string (no data: prefix)
        if (strpos($data, 'data:') === false && base64_decode($data, true) !== false) {
            return true;
        }
        
        return false;
    }
}
?>