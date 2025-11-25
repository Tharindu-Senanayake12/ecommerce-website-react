# 🛍️ **E-Commerce Clothing Store (MERN Stack)**

A fully functional and modern **E-Commerce Web Application** built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.
This project includes a complete **customer storefront**, **admin dashboard**, **product management**, **order management**, and secure **user authentication**.
Designed for clothing brands and online fashion stores.

---

## 🚀 **Features**

### 🔥 **Customer Features**

* 🛒 Browse products by category (Tops, Dresses, Pants, Denim, Skirts, Shorts, etc.)
* 🔍 Advanced filtering (category, size, color, availability)
* 👕 Product detail pages with images, description, price
* ❤️ Add to Cart & Manage Cart Items
* 🧾 Place Orders with address & payment details
* 👤 User Authentication (Login / Register)
* 🧾 View previous orders

### 🛠️ **Admin Features**

* 📦 Add, Update, Delete Products
* 📸 Image uploads via **Multer + Cloudinary**
* 📊 Admin Dashboard with statistics
* 🛍️ Order Management (view, update status)
* 👥 Manage Users
* 🔐 Admin Authorization & Secure Routes

---

## 🧩 **Tech Stack**

### **Frontend**

* React.js
* React Router
* Context API
* Tailwind CSS
* Axios
* Vite

### **Backend**

* Node.js
* Express.js
* MongoDB & Mongoose
* Multer (Image upload)
* Cloudinary (Image hosting)
* JWT (Authentication)

### **Other Tools**

* Git & GitHub
* VS Code

---

## 📂 **Project Structure**

```
Ecommerce-app/
│── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│
│── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
│
└── admin/ 
```

---

## ⚙️ **Installation & Setup**

### **1️⃣ Clone the repository**

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd ecommerce-app
```

---

### **2️⃣ Install dependencies**

#### Backend:

```bash
cd backEnd
npm install
```

#### Frontend:

```bash
cd ../frontend
npm install
```

---

### **3️⃣ Configure Environment Variables**

Create a `.env` file in the **backend** folder:

```
MONGO_URL=your_mongo_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

### **4️⃣ Run the Application**

#### Backend:

```bash
cd backEnd
npm start
```

#### Frontend:

```bash
cd frontend
npm run dev
```

---

## 🖼️ **Screenshots**

---


## 🏗️ **Future Improvements**

* Online payment gateway integration
* Admin analytics with charts
* Wishlist & reviews feature

