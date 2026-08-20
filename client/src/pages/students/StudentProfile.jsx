import { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard, 
  GraduationCap, 
  CheckCircle,
  FileText,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Data (Usually fetched via API based on ID from URL params)
  const student = {
    id: 'ADM-26001',
    firstName: 'Aarav',
    lastName: 'Sharma',
    class: 'Class 10',
    section: 'A',
    rollNumber: '14',
    status: 'Active',
    dob: '15-Aug-2010',
    bloodGroup: 'O+',
    gender: 'Male',
    contact: {
      guardianName: 'Rajesh Sharma',
      relation: 'Father',
      phone: '+91 9876543210',
      email: 'rajesh.sharma@example.com',
      address: '123, Rosewood Apartments, Spring Valley, New Delhi, India'
    },
    attendance: '94.5%',
    feeStatus: 'Paid'
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
        <h1 className="text-2xl font-bold text-slate-800">Student Profile</h1>
      </div>

      {/* Top Identity Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
        
        {/* Avatar */}
        <div className="w-24 h-24 bg-slate-200 rounded-2xl flex items-center justify-center text-4xl font-bold text-slate-500 border-4 border-white shadow-sm z-10">
          {student.firstName.charAt(0)}
        </div>

        {/* Identity Details */}
        <div className="flex-1 z-10">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-900">{student.firstName} {student.lastName}</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {student.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 mt-2">
            <div className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-slate-400" /> {student.class} - {student.section}</div>
            <div className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" /> Roll No: {student.rollNumber}</div>
            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Adm No: {student.id}</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 z-10 w-full md:w-auto mt-4 md:mt-0">
          <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 flex-1 md:flex-none text-center">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Attendance</p>
            <p className="text-lg font-bold text-emerald-600">{student.attendance}</p>
          </div>
          <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 flex-1 md:flex-none text-center">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Fee Status</p>
            <p className="text-lg font-bold text-blue-600">{student.feeStatus}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto hide-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'academic', label: 'Academic Records', icon: GraduationCap },
          { id: 'fees', label: 'Fee Details', icon: CreditCard },
          { id: 'attendance', label: 'Attendance History', icon: Clock }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
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
                  <span className="text-slate-500">Date of Birth</span>
                  <span className="col-span-2 font-medium text-slate-900">{student.dob}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-slate-500">Gender</span>
                  <span className="col-span-2 font-medium text-slate-900">{student.gender}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-slate-500">Blood Group</span>
                  <span className="col-span-2 font-medium text-slate-900">{student.bloodGroup}</span>
                </div>
              </div>
            </div>

            {/* Guardian & Contact */}
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Primary Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">{student.contact.guardianName}</p>
                    <p className="text-slate-500 text-xs uppercase">{student.contact.relation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-900">{student.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-900">{student.contact.email}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="font-medium text-slate-900 leading-relaxed">{student.contact.address}</span>
                </div>
              </div>
            </div>
            
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'overview' && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
            <CheckCircle className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-lg font-medium text-slate-600">{tabLabel(activeTab)} Module Setup</p>
            <p className="text-sm">This section will connect to the respective backend microservice.</p>
          </div>
        )}

      </div>
    </div>
  );

  // Helper function for placeholder
  function tabLabel(id) {
    if (id === 'academic') return 'Academic';
    if (id === 'fees') return 'Fee Management';
    if (id === 'attendance') return 'Attendance tracking';
    return '';
  }
};

export default StudentProfile;