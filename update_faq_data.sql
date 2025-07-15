-- Script to clear existing FAQ data and add meaningful library-related FAQs
-- Run this SQL script in your MySQL database

-- Clear existing FAQ data
DELETE FROM faq_table;

-- Reset auto increment
ALTER TABLE faq_table AUTO_INCREMENT = 1;

-- Insert meaningful library FAQs
INSERT INTO faq_table (question, answer, links) VALUES
('How do I get a library card?', 'To get a library card, visit the Circulation Desk with your Study Load and a recent 1x1 photo (for students) or faculty ID (for faculty). Cards are issued immediately. Faculty cards require Dean''s signature before borrowing privileges are activated.', '/library-policies'),

('What are the library hours?', 'The library is open Monday to Friday from 7:00 AM to 7:00 PM, and Saturday from 8:00 AM to 5:00 PM. Hours may vary during holidays and examination periods. Please check our announcements for any schedule changes.', '/'),

('How many books can I borrow and for how long?', 'Undergraduate students can borrow 2 books for 3 days. Graduate students can borrow 3 books for 1 week. The borrowing date counts as day 1. Faculty members have extended borrowing privileges - please inquire at the circulation desk.', '/library-policies'),

('What happens if I return books late?', 'Late returns incur a penalty of PHP 5.00 per day, per book. Penalties must be paid at the Business Office. Students with unpaid penalties will be denied library clearance.', '/library-policies'),

('Can I renew my borrowed books?', 'Yes, books can be renewed if no other student has reserved them. You can renew in person at the circulation desk or contact us via email. Renewal extends your borrowing period by the original loan duration.', 'mailto:library.coc@phinmaed.com'),

('Do you have computers and internet access?', 'Yes, we provide computer workstations with internet access for research and academic purposes. Time limits may apply during peak hours. Please bring a valid ID to use the computers.', '/library-services'),

('Can I photocopy materials from the library?', 'Photocopying is available but must comply with Philippine Copyright and Intellectual Property Laws. Not all materials can be photocopied. Reserved books can be taken out for photocopying for a maximum of 2 hours with a PHP 5.00 per hour charge for overtime.', '/library-policies'),

('How do I access online databases and e-books?', 'Online resources are accessible through our website using your student/faculty credentials. For off-campus access, please contact the library staff for setup instructions. We provide training sessions on database usage.', '/library-services'),

('Can visitors or alumni use the library?', 'Yes! COC-PHINMA alumni can use the library. Visiting researchers from ALINET member schools pay PHP 20.00 per visit, while non-ALINET visitors pay PHP 50.00 per visit. However, visitors and alumni cannot borrow materials - library use only.', '/library-policies'),

('What research assistance do you provide?', 'Our librarians provide research guidance, help with database searches, citation assistance, and information literacy training. We offer one-on-one consultations and group instruction sessions. Schedule an appointment for personalized help.', '/library-services'),

('Are there study rooms or quiet areas?', 'Yes, we have designated quiet study areas and group study rooms. Silence must be observed in quiet zones. Group study rooms can be reserved in advance. Please maintain cleanliness and return furniture to original positions.', '/library-policies'),

('How do I suggest new books or materials for the library?', 'We welcome acquisition suggestions! Submit your recommendations to library staff with complete bibliographic information. Faculty recommendations for course-related materials receive priority consideration during our collection development process.', 'mailto:library.coc@phinmaed.com'),

('Can I eat or drink in the library?', 'Food is strictly prohibited inside the library. Bottled water and other drinks are allowed but must be kept away from books and computers to prevent spills. Please dispose of containers properly.', '/library-policies'),

('What should I do if I find a damaged book?', 'Report damaged books immediately to library staff. Do not attempt repairs yourself. If you damage a book while it''s checked out to you, you may be required to pay for replacement or repair costs.', '/library-policies'),

('Do you offer library orientation or training?', 'Yes! We provide library orientation for new students and faculty, database training sessions, and information literacy workshops. Contact us to schedule group sessions or individual training.', 'mailto:library.coc@phinmaed.com'),

('How can I access past theses and research papers?', 'Our institutional repository contains past theses, dissertations, and research papers from COC-PHINMA students and faculty. Access may be restricted for some materials. Inquire at the reference desk for assistance.', '/library-services'),

('What if I lose a library book?', 'Lost books must be reported immediately. You will be charged the replacement cost plus a processing fee. Payment should be made at the Business Office. Library clearance will be withheld until payment is completed.', '/library-policies'),

('Can I use my mobile phone in the library?', 'Mobile phones must be set to silent or vibrate mode. Voice calls should be taken outside the library to maintain the quiet study environment. Text messaging is permitted if done quietly.', '/library-policies'),

('Do you have special collections or archives?', 'Yes, we maintain special collections including rare books, historical documents, and institutional archives. Access to these materials may be restricted and require special handling procedures. Please inquire with library staff.', '/library-services'),

('How do I contact the library for help?', 'You can reach us via email at library.coc@phinmaed.com, visit our Facebook page at facebook.com/PHINMACOCLibrary, or contact our librarian directly at facebook.com/askvirla. You can also visit us in person during library hours.', '/');

-- Verify the data
SELECT COUNT(*) as total_faqs FROM faq_table;
SELECT question FROM faq_table LIMIT 5;