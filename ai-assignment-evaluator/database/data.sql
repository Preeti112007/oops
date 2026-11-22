USE ai_evaluator_db;

-- Default login passwords: Password@123
INSERT INTO users (id, name, email, password, role, created_at)
VALUES 
(1, 'Prof. Alan Turing', 'teacher@evaluator.edu', '$2a$10$w3/s1q6r9f4yN8aX7dE8UuX4Qe3iRjK4vT8mP7oL9nK1oG0eA2.Oq', 'ROLE_TEACHER', NOW()),
(2, 'Sarah Connor', 'sarah@student.edu', '$2a$10$w3/s1q6r9f4yN8aX7dE8UuX4Qe3iRjK4vT8mP7oL9nK1oG0eA2.Oq', 'ROLE_STUDENT', NOW()),
(3, 'John Doe', 'john@student.edu', '$2a$10$w3/s1q6r9f4yN8aX7dE8UuX4Qe3iRjK4vT8mP7oL9nK1oG0eA2.Oq', 'ROLE_STUDENT', NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO assignments (id, title, subject, question, reference_answer, maximum_marks, keywords_criteria, deadline, teacher_id, created_at)
VALUES
(1, 
 'Polymorphism in Object-Oriented Programming', 
 'Computer Science', 
 'Explain the concept of Polymorphism in Object-Oriented Programming. Differentiate between compile-time (static) polymorphism and runtime (dynamic) polymorphism with suitable examples.', 
 'Polymorphism allows objects of different classes to be treated as instances of a common superclass, enabling a single interface to represent different underlying forms (one name, many forms). Compile-time (static) polymorphism is achieved via method overloading or operator overloading, where method invocation is resolved at compile time. Runtime (dynamic) polymorphism is achieved through method overriding and inheritance with virtual/overridden methods, where method resolution occurs dynamically at runtime using late binding or vtables.', 
 10, 
 'Polymorphism definition, compile-time polymorphism (method overloading), runtime polymorphism (method overriding), dynamic dispatch/late binding, code reusability.', 
 DATE_ADD(NOW(), INTERVAL 7 DAY), 
 1, 
 NOW()),

(2, 
 'ACID Properties in Relational Databases', 
 'Database Management Systems', 
 'Define ACID properties in DBMS. Explain how each property contributes to the reliability of database transactions.', 
 'ACID stands for Atomicity, Consistency, Isolation, and Durability. 1) Atomicity: All or nothing execution of a transaction. If any part fails, changes are rolled back. 2) Consistency: A transaction transitions the database from one valid state to another, preserving all integrity constraints. 3) Isolation: Concurrent execution of transactions leaves the database in the same state as if they were executed sequentially. 4) Durability: Once a transaction is committed, its effects are permanent, even in the event of a system crash or power outage.', 
 10, 
 'Atomicity (all or nothing/rollback), Consistency (integrity constraints/valid state), Isolation (concurrency control/serializability), Durability (persisted/survives failure).', 
 DATE_ADD(NOW(), INTERVAL 14 DAY), 
 1, 
 NOW())
ON DUPLICATE KEY UPDATE title=VALUES(title);
