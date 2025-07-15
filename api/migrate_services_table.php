<?php
/**
 * Migration script to add image_type column to services table
 * Run this once to update the database schema
 */

include_once 'connection.php';

try {
    // Check if image_type column already exists
    $stmt = $conn->query("SHOW COLUMNS FROM services LIKE 'image_type'");
    $columnExists = $stmt->rowCount() > 0;
    
    if (!$columnExists) {
        echo "Adding image_type column to services table...\n";
        
        // Add the new column
        $conn->exec("ALTER TABLE services ADD COLUMN image_type ENUM('base64', 'file') NULL AFTER service_img");
        
        // Update existing records to mark them as base64 type
        $conn->exec("UPDATE services SET image_type = 'base64' WHERE service_img IS NOT NULL");
        
        echo "Migration completed successfully!\n";
        echo "- Added image_type column\n";
        echo "- Updated existing records to use 'base64' type\n";
    } else {
        echo "Migration already completed - image_type column exists.\n";
    }
    
    // Create uploads directory structure
    $uploadDirs = [
        __DIR__ . '/uploads',
        __DIR__ . '/uploads/services'
    ];
    
    foreach ($uploadDirs as $dir) {
        if (!file_exists($dir)) {
            if (mkdir($dir, 0755, true)) {
                echo "Created directory: $dir\n";
            } else {
                echo "Failed to create directory: $dir\n";
            }
        }
    }
    
    echo "\nDatabase migration completed successfully!\n";
    
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>