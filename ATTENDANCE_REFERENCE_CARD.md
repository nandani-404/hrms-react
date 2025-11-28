# Attendance System - Quick Reference Card

## 🚀 Quick Start

### For Employees
```
Login → Attendance → Check In → Capture Selfie → Submit
```

### For HR
```
Login → Attendance → View Records → Filter → Analyze
```

---

## 📱 Key Features

| Feature | Employee | HR |
|---------|----------|-----|
| Mark Attendance | ✅ | ✅ |
| View Own Status | ✅ | ✅ |
| View All Records | ❌ | ✅ |
| Filter Data | ❌ | ✅ |

---

## 🎯 Common Tasks

### Check-In (All Users)
1. Click "Check In" button
2. Allow camera access
3. Capture selfie
4. Click "Submit"

### Check-Out (All Users)
1. Click "Check Out" button
2. Confirm action
3. Done!

### View Records (HR Only)
1. Go to Attendance page
2. Select date
3. Select employee (optional)
4. View table

---

## 🔐 Access Levels

### Employee
- Dashboard (personal)
- Attendance (own only)

### HR/Admin
- All employee features
- Plus: Employees, WFH, Leave, Helpdesk, Payroll, Reports

---

## 📊 Status Indicators

| Icon | Status | Meaning |
|------|--------|---------|
| 🟢 | Present | Checked in on time |
| 🔴 | Absent | Did not check in |
| 🟡 | Half Day | Partial attendance |
| 🟠 | Late | Checked in late |
| 🔵 | On Leave | Approved leave |

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Camera not working | Check permissions, use HTTPS |
| Can't submit | Check internet, verify selfie captured |
| Not seeing HR features | Verify role, re-login |
| Mobile UI broken | Clear cache, update browser |

---

## 📞 Support

**Users**: Contact HR Department
**HR**: Contact System Administrator
**Technical**: Check documentation files

---

## 📚 Documentation Files

1. **ATTENDANCE_QUICK_START.md** - User guide
2. **ATTENDANCE_SELFIE_FEATURE.md** - Technical docs
3. **ROLE_BASED_ACCESS_GUIDE.md** - Role details
4. **ATTENDANCE_IMPLEMENTATION_SUMMARY.md** - Overview

---

## 🔗 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/attendance/check-in` | POST | Check-in with selfie |
| `/attendance/check-out` | POST | Check-out |
| `/attendance/employee/{id}/today` | GET | Today's status |
| `/attendance` | GET | All records (HR) |

---

## ⚙️ Technical Stack

- **Frontend**: React + Vite
- **State**: TanStack Query
- **UI**: Tailwind CSS
- **Animations**: Framer Motion
- **Camera**: MediaDevices API
- **Auth**: JWT + Sanctum

---

## 📱 Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
❌ IE 11

---

## 🎨 Mobile Responsive

- Breakpoints: 768px (md), 1024px (lg)
- Touch-friendly buttons (44px min)
- Full-screen camera modal
- Hamburger menu navigation

---

## 🔒 Security

- JWT authentication
- Role-based access
- File validation (5MB max)
- HTTPS required for camera
- Backend authorization

---

## ⚡ Performance

- Page load: < 2s
- Camera open: < 1s
- Photo capture: Instant
- Upload: 1-3s
- Status update: < 1s

---

## 🎯 Success Metrics

- ✅ Users can check-in/out
- ✅ Selfie capture works
- ✅ Status updates real-time
- ✅ HR can view all records
- ✅ Mobile-friendly
- ✅ Role-based access works

---

**Version**: 1.0.0 | **Date**: Nov 28, 2025 | **Status**: ✅ Production Ready
