# Vehicle Rental System

A full-stack vehicle rental system built with React, Node.js, Express, and MySQL.

## Features

- User authentication (login/register)
- Browse available vehicles
- Filter vehicles by type and price
- View vehicle details
- Rent vehicles with date selection
- Manage rentals (view, cancel)
- Responsive design

## Tech Stack

### Frontend
- React
- Material-UI
- React Router
- Axios
- Date-fns

### Backend
- Node.js
- Express
- MySQL
- JWT Authentication
- Bcrypt

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vehicle-rental-system
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

4. Create a MySQL database and import the schema:
```bash
mysql -u root -p < config/schema.sql
```

5. Create a .env file in the root directory with the following variables:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vehicle_rental
JWT_SECRET=your_jwt_secret_key
```

## Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. In a new terminal, start the frontend:
```bash
npm run client
```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Vehicles
- GET /api/vehicles - Get all vehicles
- GET /api/vehicles/:id - Get vehicle by ID
- POST /api/vehicles - Add new vehicle
- PUT /api/vehicles/:id - Update vehicle
- DELETE /api/vehicles/:id - Delete vehicle

### Rentals
- GET /api/rentals - Get all rentals
- GET /api/rentals/:id - Get rental by ID
- POST /api/rentals - Create new rental
- PUT /api/rentals/:id/status - Update rental status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. # Vehicle_Rental_System
# Vehicle_Rental_System
