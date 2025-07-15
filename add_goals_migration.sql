-- Migration script to add goals content type to existing content_settings table
-- Run this SQL script in your MySQL database after the initial content_migration.sql

-- Insert goals content type
INSERT INTO `content_settings` (`content_type`, `title`, `content`) VALUES
('goals', 'Our Goals', '## Library Goals and Objectives

- To build, organize, preserve and make accessible the library''s collection
- To provide relevant information resources in various formats to support the curriculum
- To develop information literacy skills among users
- To extend library services to the community
- To establish linkages with other libraries and institutions

## Strategic Objectives

- **Collection Development**: Continuously expand and update our collection to meet academic needs
- **Digital Innovation**: Integrate modern technology to enhance user experience
- **Community Engagement**: Foster partnerships with local and international institutions
- **User Education**: Provide comprehensive information literacy programs')
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `content` = VALUES(`content`),
  `updated_at` = CURRENT_TIMESTAMP;

-- Verify the addition
SELECT content_type, title FROM content_settings WHERE content_type = 'goals';