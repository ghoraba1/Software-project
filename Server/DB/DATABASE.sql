create table categories(
category_ID serial primary key,
category_name text NOT NULL
);


create table suppliers(
supplier_ID serial primary key, 
supplier_name text NOT NULL,
contact_info text NOT NULL,
address text NOT NULL
);

create table equipment(
equipment_ID serial primary key,
equipment_name text NOT NULL,
equipment_img bytea ,       /*khalleha null 3ady*/  
rating integer DEFAULT '5' NOT NULL,
model_number integer NOT NULL,
purchase_date date NOT NULL,
quantity integer NOT NULL,
status text NOT NULL,
location text NOT NULL,
category_ID integer NOT NULL,
supplier_id integer NOT NULL,
foreign key(category_ID) references categories(category_ID),
foreign key(supplier_ID) references suppliers(supplier_ID)
);

CREATE table users(
user_id serial primary key ,
username text NOT NULL ,
email text not null,
password text not null,
role text DEFAULT 'standard_user' not null,
created_at Date not null
);

create table Orders (
order_ID serial primary key,
date Date not null ,
user_id  integer not null,
foreign key(user_id) references Users(user_id)
);

create table Cart (
cart_ID serial primary key ,
quantity integer not null ,
user_ID  integer not null,
equipment_ID integer not null ,
foreign key(user_ID) references Users(user_ID),
foreign key(equipment_ID) references equipment(equipment_ID)
);

create table Rating ( 
rating_ID serial primary key ,
comment text ,
score integer not null ,
user_ID  integer not null,
equipment_ID integer not null ,
foreign key(user_ID) references users(user_id),
foreign key(equipment_ID) references equipment(equipment_ID)

);

create table Session(
    "id" serial primary key,
    "user_id" integer not null,
    "token" text not null,
    "expiresAt" timestamp not null ,
    foreign key(user_id) references Users(user_id)
);
