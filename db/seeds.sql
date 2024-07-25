-- Insert data into departments table
INSERT INTO departments (name) VALUES 
('Engineering'), 
('HR'), 
('Sales');

-- Insert data into roles table
INSERT INTO roles (title, salary, department_id) VALUES 
('Software Engineer', 80000, (SELECT id FROM departments WHERE name = 'Engineering')),
('HR Manager', 60000, (SELECT id FROM departments WHERE name = 'HR')),
('Sales Representative', 50000, (SELECT id FROM departments WHERE name = 'Sales'));

-- Insert data into employees table
-- Insert employees with NULL manager_id first
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', (SELECT id FROM roles WHERE title = 'Software Engineer'), NULL),
('Jane', 'Smith', (SELECT id FROM roles WHERE title = 'HR Manager'), NULL),
('Mike', 'Johnson', (SELECT id FROM roles WHERE title = 'Sales Representative'), NULL);

-- Update employees to set manager_id after all employees are inserted
UPDATE employees
SET manager_id = (SELECT id FROM employees WHERE first_name = 'John' AND last_name = 'Doe')
WHERE first_name = 'Jane' AND last_name = 'Smith';

UPDATE employees
SET manager_id = (SELECT id FROM employees WHERE first_name = 'Jane' AND last_name = 'Smith')
WHERE first_name = 'Mike' AND last_name = 'Johnson';

