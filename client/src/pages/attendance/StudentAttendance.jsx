import { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { attendanceService } from '../../services/attendanceService';
import { academicService } from '../../services/academicService';

const StudentAttendance = () => {
  // Dropdown Data States
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  // Form Selection States
  const [filters, setFilters] = useState({
    academicYear: '',
    classId: '',
    sectionId: '',
    date: new Date().toISOString().split('T')[0], // Defaults to today
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Fetch Academic Years on Mount
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await academicService.getAcademicYears();
        setAcademicYears(res.data || []);
      } catch (error) {
        console.error("Failed to load academic years", error);
      }
    };
    fetchYears();
  }, []);

  // 2. Fetch Classes when Academic Year changes
  useEffect(() => {
    if (filters.academicYear) {
      academicService.getClassesByYear(filters.academicYear)
        .then(res => setClasses(res.data || []))
        .catch(err => console.error(err));
      setFilters(prev => ({ ...prev, classId: '', sectionId: '' })); // Reset downstream
      setSections([]);
    }
  }, [filters.academicYear]);

  // 3. Fetch Sections when Class changes
  useEffect(() => {
    if (filters.classId) {
      academicService.getSectionsByClass(filters.classId)
        .then(res => setSections(res.data || []))
        .catch(err => console.error(err));
      setFilters(prev => ({ ...prev, sectionId: '' }));
    }
  }, [filters.classId]);

  // 4. Fetch Enrolled Students for the grid
  const fetchStudents = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Calls getEnrolledStudents from your studentController[cite: 35]
      const res = await studentService.getEnrolledStudents(filters.academicYear, filters.sectionId);
      
      // Map enrollment records to our attendance UI state, defaulting everyone to 'PRESENT'
      const enrolledStudents = res.data.map(enrollment => ({
        studentId: enrollment.student._id,
        name: enrollment.student.fullName,
        roll: enrollment.rollNumber,
        status: 'PRESENT',
        remarks: ''
      }));
      
      setStudents(enrolledStudents);
      if (enrolledStudents.length === 0) {
        setMessage({ type: 'info', text: 'No students found for this section.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch students. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, newStatus) => {
    setStudents(students.map(stu => 
      stu.studentId === studentId ? { ...stu, status: newStatus } : stu
    ));
  };

  // 5. Submit the Attendance to the backend
  const saveAttendance = async () => {
    try {
      const payload = {
        academicYear: filters.academicYear,
        classId: filters.classId,
        sectionId: filters.sectionId,
        date: filters.date,
        // Match the structure expected by markBatchAttendance[cite: 33]
        attendanceData: students.map(s => ({
          studentId: s.studentId,
          status: s.status,
          remarks: s.remarks
        }))
      };

      await attendanceService.saveBatchAttendance(payload);
      setMessage({ type: 'success', text: 'Attendance recorded successfully!' });
      
    } catch (error) {
      // Handle the custom ATTENDANCE_WINDOW_CLOSED error[cite: 33]
      const errorMsg = error.response?.data?.message || 'Failed to save attendance.';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Student Attendance</h1>
      
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
        <form onSubmit={fetchStudents} className="flex flex-wrap gap-4 items-end">
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Academic Year</label>
            <select 
              className="mt-1 block w-32 border-slate-300 rounded-md shadow-sm"
              value={filters.academicYear}
              onChange={(e) => setFilters({...filters, academicYear: e.target.value})}
              required
            >
              <option value="">Select Year</option>
              {academicYears.map(year => (
                <option key={year._id} value={year._id}>{year.year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Class</label>
            <select 
              className="mt-1 block w-32 border-slate-300 rounded-md shadow-sm disabled:bg-slate-100"
              value={filters.classId}
              onChange={(e) => setFilters({...filters, classId: e.target.value})}
              required
              disabled={!filters.academicYear}
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Section</label>
            <select 
              className="mt-1 block w-32 border-slate-300 rounded-md shadow-sm disabled:bg-slate-100"
              value={filters.sectionId}
              onChange={(e) => setFilters({...filters, sectionId: e.target.value})}
              required
              disabled={!filters.classId}
            >
              <option value="">Select Section</option>
              {sections.map(sec => (
                <option key={sec._id} value={sec._id}>{sec.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Date</label>
            <input 
              type="date" 
              className="mt-1 block w-40 border-slate-300 rounded-md shadow-sm"
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Loading...' : 'Load Students'}
          </button>
        </form>
      </div>

      {/* Messaging / Alerts */}
      {message.text && (
        <div className={`p-4 mb-6 rounded-md ${
          message.type === 'error' ? 'bg-red-50 text-red-700' : 
          message.type === 'success' ? 'bg-green-50 text-green-700' : 
          'bg-blue-50 text-blue-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Attendance Grid */}
      {students.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-24">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {students.map((student) => (
                <tr key={student.studentId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">{student.roll}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2 border rounded-lg p-1 w-max mx-auto bg-slate-50">
                      {['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'EXCUSED'].map(status => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleStatusChange(student.studentId, status)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                            student.status === status 
                              ? status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800'
                              : status === 'ABSENT' ? 'bg-red-100 text-red-800'
                              : status === 'EXCUSED' ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                              : 'text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {status.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-slate-50 border-t flex justify-end">
            <button 
              onClick={saveAttendance}
              className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 shadow-sm font-medium"
            >
              Save Attendance
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;