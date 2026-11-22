import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { CreateAssignmentPage } from './pages/CreateAssignmentPage';
import { ManageAssignmentsPage } from './pages/ManageAssignmentsPage';
import { TeacherSubmissionsPage } from './pages/TeacherSubmissionsPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { SubmitAssignmentPage } from './pages/SubmitAssignmentPage';
import { EvaluationResultPage } from './pages/EvaluationResultPage';

const RootRedirect = () => {
  const { isAuthenticated, isTeacher, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-500">Checking session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={isTeacher ? '/teacher/dashboard' : '/student/dashboard'} replace />;
};

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col font-serif">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<RootRedirect />} />

              {/* Teacher Routes */}
              <Route
                path="/teacher/dashboard"
                element={
                  <ProtectedRoute requiredRole="ROLE_TEACHER">
                    <TeacherDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/create-assignment"
                element={
                  <ProtectedRoute requiredRole="ROLE_TEACHER">
                    <CreateAssignmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/manage-assignments"
                element={
                  <ProtectedRoute requiredRole="ROLE_TEACHER">
                    <ManageAssignmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/submissions"
                element={
                  <ProtectedRoute requiredRole="ROLE_TEACHER">
                    <TeacherSubmissionsPage />
                  </ProtectedRoute>
                }
              />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute requiredRole="ROLE_STUDENT">
                    <StudentDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/submit/:assignmentId"
                element={
                  <ProtectedRoute requiredRole="ROLE_STUDENT">
                    <SubmitAssignmentPage />
                  </ProtectedRoute>
                }
              />

              {/* Shared Evaluation Results */}
              <Route
                path="/evaluations/:submissionId"
                element={
                  <ProtectedRoute>
                    <EvaluationResultPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <footer className="bg-white border-t border-gray-300 py-4 text-center text-xs text-gray-600">
            <p>AI Assignment Evaluator - College Project • Department of Computer Science</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
