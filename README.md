# 💰 Axis Finance

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/SpringBoot-3.x-darkgreen)
![H2](https://img.shields.io/badge/Database-H2-blue)
![License](https://img.shields.io/badge/License-MIT-red)

Financial management REST API for tracking **categories, revenues and expenses**, featuring a simple dashboard with real-time metrics.

This project was built using **Java + Spring Boot** for the backend and a **Vanilla JavaScript frontend** to demonstrate full-stack integration and financial data visualization.

---

# 🚀 Features

### Categories
- Create category
- List categories
- Update category
- Delete category
- Duplicate name prevention using normalized text

### Revenues
- Create revenue
- List revenues
- Update revenue
- Delete revenue

### Expenses
- Create expense
- List expenses
- Update expense
- Delete expense

### Dashboard
- Total number of categories
- Total number of revenues
- Total number of expenses
- Total revenue amount
- Total expense amount

Dashboard metrics are dynamically updated using **Fetch API** and formatted using **JavaScript Intl API**.

---

# 🛠 Tech Stack

## Backend
- Java 21
- Spring Boot 3.2
- Spring Web
- Spring Data JPA
- Jakarta Validation
- Lombok
- H2 Database

## Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API

---

# 📁 Project Structure

```
axis-finance/
│
├── axis-finance-backend/       # Spring Boot REST API
│   └── src/main/java/com/axis/finance
│
└── axis-finance-frontend/      # Static frontend
    ├── index.html
    ├── css/
    ├── js/
    ├── pages/
    └── images/
```

---

# 🧱 Backend Architecture

The backend follows a layered architecture:

```
controller
service
repository
domain
dto
exception
utilities
```

### Layers

**Controller**
- Handles HTTP requests
- Maps endpoints to services

**Service**
- Contains business logic

**Repository**
- Data persistence using Spring Data JPA

**DTO**
- Request and Response objects to avoid exposing entities

**Domain**
- Entities and enums used by the application

**Utilities**
- Helper classes such as text normalization

---

# 📊 Domain Model

## Category

```
categoryId
name
normalizedName
categoryType
```

## Revenue

```
revenueId
description
amount
category
createdDate
```

## Expense

```
expenseId
description
amount
category
createdDate
```

---

# ▶️ How to Run the Project

## 1️⃣ Backend (Spring Boot)

Open the backend project in IntelliJ and run the main application.

The API will start at:

```
http://localhost:8080
```

---

## 2️⃣ Frontend

1. Open `axis-finance-frontend` in **VSCode**
2. Install **Live Server** extension
3. Right-click `index.html`
4. Click **Open with Live Server**

Frontend will run at something like:

```
http://127.0.0.1:5500
```

---

# 📦 API Endpoints

## Categories

| Method | Endpoint | Description |
|------|------|------|
| GET | `/category` | List all categories |
| POST | `/category` | Create category |
| PUT | `/category/{id}` | Update category |
| DELETE | `/category/{id}` | Delete category |

---

## Revenues

| Method | Endpoint | Description |
|------|------|------|
| GET | `/revenue` | List revenues |
| POST | `/revenue` | Create revenue |
| PUT | `/revenue/{id}` | Update revenue |
| DELETE | `/revenue/{id}` | Delete revenue |

---

## Expenses

| Method | Endpoint | Description |
|------|------|------|
| GET | `/expense` | List expenses |
| POST | `/expense` | Create expense |
| PUT | `/expense/{id}` | Update expense |
| DELETE | `/expense/{id}` | Delete expense |

---

# 📈 Dashboard

The frontend dashboard aggregates financial information by consuming the REST API.

Displayed metrics:

- Total categories
- Total revenues
- Total expenses
- Total revenue value
- Total expense value

Currency values are formatted using:

```javascript
Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
})
```

---

# 🧠 Architecture Highlights

- Layered architecture (Controller → Service → Repository)
- DTO pattern for request and response separation
- Enum-based category typing
- Text normalization to avoid duplicate category names
- Frontend-backend integration using Fetch API
- Dashboard metrics calculated dynamically from API data
- Defensive HTML escaping to prevent injection

---

# 📜 License

MIT License