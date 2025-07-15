-- Migration script to create content_settings table for managing mission, vision, and policies
-- Run this SQL script in your MySQL database

-- Create the content_settings table
CREATE TABLE IF NOT EXISTS `content_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content_type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `content_type` (`content_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default content for mission, vision, and policies
INSERT INTO `content_settings` (`content_type`, `title`, `content`) VALUES
('mission', 'Mission', 'The mission of the COC-PHINMA Education Network Library is to provide quality and updated information resources and user-centered services that will sustain the instructional, research and extension programs of the academic community.'),
('vision', 'Vision', 'The Rosauro P. Dongallo Learning Resource Center envisions itself to be the premier academic information provider and knowledge repository in Northern Mindanao, committed to the development of the total person.'),
('library_policies', 'Library Policies', '## Eligibility

The following COC-PEN constituents are eligible to have a COC-PEN Library Card:

- COC-PEN currently enrolled students
- COC-PEN faculty member (full-time/part-time), and
- COC-PEN staff member or school administrator

You may go to the designated Circulation Desk and we will issue the card immediately. For the students, you are required to present your STUDY LOAD and your 1 X 1 RECENT PHOTO upon applying for a library card. For the faculty members, you will immediately be given a special card that your respective Deans must sign it first before you will be allowed to loan out library materials.

We also extend services to the following:

- COC-PEN Alumni
- Visiting researchers (eg. student from other ALINET member schools). A fee of 20.00 php per visit is charged to the visiting researcher from any of the ALINET member schools.
- Visiting researchers from non-ALINET member schools is charged 50.00 php per visit.

## Borrowing Privileges

- Undergraduate students can loan out maximum of two (2) books for three (3) days; the date a student loans out a material is counted as the first day of the three (3)- day allowable borrowing period of books for circulation.
- Graduate students can loan out maximum of three (3) books for one week; the date a student loans out a material is counted as the first day of the one week allowable borrowing period of books for circulation.
- Alumni and other visiting researchers are not allowed to loan out our library''s resources.

## Fines and Penalties

**Records of Penalties are submitted to and collected by the School''s Business Office. A student with unpaid penalty is denied for a library clearance.**

- Penalty for overdue loaned-out books is 5.00 php per day, per book.
- Reserved books that are prescribed by faculty members as textbooks for their classes are for inside the library use only. This is to ensure that all students can be accommodated in using the materials. Photocopying of this material outside the library should take for a maximum of two (2) hours only. 5.00 php per hour is charged beyond the alloted time. Excess of 10-minute extension after two (2) hours is considered one (1) hour late.

## Photocopying

COC-PEN Library adheres to the Philippine Copyright and Intellectual Property Right Laws. Not everything in the library is allowed for photocopy.

## General Rules

**The following are rules that need to be observed while inside the library premise. Note: Any Violation to these rules will be subject for serious disciplinary action:**

- Silence must be observed. Mobile phones must be turned into silent or vibra mode.
- Avoid eating inside the library''s premise. Bringing of bottled drinking liquids is allowed, however, do not place such on the table to avoid spillage that might damage any library material.
- Do not mutilate any library materials.
- Doing projects inside the library more particularly ''cutting of papers'' is strictly prohibited. Our library is solely for study and research.
- Do not disarrange library''s chairs and tables nor making graffiti on it.
- Do not leave the table dirty.
- Put your used books on the designated BOOK DROP.');

-- Verify the changes
SELECT * FROM content_settings;