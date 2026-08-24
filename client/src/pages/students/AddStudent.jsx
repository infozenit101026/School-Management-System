import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  UserPlus, 
  User, 
  Users, 
  BookOpen, 
  Save, 
  Loader2,
  AlertCircle,
  Info
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { studentService } from '../../services/studentService';

const AddStudent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  // Academic Dropdown States
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm();

  const selectedYear = watch('academicYear');
  const selectedClass = watch('class');

  // 1. Load Academic Years on mount
  useEffect(() => {
    academicService.getAcademicYears()
      .then(res => setAcademicYears(res.data || []))
      .catch(err => console.error('Failed to fetch academic years', err));
  }, []);

  // 2. Fetch Classes when Academic Year is selected
  useEffect(() => {
    if (selectedYear) {
      academicService.getClassesByYear(selectedYear)
        .then(res => setClasses(res.data || []))
        .catch(err => console.error(err));
      setValue('class', '');
      setValue('section', '');
      setSections([]);
    }
  }, [selectedYear, setValue]);

  // 3. Fetch Sections when Class is selected
  useEffect(() => {
    if (selectedClass) {
      academicService.getSectionsByClass(selectedClass)
        .then(res => setSections(res.data || []))
        .catch(err => console.error(err));
      setValue('section', '');
    }
  }, [selectedClass, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    // Payload structured to match processStudentAdmission service requirements
    const payload = {
      studentDetails: {
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender, 
        bloodGroup: data.bloodGroup || undefined,
        contactNumber: data.guardianPhone, // Reusing guardian phone for student if not explicitly collected
        address: data.address
      },
      guardianDetails: [
        {
          fullName: data.guardianName,
          relationType: data.guardianRelation.toUpperCase(), // FIX: matches backend schema
          contactNumber: data.guardianPhone,                 // FIX: matches backend schema
          email: data.guardianEmail || undefined,
          isEmergencyContact: true                           // FIX: matches backend schema
        }
      ],
      enrollmentDetails: {
        academicYear: data.academicYear,
        class: data.class,
        section: data.section
      }
    };

    try {
      const res = await studentService.registerAdmission(payload);
      setSubmitStatus({ 
        type: 'success', 
        message: `Student admitted successfully! Admission Number: ${res.data?.data?.admissionNumber || 'Assigned'}` 
      });
      reset();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to process admission. Please try again.';
      setSubmitStatus({ 
        type: 'error', 
        message: errorMsg 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">New Student Admission</h1>
            <p className="text-sm text-slate-500">Register a new student and assign their initial class</p>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {submitStatus.message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 border ${
          submitStatus.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {submitStatus.type === 'success' ? <UserPlus className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium">{submitStatus.message}</p>
        </div>
      )}

      {/* Admission Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Section 1: Personal Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <User className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">Personal Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="John"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Doe"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                {...register('dateOfBirth', { required: 'Date of birth is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              />
              {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
              <select
                {...register('gender', { required: 'Gender is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
              <select
                {...register('bloodGroup')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Guardian Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <Users className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">Primary Guardian Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Guardian Name *</label>
              <input
                type="text"
                {...register('guardianName', { required: 'Guardian name is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              />
              {errors.guardianName && <p className="text-red-500 text-xs mt-1">{errors.guardianName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Relationship *</label>
              <select
                {...register('guardianRelation', { required: 'Relationship is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
              >
                <option value="">Select Relationship</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
              {errors.guardianRelation && <p className="text-red-500 text-xs mt-1">{errors.guardianRelation.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number *</label>
              <input
                type="tel"
                {...register('guardianPhone', { required: 'Contact number is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="+91 "
              />
              {errors.guardianPhone && <p className="text-red-500 text-xs mt-1">{errors.guardianPhone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                {...register('guardianEmail')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="guardian@example.com"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Residential Address *</label>
              <textarea
                {...register('address', { required: 'Address is required' })}
                rows="3"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                placeholder="Full residential address"
              ></textarea>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Academic Enrollment */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-800">Academic Enrollment</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year *</label>
              <select
                {...register('academicYear', { required: 'Academic year is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
              >
                <option value="">Select Year</option>
                {academicYears.map(y => (
                  <option key={y._id} value={y._id}>{y.year}</option>
                ))}
              </select>
              {errors.academicYear && <p className="text-red-500 text-xs mt-1">{errors.academicYear.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Admitting Class *</label>
              <select
                {...register('class', { required: 'Class is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white disabled:bg-slate-100"
                disabled={!selectedYear}
              >
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Section *</label>
              <select
                {...register('section', { required: 'Section is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white disabled:bg-slate-100"
                disabled={!selectedClass}
              >
                <option value="">Select Section</option>
                {sections.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
              {errors.section && <p className="text-red-500 text-xs mt-1">{errors.section.message}</p>}
            </div>

            {/* Automation Warning Banner */}
            <div className="md:col-span-3 bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 border border-blue-200">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">
                <strong>Automation Notice:</strong> Admission Numbers and Student IDs are automatically generated sequentially. The student's <strong>Roll Number</strong> will be calculated automatically by inserting them into the existing section list in alphabetical order.
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSubmitting ? 'Processing...' : 'Admit Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;