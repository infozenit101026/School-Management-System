import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import { 
  Clock, 
  CheckCircle2, 
  LogOut, 
  Calendar, 
  Loader2, 
  UserCheck, 
  FileText 
} from 'lucide-react';

const StaffAttendance = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [todayRecord, setTodayRecord] = useState(null);

  // Fetch Attendance Records
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getAttendanceLogs();
      const data = response.data || [];
      setLogs(data);

      // Check if logged-in user already clocked in today
      const todayStr = new Date().toISOString().split('T')[0];
      const todayEntry = data.find((log) => {
        const logDate = new Date(log.date).toISOString().split('T')[0];
        return logDate === todayStr;
      });

      setTodayRecord(todayEntry || null);
    } catch (err) {
      console.error('Failed to load attendance logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Clock-In Handler
  const handleClockIn = async () => {
    try {
      setActionLoading(true);
      await attendanceService.clockIn({ remarks, status: 'PRESENT' });
      setRemarks('');
      await fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || 'Clock-in failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Clock-Out Handler
  const handleClockOut = async () => {
    try {
      setActionLoading(true);
      await attendanceService.clockOut();
      await fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || 'Clock-out failed.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Staff Attendance</h1>
          <p className="text-sm text-slate-500">Record daily check-ins and view attendance logs</p>
        </div>
      </div>

      {/* Action Box: Clock In / Clock Out */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-600" /> Today's Attendance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Form & Actions */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Remarks / Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Arrived early, Lab duty..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={!!todayRecord?.checkInTime}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none disabled:bg-slate-50"
              />
            </div>

            <div className="flex gap-3">
              {!todayRecord ? (
                <button
                  onClick={handleClockIn}
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm flex items-center gap-2 shadow-sm transition-colors"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Clock In
                </button>
              ) : !todayRecord.checkOutTime ? (
                <button
                  onClick={handleClockOut}
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg text-sm flex items-center gap-2 shadow-sm transition-colors"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                  Clock Out
                </button>
              ) : (
                <span className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg font-medium">
                  Completed for today
                </span>
              )}
            </div>
          </div>

          {/* Current Status Badge */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Status Summary</span>
            {todayRecord ? (
              <div className="space-y-1 text-sm">
                <p className="text-slate-700">
                  <strong className="text-slate-900">Check-in:</strong> {new Date(todayRecord.checkInTime).toLocaleTimeString()}
                </p>
                <p className="text-slate-700">
                  <strong className="text-slate-900">Check-out:</strong> {todayRecord.checkOutTime ? new Date(todayRecord.checkOutTime).toLocaleTimeString() : 'Pending'}
                </p>
                {todayRecord.remarks && (
                  <p className="text-slate-500 text-xs italic">"{todayRecord.remarks}"</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">You have not clocked in today yet.</p>
            )}
          </div>

        </div>
      </div>

      {/* Attendance Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" /> Attendance History
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Check-in</th>
                <th className="px-6 py-4">Check-out</th>
                <th className="px-6 py-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-600" /> Loading logs...
                    </div>
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{log.staffId?.username || user?.username || 'Staff'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs rounded-md font-medium">
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {log.checkInTime ? new Date(log.checkInTime).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {log.checkOutTime ? new Date(log.checkOutTime).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{log.remarks || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No attendance records found.
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