# Minimal LMS Backend System

A complete Learning Management System (LMS) backend built with TypeScript, Express.js, and MongoDB following the MVC architectural pattern.

## 🚀 Features

### Admin Dashboard Features
- **Course Management**: Create, read, update, and delete courses with thumbnails, titles, prices, and descriptions
- **Module Management**: Organize course content into numbered modules with auto-incrementing module numbers
- **Lecture Management**: Add lectures under modules with video uploads/URLs and multiple PDF notes
- **Content Organization**: Dynamic routing from course cards to module & lecture management pages

### User Panel Features
- **Course Discovery**: Browse and view published courses with detailed information
- **Sequential Learning**: Lectures unlock progressively as users complete previous content
- **Progress Tracking**: Visual indicators showing completed lectures and overall progress
- **Content Delivery**: Video streaming and PDF note downloads for each lecture

### Technical Features
- **Authentication & Authorization**: Role-based access control (admin, superAdmin, user)
- **File Upload**: Support for course thumbnails, video files, and PDF notes
- **Progress Tracking**: Comprehensive user progress monitoring and analytics
- **Search & Filtering**: Advanced query capabilities with pagination and sorting
- **RESTful API**: Well-structured endpoints following REST principles

## 🛠️ Tech Stack

- **Backend**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with role-based access control
- **File Upload**: Multer with Cloudinary integration
- **Validation**: Zod schema validation
- **Architecture**: MVC pattern with service layer

## 📁 Project Structure

```
src/
├── app/
│   ├── builder/
│   │   └── QueryBuilder.ts          # Advanced query building utility
│   ├── config/
│   │   ├── cloudinary.config.ts     # Cloudinary configuration
│   │   ├── index.ts                 # Database configuration
│   │   └── multer.config.ts         # File upload configuration
│   ├── errors/
│   │   └── AppError.ts              # Custom error handling
│   ├── middlewares/
│   │   ├── auth.ts                  # Authentication middleware
│   │   ├── globalErrorHandler.ts    # Global error handling
│   │   ├── notFoundRoute.ts         # 404 route handling
│   │   └── validateRequest.ts       # Request validation
│   ├── modules/
│   │   ├── auth/                    # Authentication module
│   │   ├── user/                    # User management
│   │   ├── Blog/                    # Blog system
│   │   ├── course/                  # Course management
│   │   ├── module/                  # Module organization
│   │   ├── lecture/                 # Lecture content
│   │   └── progress/                # User progress tracking
│   ├── routes/
│   │   └── index.ts                 # Main route configuration
│   └── utils/
│       ├── catchAsync.ts            # Async error handling
│       ├── generateToken.ts         # JWT token generation
│       └── sendResponse.ts          # Standardized API responses
├── app.ts                           # Express app configuration
└── server.ts                        # Server entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd minimal-lms-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp exampleEnv .env
   ```
   
   Configure your `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lms
   JWT_SECRET=your-jwt-secret
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Run the application**
   ```bash
   # Development
   npm run dev
   
   # Build and run
   npm run build
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh-token` - Refresh access token

### Courses
- `GET /api/v1/courses` - Get all courses (with filtering)
- `GET /api/v1/courses/published` - Get published courses
- `GET /api/v1/courses/:id` - Get course by ID
- `POST /api/v1/courses` - Create course (Admin only)
- `PUT /api/v1/courses/:id` - Update course (Admin only)
- `DELETE /api/v1/courses/:id` - Delete course (Admin only)

### Modules
- `GET /api/v1/modules` - Get all modules
- `GET /api/v1/modules/course/:courseId` - Get modules by course
- `GET /api/v1/modules/:id` - Get module by ID
- `POST /api/v1/modules` - Create module (Admin only)
- `PUT /api/v1/modules/:id` - Update module (Admin only)
- `DELETE /api/v1/modules/:id` - Delete module (Admin only)
- `PUT /api/v1/modules/reorder/:courseId` - Reorder modules (Admin only)

### Lectures
- `GET /api/v1/lectures` - Get all lectures
- `GET /api/v1/lectures/module/:moduleId` - Get lectures by module
- `GET /api/v1/lectures/course/:courseId` - Get lectures by course
- `GET /api/v1/lectures/:id` - Get lecture by ID
- `POST /api/v1/lectures` - Create lecture (Admin only)
- `PUT /api/v1/lectures/:id` - Update lecture (Admin only)
- `DELETE /api/v1/lectures/:id` - Delete lecture (Admin only)
- `PUT /api/v1/lectures/reorder/:moduleId` - Reorder lectures (Admin only)


### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Blog
- `GET /api/v1/blogs` - Get all blogs
- `GET /api/v1/blogs/:id` - Get blog by ID
- `POST /api/v1/blogs` - Create blog (Admin only)
- `PUT /api/v1/blogs/:id` - Update blog (Admin only)
- `DELETE /api/v1/blogs/:id` - Delete blog (Admin only)

## 🔐 Authentication & Authorization

The system uses JWT tokens with role-based access control:

- **user**: Can access courses and view content
- **admin**: Can manage courses, modules, and lectures
- **superAdmin**: Full system access including user management

## 📁 File Upload

The system supports multiple file types:
- **Course thumbnails**: Single image upload
- **Video files**: Single video upload per lecture
- **PDF notes**: Multiple PDF uploads per lecture

Files are stored using Cloudinary for efficient delivery and management.

## 🔍 Query Features

Advanced querying capabilities include:
- **Search**: Text search across titles and descriptions
- **Filtering**: Filter by category, level, price, etc.
- **Sorting**: Sort by any field in ascending/descending order
- **Pagination**: Configurable page size and navigation
- **Field Selection**: Choose which fields to include/exclude



## 🚀 Deployment

### Build the Application
```bash
npm run build
```

### Environment Variables for Production
Ensure all required environment variables are set in your production environment.

### Database Setup
- Ensure MongoDB is running and accessible
- Create necessary indexes for optimal performance
- Set up proper backup and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using modern web technologies**
