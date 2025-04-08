# HR Templates Generator

This is an **HR Templates Generator** project built with [Next.js](https://nextjs.org), designed to dynamically generate HR-related documents such as Offer Letters, Internship Letters, Promotion Letters, and more. All data is fetched dynamically from the database.

## Features

- 📄 **Dynamic PDF Generation**: Select an HR template, input required details, and generate a professional PDF.
- 🏗️ **Modular API System**: Each template has its own API route (e.g., `/api/templates/:id`).
- 🗃️ **Database Integration**: Uses a `templates` table to store categories, content, and placeholders, and a `users` table to manage user information.
- 🔄 **Real-Time Preview**: Updates the document preview dynamically based on user input.
- ⚡ **Optimized Performance**: Built with Next.js App Router for efficient server-side rendering and API handling.

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [MySQL](https://www.mysql.com/) (For database storage)

### Installation
Clone the repository and install dependencies:

```bash
git clone git remote add origin https://github.com/harsh12345-beep/HR-WEB.git

npm install
```

### Database Setup
1. Create a MySQL database named `hr_templates`.
2. Use the following table structures:

#### `templates` Table
```sql
CREATE TABLE templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255),
    name VARCHAR(255),
    content TEXT,
    placeholders JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `users` Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
#### `templates_hist` Table
```sql
CREATE TABLE templates_hist (
);


```
#### `emp_data` Table
```sql
CREATE TABLE emp_data (
);

```


### Running the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## API Routes
All data is fetched from the database using the following API endpoints:

- `GET /api/templates/:id` (Fetch a specific template by ID)
- `POST /api/templates` (Create a new template)
- `PUT /api/templates/:id` (Update an existing template)
- `DELETE /api/templates/:id` (Delete a template)
- `POST /api/auth/register` (User registration)
- `POST /api/auth/login` (User authentication)
- More to be added as needed...



## Learn More
For further details on Next.js, check out:
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## License
This project is licensed under the **MIT License**.

---

Made by **Brijesh Vishvakarma**