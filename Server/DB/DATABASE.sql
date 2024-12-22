CREATE TABLE categories (
    category_ID serial PRIMARY KEY,
    category_name text NOT NULL
);

CREATE TABLE suppliers (
    supplier_ID serial PRIMARY KEY, 
    supplier_name text NOT NULL,
    contact_info text NOT NULL,
    address text NOT NULL
);

CREATE TABLE equipment (
    equipment_ID serial PRIMARY KEY,
    equipment_name text NOT NULL,
    equipment_img bytea,  /*khalleha null 3ady*/  
    rating integer DEFAULT '5' NOT NULL,
    model_number integer NOT NULL,
    purchase_date date NOT NULL,
    quantity integer NOT NULL,
    status text NOT NULL,
    location text NOT NULL,
    category_ID integer NOT NULL,
    supplier_id integer NOT NULL,
    FOREIGN KEY (category_ID) REFERENCES categories(category_ID) ON DELETE CASCADE,
    FOREIGN KEY (supplier_ID) REFERENCES suppliers(supplier_ID) ON DELETE CASCADE
);

CREATE TABLE users (
    user_id serial PRIMARY KEY,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'standard_user' NOT NULL,
    created_at date NOT NULL
);

CREATE TABLE orders (
    order_ID serial PRIMARY KEY,
    date date NOT NULL,
    user_id integer NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE cart (
    cart_ID serial PRIMARY KEY,
    quantity integer NOT NULL,
    user_ID integer NOT NULL,
    equipment_ID integer NOT NULL,
    FOREIGN KEY (user_ID) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (equipment_ID) REFERENCES equipment(equipment_ID) ON DELETE CASCADE
);

CREATE TABLE rating (
    rating_ID serial PRIMARY KEY,
    comment text,
    score integer NOT NULL,
    user_ID integer NOT NULL,
    equipment_ID integer NOT NULL,
    FOREIGN KEY (user_ID) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (equipment_ID) REFERENCES equipment(equipment_ID) ON DELETE CASCADE
);

CREATE TABLE session (
    session_id serial PRIMARY KEY,
    user_id integer NOT NULL,
    token text NOT NULL,
    expiresat timestamp NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE equipment_order (
    order_ID serial PRIMARY KEY,
    mainorder_ID INTEGER NOT NULL,
    equipment_ID integer NOT NULL,
    quantity integer NOT NULL,
     FOREIGN KEY (mainorder_ID) REFERENCES Orders(order_ID) ON DELETE CASCADE,
    FOREIGN KEY (equipment_ID) REFERENCES equipment(equipment_ID) ON DELETE CASCADE
);