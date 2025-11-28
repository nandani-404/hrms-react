# Attendance with Selfie Feature - Implementation Guide

## Overview
Mobile-friendly attendance system with selfie capture for check-in/check-out. Role-based access control ensures HR users see additional management features while regular employees only see their attendance marking interface.

## Features Implemented

### For All Users (Employees)
✅ **Selfie-based Check-in**
- Camera access with live preview
- Capture selfie for check-in
- Retake option if needed
- Real-time status display

✅ **Check-out Functionality**
- Simple check-out without selfie (as per backend API)
- Automatic work hours calculation
- Status tracking

✅ **Today's Status Display**
- Check-in time
- Check-out time
- Work hours
- Visual status indicators

✅ **Mobile-Friendly UI**
- Responsive design for all screen sizes
- Touch-optimized buttons
- Full-screen camera modal
- Easy-to-use interface

### For HR/Admin Users Only
✅ **Attendance Records Management**
- View all employee attendance
- Filter by date
- Filter by employee
- Detailed attendance table

✅ **Role-Based Navigation**
- HR users see all menu items
- Regular employees see limited menu
- Role badge in sidebar

## Technical Implementation

### Frontend Components Updated

#### 1. **Attendance.jsx** (`tasksuite/frontend/src/pages/Attendance.jsx`)
- Dual interface: User attendance + HR management
- Camera integration using MediaDevices API
- Selfie capture with canvas
- FormData submission for file upload
- Role-based rendering

**Key Features:**
```javascript
// Camera access
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })

// Capture photo
canvas.toBlob((blob) => {
  setCapturedImage(blob)
}, 'image/jpeg', 0.8)

// Submit with FormData
const formData = new FormData()
formData.append('employee_id', user.emp_id)
formData.append('selfie', capturedImage, 'selfie.jpg')
```

#### 2. **Dashboard.jsx** (`tasksuite/frontend/src/pages/Dashboard.jsx`)
- Role-aware dashboard
- Today's attendance status for all users
- HR statistics (only for HR users)
- Quick action buttons
- Personal stats section

#### 3. **Sidebar.jsx** (`tasksuite/frontend/src/components/Sidebar.jsx`)
- Role-based navigation filtering
- Dynamic menu items based on user role
- Role badge display
- Mobile-responsive with overlay

**Navigation Rules:**
```javascript
const allNavItems = [
  { to: '/dashboard', roles: ['all'] },
  { to: '/attendance', roles: ['all'] },
  { to: '/employees', roles: ['hr', 'admin'] },
  { to: '/wfh-requests', roles: ['hr', 'admin'] },
  // ... more HR-only items
]
```

#### 4. **useAttendance.js** (`tasksuite/frontend/src/hooks/useAttendance.js`)
- Updated `useCheckIn` to handle FormData
- Proper Content-Type header for file upload
- Query invalidation for real-time updates

### Backend APIs Used

#### Check-in API
```
POST /api/attendance/check-in
Content-Type: multipart/form-data

Body:
- employee_id: string (required)
- selfie: file (required, image/jpeg|png|jpg, max 5MB)
- remark: string (optional)
```

#### Check-out API
```
POST /api/attendance/check-out
Content-Type: application/json

Body:
- employee_id: string (required)
- remark: string (optional)
```

#### Today's Status API
```
GET /api/attendance/employee/{employeeId}/today

Response:
{
  "success": true,
  "data": {
    "checked_in": boolean,
    "checked_out": boolean,
    "attendance": { ... }
  }
}
```

## Mobile Responsiveness

### Breakpoints Used
- **Mobile**: < 768px (md)
- **Tablet**: 768px - 1024px (md to lg)
- **Desktop**: > 1024px (lg)

### Mobile Optimizations
1. **Touch-friendly buttons**: Minimum 44px touch targets
2. **Responsive text**: `text-sm md:text-base` pattern
3. **Flexible grids**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
4. **Responsive padding**: `p-4 md:p-6`
5. **Mobile menu**: Hamburger menu with overlay
6. **Full-screen camera**: Modal covers entire viewport on mobile

## User Roles

### Employee Role
**Can Access:**
- Dashboard (personal stats)
- Attendance (check-in/check-out only)

**Cannot Access:**
- Employee management
- Payroll
- Reports
- WFH/Leave request management
- Helpdesk management

### HR/Admin Role
**Can Access:**
- Everything employees can access
- Plus: All HR management features
- Employee records
- Attendance records of all employees
- Payroll management
- Reports and analytics

## Usage Instructions

### For Employees

1. **Login** to the system
2. Navigate to **Dashboard** or **Attendance**
3. Click **"Check In"** button
4. Allow camera access when prompted
5. Position face in camera view
6. Click **"Capture"** to take selfie
7. Review the captured image
8. Click **"Submit"** to check in
9. At end of day, click **"Check Out"**

### For HR Users

1. **Login** with HR credentials
2. Access all employee features plus:
3. View **Attendance Records** section
4. Filter by date and employee
5. View detailed attendance table
6. Access other HR modules from sidebar

## Security Considerations

1. **Authentication**: All routes protected with `auth:sanctum` middleware
2. **Role Verification**: Backend validates user roles
3. **File Upload**: Selfies validated (type, size) on backend
4. **CORS**: Configured for secure cross-origin requests
5. **Token Management**: JWT tokens stored securely

## Testing Checklist

### Employee Testing
- [ ] Can login successfully
- [ ] Can see Dashboard with personal stats
- [ ] Can access Attendance page
- [ ] Can open camera for check-in
- [ ] Can capture selfie
- [ ] Can retake selfie if needed
- [ ] Can submit check-in successfully
- [ ] Can check-out successfully
- [ ] Cannot access HR-only pages
- [ ] Sidebar shows only allowed menu items

### HR Testing
- [ ] Can login with HR credentials
- [ ] Can see full Dashboard with all stats
- [ ] Can mark own attendance
- [ ] Can view all employee attendance records
- [ ] Can filter attendance by date
- [ ] Can filter attendance by employee
- [ ] Can access all HR modules
- [ ] Sidebar shows all menu items

### Mobile Testing
- [ ] UI responsive on mobile devices
- [ ] Camera works on mobile browsers
- [ ] Touch interactions work smoothly
- [ ] Text readable on small screens
- [ ] Buttons easily tappable
- [ ] Modal covers full screen
- [ ] Sidebar overlay works correctly

## Troubleshooting

### Camera Not Working
**Issue**: Camera access denied
**Solution**: 
- Check browser permissions
- Ensure HTTPS connection (required for camera API)
- Try different browser

### Selfie Upload Fails
**Issue**: File upload error
**Solution**:
- Check file size (max 5MB)
- Verify file format (jpeg/png/jpg)
- Check network connection
- Verify backend storage permissions

### Role-Based Access Not Working
**Issue**: Employee sees HR features or vice versa
**Solution**:
- Verify user role in database
- Check AuthContext user object
- Clear localStorage and re-login
- Verify backend role middleware

### Mobile UI Issues
**Issue**: Layout broken on mobile
**Solution**:
- Clear browser cache
- Check Tailwind CSS classes
- Verify responsive breakpoints
- Test on different devices

## Future Enhancements

### Potential Features
1. **Geolocation**: Add location tracking for check-in
2. **Face Recognition**: Verify identity using AI
3. **Offline Mode**: Allow check-in without internet
4. **Notifications**: Push notifications for attendance reminders
5. **Analytics**: Personal attendance analytics dashboard
6. **Leave Integration**: Auto-mark leave days
7. **Shift Management**: Support multiple shifts
8. **Overtime Tracking**: Calculate and display overtime hours

## File Structure

```
tasksuite/frontend/src/
├── pages/
│   ├── Attendance.jsx          # Main attendance page (updated)
│   └── Dashboard.jsx            # Dashboard with role-based content (updated)
├── components/
│   ├── Sidebar.jsx              # Role-based navigation (updated)
│   ├── Header.jsx               # Header with user menu
│   └── Layout.jsx               # Main layout wrapper
├── hooks/
│   └── useAttendance.js         # Attendance API hooks (updated)
├── context/
│   └── AuthContext.jsx          # Authentication context
└── services/
    └── api.js                   # Axios instance
```

## API Endpoints Reference

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/attendance/check-in` | POST | ✓ | All | Check-in with selfie |
| `/attendance/check-out` | POST | ✓ | All | Check-out |
| `/attendance/employee/{id}/today` | GET | ✓ | All | Today's status |
| `/attendance` | GET | ✓ | HR | All attendance records |
| `/attendance/report` | GET | ✓ | HR | Attendance report |
| `/attendance/hr-export` | GET | ✓ | HR | Export attendance data |

## Environment Variables

Ensure these are set in `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+ (Desktop & Mobile)
- ✅ Firefox 88+ (Desktop & Mobile)
- ✅ Safari 14+ (Desktop & Mobile)
- ✅ Edge 90+
- ⚠️ IE 11 (Not supported - camera API unavailable)

### Required Browser Features
- MediaDevices API (camera access)
- Canvas API (image capture)
- FormData API (file upload)
- LocalStorage (token storage)

## Performance Considerations

1. **Image Optimization**: Selfies compressed to 80% quality
2. **Lazy Loading**: Components load on demand
3. **Query Caching**: TanStack Query caches API responses
4. **Debouncing**: Filter inputs debounced to reduce API calls
5. **Code Splitting**: Route-based code splitting with React.lazy

## Deployment Notes

### Production Checklist
- [ ] Update API base URL in `.env`
- [ ] Enable HTTPS (required for camera)
- [ ] Configure CORS on backend
- [ ] Set up file storage for selfies
- [ ] Test on production domain
- [ ] Verify camera permissions
- [ ] Test on multiple devices
- [ ] Monitor error logs

---

**Last Updated**: November 28, 2025
**Version**: 1.0.0
**Author**: Development Team
