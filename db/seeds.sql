-- Insert data into the departments table
INSERT INTO departments (name) VALUES ('Sales');
INSERT INTO departments (name) VALUES ('Engineering');
INSERT INTO departments (name) VALUES ('Finance');
INSERT INTO departments (name) VALUES ('Legal');

-- Insert data into the roles table
INSERT INTO roles (title, salary, department_id) VALUES ('Sales Lead', 100000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Salesperson', 95000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Software Engineer', 120000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Accountant', 125000, 3);
INSERT INTO roles (title, salary, department_id) VALUES ('Legal Team Lead', 130000, 4);
INSERT INTO roles (title, salary, department_id) VALUES ('Lawyer', 110000, 4);

-- Insert data into the employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Camille', 'Klutsey', 1, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Roxann', 'Harris', 2, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Tyrone', 'Giles', 3, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Curtis', 'Harris', 4, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Terrell', 'Harris', 5, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('David', 'Klutsey', 6, 5);
