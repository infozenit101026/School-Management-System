import { useState, useEffect } from 'react';
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
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentService } from '../../services/studentService';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState('overview');
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);

      try {
        let responseData = null;
        try {
          const res = await studentService.getStudentById(id);
          responseData = res.data?.data || res.data || res;
        } catch (e) {
          const allRes = await studentService.getAllStudents();
          const list = allRes.data?.data || allRes.data || allRes || [];
          responseData = list.find(item => {
            const st = item.student || item;
            return st._id === id || item._id === id || st.admissionNumber === id;
          });
        }

        if (responseData) {
          setStudentData(responseData);
        } else {
          setError('Student profile could not be found.');
        }
      } catch (err) {
        console.error('Error loading student profile:', err);
        setError('Failed to fetch student details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium text-sm">Fetching student profile...</p>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-xl text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-red-800">Profile Error</h2>
        <p className="text-sm text-red-600">{error || 'Student record not found.'}</p>
        <button
          onClick={() => navigate('/students')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Return to Student Directory
        </button>
      </div>
    );
  }

  const student = studentData.student || studentData;
  const enrollment = studentData.enrollment || studentData.currentEnrollment || {};
  const guardian = studentData.guardian || student.guardian || 
    (studentData.guardians && studentData.guardians[0]) || 
    (student.guardians && student.guardians[0]) || {};

  const fullName = student.fullName || `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'N/A';
  const className = enrollment.class?.name || enrollment.class?.className || studentData.className || 'N/A';
  const sectionName = enrollment.section?.name || enrollment.section?.sectionName || studentData.sectionName || 'N/A';
  const rollNumber = enrollment.rollNumber || student.rollNumber || 'Unassigned';
  const admissionNumber = student.admissionNumber || studentData.admissionNumber || 'N/A';
  const dob = student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : (student.dob || 'N/A');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Student Profile</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
        
        <div className="w-24 h-24 bg-slate-200 rounded-2xl flex items-center justify-center text-4xl font-bold text-slate-500 border-4 border-white shadow-sm z-10">
          {fullName.charAt(0)}
        </div>

        <div className="flex-1 z-10">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-900">{fullName}</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {student.status || 'ACTIVE'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 mt-2">
            <div className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-slate-400" /> {className} - {sectionName}</div>
            <div className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" /> Roll No: {rollNumber}</div>
            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Adm No: {admissionNumber}</div>
          </div>
        </div>

        <div className="flex gap-4 z-10 w-full md:w-auto mt-4 md:mt-0">
          <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 flex-1 md:flex-none text-center">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Attendance</p>
            <p className="text-lg font-bold text-emerald-600">N/A</p>
          </div>
          <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 flex-1 md:flex-none text-center">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Fee Status</p>
            <p className="text-lg font-bold text-blue-600">Active</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[350px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Personal Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-slate-500">Date of Birth</span>
                  <span className="col-span-2 font-medium text-slate-900">{dob}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-slate-500">Gender</span>
                  <span className="col-span-2 font-medium text-slate-900">{student.gender || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-slate-500">Blood Group</span>
                  <span className="col-span-2 font-medium text-slate-900">{student.bloodGroup || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Primary Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">{guardian.fullName || guardian.name || 'N/A'}</p>
                    <p className="text-slate-500 text-xs uppercase">{guardian.relationType || guardian.relation || 'Guardian'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-900">{guardian.contactNumber || guardian.phone || student.contactNumber || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-900">{guardian.email || 'N/A'}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="font-medium text-slate-900 leading-relaxed">{guardian.address || student.address || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
            <CheckCircle className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-lg font-medium text-slate-600">Module Connected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;