# fpadw_api

A API backend for a webshop application built with Express.js, MariaDB, and session-based authentication.

github repository @ https://github.com/Obelion1/dwg_abschlussprojekt_api

## Features

- User registration and authentication with bcrypt password hashing
- Session-based authentication using express-session
- Product catalog management
- Shopping cart functionality tied to user sessions
- CORS enabled for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- MariaDB (v10.5 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository and navigate to the project directory:
```bash
cd fpadw_api
```

2. Install dependencies:
```bash
npm install
```

3. Import the database:
```bash
mysql -u your_username -p your_database < database_dump.sql
```

4. Create a `.env` file in the root directory with the following variables:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database
SESSION_SECRET=your_session_secret
JWT_SECRET_KEY=your_jwt_secret
PORT=3001
```

## Dependencies

- **express** - Web framework
- **mariadb** - MariaDB client for Node.js
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation
- **express-session** - Session management
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **nodemon** (dev) - Development server with auto-restart

## Running the Server

Development mode with auto-restart:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### Products

#### GET /api/products
Get all products from the catalog.

**Response:**
```json
[
  {
    "product_id": 1,
    "name": "Product Name",
    "short_description": "Brief description",
    "description": "Full description",
    "image_url": "/path/to/image.jpg",
    "price": 9.99
  }
]
```

### User Management

#### GET /api/users
Get all users (testing endpoint).

**Response:**
```json
[
  {
    "user_id": 1,
    "email": "user@example.com",
    "password_hash": "hashed_password"
  }
]
```

### Authentication

#### POST /api/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User created successfully"
}
```

#### POST /api/login
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### GET /api/auth/check
Check if user is currently authenticated.

**Response:**
```json
{
  "loggedIn": true,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### POST /api/logout
Destroy user session and log out.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Shopping Cart

All cart endpoints require an active user session.

#### GET /api/cart
Get current user's shopping cart.

**Response:**
```json
{
  "cart": [
    {
      "productId": 1,
      "name": "Product Name",
      "price": 9.99,
      "quantity": 2
    }
  ]
}
```

#### POST /api/cart/add
Add a product to the shopping cart.

**Request Body:**
```json
{
  "productId": 1,
  "name": "Product Name",
  "price": 9.99,
  "quantity": 1
}
```

**Response:**
```json
{
  "cart": [
    {
      "productId": 1,
      "name": "Product Name",
      "price": 9.99,
      "quantity": 1
    }
  ]
}
```

#### PUT /api/cart/update
Update product quantity in cart.

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 3
}
```

**Response:**
```json
{
  "cart": [
    {
      "productId": 1,
      "name": "Product Name",
      "price": 9.99,
      "quantity": 3
    }
  ]
}
```

#### DELETE /api/cart/remove/:productId
Remove a product from the cart.

**Response:**
```json
{
  "cart": []
}
```

## Security Considerations

- Passwords are hashed using bcrypt before storage
- Sessions are managed server-side with express-session
- CORS is configured to accept requests from `http://localhost:5173` (React development server)
- All cart operations require active user sessions

## Database Schema

The application uses three main tables:
- `user` - User accounts with hashed passwords
- `product` - Product catalog
- Session data is stored in express-session (in-memory by default)

Refer to the SQL dump for complete schema details.

## Error Handling

All endpoints include try-catch blocks and return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `401` - Unauthorized
- `500` - Server Error

## Development Notes

- The API uses session-based authentication stored server-side
- Shopping cart data persists in the user session
- CORS is enabled with credentials support for cookie-based sessions
- Development uses nodemon for automatic server restarts

## License

This project is for educational purposes.
