# AI Assignment Evaluator (College Project)

A Web-Based Assignment Assessment System developed using Spring Boot, React, MySQL, and Google Gemini API.

The project source code is organized in the [`ai-assignment-evaluator/`](./ai-assignment-evaluator) directory:
- `frontend/` - React + Vite + Tailwind CSS User Interface (Times New Roman academic design)
- `backend/` - Spring Boot (Java 21) REST API with Google Gemini LLM Integration
- `database/` - MySQL Schema (`schema.sql`) and sample data (`data.sql`)

---

## 1. Project Abstract

In university academic courses, grading descriptive subjective assignments is time-consuming and often subject to grading inconsistency. This project, **AI Assignment Evaluator**, provides an automated conceptual assessment platform for educational institutions.

Instructors create assignments with question prompts, reference model answers, and evaluation criteria. Students submit their descriptive answers through their student portal. The system compares the conceptual meaning of the student's answer against the teacher's reference answer using Google Gemini LLM, computes a fair score out of 10, identifies which concepts were covered or missed, and produces constructive feedback. Instructors retain full control to inspect submissions, override marks, and provide teacher remarks.

---

## 2. Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Axios, Times New Roman typography.
- **Backend**: Java 21, Spring Boot 3.3.5, Spring Web, Spring Data JPA, Spring Security with JWT.
- **AI Integration**: Google Gemini API (`gemini-1.5-flash`), structured JSON response format.
- **Database**: MySQL 8.0 / Hibernate (with H2 in-memory profile for standalone demonstration).

---

## 3. System Modules

### A. Authentication Module
- Role-based login and registration for **Teachers** and **Students**.
- Password encryption using BCrypt.
- Session authorization using JSON Web Tokens (JWT).

### B. Teacher Module
- **Dashboard**: Class analytics (total students, total assignments, evaluated answers, class average).
- **Create Assignment**: Form to enter title, subject, question, reference model answer, max marks (default 10), and key concepts.
- **Submissions & Grading Review**: Table of all student answers. Teachers can review AI scores, edit/override marks, add remarks, and approve final grades.
- **CSV Export**: Export all student evaluation records to a CSV file.

### C. Student Module
- **Student Dashboard**: Available assignments, submission history, marks summary.
- **Answer Submission**: Text editor with word and character count. Supports multiple submission attempts.
- **Evaluation Report**: Detailed report displaying marks out of 10, percentage, correct concepts covered, missing concepts, incorrect statements, and AI feedback.

### D. AI Evaluation Engine
- Feeds question, model answer, key rubrics, and student answer to Google Gemini API.
- Evaluates conceptual accuracy rather than exact word-for-word matching.
- Returns structured JSON validated before database storage:
  - `marksObtained`
  - `maximumMarks`
  - `percentage`
  - `correctConcepts`
  - `missingConcepts`
  - `incorrectConcepts`
  - `feedback`
  - `improvementSuggestions`

---

## 4. Default Demo Accounts

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Teacher** | Prof. Alan Turing | `teacher@evaluator.edu` | `Password@123` |
| **Student** | Sarah Connor | `sarah@student.edu` | `Password@123` |
| **Student** | John Doe | `john@student.edu` | `Password@123` |

*(Quick-fill demo buttons are available on the login page).*

---

## 5. How to Run

### Step 1: Navigate to Project
```bash
cd ai-assignment-evaluator
```

### Step 2: Configure Environment (Optional)
To use a live Gemini API key:
```bash
export GEMINI_API_KEY="your_api_key_here"
```

### Step 3: Start Application
Run the startup script:
```bash
./run.sh
```

Or run manually:

#### Run Backend:
```bash
cd backend
mvn clean package -DskipTests
java -Dspring.profiles.active=dev -jar target/ai-assignment-evaluator-backend-1.0.0.jar
```
Backend runs at: `http://localhost:8080`

#### Run Frontend:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`
