# Quiz Learning System - Backend

A production-ready Node.js/Express.js backend for a comprehensive quiz learning platform with JWT authentication, role-based access control, automatic grading, and advanced analytics.

## Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL 5.7+
- npm or yarn

### Installation

```bash
# 1. Clone or navigate to backend directory
cd Backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Initialize database
npm run setup-db

# 5. Start development server
npm run dev
```

The server will run on `http://localhost:5000` with auto-reload enabled.

---

## Project Structure

```
src/
├── database/
│   ├── connection.js          # MySQL connection pool
│   └── schema.sql             # Database schema & seed data
├── middleware/
│   ├── auth.js                # JWT & RBAC middleware
│   ├── validation.js          # Input validation
│   └── errorHandler.js        # Global error handler
├── controllers/               # Business logic (10 files)
│   ├── authController.js
│   ├── userController.js
│   ├── categoryController.js
│   ├── classController.js
│   ├── questionController.js
│   ├── quizController.js
│   ├── quizAttemptController.js
│   ├── resultsController.js
│   ├── notificationController.js
│   └── adminController.js
├── routes/                    # API endpoints (10 files)
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── categoryRoutes.js
│   ├── classRoutes.js
│   ├── questionRoutes.js
│   ├── quizRoutes.js
│   ├── quizAttemptRoutes.js
│   ├── resultsRoutes.js
│   ├── notificationRoutes.js
│   └── adminRoutes.js
├── utils/
│   ├── password.js            # Password hashing utilities
│   └── stringUtils.js         # String operations & grading
└── index.js                   # Express app entry point

scripts/
└── setupDatabase.js           # Database initialization
```

---

## Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=quizspace_db
DB_PORT=3306

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key
JWT_REFRESH_EXPIRE=30d

# Frontend CORS
CORS_ORIGIN=http://localhost:5173

# Password Requirements
PASSWORD_MIN_LENGTH=8
```

---

## Database

### Initialization

```bash
npm run setup-db
```

This creates:
- **11 tables** with proper relationships
- **Test accounts** with seed data
- **Sample questions** and categories

### Database Schema

#### Core Entities
1. **users** - User accounts (admin, teacher, student)
2. **categories** - Subject categories
3. **classes** - Class/Kelas management
4. **class_members** - Student-class relationships
5. **questions** - Question bank
6. **question_options** - Multiple choice options
7. **quizzes** - Quiz definitions
8. **quiz_questions** - Quiz composition
9. **quiz_attempts** - Student attempts
10. **quiz_answers** - Student answers
11. **notifications** - User notifications

### Test Accounts

```
Admin:    admin@quizspace.test / admin123
Teacher:  teacher@quizspace.test / admin123
Student1: user@quizspace.test / admin123
Student2: student2@quizspace.test / admin123
```

All passwords use bcrypt hash: `$2a$10$K8.wPz0uVGkBNp4CbLN2G.Ea8o3HF5qxlEwvLNT8GBT4u2jLmxjZW`

---

## API Overview

### Total Endpoints: 60+

#### Authentication (4)
```
POST   /api/auth/register        Register new user
POST   /api/auth/login           Login user
POST   /api/auth/logout          Logout
POST   /api/auth/refresh-token   Refresh JWT token
```

#### Users (6)
```
GET    /api/users/me             Get current user
PUT    /api/users/me             Update profile
PUT    /api/users/me/password    Change password
GET    /api/users/me/stats       Get user statistics
GET    /api/users/all            List all users (admin)
PUT    /api/users/:id/status     Update user status (admin)
```

#### Categories (5)
```
GET    /api/categories           List categories
GET    /api/categories/:id       Get category details
POST   /api/categories           Create category (admin)
PUT    /api/categories/:id       Update category (admin)
DELETE /api/categories/:id       Delete category (admin)
```

#### Classes (8)
```
GET    /api/classes              Get user's classes
POST   /api/classes              Create class (teacher)
GET    /api/classes/:id          Get class details
PUT    /api/classes/:id          Update class (teacher)
DELETE /api/classes/:id          Delete class (teacher)
POST   /api/classes/join         Join class with code
GET    /api/classes/:id/members  List class members (teacher)
DELETE /api/classes/:id/members/:memberId  Remove member (teacher)
```

#### Questions (6)
```
POST   /api/questions            Create question (teacher)
GET    /api/questions            List teacher's questions
GET    /api/questions/:id        Get question details
PUT    /api/questions/:id        Update question (owner)
DELETE /api/questions/:id        Delete question (owner)
POST   /api/questions/search     Search questions
```

#### Quizzes (7)
```
POST   /api/quizzes              Create quiz (teacher)
GET    /api/quizzes/classes/:id  Get class quizzes
GET    /api/quizzes/:id          Get quiz details
PUT    /api/quizzes/:id          Update quiz (teacher)
DELETE /api/quizzes/:id          Delete quiz (teacher)
POST   /api/quizzes/:id/publish  Publish quiz (teacher)
POST   /api/quizzes/:id/close    Close quiz (teacher)
```

#### Quiz Attempts (6)
```
POST   /api/quiz-attempts        Start quiz attempt
GET    /api/quiz-attempts/:id    Get current attempt
POST   /api/quiz-attempts/:id/answers     Save answer
POST   /api/quiz-attempts/:id/submit      Submit quiz
GET    /api/quiz-attempts/:id/results     Get results
GET    /api/quiz-attempts/quiz/:id/history  Get attempt history
```

#### Results (5)
```
GET    /api/results/quizzes/:id           Get quiz results (teacher)
GET    /api/results/quizzes/:id/analytics Get quiz analytics (teacher)
GET    /api/results/leaderboard/classes/:id  Get class leaderboard
GET    /api/results/user/history          Get user's history
GET    /api/results/user/statistics       Get user statistics
```

#### Notifications (5)
```
GET    /api/notifications                 List notifications
GET    /api/notifications/unread-count    Get unread count
PUT    /api/notifications/:id/read        Mark notification as read
PUT    /api/notifications/read-all        Mark all as read
DELETE /api/notifications/:id             Delete notification
```

#### Admin (5)
```
GET    /api/admin/analytics              System analytics
GET    /api/admin/dashboard              Dashboard summary
GET    /api/admin/teachers/rankings      Teacher rankings
GET    /api/admin/students/activity      Student activity
GET    /api/admin/health                 System health
```

---

## Features Implemented

### Authentication & Security
- ✅ User registration & login
- ✅ JWT token-based authentication
- ✅ Refresh token mechanism
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcryptjs
- ✅ Input validation & sanitization
- ✅ SQL injection prevention
- ✅ XSS prevention

### Class Management
- ✅ Create/manage classes
- ✅ Auto-generate class codes
- ✅ Student enrollment
- ✅ Member management
- ✅ Category assignment

### Question Bank
- ✅ **3 question types:**
  - Multiple choice (pilihan_ganda)
  - True/False (benar_salah)
  - Short answer (isian_singkat)
- ✅ CRUD operations
- ✅ Search and filtering
- ✅ Option management

### Quiz Engine
- ✅ Create quizzes with questions
- ✅ Set question weights (bobot)
- ✅ Schedule with time constraints
- ✅ Publish/close quizzes
- ✅ Retry policies
- ✅ Answer visibility control

### Auto-Grading System
- ✅ Multiple choice: Exact match
- ✅ True/False: Case-insensitive
- ✅ Short answer: Flexible matching
- ✅ Weighted scoring
- ✅ Score calculation (0-100)

### Results & Analytics
- ✅ Individual results display
- ✅ Explanations (pembahasan)
- ✅ Quiz analytics
- ✅ Class leaderboard
- ✅ User history
- ✅ Statistics dashboard

### Notifications
- ✅ Create notifications
- ✅ Mark as read
- ✅ Pagination support

### Admin Dashboard
- ✅ System statistics
- ✅ User management
- ✅ Teacher rankings
- ✅ Student activity tracking
- ✅ System health monitoring

---

## Grading Logic

### Multiple Choice
```
If jawaban === kunci_jawaban (exact match)
  → is_benar = true
  → poin = bobot
Else
  → is_benar = false
  → poin = 0
```

### True/False
```
Normalize both strings:
  - Lowercase
  - Trim whitespace
  - Remove special characters

If normalized_jawaban === normalized_kunci
  → is_benar = true
  → poin = bobot
```

### Short Answer
```
Remove:
  - Punctuation: . , ! ? ; :
  - Extra spaces
  - Case sensitivity

If normalized_jawaban === normalized_kunci
  → is_benar = true
  → poin = bobot
```

### Score Calculation
```
total_poin = sum of poin for correct answers
total_bobot = sum of all question weights
skor = (total_poin / total_bobot) * 100
```

---

## Role Permissions

### Admin
- ✓ Manage users
- ✓ Manage categories
- ✓ View system analytics
- ✓ Monitor system health

### Teacher
- ✓ Create/manage classes
- ✓ Manage students
- ✓ Create/manage questions
- ✓ Create/manage quizzes
- ✓ View student results
- ✓ Access class analytics

### Student
- ✓ Join classes
- ✓ View published quizzes
- ✓ Attempt quizzes
- ✓ View own results
- ✓ View leaderboard
- ✓ View statistics

---

## Error Handling

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* ... */ }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

### Common HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## Testing

### Run Tests
```bash
npm test
```

### Manual Testing with Curl

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@quizspace.test",
    "password":"admin123"
  }'
```

**Get Current User (with token):**
```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Testing Tools
- Postman: Import API collection
- Insomnia: REST client
- cURL: Command line testing

---

## Development

### File Watching
```bash
npm run dev
```

### Project Structure Best Practices
1. **Controllers** - Business logic only
2. **Routes** - Endpoint definitions
3. **Middleware** - Cross-cutting concerns
4. **Utils** - Helper functions
5. **Database** - SQL queries & connection

### Adding New Endpoints

1. Create controller method in `src/controllers/`
2. Add route in `src/routes/`
3. Register route in `src/index.js`
4. Test with Postman/cURL

Example:
```javascript
// Controller
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Route
router.get('/:id', getUser);

// Register in index.js
app.use('/api/users', userRoutes);
```

---

## Deployment

### Production Build
```bash
# Set NODE_ENV=production
npm start
```

### Environment Variables
Ensure `.env` is properly configured with:
- Strong `JWT_SECRET`
- Production database credentials
- Correct `CORS_ORIGIN`
- `NODE_ENV=production`

### Database Backup
```bash
mysqldump -u root -p quizspace_db > backup.sql
```

### Restore Backup
```bash
mysql -u root -p quizspace_db < backup.sql
```

---

## Troubleshooting

### Database Connection Error
```
Check:
- MySQL is running
- DB_HOST, DB_USER, DB_PASSWORD correct in .env
- Database exists or can be created
```

### JWT Token Invalid
```
Check:
- Token is included in Authorization header
- Token is not expired
- JWT_SECRET matches between issues
```

### CORS Error
```
Check:
- CORS_ORIGIN in .env matches frontend URL
- Preflight requests are allowed
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :5000   # Windows
```

---

## Performance Tips

1. **Connection Pooling** - Already enabled in database/connection.js
2. **Pagination** - Use limit/offset for large datasets
3. **Indexing** - Proper indexes on frequently queried columns
4. **Caching** - Add Redis for session/token caching (future)
5. **API Rate Limiting** - Implement middleware (future)

---

## Documentation

- **API_DOCUMENTATION.md** - Detailed API reference
- **COMPLETE_API_GUIDE.md** - Comprehensive API guide
- **QUIZ_ENGINE.md** - Quiz system design
- **INTEGRATION_GUIDE.md** - Frontend integration
- **TESTING_GUIDE.md** - Testing procedures
- **DEVELOPMENT.md** - Development guide

---

## License

ISC

---

## Support

For issues or questions:
1. Check documentation files
2. Review error messages
3. Check database schema
4. Test with Postman

---

**Version:** 1.0  
**Status:** Production Ready  
**Last Updated:** November 2026
