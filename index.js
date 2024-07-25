/ Variable Definitions & Dependencies
const inquirer = require('inquirer');
const db = require('./db/connection');

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    employee_tracker();
});

var employee_tracker = function () {
    inquirer.prompt([{
        // Begin Command Line
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Log Out']
    }]).then((answers) => {
        // Views the Department Table in the Database
        if (answers.prompt === 'View All Departments') {
            db.query(`SELECT * FROM departments`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Departments: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Roles') {
            db.query(`SELECT * FROM roles`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Roles: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Employees') {
            db.query(`SELECT * FROM employees`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Employees: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'Add A Department') {
            inquirer.prompt([{
                // Adding a Department
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Please Add A Department!');
                        return false;
                    }
                }
            }]).then((answers) => {
                db.query(`INSERT INTO departments (name) VALUES (?)`, [answers.department], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.department} to the database.`);
                    employee_tracker();
                });
            });
        } else if (answers.prompt === 'Add A Role') {
            // Fetch departments to use in the choices for the role
            db.query(`SELECT * FROM departments`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // Adding A Role
                        type: 'input',
                        name: 'role',
                        message: 'What is the name of the role?',
                        validate: roleInput => {
                            if (roleInput) {
                                return true;
                            } else {
                                console.log('Please Add A Role!');
                                return false;
                            }
                        }
                    },
                    {
                        // Adding the Salary
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary of the role?',
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log('Please Add A Salary!');
                                return false;
                            }
                        }
                    },
                    {
                        // Department
                        type: 'list',
                        name: 'department',
                        message: 'Which department does the role belong to?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].name);
                            }
                            return array;
                        }
                    }
                ]).then((answers) => {
                    // Find the department ID
                    let department = result.find(dept => dept.name === answers.department);

                    db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.role} to the database.`);
                        employee_tracker();
                    });
                });
            });
        } else if (answers.prompt === 'Add An Employee') {
            // Fetch roles and employees to use in the choices for the new employee
            db.query(`SELECT * FROM roles`, (err, rolesResult) => {
                if (err) throw err;

                db.query(`SELECT * FROM employees`, (err, employeesResult) => {
                    if (err) throw err;

                    inquirer.prompt([
                        {
                            // Adding Employee First Name
                            type: 'input',
                            name: 'firstName',
                            message: 'What is the employee\'s first name?',
                            validate: firstNameInput => {
                                if (firstNameInput) {
                                    return true;
                                } else {
                                    console.log('Please Add A First Name!');
                                    return false;
                                }
                            }
                        },
                        {
                            // Adding Employee Last Name
                            type: 'input',
                            name: 'lastName',
                            message: 'What is the employee\'s last name?',
                            validate: lastNameInput => {
                                if (lastNameInput) {
                                    return true;
                                } else {
                                    console.log('Please Add A Last Name!');
                                    return false;
                                }
                            }
                        },
                        {
                            // Adding Employee Role
                            type: 'list',
                            name: 'role',
                            message: 'What is the employee\'s role?',
                            choices: () => rolesResult.map(role => role.title)
                        },
                        {
                            // Adding Employee Manager
                            type: 'list',
                            name: 'manager',
                            message: 'Who is the employee\'s manager?',
                            choices: () => employeesResult.map(emp => emp.first_name + ' ' + emp.last_name)
                        }
                    ]).then((answers) => {
                        // Find the role and manager ID
                        let role = rolesResult.find(r => r.title === answers.role);
                        let manager = employeesResult.find(emp => emp.first_name + ' ' + emp.last_name === answers.manager);

                        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, manager.id], (err, result) => {
                            if (err) throw err;
                            console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`);
                            employee_tracker();
                        });
                    });
                });
            });
        } else if (answers.prompt === 'Update An Employee Role') {
            // Fetch roles and employees to use in the choices for updating an employee role
            db.query(`SELECT * FROM employees`, (err, employeesResult) => {
                if (err) throw err;

                db.query(`SELECT * FROM roles`, (err, rolesResult) => {
                    if (err) throw err;

                    inquirer.prompt([
                        {
                            // Choose an Employee to Update
                            type: 'list',
                            name: 'employee',
                            message: 'Which employee\'s role do you want to update?',
                            choices: () => employeesResult.map(emp => emp.first_name + ' ' + emp.last_name)
                        },
                        {
                            // Updating the New Role
                            type: 'list',
                            name: 'role',
                            message: 'What is their new role?',
                            choices: () => rolesResult.map(role => role.title)
                        }
                    ]).then((answers) => {
                        // Find the employee and role ID
                        let employee = employeesResult.find(emp => emp.first_name + ' ' + emp.last_name === answers.employee);
                        let role = rolesResult.find(r => r.title === answers.role);

                        db.query(`UPDATE employees SET role_id = ? WHERE id = ?`, [role.id, employee.id], (err, result) => {
                            if (err) throw err;
                            console.log(`Updated ${answers.employee}'s role in the database.`);
                            employee_tracker();
                        });
                    });
                });
            });
        } else if (answers.prompt === 'Log Out') {
            db.end();
            console.log("Good-Bye!");
        }
    });
};

