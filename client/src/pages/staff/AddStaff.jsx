import { useState } from 'react';
import { UserPlus, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { staffService } from '../../services/staffService'; // Assuming you created this from our previous step

const AddStaff = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  // Initial state strictly matching backend expectations
  const [formData, setFormData] = useState({
    // User Authentication Fields (Required by staffController.js)
    username: '',
    password: '',
    role: 'STAFF', 
    
    // Staff Profile Fields (Required by Staff.js model)
    employeeId: '',
    fullName: '',
    email: '',
    contactNumber: '',
    designation: '',
    department: '',
    qualification: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      // API call to the backend route defined in staffRoutes.js -> createStaff controller
      const response = await staffService.createStaff(formData);
      
      setSubmitStatus({ 
        type: 'success', 
        message: response.message || 'Staff member and user account created successfully!'
      });
      
      // Reset form on success
      setFormData({
        username: '', password: '', role: 'STAFF', employeeId: '', fullName: '', 
        email: '', contactNumber: '', designation: '', department: '', 
        qualification: '', joiningDate: new Date().toISOString().split('T')[0], status: 'ACTIVE'
      });
    } catch (error) {
      // Display the specific error message sent from the backend
      setSubmitStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to onboard staff member. Please check your inputs.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
          <UserPlus className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add Staff Member</h1>
          <p className="text-sm text-slate-500">Register new teachers, administrative personnel, or operational staff</p>
        </div>
      </div>

      {/* Alert Banner */}
      {submitStatus.type === 'error' && (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">{submitStatus.message}</p>
        </div>
      )}
      {submitStatus.type === 'success' && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <p className="font-medium">{submitStatus.message}</p>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: User Account Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Account Details</h2>
          <p className="text-sm text-slate-500 mb-6">These credentials will be used by the staff member to log into the portal.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username *</label>
              <input 
                type="text" name="username" required
                value={formData.username} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
              <input 
                type="password" name="password" required
                value={formData.password} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">System Role *</label>
              <select 
                name="role" required
                value={formData.role} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
              >
                <option value="STAFF">General Staff</option>
                <option value="STAFF_MANAGER">Staff Manager</option>
                <option value="STUDENT_MANAGER">Student Manager</option>
                <option value="SCHOOL_MANAGER">School Manager</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select 
                name="status"
                value={formData.status} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
              >
                <option value="ACTIVE">Active</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Personal Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID *</label>
              <input 
                type="text" name="employeeId" required
                value={formData.employeeId} onChange={handleChange}
                placeholder="e.g., EMP-1001"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <input 
                type="text" name="fullName" required
                value={formData.fullName} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
              <input 
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number *</label>
              <input 
                type="text" name="contactNumber" required
                value={formData.contactNumber} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Designation *</label>
              <input 
                type="text" name="designation" required
                value={formData.designation} onChange={handleChange}
                placeholder="e.g., Senior Teacher"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
              <input 
                type="text" name="department" required
                value={formData.department} onChange={handleChange}
                placeholder="e.g., Science, Administration"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Qualification</label>
              <input 
                type="text" name="qualification"
                value={formData.qualification} onChange={handleChange}
                placeholder="e.g., M.Sc, B.Ed"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Joining Date</label>
              <input 
                type="date" name="joiningDate"
                value={formData.joiningDate} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Staff Member'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddStaff;