import { useState, useEffect } from 'react';
import { academicService } from '../../services/academicService';
import { BookOpen, Calendar, Layers, Plus, Loader2, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const AcademicsManagement = () => {
  const [activeTab, setActiveTab] = useState('years');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Data States
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Form Inputs
  const [yearForm, setYearForm] = useState({ year: '', startDate: '', endDate: '', isActive: true });
  const [classForm, setClassForm] = useState({ name: '', academicYear: '' });
  const [sectionForm, setSectionForm] = useState({ name: '', academicYear: '', classId: '', capacity: 30 });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', type: 'THEORY', category: 'CORE' });

  useEffect(() => {
    fetchYears();
    fetchSubjects();
  }, []);

  const fetchYears = async () => {
    try {
      const res = await academicService.getAcademicYears();
      setAcademicYears(res.data || []);
    } catch (err) {
      console.error('Failed to load academic years', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await academicService.getSubjects();
      setSubjects(res.data || []);
    } catch (err) {
      console.error('Failed to load subjects', err);
    }
  };

  const handleClassYearChange = async (yearId) => {
    setClassForm({ ...classForm, academicYear: yearId });
  };

  const handleSectionYearChange = async (yearId) => {
    setSectionForm({ ...sectionForm, academicYear: yearId, classId: '' });
    if (yearId) {
      const res = await academicService.getClassesByYear(yearId);
      setClasses(res.data || []);
    } else {
      setClasses([]);
    }
  };

  // Submit Handlers
  const handleCreateYear = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await academicService.createAcademicYear(yearForm);
      setStatus({ type: 'success', message: 'Academic Year created successfully!' });
      setYearForm({ year: '', startDate: '', endDate: '', isActive: true });
      fetchYears();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to create Academic Year' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await academicService.createClass(classForm);
      setStatus({ type: 'success', message: 'Class created successfully!' });
      setClassForm({ name: '', academicYear: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to create Class' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await academicService.createSection(sectionForm);
      setStatus({ type: 'success', message: 'Section created successfully!' });
      setSectionForm({ name: '', academicYear: '', classId: '', capacity: 30 });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to create Section' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await academicService.createSubject(subjectForm);
      setStatus({ type: 'success', message: 'Subject created successfully!' });
      setSubjectForm({ name: '', code: '', type: 'THEORY', category: 'CORE' });
      fetchSubjects();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to create Subject' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Academic Structure Management</h1>
          <p className="text-sm text-slate-500">Configure Academic Years, Classes, Sections, and Subjects</p>
        </div>
      </div>

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
        {[
          { id: 'years', label: 'Academic Years', icon: Calendar },
          { id: 'classes', label: 'Classes', icon: BookOpen },
          { id: 'sections', label: 'Sections', icon: Layers },
          { id: 'subjects', label: 'Subjects', icon: FileText }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setStatus({ type: '', message: '' }); }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {/* Academic Year Tab */}
        {activeTab === 'years' && (
          <form onSubmit={handleCreateYear} className="space-y-4 max-w-lg">
            <h2 className="font-bold text-slate-800 text-lg mb-4">Add Academic Year</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year Name *</label>
              <input
                type="text"
                placeholder="e.g. 2026-2027"
                required
                value={yearForm.year}
                onChange={(e) => setYearForm({ ...yearForm, year: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={yearForm.startDate}
                  onChange={(e) => setYearForm({ ...yearForm, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={yearForm.endDate}
                  onChange={(e) => setYearForm({ ...yearForm, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create Academic Year
            </button>
          </form>
        )}

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <form onSubmit={handleCreateClass} className="space-y-4 max-w-lg">
            <h2 className="font-bold text-slate-800 text-lg mb-4">Add Class</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year *</label>
              <select
                required
                value={classForm.academicYear}
                onChange={(e) => handleClassYearChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="">Select Academic Year</option>
                {academicYears.map(y => <option key={y._id} value={y._id}>{y.year}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Class Name *</label>
              <input
                type="text"
                placeholder="e.g. Class 10"
                required
                value={classForm.name}
                onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create Class
            </button>
          </form>
        )}

        {/* Sections Tab */}
        {activeTab === 'sections' && (
          <form onSubmit={handleCreateSection} className="space-y-4 max-w-lg">
            <h2 className="font-bold text-slate-800 text-lg mb-4">Add Section</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year *</label>
              <select
                required
                value={sectionForm.academicYear}
                onChange={(e) => handleSectionYearChange(e.target.value)}
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
                disabled={!sectionForm.academicYear}
                value={sectionForm.classId}
                onChange={(e) => setSectionForm({ ...sectionForm, classId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white disabled:bg-slate-100"
              >
                <option value="">Select Class</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Section Name *</label>
              <input
                type="text"
                placeholder="e.g. A"
                required
                value={sectionForm.name}
                onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create Section
            </button>
          </form>
        )}

        {/* Subjects Tab */}
        {activeTab === 'subjects' && (
          <form onSubmit={handleCreateSubject} className="space-y-4 max-w-lg">
            <h2 className="font-bold text-slate-800 text-lg mb-4">Add Subject</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name *</label>
              <input
                type="text"
                placeholder="e.g. Mathematics"
                required
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject Code *</label>
              <input
                type="text"
                placeholder="e.g. MATH101"
                required
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 uppercase"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                <select
                  value={subjectForm.type}
                  onChange={(e) => setSubjectForm({ ...subjectForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="THEORY">Theory</option>
                  <option value="PRACTICAL">Practical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                <select
                  value={subjectForm.category}
                  onChange={(e) => setSubjectForm({ ...subjectForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="CORE">Core</option>
                  <option value="ELECTIVE">Elective</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create Subject
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AcademicsManagement;