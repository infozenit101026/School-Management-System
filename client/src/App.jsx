import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LayoutWrapper from "./components/layout/LayoutWrapper";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import StudentProfile from "./pages/students/StudentProfile";
import StudentList from "./pages/students/StudentList";
import AddStudent from "./pages/students/AddStudent";
import StaffDirectory from "./pages/staff/StaffDirectory";
import StaffProfile from "./pages/staff/StaffProfile";
import AddStaff from "./pages/staff/AddStaff";
import AttendanceKiosk from "./pages/attendance/AttendanceKiosk";
import StaffAttendance from "./pages/staff/StaffAttendance";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import StudentAttendance from "./pages/attendance/StudentAttendance";
import Timetable from "./pages/academics/Timetable";

// Dummy imports for now (we will build these pages soon)
const StaffDashboard = () => <div className="text-2xl">Staff Dashboard</div>;
const NotFound = () => (
  <div className="text-2xl text-red-500">404 - Page Not Found</div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/kiosk" element={<AttendanceKiosk />} />

          {/* Protected Routes inside the Main Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<LayoutWrapper />}>
              {/* Universal routes (available to any logged-in user, UI changes based on role) */}
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/add" element={<AddStudent />} />
              <Route path="/students/:id" element={<StudentProfile />} />
              
              {/* Academics & Attendance Routes */}
              <Route path="/attendance" element={<StudentAttendance />} />
              <Route path="/timetable" element={<Timetable />} />

              {/* Admin & Manager Only Routes */}
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["ADMIN", "SCHOOL_MANAGER", "STAFF_MANAGER"]}
                  />
                }
              >
                <Route path="/staff" element={<StaffDirectory />} />
                <Route path="/staff/add" element={<AddStaff />} />
                <Route path="/staff/:id" element={<StaffProfile />} />
                <Route path="/staff/attendance" element={<StaffAttendance />} />
              </Route>

              {/* Admin & Student Manager Only Routes */}
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "ADMIN",
                      "SCHOOL_MANAGER",
                      "STUDENT_MANAGER",
                    ]}
                  />
                }
              >
                <Route
                  path="/admissions"
                  element={<div>Student Admissions</div>}
                />
                <Route path="/fees" element={<div>Fee Management</div>} />
              </Route>

              {/* Teacher/Staff Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={["STAFF"]} />}>
                <Route path="/my-classes" element={<div>My Classes</div>} />
                <Route
                  path="/my-timetable"
                  element={<Timetable isStaffView={true} />}
                />
              </Route>
            </Route>
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;