import { useState, useEffect } from 'react';
import { examService } from '../../services/examService';
import { academicService } from '../../services/academicService';
import { studentService } from '../../services/studentService';

const MarksEntry = () => {
  // Dropdown options
  const [academicYears, setAcademicYears] = useState([]);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Form selections
  const [filters, setFilters] = useState({
    academicYear: '',
    examination: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    maximumMarks: 100
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load initial dropdowns
  useEffect(() => {
    const init = async () => {
      try {
        const [yearsRes, subjectsRes] = await Promise.all([
          academicService.getAcademicYears(),
          academicService.getSubjects()
        ]);
        setAcademicYears(yearsRes.data || []);
        setSubjects(subjectsRes.data || []);
      } catch (err) {
        console.error('Failed to load initial metadata', err);
      }
    };
    init();
  }, []);

  // Fetch Exams and Classes when Academic Year changes
  useEffect(() => {
    if (filters.academicYear) {
      examService.getExamsByYear(filters.academicYear)
        .then(res => setExams(res.data || []))
        .catch(err => console.error(err));

      academicService.getClassesByYear(filters.academicYear)
        .then(res => setClasses(res.data || []))
        .catch(err => console.error(err));

      setFilters(prev => ({ ...prev, examination: '', classId: '', sectionId: '' }));
      setSections([]);
    }
  }, [filters.academicYear]);

  // Fetch Sections when Class changes
  useEffect(() => {
    if (filters.classId) {
      academicService.getSectionsByClass(filters.classId)
        .then(res => setSections(res.data || []))
        .catch(err => console.error(err));
      setFilters(prev => ({ ...prev, sectionId: '' }));
    }
  }, [filters.classId]);

  // Frontend grade preview helper matching backend calculation
  const calculateGradePreview = (obtained, max) => {
    if (!max || max <= 0) return 'N/A';
    const percentage = (obtained / max) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  // Fetch enrolled students
  const fetchStudents = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await studentService.getEnrolledStudents(filters.academicYear, filters.sectionId);
      const studentRows = res.data.map(enrollment => ({
        studentId: enrollment.student._id,
        name: enrollment.student.fullName,
        roll: enrollment.rollNumber,
        obtainedMarks: 0,
        remarks: ''
      }));

      setStudents(studentRows);
      if (studentRows.length === 0) setMessage({ type: 'info', text: 'No students found for this section.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load students.' });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId, value) => {
    const val = Math.max(0, Number(value));
    setStudents(prev => prev.map(s => 
      s.studentId === studentId ? { ...s, obtainedMarks: val } : s
    ));
  };

  const handleRemarkChange = (studentId, value) => {
    setStudents(prev => prev.map(s => 
      s.studentId === studentId ? { ...s, remarks: value } : s
    ));
  };

  // Submit marks to POST /api/exam/marks/batch
  const saveMarks = async () => {
    try {
      const payload = {
        examination: filters.examination,
        academicYear: filters.academicYear,
        classId: filters.classId,
        sectionId: filters.sectionId,
        subjectId: filters.subjectId,
        maximumMarks: Number(filters.maximumMarks),
        marksData: students.map(s => ({
          studentId: s.studentId,
          obtainedMarks: s.obtainedMarks,
          remarks: s.remarks
        }))
      };

      await examService.enterBatchMarks(payload);
      setMessage({ type: 'success', text: 'Marks recorded and graded successfully!' });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save marks.';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Enter Examination Marks</h1>

      {/* Filter Form */}
      <form onSubmit={fetchStudents} className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-slate-700">Academic Year</label>
          <select 
            className="mt-1 block w-36 border-slate-300 rounded-md shadow-sm"
            value={filters.academicYear}
            onChange={(e) => setFilters({...filters, academicYear: e.target.value})}
            required
          >
            <option value="">Select Year</option>
            {academicYears.map(y => <option key={y._id} value={y._id}>{y.year}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Examination</label>
          <select 
            className="mt-1 block w-40 border-slate-300 rounded-md shadow-sm disabled:bg-slate-100"
            value={filters.examination}
            onChange={(e) => setFilters({...filters, examination: e.target.value})}
            disabled={!filters.academicYear}
            required
          >
            <option value="">Select Exam</option>
            {exams.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Class</label>
          <select 
            className="mt-1 block w-32 border-slate-300 rounded-md shadow-sm disabled:bg-slate-100"
            value={filters.classId}
            onChange={(e) => setFilters({...filters, classId: e.target.value})}
            disabled={!filters.academicYear}
            required
          >
            <option value="">Select Class</option>
            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Section</label>
          <select 
            className="mt-1 block w-32 border-slate-300 rounded-md shadow-sm disabled:bg-slate-100"
            value={filters.sectionId}
            onChange={(e) => setFilters({...filters, sectionId: e.target.value})}
            disabled={!filters.classId}
            required
          >
            <option value="">Select Section</option>
            {sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Subject</label>
          <select 
            className="mt-1 block w-40 border-slate-300 rounded-md shadow-sm"
            value={filters.subjectId}
            onChange={(e) => setFilters({...filters, subjectId: e.target.value})}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Max Marks</label>
          <input 
            type="number"
            min="1"
            className="mt-1 block w-24 border-slate-300 rounded-md shadow-sm"
            value={filters.maximumMarks}
            onChange={(e) => setFilters({...filters, maximumMarks: e.target.value})}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
          {loading ? 'Loading...' : 'Load Students'}
        </button>
      </form>

      {message.text && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message.text}
        </div>
      )}

      {/* Marks Table */}
      {students.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase w-24">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Student Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase w-36">Obtained Marks</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase w-28">Grade Preview</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {students.map(s => (
                <tr key={s.studentId}>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{s.roll}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{s.name}</td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="number" 
                      min="0"
                      max={filters.maximumMarks}
                      className="w-24 border-slate-300 rounded-md text-center shadow-sm"
                      value={s.obtainedMarks}
                      onChange={(e) => handleMarkChange(s.studentId, e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-md">
                      {calculateGradePreview(s.obtainedMarks, filters.maximumMarks)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      placeholder="Optional remarks"
                      className="w-full border-slate-300 rounded-md text-sm shadow-sm"
                      value={s.remarks}
                      onChange={(e) => handleRemarkChange(s.studentId, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 bg-slate-50 border-t flex justify-end">
            <button onClick={saveMarks} className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 shadow-sm font-medium">
              Save Examination Marks
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksEntry;