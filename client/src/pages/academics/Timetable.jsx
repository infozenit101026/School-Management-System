import { useState, useEffect } from 'react';
import { academicService } from '../../services/academicService';
import { staffService } from '../../services/staffService';
import { timetableService } from '../../services/timetableService';
import { Clock, Plus, Trash2, Save, AlertCircle, CheckCircle, Calendar } from 'lucide-react';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const Timetable = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [staffList, setStaffList] = useState([]);

  // Selection state
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDay, setSelectedDay] = useState('MONDAY');

  // Timetable Periods State
  const [periods, setPeriods] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    academicService.getAcademicYears().then(res => setAcademicYears(res.data || []));
    academicService.getSubjects().then(res => setSubjects(res.data || []));
    staffService.getAllStaff().then(res => setStaffList(res.data || []));
  }, []);

  useEffect(() => {
    if (selectedYear) {
      academicService.getClassesByYear(selectedYear).then(res => setClasses(res.data || []));
      setSelectedClass('');
      setSelectedSection('');
      setSections([]);
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedClass) {
      academicService.getSectionsByClass(selectedClass).then(res => setSections(res.data || []));
      setSelectedSection('');
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass && selectedSection) {
      loadClassTimetable();
    }
  }, [selectedClass, selectedSection]);

  useEffect(() => {
    const dayData = weeklySchedule.find(s => s.day === selectedDay);
    if (dayData && dayData.periods) {
      setPeriods(dayData.periods.map(p => ({
        periodNumber: p.periodNumber,
        subject: p.subject?._id || p.subject,
        teacher: p.teacher?._id || p.teacher,
        startTime: p.startTime,
        endTime: p.endTime
      })));
    } else {
      setPeriods([]);
    }
  }, [selectedDay, weeklySchedule]);

  const loadClassTimetable = async () => {
    try {
      const res = await timetableService.getClassTimetable(selectedClass, selectedSection);
      setWeeklySchedule(res.data || []);
    } catch (err) {
      console.error('Failed to load timetable', err);
    }
  };

  const handleAddPeriod = () => {
    const nextNum = periods.length + 1;
    setPeriods([
      ...periods,
      { periodNumber: nextNum, subject: '', teacher: '', startTime: '09:00 AM', endTime: '09:45 AM' }
    ]);
  };

  const handleRemovePeriod = (index) => {
    const updated = periods.filter((_, i) => i !== index).map((p, i) => ({ ...p, periodNumber: i + 1 }));
    setPeriods(updated);
  };

  const handlePeriodChange = (index, field, value) => {
    const updated = [...periods];
    updated[index][field] = value;
    setPeriods(updated);
  };

  const handleSaveDaySchedule = async () => {
    if (!selectedYear || !selectedClass || !selectedSection) {
      setStatus({ type: 'error', message: 'Please select Academic Year, Class, and Section.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    const payload = {
      academicYear: selectedYear,
      classId: selectedClass,
      sectionId: selectedSection,
      day: selectedDay,
      periods
    };

    try {
      await timetableService.setDayTimetable(payload);
      setStatus({ type: 'success', message: `Schedule for ${selectedDay} saved successfully!` });
      loadClassTimetable();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to save timetable';
      setStatus({ type: 'error', message: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Timetable Scheduler</h1>
            <p className="text-sm text-slate-500">Configure weekly class schedules and teacher allocations</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Academic Year</label>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="">Select Year</option>
            {academicYears.map(y => <option key={y._id} value={y._id}>{y.year}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Class</label>
          <select
            disabled={!selectedYear}
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white disabled:bg-slate-100"
          >
            <option value="">Select Class</option>
            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Section</label>
          <select
            disabled={!selectedClass}
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white disabled:bg-slate-100"
          >
            <option value="">Select Section</option>
            {sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {status.message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 border ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="font-medium text-sm">{status.message}</p>
        </div>
      )}

      {selectedSection && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3.5 text-xs font-bold tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                  selectedDay === day
                    ? 'border-blue-600 bg-white text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Schedule for {selectedDay}
              </h2>
              <button
                onClick={handleAddPeriod}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Period Slot
              </button>
            </div>

            {periods.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-sm text-slate-500">No periods scheduled for {selectedDay}. Click "Add Period Slot" to begin.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {periods.map((p, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="col-span-1 text-center font-bold text-slate-600 text-sm">
                      #{p.periodNumber}
                    </div>

                    <div className="col-span-3">
                      <select
                        value={p.subject}
                        onChange={e => handlePeriodChange(index, 'subject', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-none focus:ring-1 focus:ring-blue-600"
                      >
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                      </select>
                    </div>

                    <div className="col-span-3">
                      <select
                        value={p.teacher}
                        onChange={e => handlePeriodChange(index, 'teacher', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-none focus:ring-1 focus:ring-blue-600"
                      >
                        <option value="">Select Teacher</option>
                        {staffList.map(st => <option key={st._id} value={st._id}>{st.fullName} ({st.employeeId})</option>)}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="09:00 AM"
                        value={p.startTime}
                        onChange={e => handlePeriodChange(index, 'startTime', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="09:45 AM"
                        value={p.endTime}
                        onChange={e => handlePeriodChange(index, 'endTime', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => handleRemovePeriod(index)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleSaveDaySchedule}
                disabled={loading || periods.length === 0}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {loading ? 'Saving...' : `Save ${selectedDay} Timetable`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;