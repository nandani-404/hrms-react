# 🔧 Quick Fix Guide

## Problem: Nothing shows / Sidebar not showing

### Fix #1: Hard Refresh (Try This First!)

**Windows/Linux:**
```
Ctrl + Shift + R
```

**Mac:**
```
Cmd + Shift + R
```

Or:
```
Ctrl + F5
```

### Fix #2: Clear Cache & Restart

```bash
# Stop server (Ctrl+C)

# Clear Vite cache
rm -rf node_modules/.vite

# Start again
npm run dev
```

### Fix #3: Reinstall Dependencies

```bash
# Stop server (Ctrl+C)

# Delete and reinstall
rm -rf node_modules package-lock.json
npm install

# Start
npm run dev
```

### Fix #4: Check Backend is Running

```bash
# In another terminal, go to backend
cd ../backend

# Start Laravel server
php artisan serve

# Should show: Server running on http://127.0.0.1:8000
```

### Fix #5: Verify .env File

```bash
# Check .env exists
cat .env

# Should show:
# VITE_API_BASE_URL=http://127.0.0.1:8000/api

# If not, create it:
echo "VITE_API_BASE_URL=http://127.0.0.1:8000/api" > .env
```

### Fix #6: Check Port 3000

```bash
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Then restart
npm run dev
```

### Fix #7: Use Different Browser

Try opening in:
- Chrome (Incognito mode)
- Firefox
- Edge

### Fix #8: Check Console Errors

1. Open browser
2. Press F12
3. Go to Console tab
4. Look for RED errors
5. Share the error message

### Fix #9: Verify Files Exist

```bash
# Check these files exist:
ls src/App.jsx
ls src/main.jsx
ls src/components/Sidebar.jsx
ls src/components/Layout.jsx
ls index.html
```

### Fix #10: Complete Reset

```bash
# Stop everything (Ctrl+C)

# Go to frontend folder
cd tasksuite/frontend

# Nuclear option - delete everything
rm -rf node_modules
rm -rf package-lock.json
rm -rf node_modules/.vite
rm -rf dist

# Fresh install
npm install

# Start
npm run dev

# Open browser
# http://localhost:3000
```

---

## Quick Diagnostic

Run this in terminal:

```bash
cd tasksuite/frontend

# Check Node version (should be 16+)
node --version

# Check npm version (should be 8+)
npm --version

# Check if dependencies installed
ls node_modules

# Check if .env exists
cat .env

# Start dev server
npm run dev
```

---

## Expected Output

When you run `npm run dev`, you should see:

```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h to show help
```

---

## What You Should See in Browser

1. **Login Page**
   - Blue theme
   - Email field
   - Password field
   - "Sign In" button

2. **After Login**
   - Sidebar on left (blue HR logo)
   - Navigation items:
     - Dashboard
     - Employees
     - Attendance
     - WFH Requests
     - Leave Requests
     - Helpdesk
     - Payroll
     - Reports
   - Header on top
   - Main content area

---

## Still Not Working?

### Share This Information:

1. **What you see:**
   - Blank page?
   - Error message?
   - Partial loading?

2. **Browser console errors:**
   - Press F12
   - Go to Console tab
   - Copy any RED errors

3. **Terminal output:**
   - Copy what shows when you run `npm run dev`

4. **System info:**
   ```bash
   node --version
   npm --version
   # Your OS (Windows/Mac/Linux)
   ```

---

## Most Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Blank page | Hard refresh (Ctrl+Shift+R) |
| No sidebar | Check browser console for errors |
| Port in use | Kill process on port 3000 |
| Module not found | Run `npm install` |
| API errors | Start backend server |
| Styles missing | Clear cache, restart |

---

## Emergency Contact

If nothing works:

1. Run diagnostic: `diagnose.bat` (Windows)
2. Check: [START_HERE.md](START_HERE.md)
3. Read: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
4. Test: [TEST_BASIC.md](TEST_BASIC.md)

---

**Remember:** 90% of issues are solved by:
1. Hard refresh (Ctrl+Shift+R)
2. Clearing cache
3. Restarting dev server
4. Making sure backend is running
