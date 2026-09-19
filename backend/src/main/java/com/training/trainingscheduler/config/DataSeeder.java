package com.training.trainingscheduler.config;

import com.training.trainingscheduler.entity.*;
import com.training.trainingscheduler.repository.CourseRepository;
import com.training.trainingscheduler.repository.QuizRepository;
import com.training.trainingscheduler.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds one admin, a few demo students, sample courses, and a practice
 * quiz + final exam per course on first run against an empty database. Safe
 * to run repeatedly -- skips whatever already exists (by email for users, by
 * title for courses, by course+type for quizzes). Certificate seed data is
 * added onto this runner in a later build step as that entity lands.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final QuizRepository quizRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled}")
    private boolean seedEnabled;

    @Value("${app.seed.admin-email}")
    private String adminEmail;

    @Value("${app.seed.admin-password}")
    private String adminPassword;

    public DataSeeder(UserRepository userRepository, CourseRepository courseRepository,
                       QuizRepository quizRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.quizRepository = quizRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled) {
            return;
        }

        seedUser(adminEmail, "Admin User", adminPassword, Role.ADMIN);
        seedUser("hari@example.com", "Hari Preyadharshan", "Student@123", Role.STUDENT);
        seedUser("priya@example.com", "Priya Sharma", "Student@123", Role.STUDENT);
        seedUser("rahul@example.com", "Rahul Kumar", "Student@123", Role.STUDENT);

        Course java = seedCourse("Java Programming", "Programming", "Beginner", "8 weeks",
                "Learn core Java syntax, OOP concepts and build real console applications.", 24,
                "https://picsum.photos/seed/java-programming/600/360");
        Course spring = seedCourse("Spring Boot", "Programming", "Intermediate", "6 weeks",
                "Build production-ready REST APIs with Spring Boot, JPA and Spring Security.", 20,
                "https://picsum.photos/seed/spring-boot/600/360");
        Course react = seedCourse("React JS", "Web Development", "Beginner", "6 weeks",
                "Build modern single-page applications with React, hooks and React Router.", 18,
                "https://picsum.photos/seed/react-js/600/360");
        Course postgres = seedCourse("PostgreSQL", "Database", "Intermediate", "4 weeks",
                "Master relational database design, SQL queries and PostgreSQL administration.", 15,
                "https://picsum.photos/seed/postgresql/600/360");
        Course python = seedCourse("Python Basics", "Programming", "Beginner", "5 weeks",
                "An introduction to Python programming, data structures and scripting.", 16,
                "https://picsum.photos/seed/python-basics/600/360");

        seedQuiz(java, QuizType.PRACTICE, "Introduction to Java", 30, 70, List.of(
                new QuestionSeed("What is Java?", List.of("A programming language", "A database", "An operating system", "A web browser"), 0),
                new QuestionSeed("Which keyword is used to create a class in Java?", List.of("class", "Class", "create", "new"), 0),
                new QuestionSeed("What does JDK stand for?", List.of("Java Development Kit", "Java Desktop Kit", "Java Data Kit", "Java Design Kit"), 0),
                new QuestionSeed("Which of these is NOT a primitive data type in Java?", List.of("int", "boolean", "String", "char"), 2),
                new QuestionSeed("What is the entry point of a Java program?", List.of("start()", "main()", "run()", "init()"), 1)
        ));
        seedQuiz(java, QuizType.FINAL_EXAM, "Java Final Exam", 30, 70, List.of(
                new QuestionSeed("What is the correct way to declare a variable in Java?", List.of("int x = 5;", "variable x = 5;", "x = 5;", "declare x = 5;"), 0),
                new QuestionSeed("Which of the following is a Java OOP concept?", List.of("Compilation", "Inheritance", "Debugging", "Execution"), 1),
                new QuestionSeed("What does the \"static\" keyword mean in Java?", List.of("The variable changes every time", "Belongs to the class not the instance", "It is a constant value", "It cannot be used in methods"), 1),
                new QuestionSeed("Which method is automatically called when an object is created?", List.of("start()", "init()", "constructor()", "Constructor"), 3),
                new QuestionSeed("What is the size of int in Java?", List.of("8 bits", "16 bits", "32 bits", "64 bits"), 2)
        ));

        seedGenericQuizPair(spring, "Spring Boot Basics");
        seedGenericQuizPair(react, "React Basics");
        seedGenericQuizPair(postgres, "SQL Basics");
        seedGenericQuizPair(python, "Python Basics");
    }

    private void seedUser(String email, String fullName, String rawPassword, Role role) {
        if (userRepository.existsByEmail(email)) {
            return;
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }

    private Course seedCourse(String title, String category, String level, String duration,
                               String description, int totalLessons, String thumbnailUrl) {
        return courseRepository.findAll().stream()
                .filter(c -> c.getTitle().equals(title))
                .findFirst()
                .orElseGet(() -> {
                    Course course = new Course();
                    course.setTitle(title);
                    course.setCategory(category);
                    course.setLevel(level);
                    course.setDuration(duration);
                    course.setDescription(description);
                    course.setTotalLessons(totalLessons);
                    course.setThumbnailUrl(thumbnailUrl);
                    course.setStatus(CourseStatus.ACTIVE);
                    return courseRepository.save(course);
                });
    }

    // Generic 3-question placeholder pair for courses without hand-authored
    // question banks yet -- keeps every course demoable end-to-end.
    private void seedGenericQuizPair(Course course, String chapter) {
        List<QuestionSeed> generic = List.of(
                new QuestionSeed("Which best describes " + course.getTitle() + "?", List.of(course.getCategory(), "Unrelated topic", "Not a technology", "None of these"), 0),
                new QuestionSeed("What level is this course aimed at?", List.of(course.getLevel(), "Expert only", "Not applicable", "None of these"), 0),
                new QuestionSeed("How long is this course?", List.of(course.getDuration(), "1 day", "1 year", "Not specified"), 0)
        );
        seedQuiz(course, QuizType.PRACTICE, chapter, 30, 70, generic);
        seedQuiz(course, QuizType.FINAL_EXAM, course.getTitle() + " Final Exam", 30, 70, generic);
    }

    private void seedQuiz(Course course, QuizType type, String chapter, int timeLimitSeconds,
                           int passScorePercent, List<QuestionSeed> questionSeeds) {
        if (quizRepository.findFirstByCourseIdAndType(course.getId(), type).isPresent()) {
            return;
        }

        Quiz quiz = new Quiz();
        quiz.setCourse(course);
        quiz.setType(type);
        quiz.setChapter(chapter);
        quiz.setTimeLimitSeconds(timeLimitSeconds);
        quiz.setPassScorePercent(passScorePercent);
        quiz.setStatus(QuizStatus.ACTIVE);

        for (QuestionSeed qs : questionSeeds) {
            Question question = new Question();
            question.setQuiz(quiz);
            question.setText(qs.text());
            question.setOptions(qs.options());
            question.setCorrectIndex(qs.correctIndex());
            quiz.getQuestions().add(question);
        }

        quizRepository.save(quiz);
    }

    private record QuestionSeed(String text, List<String> options, int correctIndex) {
    }

}
