# 🚀 START HERE - HR Portal Setup

## Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
cd tasksuite/frontend
npm install
```

**Wait for installation to complete** (may take 2-3 minutes)

### Step 2: Verify Environment

Check that `.env` file exists:
```bash
# Should show: VITE_API_BASE_URL=http://127.0.0.1:8000/api
cat .env
```

If not, create it:
```bash
echo VITE_API_BASE_URL=http://127.0.0.1:8000/api > .env
```

### Step 3: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**Open browser:** http://localhost:3000

---

## ❌ If Nothing Shows / Blank Page

### Check 1: Browser Console

1. Open browser DevTools (Press F12)
2. Go to **Console** tab
3. Look for errors (red text)

**Common errors and fixes:**

#### Error: "Failed to fetch dynamically imported module"
**Fix:** Hard refresh the page
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

#### Error: "Cannot find module"
**Fix:** Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Error: "Unexpected token"
**Fix:** Clear Vite cache
```bash
rm -rf node_modules/.vite
npm run dev
```

### Check 2: Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Look for failed requests (red)

**If you see 404 errors:**
- Make sure backend is running on port 8000
- Check `.env` file has correct API URL

### Check 3: Terminal Output

Look at the terminal where you ran `npm run dev`

**If you see errors:**

#### Port 3000 already in use
```bash
# Kill the process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
# Edit vite.config.js and change port to 3001
```

#### Module not found
```bash
npm install
```

---

## ✅ Verification Checklist

Run these checks:

### 1. Files Exist
```bash
# Check these files exist:
ls src/App.jsx
ls src/main.jsx
ls src/index.css
ls .env
```

### 2. Dependencies Installed
```bash
# Should show node_modules folder
ls node_modules
```

### 3. Backend Running
```bash
# Test backend API
curl http://127.0.0.1:8000/api/employees
```

If backend not running:
```bash
cd ../backend
php artisan serve
```

---

## 🔧 Complete Reset (If All Else Fails)

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Clean everything
rm -rf node_modules
rm -rf package-lock.json
rm -rf node_modules/.vite
rm -rf dist

# 3. Reinstall
npm install

# 4. Start fresh
npm run dev
```

---

## 📱 Expected Behavior

### Login Page
- Should see blue-themed login form
- Email and password fields
- "Sign In" button

### After Login
- Sidebar on left with navigation
- Header on top with user info
- Main content area

### Sidebar Should Show:
- Dashboard
- Employees
- Attendance
- WFH Requests
- Leave Requests
- Helpdesk
- Payroll
- Reports

---

## 🐛 Still Not Working?

### Check Browser Compatibility
- Use Chrome, Firefox, Safari, or Edge (latest version)
- Avoid Internet Explorer

### Check Node Version
```bash
node --version
# Should be v16 or higher
```

If too old:
- Download from https://nodejs.org/
- Install latest LTS version
- Restart terminal
- Try again

### Check npm Version
```bash
npm --version
# Should be v8 or higher
```

---

## 📞 Debug Information

If you need help, provide this information:

```bash
# 1. Node version
node --version

# 2. npm version
npm --version

# 3. Operating System
# Windows/Mac/Linux

# 4. Browser console errors
# Copy from F12 > Console

# 5. Terminal output
# Copy from terminal where npm run dev is running
```

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Terminal shows "ready in XXX ms"
2. ✅ Browser opens to http://localhost:3000
3. ✅ You see the login page
4. ✅ No errors in browser console
5. ✅ Sidebar appears after login

---

## 🎯 Quick Test

After starting, test these:

1. **Open browser** → http://localhost:3000
2. **See login page** → Blue theme, email/password fields
3. **Check console** → F12, no red errors
4. **Try login** → Use backend credentials
5. **See dashboard** → Sidebar + content

---

## 📚 Next Steps

Once it's working:

1. ✅ Explore all pages
2. ✅ Test features
3. ✅ Check API connections
4. ✅ Review documentation

---

**Need more help?**
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Detailed troubleshooting
- [QUICK_START.md](QUICK_START.md) - Quick start guide
- [SETUP_COMPLETE.md](SETUP_COMPLETE.md) - Complete documentation

---

**Most common issue:** Backend not running on port 8000
**Quick fix:** `cd ../backend && php artisan serve`
