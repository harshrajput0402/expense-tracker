# Expense Tracker

A full-stack Expense Tracker application built with the MERN stack that helps users manage income and expenses, visualize financial data, and generate reports.

## Tech Stack

### Frontend
- React.js
- Vite
- Axios
- React Router DOM
- Recharts
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- XLSX

---

# Prerequisites

Before running this project, install the following software:

### 1. Node.js

Download and install Node.js (LTS version):

:contentReference[oaicite:0]{index=0}

Verify installation:

```bash
node -v
npm -v
```

---

### 2. Git

Download Git:

:contentReference[oaicite:1]{index=1}

Verify installation:

```bash
git --version
```

---

### 3. MongoDB

You can use either:

- MongoDB Atlas (Cloud)

:contentReference[oaicite:2]{index=2}

OR

- MongoDB Community Server

:contentReference[oaicite:3]{index=3}

---

# Clone Repository

```bash
git clone https://github.com/harshrajput0402/expense-tracker.git
cd expense-tracker
```

---

# Backend Setup

Move into backend folder:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Run backend:

```bash
npm run dev
```

---

# Frontend Setup

Move into frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

---

# Backend Dependencies

```bash
npm install express mongoose dotenv cors jsonwebtoken bcryptjs cookie-parser multer xlsx validator
```

Development dependencies:

```bash
npm install -D nodemon
```

---

# Frontend Dependencies

```bash
npm install axios react-router-dom recharts lucide-react
```

---

# Environment Variables

Create a `.env` file inside the Backend folder.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

---

# Start the Project

Backend

```bash
cd Backend
npm run dev
```

Frontend

```bash
cd frontend
npm run dev
```

---

Open:

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:3000
```