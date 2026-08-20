import { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar as CalendarIcon,
  Search,
  Save,
  AlertCircle
} from 'lucide-react';

const StaffAttendance = () => {
  // Default to today's date (formatted for the input field)
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' or 'error'

  // Mock Staff Data
  const rawStaff = [
    { id: 'EMP-1001', name: 'Dr. Sarah Jenkins', role: 'Principal', department: 'Administration' },
    { id: 'EMP-1002', name: 'Michael Chang', role: 'Teacher', department: 'Mathematics' },
    { id: 'EMP-1003', name: 'Emily Rodriguez', role: 'Teacher', department: 'Science' },
    { id: 'EMP-1004', name: 'James Wilson', role: 'IT Support', department: 'IT' },
    { id: 'EMP-1005', name: 'Anita Desai', role: 'Librarian', department: 'Library' },
  ];

  // Initialize attendance state (Defaulting everyone to 'Present' for faster entry)
  const [attendanceData, setAttendanceData] = useState(() => {
    const initialData = {};
    rawStaff.forEach(staff => {
      initialData[staff.id] = 'Present'; 
    });
    return initialData;
  });

  // Handle status change
  const handleStatusChange = (empId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [empId]: status
    }));
  };

  // Filter staff for the search bar
  const filteredStaff = useMemo(() => {
    return rawStaff.filter(staff => 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      staff.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, rawStaff]);

  const handleSaveAttendance = async () => {
    setIsSubmitting(true);
    setSaveStatus(null);
    
    try {
      // Simulate API call: await api.post('/attendance/staff', { date: selectedDate, records: attendanceData });
      console.log(`Saving attendance for ${selectedDate}:`, attendanceData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('success');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Staff Attendance</h1>
            <p className="text-sm text-slate-500">Record and monitor daily employee attendance</p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
          <CalendarIcon className="w-5 h-5 text-slate-400" />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 cursor-pointer"
          />
        </div>
      </div>

      {/* Status Alert */}
      {saveStatus === 'success' && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <p className="font-medium">Attendance records saved successfully for {selectedDate}.</p>
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">Failed to save attendance. Please try again.</p>
        </div>
      )}

      {/* Controls Area */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search employee name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none text-sm"
          />
        </div>

        <button
          onClick={handleSaveAttendance}
          disabled={isSubmitting}
          className="w-full md:w-auto px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{staff.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{staff.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{staff.role} • {staff.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleStatusChange(staff.id, 'Present')}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                            attendanceData[staff.id] === 'Present'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(staff.id, 'Absent')}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                            attendanceData[staff.id] === 'Absent'
                              ? 'bg-red-50 border-red-200 text-red-700'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </button>
                        <button
                          onClick={() => handleStatusChange(staff.id, 'Late')}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                            attendanceData[staff.id] === 'Late'
                              ? 'bg-amber-50 border-amber-200 text-amber-700'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" /> Late
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                    No staff members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default StaffAttendance;