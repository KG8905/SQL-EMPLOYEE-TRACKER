# SQL-EMPLOYEE-TRACKER
A comprehensive application for managing employee data, built with Node.js and PostgreSQL. The Employee Tracker allows users to manage departments, roles, and employees, providing a clean and user-friendly interface for all administrative tasks related to employee management.

Table of Contents
Features
Installation
Usage
API Routes
Database Schema
Contributing
License
Features
Manage Departments: View, add, update, and delete departments.
Manage Roles: View, add, update, and delete roles with associated salaries and department information.
Manage Employees: View, add, update, and delete employee records, including role and manager assignments.
Interactive Command Line Interface: An easy-to-use CLI for interacting with the database.
Installation
To set up the Employee Tracker application, follow these steps:

Clone the Repository

git clone https://github.com/yourusername/employee-tracker.git
cd employee-tracker
Install Dependencies

Ensure you have Node.js and npm installed. Then install the necessary packages:


npm install
Set Up the Database

Install PostgreSQL if it’s not already installed. Download PostgreSQL if needed.

Create a .env file in the root directory of the project and add your PostgreSQL credentials:

DB_USER=your_db_username
DB_HOST=localhost
DB_NAME=employee_tracker
DB_PASSWORD=your_db_password
DB_PORT=5432
Set up the database schema by running the SQL commands from the schema.sql file. Ensure you have PostgreSQL running and then execute the commands in the schema.sql file:


psql -U your_db_username -d employee_tracker -a -f path/to/schema.sql
Usage
Start the Application

Launch the server with Node.js:


node server.js
The application will be available at http://localhost:3000.

Interact with the Application

Open your web browser and go to http://localhost:3000 to interact with the application's web interface.
Use the provided CLI or web-based interfaces to manage your employee data.

Database Schema
The database schema includes the following tables:

Departments Table


CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);
Roles Table


CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
Employees Table

sql

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);
Contributing
Contributions are welcome! If you have suggestions, improvements, or bug fixes, please submit a pull request or open an issue.

Fork the repository.
Create a new branch for your changes.
Commit your changes with a clear description.
Push the changes to your forked repository.
Open a pull request to merge your changes.
License
This project is licensed under the MIT License. See the LICENSE file for more information.

Feel free to adjust the information as needed to fit the specifics of your project and setup.
