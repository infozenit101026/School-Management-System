import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  GraduationCap,
  Loader2,
  AlertCircle,
  X,
  Save,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { studentService } from "../../services/studentService";
import { academicService } from "../../services/academicService";

const StudentList = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canManageStudents = hasRole([
    "ADMIN",
    "SCHOOL_MANAGER",
    "STUDENT_MANAGER",
  ]);

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);

  // Global Academic Data
  const [academicYears, setAcademicYears] = useState([]);

  // Modal State
  const [editingStudent, setEditingStudent] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);
  
  const [editFormData, setEditFormData] = useState({
    id: "",
    fullName: "",
    dateOfBirth: "",
    gender: "MALE",
    bloodGroup: "",
    status: "ACTIVE",
    guardianName: "",
    contactNumber: "",
    address: "",
    academicYear: "",
    classId: "",
    sectionId: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("");

  // Initial Data Fetch
  useEffect(() => {
    const fetchDirectoryData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [studentsRes, yearsRes] = await Promise.all([
          studentService.getAllStudents(),
          academicService.getAcademicYears().catch(() => ({ data: [] })),
        ]);

        const rawList =
          studentsRes.data?.data || studentsRes.data || studentsRes || [];
        setStudents(Array.isArray(rawList) ? rawList : []);
        setAcademicYears(
          Array.isArray(yearsRes) ? yearsRes : yearsRes.data || []
        );
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Failed to load student directory.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirectoryData();
  }, []);

  // Fetch Classes when Academic Year changes in Modal (Safeguarded against [object Object])
  useEffect(() => {
    if (editFormData.academicYear && !String(editFormData.academicYear).includes('[object')) {
      academicService
        .getClassesByYear(editFormData.academicYear)
        .then((res) => {
          const list = Array.isArray(res) ? res : res?.data || [];
          setAvailableClasses(list);
        })
        .catch((err) => console.error("Failed to fetch classes:", err));
    } else {
      setAvailableClasses([]);
    }
  }, [editFormData.academicYear]);

  // Fetch Sections when Class changes in Modal (Safeguarded against [object Object])
  useEffect(() => {
    if (editFormData.classId && !String(editFormData.classId).includes('[object')) {
      academicService
        .getSectionsByClass(editFormData.classId)
        .then((res) => {
          const list = Array.isArray(res) ? res : res?.data || [];
          setAvailableSections(list);
        })
        .catch((err) => console.error("Failed to fetch sections:", err));
    } else {
      setAvailableSections([]);
    }
  }, [editFormData.classId]);

  const parseStudentRow = (item) => {
    const student = item.student || item;
    const enrollment = item.enrollment || item.currentEnrollment || {};

    const id = student._id || item._id;
    const admissionNumber =
      student.admissionNumber || item.admissionNumber || "N/A";

    const name =
      student.fullName ||
      (student.firstName
        ? `${student.firstName} ${student.lastName || ""}`.trim()
        : null) ||
      item.name ||
      "N/A";

    const className =
      enrollment.class?.name ||
      enrollment.class?.className ||
      item.class?.name ||
      item.className ||
      item.class ||
      "N/A";

    const sectionName =
      enrollment.section?.name ||
      enrollment.section?.sectionName ||
      item.section?.name ||
      item.sectionName ||
      item.section ||
      "N/A";

    const guardianObj =
      item.guardian ||
      student.guardian ||
      (item.guardians && item.guardians[0]) ||
      (student.guardians && student.guardians[0]) ||
      {};

    const guardianName =
      guardianObj.fullName ||
      guardianObj.name ||
      guardianObj.guardianName ||
      item.guardianName ||
      item.fatherName ||
      "N/A";

    const status = student.status || item.status || "ACTIVE";

    return {
      id,
      admissionNumber,
      name,
      className,
      sectionName,
      guardianName,
      status,
    };
  };

  // Helper to safely extract string IDs from populated objects
  const extractId = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val._id || val.id || "";
  };

  const parseFullStudentForEdit = (item) => {
    if (!item) return {};
    const student = item.student || item;
    const enrollment = item.enrollment || item.currentEnrollment || {};
    const guardianObj =
      item.guardian ||
      student.guardian ||
      (item.guardians && item.guardians[0]) ||
      (student.guardians && student.guardians[0]) ||
      {};

    const id = extractId(student) || extractId(item);
    const fullName =
      student.fullName ||
      (student.firstName
        ? `${student.firstName} ${student.lastName || ""}`.trim()
        : item.name || "");

    const dateOfBirth = student.dateOfBirth
      ? new Date(student.dateOfBirth).toISOString().split("T")[0]
      : student.dob || "";

    const gender = student.gender || "MALE";
    const bloodGroup = student.bloodGroup || "";
    const status = student.status || item.status || "ACTIVE";
    
    // Safely extract Academic details
    const academicYear = extractId(enrollment.academicYear) || extractId(item.academicYear);
    const classId = extractId(enrollment.class) || extractId(item.class);
    const sectionId = extractId(enrollment.section) || extractId(item.section);

    const contactNumber =
      student.contactNumber ||
      item.contactNumber ||
      guardianObj.contactNumber ||
      guardianObj.phone ||
      "";
    const address = student.address || item.address || guardianObj.address || "";
    const guardianName =
      guardianObj.fullName ||
      guardianObj.name ||
      guardianObj.guardianName ||
      item.guardianName ||
      item.fatherName ||
      "";

    return {
      id,
      fullName,
      dateOfBirth,
      gender,
      bloodGroup,
      status,
      contactNumber,
      address,
      guardianName,
      academicYear,
      classId,
      sectionId
    };
  };

  const handleOpenEditModal = (rawItem) => {
    const fullData = parseFullStudentForEdit(rawItem);
    setEditFormData(fullData);
    setEditingStudent(rawItem);
    setModalError(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      if (name === "academicYear") {
        newData.classId = "";
        newData.sectionId = "";
      }
      if (name === "classId") {
        newData.sectionId = "";
      }
      
      return newData;
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setModalError(null);

    try {
      const updatePayload = {
        ...editFormData,
        enrollment: {
          academicYear: editFormData.academicYear,
          class: editFormData.classId,
          section: editFormData.sectionId
        }
      };

      if (studentService.updateStudent) {
        await studentService.updateStudent(editFormData.id, updatePayload);
      }

      const studentsRes = await studentService.getAllStudents();
      const rawList = studentsRes.data?.data || studentsRes.data || studentsRes || [];
      setStudents(Array.isArray(rawList) ? rawList : []);
      
      setEditingStudent(null);
    } catch (err) {
      console.error("Failed to update student:", err);
      setModalError(
        err.response?.data?.message || "Failed to update student record."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      if (studentService.deleteStudent) {
        await studentService.deleteStudent(id);
      }
      setStudents((prev) =>
        prev.filter((item) => parseStudentRow(item).id !== id)
      );
    } catch (err) {
      console.error("Failed to delete student:", err);
      setError("Failed to delete student record.");
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((item) => {
      const parsed = parseStudentRow(item);
      const matchesSearch =
        parsed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parsed.admissionNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      
      const itemYearId = extractId(item.enrollment?.academicYear) || extractId(item.academicYear);
      const matchesClass = classFilter ? itemYearId === classFilter : true;
      
      return matchesSearch && matchesClass;
    });
  }, [searchQuery, classFilter, students]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Student Directory
            </h1>
            <p className="text-sm text-slate-500">
              Manage and view enrolled students
            </p>
          </div>
        </div>

        {canManageStudents && (
          <Link
            to="/students/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </Link>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-800 border border-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or admission ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-slate-400" />
            </div>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white appearance-none"
            >
              <option value="">All Academic Years</option>
              {academicYears.map((y) => (
                <option key={y._id} value={y._id}>
                  {y.year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Admission ID</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Class & Section</th>
                <th className="px-6 py-4">Guardian</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      <span>Loading student directory...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((rawItem) => {
                  const student = parseStudentRow(rawItem);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {student.admissionNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                            {student.name.charAt(0)}
                          </div>
                          {student.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {student.className} - {student.sectionName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {student.guardianName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                            student.status === "ACTIVE" ||
                            student.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              student.status === "ACTIVE" ||
                              student.status === "Active"
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/students/${student.id}`}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {canManageStudents && (
                            <>
                              <button
                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Edit Student"
                                onClick={() => handleOpenEditModal(rawItem)}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Student"
                                onClick={() =>
                                  handleDelete(student.id, student.name)
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="text-base font-medium text-slate-700">
                        No students found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Edit Student Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Update student records and academic enrollment
                </p>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {modalError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* ACADEMIC DETAILS */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded inline-block">
                  Academic Enrollment
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Academic Year
                    </label>
                    <select
                      name="academicYear"
                      value={editFormData.academicYear}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      <option value="">Select Year</option>
                      {academicYears.map((y) => (
                        <option key={y._id} value={y._id}>
                          {y.year}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Class
                    </label>
                    <select
                      name="classId"
                      value={editFormData.classId}
                      onChange={handleEditInputChange}
                      disabled={!editFormData.academicYear}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50 disabled:bg-slate-50"
                    >
                      <option value="">Select Class</option>
                      {availableClasses.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name || c.className}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Section
                    </label>
                    <select
                      name="sectionId"
                      value={editFormData.sectionId}
                      onChange={handleEditInputChange}
                      disabled={!editFormData.classId}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50 disabled:bg-slate-50"
                    >
                      <option value="">Select Section</option>
                      {availableSections.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name || s.sectionName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Personal Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Personal Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={editFormData.fullName}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editFormData.dateOfBirth}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={editFormData.gender}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={editFormData.bloodGroup}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
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

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                      <option value="TRANSFERRED">TRANSFERRED</option>
                      <option value="PASSED_OUT">PASSED OUT</option>
                      <option value="DISCONTINUED">DISCONTINUED</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Contact & Guardian */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Contact & Guardian Info
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Guardian Name
                    </label>
                    <input
                      type="text"
                      name="guardianName"
                      value={editFormData.guardianName}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={editFormData.contactNumber}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Residential Address
                    </label>
                    <textarea
                      name="address"
                      rows="3"
                      value={editFormData.address}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 text-xs border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5 disabled:opacity-70"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;