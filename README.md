# 💰 Budget Buddy - Personal Financial Management System

Budget Buddy is a comprehensive **personal financial management system** designed to help users track their income, expenses, savings, and budgets. It is a **mobile application** built with a microservice architecture for flexibility, scalability, and secure user management. 📱🌐

---

## 🏗️ Repositories Overview

### 1. 📘 `budget-buddy-financial-management-service`
💵 Handles income, expense, savings, and budget tracking. Provides analytics 📊, financial insights 💹, and secure data handling 🛡️. Integrates seamlessly 🔄 with other Budget Buddy services.

### 2. 📱 `budget-buddy-frontend`
Delivers a modern, **mobile-friendly interface** 🌟. Features smooth UI 🎨, real-time tracking 📝, and intuitive personal money management 💰. Provides a seamless and enjoyable user experience 🤩.

### 3. 🌐 `budget-buddy-api-gateway`
Acts as the **central gateway** 🚏, managing requests 🔄, routing 🛣️, authentication 🔑, and communication 📡 across all services. Ensures reliability ✅, security 🛡️, and smooth orchestration ⚙️.

### 4. 👤 `budget-buddy-user-management-service`
Manages secure **user registration** 📝, authentication 🔐, roles 👥, and profile management 🧾. Provides a scalable identity layer 🌐, ensuring privacy 🛡️, security 🔒, and smooth access control ⚡.

---

## ⚡ Features

- Track **income, expenses, and savings** 💵💳  
- Manage **budgets** effectively 📊  
- **Secure user authentication** 🔐 and role-based access 👥  
- Real-time **financial insights** 💹  
- Mobile-friendly and intuitive interface 📱🎨  
- Microservices architecture for **scalability and reliability** 🌐⚙️  

---

## 🛠️ Tech Stack

- **Frontend:** React / React Native 📱  
- **Backend Services:** Node.js / NestJS ⚡  
- **Database:** MySQL / PostgreSQL 🗄️  
- **API Gateway:** NestJS / Express 🌐  
- **Authentication:** JWT / OAuth2 🔑  

---

## 🚀 Getting Started

1. **Clone all repositories** in a parent folder:  
```bash
git clone https://github.com/your-username/budget-buddy-frontend.git
git clone https://github.com/your-username/budget-buddy-financial-management-service.git
git clone https://github.com/your-username/budget-buddy-api-gateway.git
git clone https://github.com/your-username/budget-buddy-user-management-service.git
````

2. **Install dependencies** in each repo:

```bash
npm install
```

3. **Configure environment variables** for each service (`.env` files).

4. **Run services**:

```bash
npm run start
```

5. **Launch frontend**:

```bash
npm run dev
```

---

## 📂 Project Structure

```
budget-buddy/
├─ budget-buddy-frontend/       # Mobile-friendly UI
├─ budget-buddy-financial-management-service/  # Income, expense, savings, budget
├─ budget-buddy-api-gateway/    # API gateway for all services
└─ budget-buddy-user-management-service/ # Authentication & user management
```

---
