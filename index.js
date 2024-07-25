const inquirer = require('inquirer');
const db = require('./db/connection');

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    employee_tracker();
});

var employee_tracker = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Log Out']
    }]).then((answers) => {
        if (answers.prompt === 'View All Departments') {
            db.query(`SELECT * FROM departments`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Departments: ");
                console.table(result.rows);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Roles') {
            db.query(`SELECT * FROM roles`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Roles: ");
                console.table(result.rows);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Employees') {
            db.query(`SELECT * FROM employees`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Employees: ");
                console.table(result.rows);
                employee_tracker();
            });
        } else if (answers.prompt === 'Add A Department') {
            inquirer.prompt([{
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
                db.query(`INSERT INTO departments (name) VALUES ($1)`, [answers.department], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.department} to the database.`)
                    employee_tracker();
                });
            })
        } else if (answers.prompt === 'Add A Role') {
            db.query(`SELECT * FROM departments`, (err, result) => {
                if (err) throw err;
                inquirer.prompt([
                    {
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
                        type: 'list',
                        name: 'department',
                        message: 'Which department does the role belong to?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.rows.length; i++) {
                                array.push(result.rows[i].name);
                            }
                            return array;
                        }
                    }
                ]).then((answers) => {
                    for (var i = 0; i < result.rows.length; i++) {
                        if (result.rows[i].name === answers.department) {
                            var department = result.rows[i];
                        }
                    }
                    db.query(`INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)`, [answers.role, answers.salary, department.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.role} to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Add An Employee') {
            db.query(`SELECT * FROM roles`, (err, result) => {
                if (err) throw err;
                db.query(`SELECT * FROM employees`, (err, employees) => {
                    if (err) throw err;
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'firstName',
                            message: 'What is the employees first name?',
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
                            type: 'input',
                            name: 'lastName',
                            message: 'What is the employees last name?',
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
                            type: 'list',
                            name: 'role',
                            message: 'What is the employees role?',
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.rows.length; i++) {
                                    array.push(result.rows[i].title);
                                }
                                return array;
                            }
                        },
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is the employees manager?',
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < employees.rows.length; i++) {
                                    array.push(employees.rows[i].first_name + ' ' + employees.rows[i].last_name);
                                }
                                return array;
                            }
                        }
                    ]).then((answers) => {
                        for (var i = 0; i < result.rows.length; i++) {
                            if (result.rows[i].title === answers.role) {
                                var role = result.rows[i];
                            }
                        }
                        for (var i = 0; i < employees.rows.length; i++) {
                            if ((employees.rows[i].first_name + ' ' + employees.rows[i].last_name) === answers.manager) {
                                var manager = employees.rows[i];
                            }
                        }
                        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [answers.firstName, answers.lastName, role.id, manager.id], (err, result) => {
                            if (err) throw err;
                            console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                            employee_tracker();
                        });
                    })
                });
            });
        } else if (answers.prompt === 'Update An Employee Role') {
            db.query(`SELECT * FROM employees`, (err, employees) => {
                if (err) throw err;
                db.query(`SELECT * FROM roles`, (err, roles) => {
                    if (err) throw err;
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'employee',
                            message: 'Which employees role do you want to update?',
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < employees.rows.length; i++) {
                                    array.push(employees.rows[i].first_name + ' ' + employees.rows[i].last_name);
                                }
                                return array;
                            }
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: 'What is their new role?',
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < roles.rows.length; i++) {
                                    array.push(roles.rows[i].title);
                                }
                                return array;
                            }
                        }
                    ]).then((answers) => {
                        for (var i = 0; i < employees.rows.length; i++) {
                            if ((employees.rows[i].first_name + ' ' + employees.rows[i].last_name) === answers.employee) {
                                var employee = employees.rows[i];
                            }
                        }
                        for (var i = 0; i < roles.rows.length; i++) {
                            if (roles.rows[i].title === answers.role) {
                                var role = roles.rows[i];
                            }
                        }
                        db.query(`UPDATE employees SET role_id = $1 WHERE id = $2`, [role.id, employee.id], (err, result) => {
                            if (err) throw err;
                            console.log(`Updated ${answers.employee}'s role to ${answers.role} in the database.`)
                            employee_tracker();
                        });
                    })
                });
            });
        } else {
            db.end();
            return;
        }
    })
}
