# Role-Based Access Control - Visual Guide

## 🎭 Overview

The system implements role-based access control where different users see different features based on their role.

## 👤 User Roles

### 1. Employee Role
- Default role for regular employees
- Limited access to personal features only
- Cannot manage other employees or access HR data

### 2. HR/Admin Role
- Full access to all features
- Can manage employees and view all data
- Has all employee features plus HR management tools

---

## 📱 Interface Comparison

### Dashboard Page

#### Employee View
```
┌─────────────────────────────────────┐
│ Dashboard                           │
│ Welcome back, John Doe              │
├─────────────────────────────────────┤
│                                     │
│ ┌─── Today's Attendance ─────────┐ │
│ │ Friday, November 28, 2025      │ │
│ │                                │ │
│ │ Check In: 09:00 AM ✓           │ │
│ │ Check Out: Not marked          │ │
│ │                                │ │
│ │ [Go to Attendance]             │ │
│ └────────────────────────────────┘ │
│                                     │
│ ┌─── Quick Actions ──────────────┐ │
│ │ • Mark Attendance              │ │
│ └────────────────────────────────┘ │
│                                     │
│ ┌─── Your Stats ─────────────────┐ │
│ │ This Month: 1 day              │ │
│ │ Work Hours Today: 0 hrs        │ │
│ │ Status: Active                 │ │
│ └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### HR/Admin View
```
┌─────────────────────────────────────┐
│ Dashboard                           │
│ Welcome back, HR Manager            │
├─────────────────────────────────────┤
│                                     │
│ ┌─── Today's Attendance ─────────┐ │
│ │ Friday, November 28, 2025      │ │
│ │                                │ │
│ │ Check In: 09:00 AM ✓           │ │
│ │ Check Out: Not marked          │ │
│ │                                │ │
│ │ [Go to Attendance]             │ │
│ └────────────────────────────────┘ │
│                                     │
│ ┌─ HR Statistics ────────────────┐ │
│ │ Total Employees: 50            │ │
│ │ Present Today: 45              │ │
│ │ Monthly Payroll: ₹0            │ │
│ │ Attendance Rate: 90%           │ │
│ └────────────────────────────────┘ │
│                                     │
│ ┌─── Quick Actions ──────────────┐ │
│ │ • Mark Attendance              │ │
│ │ • Manage Employees             │ │
│ │ • View Payroll                 │ │
│ └────────────────────────────────┘ │
│                                     │
│ ┌─── Your Stats ─────────────────┐ │
│ │ This Month: 1 day              │ │
│ │ Work Hours Today: 0 hrs        │ │
│ │ Status: Active                 │ │
│ └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Key Differences:**
- ✅ HR sees statistics cards (Total Employees, Present Today, etc.)
- ✅ HR has more quick actions
- ✅ Both see personal attendance status

---

### Attendance Page

#### Employee View
```
┌─────────────────────────────────────┐
│ Attendance                          │
│ Mark your attendance                │
├─────────────────────────────────────┤
│                                     │
│ ┌─── Your Attendance ────────────┐ │
│ │ John Doe (EMP001)              │ │
│ │                                │ │
│ │ Check In: 09:00 AM ✓           │ │
│ │ Check Out: Not marked          │ │
│ │                                │ │
│ │ Work Hours: 0 hrs              │ │
│ │                                │ │
│ │ [Check In] [Check Out]         │ │
│ └────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

#### HR/Admin View
```
┌─────────────────────────────────────┐
│ Attendance                          │
│ Manage employee attendance          │
├─────────────────────────────────────┤
│                                     │
│ ┌─── Your Attendance ────────────┐ │
│ │ HR Manager (HR001)             │ │
│ │                                │ │
│ │ Check In: 09:00 AM ✓           │ │
│ │ Check Out: Not marked          │ │
│ │                                │ │
│ │ Work Hours: 0 hrs              │ │
│ │                                │ │
│ │ [Check In] [Check Out]         │ │
│ └────────────────────────────────┘ │
│                                     │
│ ┌─── Attendance Records ─────────┐ │
│ │ Date: [2025-11-28]             │ │
│ │ Employee: [All Employees ▼]    │ │
│ │                                │ │
│ │ ┌──────────────────────────┐   │ │
│ │ │ Employee | Date | In | Out│   │ │
│ │ ├──────────────────────────┤   │ │
│ │ │ John Doe | 11/28 | 9:00 │   │ │
│ │ │ Jane Smith | 11/28 | 8:45│   │ │
│ │ │ ... more records ...     │   │ │
│ │ └──────────────────────────┘   │ │
│ └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Key Differences:**
- ✅ HR sees "Attendance Records" section below
- ✅ HR can filter by date and employee
- ✅ HR can view all employee attendance
- ✅ Employees only see their own attendance

---

### Sidebar Navigation

#### Employee View
```
┌─────────────────┐
│ 🏢 HR Portal    │
├─────────────────┤
│                 │
│ 📊 Dashboard    │
│ 🕐 Attendance   │
│                 │
│                 │
│                 │
│                 │
│                 │
│                 │
├─────────────────┤
│ Logged in as    │
│ employee        │
└─────────────────┘
```

#### HR/Admin View
```
┌─────────────────┐
│ 🏢 HR Portal    │
├─────────────────┤
│                 │
│ 📊 Dashboard    │
│ 🕐 Attendance   │
│ 👥 Employees    │
│ 🏠 WFH Requests │
│ 📅 Leave Req.   │
│ 🎧 Helpdesk     │
│ 💰 Payroll      │
│ 📊 Reports      │
├─────────────────┤
│ Logged in as    │
│ hr              │
└─────────────────┘
```

**Key Differences:**
- ✅ HR sees all menu items (8 items)
- ✅ Employees see only 2 items (Dashboard, Attendance)
- ✅ Role badge shows current role

---

## 🔐 Access Control Matrix

| Feature | Employee | HR/Admin |
|---------|----------|----------|
| **Dashboard** | ✅ Personal view | ✅ Full view with stats |
| **Mark Own Attendance** | ✅ Yes | ✅ Yes |
| **View Own Attendance** | ✅ Yes | ✅ Yes |
| **View All Attendance** | ❌ No | ✅ Yes |
| **Filter Attendance** | ❌ No | ✅ Yes |
| **Manage Employees** | ❌ No | ✅ Yes |
| **WFH Requests** | ❌ No | ✅ Yes |
| **Leave Requests** | ❌ No | ✅ Yes |
| **Helpdesk** | ❌ No | ✅ Yes |
| **Payroll** | ❌ No | ✅ Yes |
| **Reports** | ❌ No | ✅ Yes |

---

## 🎯 Feature Visibility Rules

### Always Visible (All Roles)
1. **Personal Attendance Card**
   - Check-in/check-out buttons
   - Today's status
   - Work hours
   - Personal stats

2. **Dashboard Personal Section**
   - Today's attendance status
   - Quick action to mark attendance
   - Personal work statistics

3. **Navigation**
   - Dashboard link
   - Attendance link
   - Logout button

### HR/Admin Only
1. **HR Statistics Cards**
   - Total employees
   - Present today count
   - Monthly payroll
   - Attendance rate

2. **Attendance Management**
   - All employee records table
   - Date filter
   - Employee filter
   - Export options (if implemented)

3. **HR Navigation Items**
   - Employees
   - WFH Requests
   - Leave Requests
   - Helpdesk
   - Payroll
   - Reports

---

## 💻 Implementation Details

### How It Works

#### 1. Role Detection
```javascript
const { user } = useAuth()
const isHR = user?.role === 'hr' || user?.role === 'admin'
```

#### 2. Conditional Rendering
```javascript
{isHR && (
  <HROnlyComponent />
)}
```

#### 3. Navigation Filtering
```javascript
const navItems = allNavItems.filter(item => 
  item.roles.includes('all') || item.roles.includes(userRole)
)
```

### Role Assignment

Roles are assigned in the database and returned during login:

```javascript
// Login response
{
  "token": "...",
  "user": {
    "id": 1,
    "emp_id": "EMP001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "employee" // or "hr" or "admin"
  }
}
```

---

## 🔄 Role Change Process

### Changing User Role

1. **Database Update**
   ```sql
   UPDATE users SET role = 'hr' WHERE email = 'user@example.com';
   ```

2. **User Must Re-login**
   - Logout from current session
   - Login again
   - New role will be loaded

3. **Interface Updates Automatically**
   - Sidebar shows new menu items
   - Dashboard shows new features
   - Attendance page shows HR section

---

## 🎨 Visual Indicators

### Role Badge
- Located at bottom of sidebar
- Shows current role
- Color-coded:
  - Employee: Gray background
  - HR/Admin: Primary color background

### Feature Sections
- Personal sections: Primary gradient (blue)
- HR sections: White background with border
- Clear visual separation

### Status Indicators
- ✅ Green: Active/Present/Checked-in
- ❌ Red: Inactive/Absent
- 🟡 Yellow: Pending/Half-day
- 🔵 Blue: On Leave

---

## 📱 Mobile Considerations

### Both Roles
- Responsive layout
- Touch-friendly buttons
- Mobile menu with hamburger icon
- Full-screen camera modal

### Employee Mobile
- Simplified interface
- Focus on attendance marking
- Large, clear buttons
- Minimal navigation

### HR Mobile
- Scrollable tables
- Collapsible filters
- Swipeable cards
- Optimized for data viewing

---

## 🔒 Security Notes

### Frontend Protection
- Role-based UI rendering
- Navigation filtering
- Component-level access control

### Backend Protection
- API endpoint authorization
- Role validation on server
- Employee ID verification
- Token-based authentication

### Important
⚠️ **Frontend role checks are for UX only!**
- Backend must always validate roles
- Never trust frontend role checks for security
- All sensitive operations must be authorized on server

---

## 🧪 Testing Role-Based Access

### Test as Employee
1. Login with employee credentials
2. Verify limited navigation
3. Check attendance page (no HR section)
4. Try accessing HR URLs directly (should see empty/error)
5. Verify can mark own attendance

### Test as HR
1. Login with HR credentials
2. Verify full navigation
3. Check attendance page (HR section visible)
4. Verify can view all records
5. Verify can mark own attendance
6. Test filters and data access

### Test Role Switch
1. Login as employee
2. Note available features
3. Logout
4. Change role in database
5. Login again
6. Verify new features appear

---

## 📞 Support

### For Users
- If you can't see expected features, check your role
- Contact HR to verify your role assignment
- Logout and login again after role change

### For Administrators
- Roles are managed in database
- Update user role in `users` table
- User must re-login to see changes
- Verify role in AuthContext after login

---

## 🎉 Summary

### Employee Experience
- ✅ Simple, focused interface
- ✅ Easy attendance marking
- ✅ Personal stats only
- ✅ No clutter from HR features

### HR Experience
- ✅ All employee features
- ✅ Plus full HR management
- ✅ Comprehensive data access
- ✅ Powerful filtering and reporting

### Benefits
- 🎯 Clear separation of concerns
- 🔒 Secure role-based access
- 📱 Mobile-friendly for both roles
- 🚀 Scalable architecture
- 👥 Better user experience

---

**Last Updated**: November 28, 2025
**Version**: 1.0.0
