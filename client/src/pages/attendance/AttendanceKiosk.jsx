import React, { useState, useEffect } from 'react';
import { submitKioskPunch } from '../../services/staffAttendanceService'; // Adjust path if needed

const AttendanceKiosk = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState(''); 
  const [currentTime, setCurrentTime] = useState(new Date());
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Run the live digital clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle the single Kiosk Punch
  const handlePunch = async (e) => {
    e.preventDefault(); // Prevent form submission reload

    if (!employeeId || !password) {
      setMessage({ text: 'Please enter both Employee ID and Password.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Sends { employeeId, password } as required by your backend
      const data = await submitKioskPunch({ employeeId, password });

      // Your backend returns different actions (CLOCKED_IN, CLOCKED_OUT) and a nice message!
      setMessage({ 
        text: data.message, 
        type: 'success' 
      });
      
      // Clear inputs for the next person
      setEmployeeId('');
      setPassword('');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Authentication failed. Please try again.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
      // Clear the message after 5 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '450px', width: '100%', textAlign: 'center' }}>
        
        {/* Live Clock Display */}
        <h1 style={{ fontSize: '3.5rem', margin: '0 0 10px 0', color: '#1f2937', fontWeight: 'bold' }}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '30px', fontWeight: '500' }}>
          {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '25px', color: '#374151' }}>Staff Time Clock</h2>

        {/* Status Message */}
        {message.text && (
          <div style={{ 
            padding: '15px', 
            marginBottom: '20px', 
            borderRadius: '8px', 
            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: message.type === 'success' ? '#065f46' : '#991b1b',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handlePunch}>
          <input
            type="text"
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            style={{ width: '100%', padding: '15px', marginBottom: '15px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1.1rem', boxSizing: 'border-box' }}
          />
          <input
            type="password"
            placeholder="Password / PIN"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '15px', marginBottom: '25px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1.1rem', boxSizing: 'border-box' }}
          />

          <button 
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '15px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '1.2rem', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Processing...' : 'Punch Time'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AttendanceKiosk;