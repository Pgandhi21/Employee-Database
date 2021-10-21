var mysql = require("mysql2");
var inquirer = require("inquirer");
require('console.table');


//Create connection  to database
const dbConnect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sqlroot",
    database: "employees_db",
    port: 3306 
});

dbConnect.connect(function(err) {
    if (err) throw err;
    questions();
})



function questions() {
    inquirer.prompt([
    {
        type: 'list',
        name: 'options',
        message: 'What you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee', 'Delete an employee', 'Quit'],
    },
])
    .then(function (response) {
        var res = response.options;
        switch (res) {
            case 'View all departments':
                return viewDept();
            case 'View all roles':
                return viewRoles();
            case 'View all employees':
                return viewEmployee();
            case 'Add a department':
                return  addDept();
            case 'Add a role':
                return addRole();
            case 'Add an employee':
                return addEmployee();
            case 'Delete an employee':
                return deleteEmployee();
            case 'Update an employee':
                return updateEmployee();
            case 'Quit':
                return dbConnect.end();
        }
    })
};

function viewDept() {
    dbConnect.query("SELECT id AS Id, dept_name AS Department FROM department", function(err, data) {
        if (err) throw err;
        console.table(data); 
        questions();
    })
};

function viewRoles() {
    dbConnect.query("SELECT roles.id AS Id, roles.title AS Title, roles.salary AS Salary, dept_id AS Department FROM roles", function(err, data) {
        if (err) throw err;
        console.table(data); 
        questions();
    })
};

const queryViewEmployee = 
"SELECT employee.id AS Employee_Id, employee.first_name AS First_Name, employee.last_name AS Last_Name, roles.title AS Title, roles.salary AS Salary, department.dept_name AS Department, employee.manager_name AS Manager FROM employee INNER JOIN roles ON employee.role_id = roles.id INNER JOIN department ON roles.dept_id = department.id";

function viewEmployee() {
    dbConnect.query(queryViewEmployee, function(err, data) {
        if (err) throw err;
        console.table(data); 
        questions();
    })
};

function addDept() {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'dept_name',
            message: "What is the name of the department?"
        },
    ])
    .then (function(response) {
        
        var addDeptQuery = "INSERT INTO department(dept_name) VALUES (?)"

        dbConnect.query(addDeptQuery, response.dept_name, function(err) {
            if (err) throw err;
            console.log(response.dept_name + " was added Successfully");
            questions();
        })
    })
} 

function addRole() {
    var deptOptions = [];

    dbConnect.query("SELECT * FROM department", function(err, data) {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            var deptData = {
                name: data[i].id + " - " +data[i].dept_name,
                value: {
                    deptID: data[i].id,
                    deptName: data[i].dept_name,
                }
            }
            deptOptions.push(deptData);
        }
    });

    inquirer.prompt ([
        {
            type: 'input',
            name: 'title',
            message: "What is the title of the role?"
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the salary of the role?"
        },
        {
            type: 'list',
            name: 'dept_name',
            message: "Which department does the role belong to?",
            choices: deptOptions
        },
    ])
    .then (function(response) {
        
        var addRoleQuery = "INSERT INTO roles(title, salary, dept_id) VALUES (?,?,?)";
        var roleInfo = [response.title, response.salary, response.dept_name.deptID];


        dbConnect.query(addRoleQuery, roleInfo, function(err) {
            if (err) throw err;
            console.log("Role was added Successfully");
            questions();
        });
    })
}; 

function addEmployee() {
    
    var roleOptions = [];

    dbConnect.query("SELECT title, id FROM roles", function(err, data) {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            var roleData = {
                name: data[i].id + " - " +data[i].title,
                value: {
                    roleID: data[i].id,
                    roleTitle: data[i].title,
                }
            }
            roleOptions.push(roleData);
        }
    });

    
    inquirer.prompt ([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the first name of the employee?"
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the last name of the employee?"
        },
        {
            type: 'input',
            name: 'manager',
            message: "Who is the manager of the employee?"
        },
        {
            type: 'list',
            name: 'title',
            message: "What is the role of the employee?",
            choices: roleOptions
        },
    ])
    .then (function(response) {

        var addEmployeeQuery = "INSERT INTO employee(first_name, last_name, role_id, manager_name) VALUES (?,?,?,?)"

        var employeeInfo = [response.first_name, response.last_name, response.title.roleID, response.manager_name];

        dbConnect.query(addEmployeeQuery, employeeInfo, function(err) {
            if (err) throw err;
            console.log("Employee was added Successfully");
            questions();
        })
    })
} 

function updateEmployee() {
    
    var roleOptionsID = [];

    dbConnect.query("SELECT * FROM roles", function(err, data) {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            var roleDataID = {
                name: data[i].id + " - " +data[i].title,
                value: {
                    roleID: data[i].id,
                    roleTitle: data[i].title,
                }
            };
            roleOptionsID.push(roleDataID);
        }
    });

    
    inquirer.prompt ([
        {
            type: 'list',
            name: 'title',
            message: "What is the role of the employee?",
            choices: roleOptionsID,
        },
    ])
    .then (function(response) {

        console.log(response);
    })
} 

// function updateEmployee() {
//     var employeeOptions = [];

//     const queryViewEmployee = "SELECT employee.first_name AS first_name, employee.last_name AS last_name, roles.title AS title, department.dept_name AS dept_name, employee.manager_name AS manager_name FROM employee INNER JOIN roles ON employee.role_id = roles.id INNER JOIN department ON roles.dept_id = department.id";

//     dbConnect.query(queryViewEmployee, function(err, data) {
//         if (err) throw err;

//         for (i = 0; i < data.length; i++) {
//             var employeeData = {
//                 name: data[i].first_name + " - " + data[i].last_name + " - " + data[i].title + " - " + data[i].dept_name + " - " + data[i].manager_name,
//                 value: {
//                     roleID: data[i].id,
//                     roleTitle: data[i].title,
//                 }
//             }
//             employeeOptions.push(employeeData);
//         }
//     });

//     var roleOption = [];

//     dbConnect.query("SELECT title, id FROM roles", function(err, data) {
//         if (err) throw err;

//         for (i = 0; i < data.length; i++) {
//             var roleData = {
//                 name: data[i].id + " - " +data[i].title,
//                 value: {
//                     roleID: data[i].id,
//                     roleTitle: data[i].title,
//                 }
//             }
//             console.log(roleData, 'line 243');
//             roleOption.push(roleData);
//         }
//     });
//     console.log(roleOption, 'line 247');
    
//     inquirer.prompt ([
//         {
//             type: 'list',
//             name: 'title',
//             message: "What is the role of the employee?",
//             choices: roleOption
//         },
//     ])
//     .then (function(response) {

//         console.log(response);
//         questions();
//     })
// } 

function deleteEmployee() {
    
    var employeeOptions = [];

    dbConnect.query("SELECT * FROM employee", function(err, data) {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            employeeOptions.push(data[i].first_name)
            //  + "-" + data[i].last_name + "-" + data[i].role_id + "-" + data[i].manager_name
        }
    })

    inquirer.prompt ([
        {
            type: 'input',
            name: 'first_name',
            message: "Which first name of the employee do you want to delete?"
        },
        {
            type: 'input',
            name: 'last_name',
            message: "Which last name of the employee do you want to delete?"
        },
    ])
    .then (function(response) {
        
        dbConnect.query("DELETE FROM employee WHERE first_name = ? and last_name = ?", [response.first_name, response.last_name], function(err) {
            if (err) throw err;
            console.log(response.first_name + " " + response.last_name + " was deleted Successfully");
            questions();
        })
    })
};
