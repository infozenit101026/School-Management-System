import { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);

  // Sample data structured based on system requirements
  const feeCollectionData = [
    { category: 'School Fee', paid: 450000, pending: 80000, partial: 30000 },
    { category: 'Bus Fee', paid: 120000, pending: 25000, partial: 10000 },
    { category: 'Event Fee', paid: 45000, pending: 5000, partial: 2000 },
    { category: 'Tour Fee', paid: 90000, pending: 15000, partial: 5000 },
  ];

  const classPerformanceData = [
    { class: 'Class 6', avgMarks: 78, passRate: 94 },
    { class: 'Class 7', avgMarks: 72, passRate: 88 },
    { class: 'Class 8', avgMarks: 81, passRate: 96 },
    { class: 'Class 9', avgMarks: 69, passRate: 82 },
    { class: 'Class 10', avgMarks: 74, passRate: 91 },
  ];

  const feeStatusDistribution = [
    { name: 'Fully Paid', value: 65, color: '#10B981' },
    { name: 'Partially Paid', value: 20, color: '#F59E0B' },
    { name: 'Pending', value: 15, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Control Center</h1>
          <p className="text-sm text-slate-500 mt-1">
            Academic Year: <span className="font-semibold text-blue-600">2026-2027</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
            Export Analytics
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-xs">
            System Settings
          </button>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Students</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-slate-800">1,248</h2>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="text-emerald-600 font-semibold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +42
              </span>
              <span className="text-slate-400">New admissions this year</span>
            </div>
          </div>
        </div>

        {/* Total Staff */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Staff</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-slate-800">86</h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span>62 Teaching</span>
              <span>•</span>
              <span>24 Non-Teaching</span>
            </div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Attendance</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-slate-800">94.2%</h2>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> +1.2% from yesterday
            </div>
          </div>
        </div>

        {/* Total Fee Collected */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee Collection</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-slate-800">₹7,05,000</h2>
            <div className="flex items-center gap-1 mt-1 text-xs text-red-500 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> ₹1,25,000 Pending
            </div>
          </div>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fee Category Collection Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 mb-4">Fee Collection Breakdown</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeCollectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="paid" fill="#10B981" name="Paid (₹)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#EF4444" name="Pending (₹)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Overall Status Donut Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 mb-2">Overall Fee Status</h3>
          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeStatusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {feeStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {feeStatusDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Academic Performance & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Class Performance Comparison */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 mb-4">Class Performance Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="class" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="avgMarks" fill="#3B82F6" name="Average Marks (%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="passRate" fill="#8B5CF6" name="Pass Rate (%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Events Widget */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Upcoming Schedule</h3>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-xs text-blue-600 font-bold uppercase">Aug 25, 2026</p>
              <h4 className="text-sm font-semibold text-slate-800 mt-0.5">Quarterly Examinations</h4>
              <p className="text-xs text-slate-500">Classes 6 to 10</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-emerald-500">
              <p className="text-xs text-emerald-600 font-bold uppercase">Sep 02, 2026</p>
              <h4 className="text-sm font-semibold text-slate-800 mt-0.5">Science Exhibition Tour</h4>
              <p className="text-xs text-slate-500">Classes 8 and 9</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-amber-500">
              <p className="text-xs text-amber-600 font-bold uppercase">Sep 10, 2026</p>
              <h4 className="text-sm font-semibold text-slate-800 mt-0.5">Parent-Teacher Meeting</h4>
              <p className="text-xs text-slate-500">All Sections</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;