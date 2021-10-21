INSERT INTO department (dept_name)
VALUES  ('Engineering'),
        ('Finance'),
        ('Legal'),
        ('Sales'),
        ('Services');

INSERT INTO roles(title, salary, dept_id)
VALUES  ('Sales Lead', 100000, 4),
        ('Salesperson', 70000, 4),
        ('Lead Engineer', 150000, 1),
        ('Software Engineer', 120000, 1),
        ('Account Manager', 160000, 2),
        ('Accountant', 125000, 2),
        ('Legal Team Lead', 250000, 3),
        ('Lawyer', 190000, 3),
        ('Customer Services', 50000, 5);

INSERT INTO employee(first_name, last_name, role_id, manager_name)
VALUES  ('John', 'Doe', 1, ''),
        ('Mike', 'Chan', 2, 'John Doe'),
        ('Ashley', 'Rodriguez', 3, ''),
        ('Kevin', 'Tupik', 4, 'Ashley Rodriguez'),
        ('Kunal', 'Singh', 5, ''),
        ('Malia', 'Brown', 6, 'Kunal Singh'),
        ('Sarah', 'Lourd', 7, ''),
        ('Tom', 'Allen', 8, 'Sarah Lourd'),
        ('Jane', 'Austin', 9, 'John Doe');