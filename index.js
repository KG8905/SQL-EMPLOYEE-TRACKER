const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
user: process.env.DB_USER,
host: process.env.DB_HOST,
database: process.env.DB_NAME,
password: process.env.DB_PASSWORD,
port: process.env.DB_PORT,
});

// Function to query the database
const query = async (text, params) => {
const start = Date.now();
const res = await pool.query(text, params);
const duration = Date.now() - start;
console.log('executed query', { text, duration, rows: res.rowCount });
return res;
};

// Function to get all rows from a table
const getAllFromTable = async (table) => {
try {
    const result = await query(`SELECT * FROM ${table}`);
    return result.rows;
} catch (err) {
    console.error(`Error getting all from ${table}:`, err.message);
}
};

// Function to add an employee
const addEmployee = async (firstName, lastName, roleId, managerId) => {
try {
    const result = await query(
      'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [firstName, lastName, roleId, managerId]
    );
    return result.rows[0];
} catch (err) {
    console.error('Error adding employee:', err.message);
}
};

// Function to add a department
const addDepartment = async (name) => {
try {
    const result = await query(
      'INSERT INTO departments (name) VALUES ($1) RETURNING *',
    [name]
    );
    return result.rows[0];
} catch (err) {
    console.error('Error adding department:', err.message);
}
};

// Function to add a role
const addRole = async (title, salary, departmentId) => {
try {
    const result = await query(
      'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *',
    [title, salary, departmentId]
    );
    return result.rows[0];
} catch (err) {
    console.error('Error adding role:', err.message);
}
};

module.exports = {
query,
getAllFromTable,
addEmployee,
addDepartment,
addRole,
};
