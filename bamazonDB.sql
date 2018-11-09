DROP DATABASE bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL (5,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

SHOW TABLES;

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Echo Dot", "Electronics", 39.99, 50),
        ("Nike Tennis Shoes", "Footwear", 79.99, 20),
        ("Polo Black Cologne", "Personal Care", 65.87, 30),
        ("Ninja Blender", "Kitchenware", 55.68, 10),
        ("Air Jordan 13 retro", "Footwear", 165.76, 12),
        ("Gillete Fusion razor", "Personal Care", 21.99, 45),
        ("Xbox Game Controller", "Electronics", 59.99, 15),
        ("Fine Mesh Strainer", "Kitchenware", 15.90, 32),
        ("Stiga Ping Pong Balls (6-pack)", "Sports & Outdoors", 9.99, 20),
        ("Red Dead Redemption 2 (ps4", "Video Games", 59.99, 18);

SELECT * FROM products;


