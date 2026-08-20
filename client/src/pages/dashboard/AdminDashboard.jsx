import { 
  Users, 
  GraduationCap, 
  CheckCircle, 
  Wallet,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Mock data for dashboard statistics
  const stats = [
    { 
      label: 'Total Students', 
      value: '1,245', 
      trend: '+12 this month', 
      icon: GraduationCap, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Total Staff', 
      value: '142', 
      trend: '+2 this month', 
      icon: Users, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    },
    { 
      label: "Today's Attendance", 
      value: '94.2%', 
      trend: '+1.2% from yesterday', 
      icon: CheckCircle, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Fee Collection', 
      value: '₹4.2M', 
      trend: '82% of target', 
      icon: Wallet, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    }
  ];

  const recentActivity = [
    { id: 1, text: 'New student admission: Rahul Verma (Class 9)', time: '2 hours ago' },
    { id: 2, text: 'Term 1 Syllabus updated for Class 10 Science', time: '4 hours ago' },
    { id: 3, text: 'Staff meeting scheduled for Friday at 3:00 PM', time: '5 hours ago' },
    { id: 4, text: 'Fee payment received from ADM-26001', time: 'Yesterday' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Admin'}!</h1>
          <p className="text-blue-100">Here is what is happening at your school today.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
          <p className="text-sm font-medium">Academic Year 2026-2027</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout for Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
          </div>
          <div className="p-6">
            <ul className="space-y-6">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-blue-600"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{activity.text}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {activity.time}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-2">
            <Link to="/admissions" className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-700">Admit Student</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>
            
            <Link to="/attendance/staff" className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-700">Mark Attendance</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/fees" className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-700">Collect Fees</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;