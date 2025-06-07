-- Create database
CREATE DATABASE IF NOT EXISTS vehicle_rental1;
USE vehicle_rental1;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  category ENUM('two-wheeler', 'four-wheeler') NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  image_url VARCHAR(500)
);

-- Rentals table
CREATE TABLE IF NOT EXISTS rentals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- Insert vehicles
INSERT INTO vehicles (make, model, year, type, category, price_per_day) VALUES
-- Two-Wheelers (₹4000/day)
('Royal Enfield', 'Classic 350', 2023, 'cruiser', 'two-wheeler', 4000.00),
('Bajaj', 'Pulsar 220', 2023, 'sports', 'two-wheeler', 4000.00),
('TVS', 'Apache RTR 200', 2023, 'sports', 'two-wheeler', 4000.00),
('KTM', 'Duke 390', 2023, 'naked', 'two-wheeler', 4000.00),
('Honda', 'CBR 250R', 2023, 'sports', 'two-wheeler', 4000.00),
('Yamaha', 'MT-15', 2023, 'naked', 'two-wheeler', 4000.00),
('Suzuki', 'Gixxer SF', 2023, 'sports', 'two-wheeler', 4000.00),
('Royal Enfield', 'Himalayan', 2023, 'adventure', 'two-wheeler', 4000.00),
('KTM', 'Adventure 390', 2023, 'adventure', 'two-wheeler', 4000.00),
('Harley Davidson', 'Iron 883', 2023, 'cruiser', 'two-wheeler', 4000.00),

-- Four-Wheelers (₹6000/day)
('Toyota', 'Camry', 2023, 'sedan', 'four-wheeler', 6000.00),
('Honda', 'Accord', 2023, 'sedan', 'four-wheeler', 6000.00),
('Nissan', 'Altima', 2023, 'sedan', 'four-wheeler', 6000.00),
('Hyundai', 'Sonata', 2023, 'sedan', 'four-wheeler', 6000.00),
('Kia', 'K5', 2023, 'sedan', 'four-wheeler', 6000.00),
('Toyota', 'RAV4', 2023, 'suv', 'four-wheeler', 6000.00),
('Honda', 'CR-V', 2023, 'suv', 'four-wheeler', 6000.00),
('Ford', 'Escape', 2023, 'suv', 'four-wheeler', 6000.00),
('Chevrolet', 'Equinox', 2023, 'suv', 'four-wheeler', 6000.00),
('Nissan', 'Rogue', 2023, 'suv', 'four-wheeler', 6000.00),

-- Four-Wheelers (₹8000/day)
('BMW', '3 Series', 2023, 'sedan', 'four-wheeler', 8000.00),
('Mercedes', 'C-Class', 2023, 'sedan', 'four-wheeler', 8000.00),
('Audi', 'A4', 2023, 'sedan', 'four-wheeler', 8000.00),
('Tesla', 'Model 3', 2023, 'sedan', 'four-wheeler', 8000.00),
('Lexus', 'ES', 2023, 'sedan', 'four-wheeler', 8000.00),
('BMW', 'X5', 2023, 'suv', 'four-wheeler', 8000.00),
('Mercedes', 'GLC', 2023, 'suv', 'four-wheeler', 8000.00),
('Audi', 'Q5', 2023, 'suv', 'four-wheeler', 8000.00),
('Lexus', 'RX', 2023, 'suv', 'four-wheeler', 8000.00),
('Tesla', 'Model Y', 2023, 'suv', 'four-wheeler', 8000.00),

-- Sports Cars (₹8000/day)
('Porsche', '911', 2023, 'sports', 'four-wheeler', 8000.00),
('Chevrolet', 'Corvette', 2023, 'sports', 'four-wheeler', 8000.00),
('Ford', 'Mustang', 2023, 'sports', 'four-wheeler', 8000.00),
('Dodge', 'Challenger', 2023, 'sports', 'four-wheeler', 8000.00),
('BMW', 'M4', 2023, 'sports', 'four-wheeler', 8000.00),
('Mercedes', 'AMG GT', 2023, 'sports', 'four-wheeler', 8000.00),
('Audi', 'R8', 2023, 'sports', 'four-wheeler', 8000.00),
('Nissan', 'GT-R', 2023, 'sports', 'four-wheeler', 8000.00),
('Lamborghini', 'Huracan', 2023, 'sports', 'four-wheeler', 8000.00),
('Ferrari', '488', 2023, 'sports', 'four-wheeler', 8000.00),

-- Luxury Vehicles (₹8000/day)
('Mercedes', 'S-Class', 2023, 'luxury', 'four-wheeler', 8000.00),
('BMW', '7 Series', 2023, 'luxury', 'four-wheeler', 8000.00),
('Audi', 'A8', 2023, 'luxury', 'four-wheeler', 8000.00),
('Lexus', 'LS', 2023, 'luxury', 'four-wheeler', 8000.00),
('Porsche', 'Panamera', 2023, 'luxury', 'four-wheeler', 8000.00),
('Rolls-Royce', 'Phantom', 2023, 'luxury', 'four-wheeler', 8000.00),
('Bentley', 'Continental', 2023, 'luxury', 'four-wheeler', 8000.00),
('Maserati', 'Quattroporte', 2023, 'luxury', 'four-wheeler', 8000.00),
('Jaguar', 'XJ', 2023, 'luxury', 'four-wheeler', 8000.00),
('Genesis', 'G90', 2023, 'luxury', 'four-wheeler', 8000.00); 

-- Check total number of vehicles
SELECT COUNT(*) FROM vehicles;

-- Check distribution by category
SELECT category, COUNT(*) as count FROM vehicles GROUP BY category;

-- Check distribution by price
SELECT price_per_day, COUNT(*) as count FROM vehicles GROUP BY price_per_day;

-- Add image_url column if it doesn't exist
ALTER TABLE vehicles ADD COLUMN image_url VARCHAR(500);

SET SQL_SAFE_UPDATES = 0;

-- Update existing vehicles with image URLs
UPDATE vehicles SET image_url = CASE
    WHEN make = 'Royal Enfield' AND model = 'Classic 350' THEN '/images/vehicles/royal-enfield-himalayan.webp'
    WHEN make = 'Bajaj' AND model = 'Pulsar 220' THEN '/images/vehicles/bajaj-pulsar220.webp'
    WHEN make = 'TVS' AND model = 'Apache RTR 200' THEN '/images/vehicles/TVS_Apache_RTR200.webp'
    WHEN make = 'KTM' AND model = 'Duke 390' THEN '/images/vehicles/KTM_Duke390.webp'
    WHEN make = 'Honda' AND model = 'CBR 250R' THEN '/images/vehicles/Honda_CBR250R.webp'
    WHEN make = 'Yamaha' AND model = 'MT-15' THEN '/images/vehicles/Yamaha_MT-15.jpg'
    WHEN make = 'Suzuki' AND model = 'Gixxer SF' THEN '/images/vehicles/suzuki-gixxer-sf.jpg'
    WHEN make = 'Royal Enfield' AND model = 'Himalayan' THEN '/images/vehicles/royal-enfield-himalayan.webp'
    WHEN make = 'KTM' AND model = 'Adventure 390' THEN '/images/vehicles/KTM_Adventure390.webp'
    WHEN make = 'Harley Davidson' AND model = 'Iron 883' THEN '/images/vehicles/Harley_Davidson_Iron883.webp'

    WHEN make = 'Toyota' AND model = 'Camry' THEN '/images/vehicles/toyota-camry.jpg'
    WHEN make = 'Honda' AND model = 'Accord' THEN '/images/vehicles/honda-accord.jpg'
    WHEN make = 'Nissan' AND model = 'Altima' THEN '/images/vehicles/nissan-altima.jpg'
    WHEN make = 'Hyundai' AND model = 'Sonata' THEN '/images/vehicles/hyundai-sonata.jpg'
    WHEN make = 'Kia' AND model = 'K5' THEN '/images/vehicles/kia-k5.avif'
    WHEN make = 'Toyota' AND model = 'RAV4' THEN '/images/vehicles/toyota-rav4.jpg'
    WHEN make = 'Honda' AND model = 'CR-V' THEN '/images/vehicles/honda-cr-v.jpg'
    WHEN make = 'Ford' AND model = 'Escape' THEN '/images/vehicles/ford-escape.jpg'
    WHEN make = 'Chevrolet' AND model = 'Equinox' THEN '/images/vehicles/chevrolet-equinox.jpg'
    WHEN make = 'Nissan' AND model = 'Rogue' THEN '/images/vehicles/nissan-rogue.jpg'

    WHEN make = 'BMW' AND model = '3 Series' THEN '/images/vehicles/bmw-3-series.png'
    WHEN make = 'Mercedes' AND model = 'C-Class' THEN '/images/vehicles/mercedes-c-class.webp'
    WHEN make = 'Audi' AND model = 'A4' THEN '/images/vehicles/audi-a4.webp'
    WHEN make = 'Tesla' AND model = 'Model 3' THEN '/images/vehicles/tesla-model3.jpg'
    WHEN make = 'Lexus' AND model = 'ES' THEN '/images/vehicles/lexus-es.webp'
    WHEN make = 'BMW' AND model = 'X5' THEN '/images/vehicles/bmw-x5.jpg'
    WHEN make = 'Mercedes' AND model = 'GLC' THEN '/images/vehicles/mercedes-glc.avif'
    WHEN make = 'Audi' AND model = 'Q5' THEN '/images/vehicles/audi-q5.avif'
    WHEN make = 'Lexus' AND model = 'RX' THEN '/images/vehicles/lexus-rx.webp'
    WHEN make = 'Tesla' AND model = 'Model Y' THEN '/images/vehicles/tesla-model-y.jpg'

    WHEN make = 'Porsche' AND model = '911' THEN '/images/vehicles/porsche911.jpg'
    WHEN make = 'Chevrolet' AND model = 'Corvette' THEN '/images/vehicles/chevrolet-corvette.avif'
    WHEN make = 'Ford' AND model = 'Mustang' THEN '/images/vehicles/ford-mustang.jpg'
    WHEN make = 'Dodge' AND model = 'Challenger' THEN '/images/vehicles/dodge-challenger.jpg'
    WHEN make = 'BMW' AND model = 'M4' THEN '/images/vehicles/bmw-m4.jpg'
    WHEN make = 'Mercedes' AND model = 'AMG GT' THEN '/images/vehicles/mercedes-amg-gt.jpg'
    WHEN make = 'Audi' AND model = 'R8' THEN '/images/vehicles/audi-r8.jpg'
    WHEN make = 'Nissan' AND model = 'GT-R' THEN '/images/vehicles/nissan-gt-r.jpg'
    WHEN make = 'Lamborghini' AND model = 'Huracan' THEN '/images/vehicles/lamborghini-huracan.jpg'
    WHEN make = 'Ferrari' AND model = '488' THEN '/images/vehicles/ferrari488.jpg'

    WHEN make = 'Mercedes' AND model = 'S-Class' THEN '/images/vehicles/mercedes-s-class.avif'
    WHEN make = 'BMW' AND model = '7 Series' THEN '/images/vehicles/bmw-7-series.jpg'
    WHEN make = 'Audi' AND model = 'A8' THEN '/images/vehicles/audi-a8.webp'
    WHEN make = 'Lexus' AND model = 'LS' THEN '/images/vehicles/lexus-ls.webp'
    WHEN make = 'Porsche' AND model = 'Panamera' THEN '/images/vehicles/porsche-panamera.jpg'
    WHEN make = 'Rolls-Royce' AND model = 'Phantom' THEN '/images/vehicles/rolls-royce-phantom.avif'
    WHEN make = 'Bentley' AND model = 'Continental' THEN '/images/vehicles/bentley-continental.avif'
    WHEN make = 'Maserati' AND model = 'Quattroporte' THEN '/images/vehicles/maserati-quattroporte.webp'
    WHEN make = 'Jaguar' AND model = 'XJ' THEN '/images/vehicles/jaguar-xj.avif'
    WHEN make = 'Genesis' AND model = 'G90' THEN '/images/vehicles/genesis_g90.jpg'
    ELSE image_url
END;

-- Verify the updates
SELECT make, model, image_url FROM vehicles;

SELECT * FROM vehicles;

UPDATE vehicles
SET image_url = REPLACE(image_url, '/images/vehicles/', '');

SELECT id, make, model, image_url FROM vehicles;