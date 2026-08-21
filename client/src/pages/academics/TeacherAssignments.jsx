import { useState, useEffect } from 'react';
import { academicService } from '../../services/academicService';
import { staffService } from '../../services/staffService';
import { UserCheck, BookOpen, CheckCircle, AlertCircle, Plus, Loader2, Trash2 } from 'lucide-react';

const TeacherAssignments = () => {
  const [activeTab, setActiveTab] = useState('classTeacher');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Common options
  const [academicYears, setAcademicYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [staffList, setStaffList] = useState([]);

  // Tab-specific options to prevent state conflicts
  const [ctClasses, setCtClasses] = useState([]);
  const [ctSections, setCtSections] = useState([]);
  const [stClasses, setStClasses] = useState([]);
  const [stSections, setStSections] = useState([]);

  // --- Class Teacher (Bulk) State ---
  const [ctCommonDetails, setCtCommonDetails] = useState({
    academicYear: '',
    classId: '',
  });

  const [ctBulkAssignments, setCtBulkAssignments] = useState([
    { sectionId: '', staff: '' }
  ]);

  // --- Subject Teacher (Bulk) State ---
  const [stCommonDetails, setStCommonDetails] = useState({
    academicYear: '',
    classId: '',
    sectionId: '',
  });

  const [stBulkAssignments, setStBulkAssignments] = useState([
    { subject: '', staff: '' }
  ]);

  useEffect(() => {
    academicService.getAcademicYears().then(res => setAcademicYears(res.data || []));
    academicService.getSubjects().then(res => setSubjects(res.data || []));
    staffService.getAllStaff().then(res => setStaffList(res.data || []));
  }, []);

  // ==========================================
  // HANDLERS: Class Teacher Form
  // ==========================================
  const handleCTYearChange = async (yearId) => {
    setCtCommonDetails({ academicYear: yearId, classId: '' });
    setCtClasses([]);
    setCtSections([]);
    setCtBulkAssignments([{ sectionId: '', staff: '' }]);
    if (yearId) {
      const res = await academicService.getClassesByYear(yearId);
      setCtClasses(res.data || []);
    }
  };

  const handleCTClassChange = async (classId) => {
    setCtCommonDetails(prev => ({ ...prev, classId }));
    setCtSections([]);
    setCtBulkAssignments([{ sectionId: '', staff: '' }]);
    if (classId) {
      const res = await academicService.getSectionsByClass(classId);
      setCtSections(res.data || []);
    }
  };

  const handleAddCTRow = () => {
    setCtBulkAssignments([...ctBulkAssignments, { sectionId: '', staff: '' }]);
  };

  const handleRemoveCTRow = (index) => {
    const updated = ctBulkAssignments.filter((_, i) => i !== index);
    setCtBulkAssignments(updated);
  };

  const handleCTAssignmentChange = (index, field, value) => {
    const updated = [...ctBulkAssignments];
    updated[index][field] = value;
    setCtBulkAssignments(updated);
  };

  const handleAssignClassTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const promises = ctBulkAssignments.map((assignment) =>
        academicService.assignClassTeacher({
          academicYear: ctCommonDetails.academicYear,
          classId: ctCommonDetails.classId,
          sectionId: assignment.sectionId,
          staff: assignment.staff,
        })
      );

      await Promise.all(promises);

      setStatus({ type: 'success', message: 'All Class Teachers assigned successfully!' });
      setCtCommonDetails({ academicYear: '', classId: '' });
      setCtBulkAssignments([{ sectionId: '', staff: '' }]);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to assign some class teachers. Please check for duplicate assignments.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS: Subject Teacher (Bulk) Form
  // ==========================================
  const handleSTYearChange = async (yearId) => {
    setStCommonDetails({ academicYear: yearId, classId: '', sectionId: '' });
    setStClasses([]);
    setStSections([]);
    if (yearId) {
      const res = await academicService.getClassesByYear(yearId);
      setStClasses(res.data || []);
    }
  };

  const handleSTClassChange = async (classId) => {
    setStCommonDetails(prev => ({ ...prev, classId, sectionId: '' }));
    setStSections([]);
    if (classId) {
      const res = await academicService.getSectionsByClass(classId);
      setStSections(res.data || []);
    }
  };

  const handleAddSTRow = () => {
    setStBulkAssignments([...stBulkAssignments, { subject: '', staff: '' }]);
  };

  const handleRemoveSTRow = (index) => {
    const updated = stBulkAssignments.filter((_, i) => i !== index);
    setStBulkAssignments(updated);
  };

  const handleSTAssignmentChange = (index, field, value) => {
    const updated = [...stBulkAssignments];
    updated[index][field] = value;
    setStBulkAssignments(updated);
  };

  const handleAssignSubjectTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const promises = stBulkAssignments.map((assignment) =>
        staffService.assignTeacherToSubject({
          academicYear: stCommonDetails.academicYear,
          classId: stCommonDetails.classId,
          sectionId: stCommonDetails.sectionId,
          subject: assignment.subject,
          staff: assignment.staff,
        })
      );

      await Promise.all(promises);

      setStatus({ type: 'success', message: 'All Subject Teachers assigned successfully!' });
      setStCommonDetails({ academicYear: '', classId: '', sectionId: '' });
      setStBulkAssignments([{ subject: '', staff: '' }]); // Reset rows
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to assign some teachers. Please check for duplicate assignments.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Teacher Allocations</h1>
          <p className="text-sm text-slate-500">Assign Class Teachers and Subject Teachers to Class Sections</p>
        </div>
      </div>

      {/* Status Notifications */}
      {status.message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 border ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium text-sm">{status.message}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => { setActiveTab('classTeacher'); setStatus({ type: '', message: '' }); }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'classTeacher' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Class Teacher Assignment
        </button>
        <button
          onClick={() => { setActiveTab('subjectTeacher'); setStatus({ type: '', message: '' }); }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'subjectTeacher' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Subject Teacher Assignment
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* ======================================= */}
        {/* TAB 1: CLASS TEACHER ASSIGNMENT         */}
        {/* ======================================= */}
        {activeTab === 'classTeacher' && (
          <form onSubmit={handleAssignClassTeacher} className="space-y-6 max-w-2xl">
            <h2 className="font-bold text-slate-800 text-lg mb-2">Assign Class Teachers</h2>
            
            {/* Common Details (Year, Class) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year *</label>
                <select
                  required
                  value={ctCommonDetails.academicYear}
                  onChange={e => handleCTYearChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Select Academic Year</option>
                  {academicYears.map(y => <option key={y._id} value={y._id}>{y.year}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class *</label>
                <select
                  required
                  disabled={!ctCommonDetails.academicYear}
                  value={ctCommonDetails.classId}
                  onChange={e => handleCTClassChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white disabled:bg-slate-100"
                >
                  <option value="">Select Class</option>
                  {ctClasses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Dynamic Bulk Assignment Rows */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Section & Teacher Assignments</label>
              
              {ctBulkAssignments.map((assignment, index) => (
                <div key={index} className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Section *</label>
                    <select
                      required
                      value={assignment.sectionId}
                      onChange={e => handleCTAssignmentChange(index, 'sectionId', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Select Section</option>
                      {ctSections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Class Teacher (Staff) *</label>
                    <select
                      required
                      value={assignment.staff}
                      onChange={e => handleCTAssignmentChange(index, 'staff', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Select Staff Member</option>
                      {staffList.map(st => <option key={st._id} value={st._id}>{st.fullName} ({st.employeeId})</option>)}
                    </select>
                  </div>

                  {ctBulkAssignments.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveCTRow(index)}
                      className="p-2 mb-0.5 bg-white text-red-500 border border-slate-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                      title="Remove row"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              <button 
                type="button" 
                onClick={handleAddCTRow}
                className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Another Section
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading || ctBulkAssignments.length === 0}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} 
                Save All Class Teachers
              </button>
            </div>
          </form>
        )}

        {/* ======================================= */}
        {/* TAB 2: SUBJECT TEACHER ASSIGNMENT       */}
        {/* ======================================= */}
        {activeTab === 'subjectTeacher' && (
          <form onSubmit={handleAssignSubjectTeacher} className="space-y-6 max-w-2xl">
            <h2 className="font-bold text-slate-800 text-lg mb-2">Assign Subject Teachers</h2>

            {/* Common Details (Year, Class, Section) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year *</label>
                <select
                  required
                  value={stCommonDetails.academicYear}
                  onChange={e => handleSTYearChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Select Year</option>
                  {academicYears.map(y => <option key={y._id} value={y._id}>{y.year}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class *</label>
                <select
                  required
                  disabled={!stCommonDetails.academicYear}
                  value={stCommonDetails.classId}
                  onChange={e => handleSTClassChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white disabled:bg-slate-100"
                >
                  <option value="">Select Class</option>
                  {stClasses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Section *</label>
                <select
                  required
                  disabled={!stCommonDetails.classId}
                  value={stCommonDetails.sectionId}
                  onChange={e => setStCommonDetails({ ...stCommonDetails, sectionId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white disabled:bg-slate-100"
                >
                  <option value="">Select Section</option>
                  {stSections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            {/* Dynamic Bulk Assignment Rows */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Subject & Teacher Assignments</label>
              
              {stBulkAssignments.map((assignment, index) => (
                <div key={index} className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Subject *</label>
                    <select
                      required
                      value={assignment.subject}
                      onChange={e => handleSTAssignmentChange(index, 'subject', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(sb => <option key={sb._id} value={sb._id}>{sb.name} ({sb.code})</option>)}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Teacher *</label>
                    <select
                      required
                      value={assignment.staff}
                      onChange={e => handleSTAssignmentChange(index, 'staff', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Select Staff</option>
                      {staffList.map(st => <option key={st._id} value={st._id}>{st.fullName}</option>)}
                    </select>
                  </div>

                  {stBulkAssignments.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSTRow(index)}
                      className="p-2 mb-0.5 bg-white text-red-500 border border-slate-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                      title="Remove row"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              <button 
                type="button" 
                onClick={handleAddSTRow}
                className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Another Subject
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading || stBulkAssignments.length === 0}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} 
                Save All Assignments
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeacherAssignments;