import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import MarksEntry from './pages/examinations/MarksEntry';
import AcademicsManagement from "./pages/academics/AcademicsManagement";
import TeacherAssignments from "./pages/academics/TeacherAssignments";
import EditStudent from './pages/students/EditStudent';
// Fallback / Dummy Pages
const NotFound = () => (
  <div className="text-2xl text-red-500 p-8">404 - Page Not Found</div>
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

          {/* Protected Routes inside Main Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<LayoutWrapper />}>
              {/* Universal Routes */}
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/add" element={<AddStudent />} />
              <Route path="/students/:id" element={<StudentProfile />} />
              <Route path="/students/:id/edit" element={<EditStudent />} />
              {/* Academics & Allocations Routes */}
              <Route path="/academics" element={<AcademicsManagement />} />
              <Route path="/academics/teacher-assignments" element={<TeacherAssignments />} />
              <Route path="/academics/class-teachers" element={<TeacherAssignments />} />
              <Route path="/staff/assignments" element={<TeacherAssignments />} />
              
              {/* Attendance & Scheduling */}
              <Route path="/attendance" element={<StudentAttendance />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/timetable/staff" element={<Timetable />} />
              <Route path="/examinations" element={<MarksEntry />} />
              <Route path="/examinations/marks" element={<MarksEntry />} />

              {/* Admin & Manager Restricted Routes */}
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

              {/* Admissions & Fees Restricted Routes */}
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
                  element={<div className="p-6">Student Admissions</div>}
                />
                <Route path="/fees" element={<div className="p-6">Fee Management</div>} />
              </Route>

              {/* Staff Portal Routes */}
              <Route element={<ProtectedRoute allowedRoles={["STAFF"]} />}>
                <Route path="/my-classes" element={<div className="p-6">My Classes</div>} />
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