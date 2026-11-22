package com.evaluator.config;

import com.evaluator.entity.Assignment;
import com.evaluator.entity.Role;
import com.evaluator.entity.User;
import com.evaluator.repository.AssignmentRepository;
import com.evaluator.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           AssignmentRepository assignmentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            logger.info("Database is empty. Seeding initial users and assignments...");

            // 1. Create Default Teacher
            User teacher = new User();
            teacher.setName("Prof. Alan Turing");
            teacher.setEmail("teacher@evaluator.edu");
            teacher.setPassword(passwordEncoder.encode("Password@123"));
            teacher.setRole(Role.ROLE_TEACHER);
            teacher = userRepository.save(teacher);

            // 2. Create Default Students
            User student1 = new User();
            student1.setName("Sarah Connor");
            student1.setEmail("sarah@student.edu");
            student1.setPassword(passwordEncoder.encode("Password@123"));
            student1.setRole(Role.ROLE_STUDENT);
            userRepository.save(student1);

            User student2 = new User();
            student2.setName("John Doe");
            student2.setEmail("john@student.edu");
            student2.setPassword(passwordEncoder.encode("Password@123"));
            student2.setRole(Role.ROLE_STUDENT);
            userRepository.save(student2);

            // 3. Create Sample Assignments
            Assignment assignment1 = new Assignment();
            assignment1.setTitle("Polymorphism in Object-Oriented Programming");
            assignment1.setSubject("Computer Science");
            assignment1.setQuestion("Explain the concept of Polymorphism in Object-Oriented Programming. Differentiate between compile-time (static) polymorphism and runtime (dynamic) polymorphism with suitable examples.");
            assignment1.setReferenceAnswer("Polymorphism allows objects of different classes to be treated as instances of a common superclass, enabling a single interface to represent different underlying forms (one name, many forms). Compile-time (static) polymorphism is achieved via method overloading or operator overloading, where method invocation is resolved at compile time. Runtime (dynamic) polymorphism is achieved through method overriding and inheritance with virtual/overridden methods, where method resolution occurs dynamically at runtime using late binding or vtables.");
            assignment1.setMaximumMarks(10);
            assignment1.setKeywordsCriteria("Polymorphism definition, compile-time polymorphism (method overloading), runtime polymorphism (method overriding), dynamic dispatch/late binding, code reusability.");
            assignment1.setDeadline(LocalDateTime.now().plusDays(7));
            assignment1.setTeacher(teacher);
            assignmentRepository.save(assignment1);

            Assignment assignment2 = new Assignment();
            assignment2.setTitle("ACID Properties in Relational Databases");
            assignment2.setSubject("Database Management Systems");
            assignment2.setQuestion("Define ACID properties in DBMS. Explain how each property contributes to the reliability of database transactions.");
            assignment2.setReferenceAnswer("ACID stands for Atomicity, Consistency, Isolation, and Durability. 1) Atomicity: All or nothing execution of a transaction. If any part fails, changes are rolled back. 2) Consistency: A transaction transitions the database from one valid state to another, preserving all integrity constraints. 3) Isolation: Concurrent execution of transactions leaves the database in the same state as if they were executed sequentially. 4) Durability: Once a transaction is committed, its effects are permanent, even in the event of a system crash or power outage.");
            assignment2.setMaximumMarks(10);
            assignment2.setKeywordsCriteria("Atomicity (all or nothing/rollback), Consistency (integrity constraints/valid state), Isolation (concurrency control/serializability), Durability (persisted/survives failure).");
            assignment2.setDeadline(LocalDateTime.now().plusDays(14));
            assignment2.setTeacher(teacher);
            assignmentRepository.save(assignment2);

            logger.info("Sample users and assignments successfully seeded!");
            logger.info("Teacher: teacher@evaluator.edu / Password@123");
            logger.info("Student: sarah@student.edu / Password@123");
        }
    }
}
