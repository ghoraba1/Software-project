-- Insert into categories table
INSERT INTO categories (category_name)
VALUES 
('Electronics'),
('Mechanical'),
('Civil');

-- Insert into suppliers table
INSERT INTO suppliers (supplier_name, contact_info, address)
VALUES 
('ABB', 'contact@supplierA.com', '123 Main Street'),
('Hitachi', 'contact@supplierB.com', '456 Elm Street'),
('Meco', 'contact@supplierC.com', '789 Pine Street');

-- Insert into equipment table
INSERT INTO equipment (equipment_name, equipment_img, rating, model_number, purchase_date, quantity, status, location, category_ID, supplier_ID)
VALUES 
('Laptop', NULL, 5, 101, '2023-01-15', 10, 'In Use', 'Office A', 1, 1),
('Desk', NULL, 4, 201, '2023-02-20', 5, 'Available', 'Storage Room', 2, 2),
('Hammer', NULL, 5, 301, '2022-11-05', 20, 'In Use', 'Workshop', 3, 3),
('Helmet', NULL, 5, 401, '2022-10-10', 15, 'Available', 'Safety Room', 3, 3);

-- Insert into users table
INSERT INTO users (username, email, password, role, created_at)
VALUES 
('admin', 'admin@example.com', 'securepassword', 'admin', '2024-01-01'),
('john_doe', 'john@example.com', 'password123', 'standard_user', '2024-02-01'),
('jane_smith', 'jane@example.com', 'password456', 'standard_user', '2024-03-01');

-- Insert into orders table
INSERT INTO orders (date, user_id)
VALUES 
('2024-04-01', 2),
('2024-04-02', 3);

-- Insert into cart table
INSERT INTO cart (quantity, user_ID, equipment_ID)
VALUES 
(2, 2, 1),
(1, 3, 3);

-- Insert into rating table
INSERT INTO rating (comment, score, user_ID, equipment_ID)
VALUES 
('Great product!', 5, 2, 1),
('Good quality', 4, 3, 3);

-- Insert into session table
INSERT INTO session (user_id, token, expiresAt)
VALUES 
(1, 'token_admin_123', '2024-12-31 23:59:59'),
(2, 'token_john_123', '2024-12-31 23:59:59');

-- Insert into equipmentorder table
INSERT INTO equipmentorder (mainorder_ID, equipment_ID, quantity)
VALUES 
(1, 1, 5),
(2, 3, 2);
