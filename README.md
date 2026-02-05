# 🌾 AgroLink Market

**Connecting Farms, Markets, and Agricultural Intelligence**

AgroLink Market is a full-stack, enterprise-grade agricultural e-commerce and intelligence platform that connects farmers, buyers, researchers, and administrators in a unified ecosystem.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

---

## ✨ Features

### Core Modules

#### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Secure password hashing with bcrypt
- Email/password login and registration
- Protected routes and API endpoints

#### 🛒 Marketplace
- Product listing and browsing
- Advanced search and filtering
- Category-based organization
- Product details with images
- Shopping cart functionality
- Bulk pricing support

#### 👥 User Management
- Multi-role support (Admin, Farmer, Buyer, Researcher)
- User profiles with customizable fields
- Location-based filtering

#### 📊 Research & Analytics (Coming Soon)
- Market price trends
- Supply vs demand visualization
- Regional data analysis
- Exportable datasets

#### 💬 Community Forum (Coming Soon)
- Topic-based discussions
- Q&A threads
- Expert verification badges

#### 🔔 Notifications System
- In-app notification alerts
- Order status update tracking
- Transaction confirmations

#### 💳 Wallet & Settlement System
- **Escrow Logic**: Secure fund holding until delivery confirmation
- **Platform Commission**: Automatic 5% deduction on sales
- **Transaction History**: Detailed ledger for both Buyers and Farmers
- **Balance Management**: Real-time available vs. pending balance tracking

#### 📋 Advanced Order Management
- **Interactive Timeline**: Real-time logistics stepper (Ordered → Approved → Shipped → Delivered)
- **Financial Ledger**: Transparent breakdown of subtotal, logistics, and commissions
- **Role-Aware Actions**: Contextual buttons for payment, shipping, and approval
- **Cinematic Ticket View**: High-definition, professional order detail modals

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** ShadCN UI
- **Fonts:** Inter, Outfit (Google Fonts)
- **Icons:** Lucide React

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **Database ORM:** Prisma
- **Authentication:** Passport.js + JWT
- **Validation:** class-validator, class-transformer

### Database
- **Database:** PostgreSQL 15
- **Container:** Docker
- **Admin Tool:** pgAdmin 4

### DevOps
- **Containerization:** Docker & Docker Compose
- **Package Manager:** npm

---

## 📁 Project Structure

```
AgroLink/
├── backend/                    # NestJS Backend
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # Users module
│   │   ├── products/          # Products module
│   │   ├── prisma/            # Prisma service
│   │   ├── app.module.ts      # Root module
│   │   └── main.ts            # Entry point
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/      # Public pages (landing, marketplace)
│   │   │   ├── auth/          # Auth pages (login, register)
│   │   │   ├── globals.css    # Global styles
│   │   │   └── layout.tsx     # Root layout
│   │   └── components/
│   │       ├── layout/        # Layout components (Navbar)
│   │       └── ui/            # ShadCN UI components
│   └── package.json
│
├── docker-compose.yml          # Docker services configuration
├── .gitignore                  # Git ignore rules
├── PRD.md                      # Product Requirements Document (Internal)
├── prompt.md                   # Development prompt (Internal)
├── payment.md                  # Payment System Logic (Internal)
├── QUICK_START.md              # Fast setup guide
├── DASHBOARDS_GUIDE.md         # Dashboard features documentation
├── DEVELOPMENT_SUMMARY.md      # Progress tracking
├── VISUAL_GUIDE.md             # UI/UX design tokens
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Docker** and Docker Compose
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AgroLink
   ```

2. **Start the database**
   ```bash
   docker-compose up -d
   ```
   This starts PostgreSQL on port 5432 and pgAdmin on port 5050.

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   npm run start:dev
   ```
   Backend runs on **http://localhost:3001**

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on **http://localhost:3000**

### Default Admin Credentials

The system automatically seeds a default admin user:
- **Email:** admin@agrolink.com
- **Password:** admin

⚠️ **Change these credentials immediately in production!**

---

## 📡 API Documentation

### Base URL
```
http://localhost:3001
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "BUYER",
  "location": "Lagos, Nigeria"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "BUYER",
    "fullName": "John Doe"
  }
}
```

#### Get Profile (Protected)
```http
GET /auth/profile
Authorization: Bearer <access_token>
```

### Products Endpoints

#### Get All Products
```http
GET /products
GET /products?category=Grains
GET /products?skip=0&take=10
```

#### Search Products
```http
GET /products/search?q=rice
```

#### Get Single Product
```http
GET /products/:id
```

#### Create Product (Protected - Farmers only)
```http
POST /products
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Organic Rice",
  "description": "Premium quality organic rice",
  "price": 25.99,
  "bulkPrice": 22.50,
  "quantity": 1000,
  "category": "Grains",
  "images": ["https://example.com/image.jpg"]
}
```

#### Update Product (Protected)
```http
PUT /products/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "price": 24.99,
  "quantity": 950
}
```

#### Delete Product (Protected)
```http
DELETE /products/:id
Authorization: Bearer <access_token>
```

---

## 👤 User Roles

### 🔧 Admin
- Full system control
- User & role management
- Content moderation
- Analytics & reporting

### 🌾 Farmer / Seller
- List agricultural products
- Manage inventory & pricing
- Track sales & orders
- Engage with buyers
- Post research observations

### 🛒 Buyer
- Browse marketplace
- Purchase products
- Bulk & recurring orders
- Track deliveries
- Leave reviews

### 📊 Researcher / Agricultural Economist
- Access anonymized market data
- Analyze price trends
- Publish insights & reports
- Create surveys & polls
- Participate in discussions

---

## 🎨 Design Philosophy

AgroLink follows modern web design principles:

- **Visual Excellence:** Rich color palettes, smooth gradients, premium aesthetics, and fintech-inspired design
- **Cinematic Ticket System:** High-definition, 1400px wide professional order management modals with interactive logistics tracking
- **Responsive Design:** Mobile-first approach, works on all devices
- **Accessibility:** WCAG compliant, semantic HTML, and Radix-aware Dialog titles
- **Performance:** Optimized images, lazy loading, efficient queries
- **User Experience:** Intuitive navigation, clear CTAs, smooth animations

---

## 🗄️ Database Schema

### Core Models

- **User** - Authentication and profile data
- **Product** - Agricultural product listings
- **Order** - Purchase transactions
- **OrderItem** - Individual items in orders
- **Review** - Product reviews and ratings
- **ResearchPost** - Research publications
- **ForumThread** - Community discussions
- **Comment** - Thread comments
- **Notification** - User notifications

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token-based authentication
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ SQL injection protection (Prisma ORM)
- ✅ Role-based access control
- ✅ Environment variable protection

---

## 🚧 Roadmap

### Phase 1 (Current)
- [x] Authentication & Authorization
- [x] User Management
- [x] Product Marketplace
- [x] Basic UI/UX

### Phase 2 (Complete)
- [x] Orders & Transactions
- [x] Shopping Cart System
- [x] Wallet & Escrow Integration
- [x] Farmer Dashboard Analytics
- [x] Buyer Dashboard & Redesigned Ticket System

### Phase 3
- [ ] Research & Analytics Module
- [ ] Data Visualization
- [ ] Community Forum
- [ ] Notifications System

### Phase 4
- [ ] Admin Control Panel
- [ ] Mobile Apps (React Native)
- [ ] AI-powered price prediction
- [ ] Weather integration
- [ ] Blockchain traceability

---

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agrolink?schema=public"
JWT_SECRET="super-secret-key-change-this"
PORT=3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Development Team

Built with ❤️ for the agricultural community

---

---

## 🔗 Repository & Deployment

- **Git Repository:** [ProfHezzy/AgroLink](https://github.com/ProfHezzy/AgroLink.git)
- **Primary Branch:** `main`
- **Developer Profile:** [@ProfHezzy](https://github.com/ProfHezzy)

## 📞 Contact & Support

For business inquiries, technical support, or contributions:

- **Email:** hezekiahonline94@gmail.com
- **Phone:** +234 814 027 2765
- **Community:** Join our forum inside the application dashboard.

For support, email support@agrolink.com or join our community forum.

---

## 🙏 Acknowledgments

- NestJS Team
- Next.js Team
- Prisma Team
- ShadCN UI
- All contributors and supporters

---

**Happy Farming! 🌾**
