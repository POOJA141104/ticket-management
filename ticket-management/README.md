# 🎫 Ticket Management System — React Native & Node.js

A full-stack complaint/ticket management system built with **React Native (Expo), Node.js, Express, MongoDB**.

---

## 📁 Project Structure

```
ticket-management/
├── backend/                   # Node.js + Express API (Port 5000)
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Database seeder
│   ├── controllers/           # Auth, Master, User, Complaint, Report controllers
│   ├── middleware/            # JWT auth & upload middlewares
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   └── server.js
│
└── frontend/                  # React Native (Expo) App (Port 8081)
    ├── src/
    │   ├── theme/
    │   │   └── colors.js      # Dark theme & status colors
    │   ├── components/
    │   │   ├── UI.js          # Native UI system (Btn, Input, Select, Badge, Card, Modal, Icons)
    │   │   └── Header.js      # App top bar with user info & logout
    │   ├── context/
    │   │   └── AuthContext.js # Auth state persisted via AsyncStorage
    │   ├── utils/
    │   │   └── api.js         # Axios instance with auto IP & JWT headers
    │   ├── navigation/
    │   │   └── AppNavigator.js# React Navigation (Auth Stack, Bottom Tabs & Master Stack)
    │   └── screens/
    │       ├── auth/
    │       │   └── LoginScreen.js
    │       ├── transactions/
    │       │   ├── DashboardScreen.js
    │       │   ├── RaiseComplaintScreen.js
    │       │   └── ComplaintsScreen.js
    │       ├── master/
    │       │   ├── MasterMenuScreen.js
    │       │   ├── DepartmentsScreen.js
    │       │   ├── ProgrammesScreen.js
    │       │   ├── BlocksScreen.js
    │       │   ├── RoomsScreen.js
    │       │   ├── RolesScreen.js
    │       │   └── UsersScreen.js
    │       └── reports/
    │           └── ReportsScreen.js
    ├── App.js
    └── app.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Start Backend API

```bash
cd backend
npm install
npm run seed     # Seeds default roles, departments & superadmin user
npm start        # Runs API on http://localhost:5000
```

### 2. Start React Native (Expo) App

```bash
cd frontend
npm install

# Run on Web (Browser preview at http://localhost:8081):
npx expo start --web

# Run on Android / iOS via Expo Go:
npx expo start
```
* Scan the QR code in your terminal using the **Expo Go** app on iOS or Android.
* Press `w` to open in your web browser.
* Press `a` to launch in Android Emulator.

---

## 🔑 Default Login (after seed)

| Role        | Username    | Password  |
|-------------|-------------|-----------|
| SuperAdmin  | superadmin  | admin123  |

Create more users via the **Users** master screen (SuperAdmin only).

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint        | Access  |
|--------|-----------------|---------|
| POST   | /api/auth/login | Public  |
| GET    | /api/auth/me    | Private |

### Master Screens (SuperAdmin only)
| Method | Endpoint              |
|--------|-----------------------|
| GET/POST | /api/departments    |
| PUT/DELETE | /api/departments/:id |
| GET/POST | /api/programmes     |
| GET/POST | /api/blocks         |
| GET/POST | /api/rooms          |
| GET/POST | /api/roles          |
| GET/POST | /api/users          |

### Complaints
| Method | Endpoint                        | Access              |
|--------|---------------------------------|---------------------|
| GET    | /api/complaints                 | All (filtered)      |
| POST   | /api/complaints                 | SuperAdmin, User    |
| GET    | /api/complaints/dashboard       | All                 |
| GET    | /api/complaints/:id             | All                 |
| PUT    | /api/complaints/:id/assign      | SuperAdmin only     |
| PUT    | /api/complaints/:id/status      | Staff only          |

### Reports
| Method | Endpoint                  | Access       |
|--------|---------------------------|--------------|
| GET    | /api/reports/complaints   | SuperAdmin   |

---

## 👥 Role-Based Access

| Feature               | SuperAdmin | User | Staff |
|-----------------------|:----------:|:----:|:-----:|
| Master Screens        | ✅         | ❌   | ❌    |
| Raise Complaint       | ✅         | ✅   | ❌    |
| View All Complaints   | ✅         | ❌   | ❌    |
| View Own Complaints   | ✅         | ✅   | ❌    |
| View Assigned         | ✅         | ❌   | ✅    |
| Assign Complaint      | ✅         | ❌   | ❌    |
| Update Status         | ❌         | ❌   | ✅    |
| Reports               | ✅         | ❌   | ❌    |

---

## 🛠 Tech Stack

- **Frontend**: React 18, React Router v6, Axios, React Toastify
- **Backend**: Node.js, Express.js, JWT Auth, Multer
- **Database**: MongoDB with Mongoose ODM
- **Security**: bcryptjs password hashing, JWT tokens
