# Store Rating Application

A full-stack web application for rating and managing stores with role-based access control. Built with Express.js, React, PostgreSQL, and Docker.

## 🚀 Features

### System Administrator
- **Dashboard**: View total users, stores, and ratings statistics
- **User Management**: Add, edit, delete, and view user details with role management
- **Store Management**: Add, edit, delete stores and assign owners
- **Advanced Filtering**: Search and sort users/stores by various criteria
- **User Details**: View comprehensive user profiles including store ratings (for store owners)

### Normal User
- **Store Discovery**: Browse, search, and filter store listings
- **Rating System**: Submit and modify ratings (1-5 stars) for stores
- **Personal Ratings**: View and manage personal rating history
- **Account Management**: Update password and profile information

### Store Owner
- **Business Dashboard**: View ratings for owned stores with statistics
- **Store Analytics**: Monitor average ratings and review counts
- **Customer Feedback**: See detailed ratings from customers
- **Performance Insights**: Track overall business performance

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js framework
- **Sequelize ORM** for database operations
- **PostgreSQL** database
- **JWT** authentication with role-based authorization
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React.js** with functional components and hooks
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Hook Form** with Yup validation
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Infrastructure
- **Docker** and **Docker Compose** for containerization
- **PostgreSQL** database with migrations and seed data

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd store-rating-app
   ```

2. **Start the application**
   ```bash
   docker-compose up
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Manual Setup (Development)

1. **Backend Setup**
   ```bash
   cd server
   npm install
   npm run migrate
   npm run seed
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm start
   ```

## 🔐 Demo Accounts

The application comes with pre-seeded demo accounts:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | admin@storeapp.com | Admin123! | Full system access |
| User | john.smith@email.com | User123! | Regular customer account |
| Store Owner | sarah.johnson@email.com | User123! | Business owner account |

## 📊 Database Schema

### Users Table
- `id` (Primary Key)
- `name` (20-60 characters)
- `email` (Unique, valid email format)
- `password_hash` (Encrypted)
- `address` (Max 400 characters)
- `role` (ADMIN | USER | STORE_OWNER)
- `createdAt`, `updatedAt`

### Stores Table
- `id` (Primary Key)
- `name` (20-60 characters)
- `email` (Valid email format)
- `address` (Max 400 characters)
- `owner_id` (Foreign Key to Users)
- `avg_rating` (Decimal 3,2)
- `ratings_count` (Integer)
- `createdAt`, `updatedAt`

### Ratings Table
- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `store_id` (Foreign Key to Stores)
- `rating` (Integer 1-5)
- `createdAt`, `updatedAt`
- Unique constraint on (user_id, store_id)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (USER role only)
- `POST /api/auth/login` - User login
- `PUT /api/auth/update-password` - Update password
- `GET /api/auth/profile` - Get current user profile
- `GET /api/auth/verify` - Verify JWT token

### Admin Routes
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - List users with filtering/sorting
- `GET /api/admin/users/:id` - Get user details
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stores` - List stores with filtering/sorting
- `POST /api/admin/stores` - Create new store
- `PUT /api/admin/stores/:id` - Update store
- `DELETE /api/admin/stores/:id` - Delete store

### User Routes
- `GET /api/user/stores` - List stores with user ratings
- `POST /api/user/stores/:storeId/rating` - Submit/update rating
- `GET /api/user/ratings` - Get user's ratings

### Store Owner Routes
- `GET /api/store-owner/dashboard` - Business dashboard
- `GET /api/store-owner/stores` - Get owned stores
- `GET /api/store-owner/stores/:storeId/ratings` - Get store ratings

## 🎨 Frontend Structure

```
client/src/
├── components/
│   ├── Layout.js          # Main layout with navigation
│   └── ProtectedRoute.js  # Route protection component
├── contexts/
│   └── AuthContext.js     # Authentication context
├── pages/
│   ├── auth/              # Login/Register pages
│   ├── admin/             # Admin dashboard and management
│   ├── user/              # User store browsing and ratings
│   ├── storeOwner/        # Store owner dashboard
│   ├── Profile.js         # User profile management
│   └── Unauthorized.js    # Access denied page
├── utils/
│   └── api.js            # Axios configuration
└── App.js                # Main app component with routing
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for Admin, User, and Store Owner
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: Server-side validation with express-validator
- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet.js**: Security headers protection

## 📝 Validation Rules

### User Registration/Update
- **Name**: 20-60 characters
- **Email**: Valid email format, unique
- **Password**: 8-16 characters, at least 1 uppercase letter and 1 special character
- **Address**: Maximum 400 characters

### Store Creation/Update
- **Name**: 20-60 characters
- **Email**: Valid email format
- **Address**: Maximum 400 characters
- **Owner**: Must be an existing user

### Rating Submission
- **Rating**: Integer between 1-5
- **Unique Constraint**: One rating per user per store

## 🐳 Docker Configuration

The application uses Docker Compose with three services:

- **postgres**: PostgreSQL database
- **backend**: Express.js API server
- **frontend**: React development server

### Environment Variables

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=store_rating_app
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 📈 Performance Features

- **Pagination**: All list endpoints support pagination
- **Sorting**: Sortable columns in all data tables
- **Filtering**: Search functionality across relevant fields
- **Optimized Queries**: Efficient database queries with proper indexing
- **Caching**: JWT token caching in localStorage

## 🔧 Development

### Database Migrations
```bash
cd server
npx sequelize-cli db:migrate
```

### Seed Data
```bash
cd server
npx sequelize-cli db:seed:all
```

### Code Formatting
```bash
# Backend
cd server
npm run lint

# Frontend
cd client
npm run lint
```

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PASSWORD=your-secure-password
JWT_SECRET=your-production-jwt-secret
```

### Build for Production
```bash
# Frontend
cd client
npm run build

# Backend
cd server
npm start
```

## 📱 Screenshots

### Admin Dashboard
- System statistics overview
- User and store management interfaces
- Advanced filtering and sorting capabilities

### User Interface
- Store browsing with search functionality
- Interactive rating system
- Personal rating history

### Store Owner Dashboard
- Business performance metrics
- Customer feedback overview
- Store analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🆘 Support

For support, email satyamprakash4562@gmail.com or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release with full CRUD operations and role-based access control

---

**Built with ❤️ using Express.js, React, and PostgreSQL**

