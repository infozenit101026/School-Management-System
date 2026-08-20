import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { timetableService } from '../../services/timetableService';
import { academicService } from '../../services/academicService';

const Timetable = ({ isStaffView = false }) => {
  const { user } = useAuth(); // Needed to fetch staff schedule by their ID
  const [schedule, setSchedule] = useState([]);
  
  // Dropdown Data States
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  // Filter States
  const [filters, setFilters] = useState({ academicYear: '', classId: '', sectionId: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = ['P1', 'P2', 'P3', 'P4', 'Break', 'P5', 'P6', 'P7'];

  // 1. Fetch Academic Years on Mount (For both Staff and Admin views)
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await academicService.getAcademicYears();
        setAcademicYears(res.data || []);
        
        // Auto-select the first active year for staff view
        if (isStaffView && res.data?.length > 0) {
          const activeYear = res.data.find(y => y.isActive) || res.data[0];
          setFilters(prev => ({ ...prev, academicYear: activeYear._id }));
        }
      } catch (error) {
        console.error("Failed to load academic years", error);
      }
    };
    fetchYears();
  }, [isStaffView]);

  // 2. Fetch Classes when Academic Year changes (Admin View Only)
  useEffect(() => {
    if (!isStaffView && filters.academicYear) {
      academicService.getClassesByYear(filters.academicYear)
        .then(res => setClasses(res.data || []))
        .catch(err => console.error(err));
      setFilters(prev => ({ ...prev, classId: '', sectionId: '' }));
      setSections([]);
    }
  }, [filters.academicYear, isStaffView]);

  // 3. Fetch Sections when Class changes (Admin View Only)
  useEffect(() => {
    if (!isStaffView && filters.classId) {
      academicService.getSectionsByClass(filters.classId)
        .then(res => setSections(res.data || []))
        .catch(err => console.error(err));
      setFilters(prev => ({ ...prev, sectionId: '' }));
    }
  }, [filters.classId, isStaffView]);

  // 4. Fetch the Timetable
  const fetchTimetable = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let res;
      if (isStaffView) {
        // Fetch teacher's specific schedule using getTeacherSchedule
        res = await timetableService.getTeacherSchedule(user._id, filters.academicYear);
      } else {
        // Fetch full class schedule using getClassTimetable[cite: 36]
        res = await timetableService.getClassTimetable(filters.classId, filters.sectionId);
      }

      // Format backend response (Array of days with periods) into a flat array for the UI grid[cite: 43]
      const formattedSchedule = [];
      if (res.data) {
        res.data.forEach(dayRecord => {
          dayRecord.periods.forEach(p => {
            formattedSchedule.push({
              day: dayRecord.day,
              period: `P${p.periodNumber || p.period}`, // Ensure your DB periods map to 1, 2, 3, etc.
              subject: p.subject?.name || 'N/A',
              teacher: p.teacher?.fullName || 'N/A',
              className: isStaffView && dayRecord.class ? `${dayRecord.class.name} - ${dayRecord.section?.name}` : null
            });
          });
        });
      }
      setSchedule(formattedSchedule);
      if (formattedSchedule.length === 0) setMessage({ type: 'info', text: 'No schedule found.' });
      
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to fetch timetable.' });
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch Staff timetable when academic year is set
  useEffect(() => {
    if (isStaffView && filters.academicYear && user?._id) {
      fetchTimetable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStaffView, filters.academicYear, user]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">
        {isStaffView ? 'My Timetable' : 'Class Timetable'}
      </h1>

      {/* Admin/Manager Filter - Hidden for Staff[cite: 43] */}
      {!isStaffView && (
        <form onSubmit={fetchTimetable} className="bg-white p-4 rounded-lg shadow-sm mb-6 border flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700">Academic Year</label>
            <select 
              className="mt-1 block w-40 border-slate-300 rounded-md shadow-sm"
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
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
            {loading ? 'Loading...' : 'View Schedule'}
          </button>
        </form>
      )}

      {message.text && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          {message.text}
        </div>
      )}

      {/* Timetable Grid[cite: 43] */}
      {schedule.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-center">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-slate-600 border-r w-32">Day / Period</th>
                {periods.map(p => (
                  <th key={p} className="px-4 py-3 text-sm font-medium text-slate-600 border-r min-w-[120px]">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {days.map(day => (
                <tr key={day}>
                  <td className="px-4 py-4 text-sm font-bold text-slate-800 bg-slate-50 border-r">{day}</td>
                  {periods.map(period => {
                    if (period === 'Break') return <td key={`${day}-${period}`} className="bg-slate-100 border-r text-slate-400 text-xs tracking-widest font-bold">BREAK</td>;
                    
                    const slot = schedule.find(s => s.day === day && s.period === period);
                    return (
                      <td key={`${day}-${period}`} className="px-2 py-3 border-r">
                        {slot ? (
                          <div className="flex flex-col items-center justify-center text-center">
                            <span className="font-semibold text-blue-700 text-sm leading-tight">{slot.subject}</span>
                            <span className="text-xs text-slate-500 mt-1">{isStaffView ? slot.className : slot.teacher}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Timetable;