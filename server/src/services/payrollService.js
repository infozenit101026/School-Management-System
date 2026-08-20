/**
 * Calculates the net salary for a staff member.
 * @param {Object} salaryComponents 
 * @returns {Number} netSalary
 */
export const calculateNetSalary = ({
  basicSalary, 
  allowances = 0, 
  bonus = 0, 
  overtime = 0, 
  deductions = 0, 
  advance = 0 
}) => {
  const grossEarnings = basicSalary + allowances + bonus + overtime;
  const totalDeductions = deductions + advance;
  
  const netSalary = grossEarnings - totalDeductions;
  
  return netSalary > 0 ? netSalary : 0; // Prevent negative salaries
};