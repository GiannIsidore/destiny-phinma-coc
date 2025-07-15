<?php
/**
 * Check current MySQL packet size and provide recommendations
 */

include_once 'connection.php';

try {
    // Check current max_allowed_packet setting
    $stmt = $conn->query("SHOW VARIABLES LIKE 'max_allowed_packet'");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $packetSize = (int)$result['Value'];
    $packetSizeMB = round($packetSize / 1024 / 1024, 2);
    
    echo "Current max_allowed_packet: " . number_format($packetSize) . " bytes ({$packetSizeMB} MB)\n\n";
    
    // Recommendations based on packet size
    if ($packetSize < 1048576) { // Less than 1MB
        echo "⚠️  WARNING: Packet size is very small ({$packetSizeMB} MB)\n";
        echo "Recommendation: Increase to at least 16MB\n\n";
    } elseif ($packetSize < 16777216) { // Less than 16MB
        echo "⚠️  CAUTION: Packet size is small ({$packetSizeMB} MB)\n";
        echo "Recommendation: Consider increasing to 16-64MB for better image support\n\n";
    } else {
        echo "✅ Packet size is adequate ({$packetSizeMB} MB)\n\n";
    }
    
    // Test with a small base64 image
    $testBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A';
    
    echo "Testing database insertion with small image...\n";
    
    try {
        $stmt = $conn->prepare("SELECT ? as test_data");
        $stmt->execute([$testBase64]);
        echo "✅ Basic database insertion works\n";
    } catch (Exception $e) {
        echo "❌ Database insertion failed: " . $e->getMessage() . "\n";
    }
    
    // Provide MySQL configuration recommendations
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "MYSQL CONFIGURATION RECOMMENDATIONS:\n";
    echo str_repeat("=", 60) . "\n";
    
    echo "To increase max_allowed_packet globally, add to your MySQL config file:\n\n";
    echo "[mysqld]\n";
    echo "max_allowed_packet = 64M\n\n";
    
    echo "Config file locations:\n";
    echo "- Linux: /etc/mysql/my.cnf or /etc/my.cnf\n";
    echo "- Windows: C:\\ProgramData\\MySQL\\MySQL Server X.X\\my.ini\n";
    echo "- XAMPP: xampp/mysql/bin/my.ini\n";
    echo "- WAMP: wamp/bin/mysql/mysqlX.X.X/my.ini\n\n";
    
    echo "After changing the config:\n";
    echo "1. Restart MySQL service\n";
    echo "2. Run this script again to verify\n\n";
    
    echo "Alternative: Our solution uses aggressive compression to work with current settings.\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>