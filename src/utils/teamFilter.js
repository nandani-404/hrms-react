/**
 * Team-based filtering utility
 * Filters employees/data based on reporting manager relationship
 */

/**
 * Get team members for a reporting manager
 * @param {Array} allEmployees - All employees from API
 * @param {Object} currentUser - Current logged-in user
 * @returns {Array} - Filtered team members or all employees if admin/HR
 */
export const getTeamMembers = (allEmployees, currentUser) => {
  if (!currentUser || !allEmployees) return []
  
  const isAdmin = currentUser.role === 'admin'
  const isHR = currentUser.role === 'hr'
  const isReportingManager = currentUser.is_reporting_manager === 1
  
  // Admin and HR see all employees
  if (isAdmin || isHR) {
    return allEmployees
  }
  
  // Reporting managers see only their team members
  if (isReportingManager) {
    return allEmployees.filter(emp => 
      emp.reporting_manager_id === currentUser.emp_id
    )
  }
  
  // Regular employees see only themselves
  return allEmployees.filter(emp => emp.emp_id === currentUser.emp_id)
}

/**
 * Get team member IDs for filtering API requests
 * @param {Array} allEmployees - All employees from API
 * @param {Object} currentUser - Current logged-in user
 * @returns {Array} - Array of employee IDs
 */
export const getTeamMemberIds = (allEmployees, currentUser) => {
  const teamMembers = getTeamMembers(allEmployees, currentUser)
  return teamMembers.map(emp => emp.emp_id)
}

/**
 * Check if user can manage team data (approve/reject requests, etc.)
 * @param {Object} currentUser - Current logged-in user
 * @returns {Boolean}
 */
export const canManageTeam = (currentUser) => {
  if (!currentUser) return false
  return currentUser.role === 'admin' || 
         currentUser.role === 'hr' || 
         currentUser.is_reporting_manager === 1
}

/**
 * Filter requests/records by team members
 * @param {Array} records - Records to filter (leave requests, WFH, attendance, etc.)
 * @param {Array} teamMemberIds - Team member employee IDs
 * @returns {Array} - Filtered records
 */
export const filterByTeam = (records, teamMemberIds) => {
  if (!records || !teamMemberIds) return []
  return records.filter(record => teamMemberIds.includes(record.employee_id))
}
