<?php
/**
 * Image serving script for secure file access
 */

// Get the requested file
$file = $_GET['file'] ?? '';
$type = $_GET['type'] ?? 'services';

// Validate file parameter
if (empty($file) || strpos($file, '..') !== false) {
    http_response_code(404);
    exit('File not found');
}

// Define allowed directories
$allowedDirs = [
    'services' => __DIR__ . '/uploads/services/',
];

if (!isset($allowedDirs[$type])) {
    http_response_code(404);
    exit('Invalid type');
}

$filePath = $allowedDirs[$type] . basename($file);

// Check if file exists and is readable
if (!file_exists($filePath) || !is_readable($filePath)) {
    http_response_code(404);
    exit('File not found');
}

// Get file info
$fileInfo = pathinfo($filePath);
$extension = strtolower($fileInfo['extension']);

// Set appropriate content type
$contentTypes = [
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png' => 'image/png',
    'gif' => 'image/gif',
    'webp' => 'image/webp'
];

if (!isset($contentTypes[$extension])) {
    http_response_code(404);
    exit('Invalid file type');
}

// Set headers
header('Content-Type: ' . $contentTypes[$extension]);
header('Content-Length: ' . filesize($filePath));
header('Cache-Control: public, max-age=31536000'); // Cache for 1 year
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');

// Output the file
readfile($filePath);
exit;
?>