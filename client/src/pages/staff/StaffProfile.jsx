import { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Briefcase, 
  Award,
  BookOpen,
  Clock,
  ArrowLeft,
  CheckCircle,
  Banknote
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const StaffProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Gets the employee ID from the URL
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Data (Usually fetched via API based on the 'id' param)
  const staff = {
    id: id || 'EMP-1002',
    firstName: 'Michael',
    lastName: 'Chang',
    role: 'Senior Teacher',
    department: 'Mathematics',
    status: 'Active',
    joinDate: '12-May-2018',
    bloodGroup: 'B+',
    gender: 'Male',
    qualifications: 'M.Sc. Mathematics, B.Ed.',
    contact: {
      phone: '+91 9876543222',
      email: 'm.chang@school.edu',
      emergencyContact: 'Sarah Chang (Wife) - +91 9876543223',
      address: '45, Blue Ridge Apartments, Sector 4, New Delhi, India'
    },
    attendance: '98.2%',
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Staff Profile</h1>
      </div>

      {/* Top Identity Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
        
        {/* Avatar */}
        <div className="w-24 h-24 bg-slate-200 rounded-2xl flex items-center justify-center text-4xl font-bold text-slate-500 border-4 border-white shadow-sm z-10">
          {staff.firstName.charAt(0)}
        </div>

        {/* Identity Details */}
        <div className="flex-1 z-10">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-900">{staff.firstName} {staff.lastName}</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {staff.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 mt-2">
            <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {staff.role} ({staff.department})</div>
            <div className="flex items-center gap-1.5"><Award className="w-4 h-4 text-slate-400" /> {staff.qualifications}</div>
            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Emp ID: {staff.id}</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 z-10 w-full md:w-auto mt-4 md:mt-0">
          <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 flex-1 md:flex-none text-center">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Attendance</p>
            <p className="text-lg font-bold text-emerald-600">{staff.attendance}</p>
          </div>
          <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 flex-1 md:flex-none text-center">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Joined</p>
            <p className="text-lg font-bold text-indigo-600">{staff.joinDate.split('-')[2]}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto hide-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'schedule', label: 'Classes & Schedule', icon: BookOpen },
          { id: 'attendance', label: 'Attendance', icon: Clock },
          { id: 'payroll', label: 'Payroll', icon: Banknote }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[400px]">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Personal Details */}
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Personal Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-slate-500">Date of Joining</span>
                  <span className="col-span-2 font-medium text-slate-900">{staff.joinDate}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-slate-500">Gender</span>
                  <span className="col-span-2 font-medium text-slate-900">{staff.gender}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-slate-500">Blood Group</span>
                  <span className="col-span-2 font-medium text-slate-900">{staff.bloodGroup}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-900">{staff.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-900">{staff.contact.email}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="font-medium text-slate-900 leading-relaxed">{staff.contact.address}</span>
                </div>
                <div className="flex items-start gap-3 text-sm pt-2 border-t border-slate-50">
                  <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-slate-500 text-xs uppercase mb-0.5">Emergency Contact</span>
                    <span className="font-medium text-slate-900">{staff.contact.emergencyContact}</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'overview' && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
            <CheckCircle className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-lg font-medium text-slate-600 capitalize">{activeTab} Module</p>
            <p className="text-sm">This section is currently under construction.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default StaffProfile;