-- Migration script to add image_type column to services table
-- Run this SQL script in your MySQL database

-- Add the image_type column to the services table
ALTER TABLE services ADD COLUMN image_type ENUM('base64', 'file') NULL AFTER service_img;

-- Update existing records to mark them as base64 type (for backward compatibility)
UPDATE services SET image_type = 'base64' WHERE service_img IS NOT NULL;

-- Verify the changes
DESCRIBE services;