INSERT INTO categories (category_name) VALUES ('Mechanical'), ('Electrical'), ('Civil');
INSERT INTO suppliers (supplier_name, contact_info, address) VALUES 
('Supplier A', '123-456-7890', '123 Main St'),
('Supplier B', '987-654-3210', '456 Elm St');
INSERT INTO users (username, email, password, role, created_at) VALUES 
('admin', 'admin@example.com', '<hashed_password>', 'admin', '2024-12-06');

INSERT INTO equipment (equipment_name, equipment_img, rating, model_number, purchase_date, quantity, status,
          location, category_id, supplier_id) 
         VALUES
('Laptop', NULL, 5, 12345, '2023-01-15', 10, 'Available', 'Room 101', 13,9),
('Projector', NULL, 4, 67890, '2022-05-10', 5, 'InUse', 'Conference Room', 13,10),
('Printer', NULL, 3, 11223, '2021-08-01', 15, 'UnderMaintenance', 'Room 102', 13,13),
('Air Conditioner', NULL, 5, 44556, '2023-11-10', 8, 'Available', 'Server Room', 13,14),
('Microscope', NULL, 5, 78901, '2020-07-21', 3, 'Available', 'Laboratory', 13,14);