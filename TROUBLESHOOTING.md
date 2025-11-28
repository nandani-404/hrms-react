# 🔧 HR Portal - Troubleshooting Guide

## Common Issues & Solutions

### 1. ❌ "attendance.filter is not a function"

**Problem**: Dashboard shows error about attendance.filter

**Solution**: ✅ FIXED! The code now properly handles cases where attendance data might not be an array.

**What was changed**:
```javascript
// Before
const { data: attendance = [], ... } = useAttendance({ date: today })

// After
const { data: attendance, ... } = useAttendance({ date: today })
const attendanceArray = Array.isArray(attendance) ? attendance : []
```

---

### 2. ❌ Cannot connect to API / CORS errors

**Problem**: Frontend can't connect to backend API

**Solutions**:

#### Check 1: Backend is running
```bash
# Make sure backend is running on port 8000
php artisan serve
```

#### Check 2: Environment variable is correct
Check `tasksuite/frontend/.env`:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

#### Check 3: CORS is configured
Backend CORS already includes `http://localhost:3000` ✅

#### Check 4: Restart dev server
After changing `.env`, restart:
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

### 3. ❌ Login not working

**Problem**: Can't login to the portal

**Solutions**:

#### Check 1: Backend authentication endpoint
Test in browser or Postman:
```
POST http://127.0.0.1:8000/api/login
Body: { "email": "your@email.com", "password": "password" }
```

#### Check 2: Check browser console
Open DevTools (F12) → Console tab → Look for errors

#### Check 3: Check Network tab
Open DevTools (F12) → Network tab → See if API call is made

---

### 4. ❌ "Module not found" errors

**Problem**: Import errors or missing modules

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### 5. ❌ Blank page / White screen

**Problem**: Portal shows blank page

**Solutions**:

#### Check 1: Check browser console
Open DevTools (F12) → Console tab → Look for errors

#### Check 2: Check if dev server is running
```bash
npm run dev
```

#### Check 3: Clear browser cache
- Chrome: Ctrl+Shift+Delete
- Or use Incognito mode

---

### 6. ❌ Styles not loading / Looks broken

**Problem**: Portal looks unstyled

**Solutions**:

#### Check 1: Tailwind is configured
File should exist: `tailwind.config.js` ✅

#### Check 2: PostCSS is configured
File should exist: `postcss.config.js` ✅

#### Check 3: Restart dev server
```bash
# Stop and restart
npm run dev
```

---

### 7. ❌ Data not loading / Empty tables

**Problem**: Tables show "No data" even though data exists

**Solutions**:

#### Check 1: API is returning data
Open DevTools → Network tab → Check API responses

#### Check 2: Check API endpoint
Verify in `.env`:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

#### Check 3: Check backend database
Make sure database has data:
```sql
SELECT * FROM tm_emp_details;
SELECT * FROM hrms_attendance;
```

---

### 8. ❌ Build errors

**Problem**: `npm run build` fails

**Solutions**:

#### Check 1: Fix any TypeScript/ESLint errors
Check console output for specific errors

#### Check 2: Update dependencies
```bash
npm update
```

#### Check 3: Clean install
```bash
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

---

### 9. ❌ Port 3000 already in use

**Problem**: Can't start dev server, port is busy

**Solutions**:

#### Option 1: Kill process on port 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

#### Option 2: Use different port
Edit `vite.config.js`:
```javascript
server: {
  port: 3001  // Change to different port
}
```

---

### 10. ❌ Authentication token expired

**Problem**: Logged out automatically

**Solution**: This is normal behavior. Token expires after some time.
- Just login again
- Token expiry is configured in backend

---

## 🔍 Debugging Tips

### Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Read error messages carefully

### Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Click on failed requests
4. Check Response tab for error details

### Check Backend Logs
```bash
# Laravel logs
tail -f storage/logs/laravel.log
```

### Enable React DevTools
Install React DevTools browser extension for better debugging

---

## 📞 Still Having Issues?

### Check These Files

1. **Environment**: `tasksuite/frontend/.env`
2. **API Service**: `tasksuite/frontend/src/services/api.js`
3. **Auth Context**: `tasksuite/frontend/src/context/AuthContext.jsx`
4. **Backend CORS**: `tasksuite/backend/config/cors.php`

### Common Checklist

- [ ] Backend is running on port 8000
- [ ] Frontend is running on port 3000
- [ ] `.env` file exists and is correct
- [ ] CORS is configured in backend
- [ ] Database has data
- [ ] No console errors
- [ ] Network requests are successful

---

## 🎯 Quick Fixes

### Reset Everything
```bash
# Frontend
cd tasksuite/frontend
rm -rf node_modules package-lock.json
npm install
npm run dev

# Backend
cd tasksuite/backend
php artisan cache:clear
php artisan config:clear
php artisan serve
```

### Check Versions
```bash
node --version   # Should be 16+
npm --version    # Should be 8+
php --version    # Should be 8.0+
```

---

## 📚 Additional Resources

- **Setup Guide**: [SETUP_COMPLETE.md](SETUP_COMPLETE.md)
- **Quick Start**: [QUICK_START.md](QUICK_START.md)
- **API Docs**: [../ATTENDANCE_API_DOCUMENTATION.md](../ATTENDANCE_API_DOCUMENTATION.md)

---

**Most issues are solved by:**
1. Checking `.env` file
2. Restarting dev server
3. Checking browser console
4. Verifying backend is running

---

**Need more help?** Check the complete documentation in [SETUP_COMPLETE.md](SETUP_COMPLETE.md)
