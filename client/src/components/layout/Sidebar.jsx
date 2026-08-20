import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  DollarSign,
  Clock,
  Bus,
  Calendar,
  FileText,
  Settings,
  ShieldCheck,
  Award
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  // Master navigation configuration categorized by roles
  const getNavItems = () => {
    const role = user?.role;
    const managerType = user?.managerType; // SCHOOL_MANAGER, STAFF_MANAGER, STUDENT_MANAGER

    // Base items accessible to all staff/admin users
    const items = [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
    ];

    if (role === 'ADMIN') {
      return [
        ...items,
        { label: 'System & Users', path: '/admin/users', icon: ShieldCheck },
        { label: 'Academics', path: '/academics', icon: BookOpen },
        { label: 'Students', path: '/students', icon: GraduationCap },
        { label: 'Admissions', path: '/admissions', icon: UserCheck },
        { label: 'Staff Management', path: '/staff', icon: Users },
        { label: 'Attendance', path: '/staff/attendance', icon: CalendarCheck },
        { label: 'Examinations & Marks', path: '/examinations', icon: Award },
        { label: 'Fee Management', path: '/fees', icon: DollarSign },
        { label: 'Payroll', path: '/payroll', icon: DollarSign },
        { label: 'Timetable', path: '/timetable', icon: Clock },
        { label: 'Transport', path: '/transport', icon: Bus },
        { label: 'Events & Tours', path: '/events', icon: Calendar },
        { label: 'Reports', path: '/reports', icon: FileText },
        { label: 'School Settings', path: '/admin/settings', icon: Settings },
      ];
    }

    if (role === 'MANAGER') {
      if (managerType === 'SCHOOL_MANAGER') {
        return [
          ...items,
          { label: 'Academic Overview', path: '/academics', icon: BookOpen },
          { label: 'Staff Assignments', path: '/staff/assignments', icon: Users },
          { label: 'Class Teachers', path: '/academics/class-teachers', icon: UserCheck },
          { label: 'Students', path: '/students', icon: GraduationCap },
          { label: 'Timetable', path: '/timetable', icon: Clock },
          { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
          { label: 'Marks', path: '/examinations', icon: Award },
          { label: 'Reports', path: '/reports', icon: FileText },
        ];
      }
      if (managerType === 'STAFF_MANAGER') {
        return [
          ...items,
          { label: 'Staff Directory', path: '/staff', icon: Users },
          { label: 'Staff Timetable', path: '/timetable/staff', icon: Clock },
          { label: 'Salary & Payroll', path: '/payroll', icon: DollarSign },
          { label: 'Reports', path: '/reports', icon: FileText },
        ];
      }
      if (managerType === 'STUDENT_MANAGER') {
        return [
          ...items,
          { label: 'Admissions', path: '/admissions', icon: UserCheck },
          { label: 'Students Directory', path: '/students', icon: GraduationCap },
          { label: 'Enrollments', path: '/students/enrollment', icon: BookOpen },
          { label: 'Fee Assignments', path: '/fees/assignments', icon: DollarSign },
          { label: 'Reports', path: '/reports', icon: FileText },
        ];
      }
    }

    if (role === 'STAFF') {
      return [
        ...items,
        { label: 'My Timetable', path: '/my-timetable', icon: Clock },
        { label: 'My Classes & Subjects', path: '/my-classes', icon: BookOpen },
        { label: 'Assigned Students', path: '/students', icon: GraduationCap },
        { label: 'Mark Attendance', path: '/attendance', icon: CalendarCheck },
        { label: 'Enter Marks', path: '/examinations/marks', icon: Award },
      ];
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800">
      {/* App Branding */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">
          S
        </div>
        <div>
          <h1 className="font-bold text-white leading-tight">School ERP</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">{user?.role || 'Portal'}</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;