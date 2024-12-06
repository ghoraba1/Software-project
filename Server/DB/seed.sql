INSERT INTO categories (category_name) VALUES ('Mechanical'), ('Electrical'), ('Civil');
INSERT INTO suppliers (supplier_name, contact_info, address) VALUES 
('Supplier A', '123-456-7890', '123 Main St'),
('Supplier B', '987-654-3210', '456 Elm St');
INSERT INTO users (username, email, password, role, created_at) VALUES 
('admin', 'admin@example.com', '<hashed_password>', 'admin', '2024-12-06');