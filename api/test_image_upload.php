<?php
/**
 * Test script to verify the image upload functionality
 */

include_once 'connection.php';
include_once 'image_handler.php';

// Test image (small base64 encoded test image)
$testBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A';

try {
    echo "Testing image upload functionality...\n\n";
    
    $imageHandler = new ImageHandler();
    
    // Test 1: File system storage
    echo "Test 1: File system storage\n";
    try {
        $filename = $imageHandler->saveImageFile($testBase64);
        echo "✓ File saved successfully: $filename\n";
        
        $url = $imageHandler->getImageUrl($filename);
        echo "✓ Image URL generated: $url\n";
        
        // Clean up test file
        $imageHandler->deleteImageFile($filename);
        echo "✓ Test file cleaned up\n";
        
    } catch (Exception $e) {
        echo "✗ File system test failed: " . $e->getMessage() . "\n";
    }
    
    // Test 2: Base64 compression
    echo "\nTest 2: Base64 compression\n";
    try {
        $compressed = $imageHandler->compressBase64Image($testBase64, 70);
        echo "✓ Base64 compression successful\n";
        echo "Original size: " . strlen($testBase64) . " bytes\n";
        echo "Compressed size: " . strlen($compressed) . " bytes\n";
        
    } catch (Exception $e) {
        echo "✗ Base64 compression test failed: " . $e->getMessage() . "\n";
    }
    
    // Test 3: Database connection with increased packet size
    echo "\nTest 3: Database packet size\n";
    try {
        $stmt = $conn->query("SELECT @@max_allowed_packet as packet_size");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $packetSize = $result['packet_size'];
        echo "✓ Current max_allowed_packet: " . number_format($packetSize) . " bytes (" . round($packetSize / 1024 / 1024, 2) . " MB)\n";
        
        if ($packetSize >= 67108864) {
            echo "✓ Packet size is sufficient for large images\n";
        } else {
            echo "⚠ Packet size may be too small for very large images\n";
        }
        
    } catch (Exception $e) {
        echo "✗ Database test failed: " . $e->getMessage() . "\n";
    }
    
    echo "\nAll tests completed!\n";
    
} catch (Exception $e) {
    echo "Test suite failed: " . $e->getMessage() . "\n";
}
?>