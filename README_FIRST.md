# 👋 READ THIS FIRST!

## 🚀 Getting Started in 3 Commands

```bash
cd tasksuite/frontend
npm install
npm run dev
```

Then open: **http://localhost:3000**

---

## ❌ Not Working? Try These (In Order)

### 1. Hard Refresh Browser
```
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

### 2. Clear Cache & Restart
```bash
rm -rf node_modules/.vite
npm run dev
```

### 3. Make Sure Backend is Running
```bash
# In another terminal:
cd tasksuite/backend
php artisan serve
```

### 4. Check .env File
```bash
cat .env
# Should show: VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### 5. Complete Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📚 Documentation Files

| File | When to Use |
|------|-------------|
| **[QUICK_FIX.md](QUICK_FIX.md)** | Something not working |
| **[START_HERE.md](START_HERE.md)** | First time setup |
| **[TEST_BASIC.md](TEST_BASIC.md)** | Debugging issues |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | Detailed problems |
| **[QUICK_START.md](QUICK_START.md)** | Quick reference |

---

## ✅ Success Checklist

You'll know it's working when:

- [x] Terminal shows "ready in XXX ms"
- [x] Browser opens to localhost:3000
- [x] You see blue-themed login page
- [x] No errors in console (F12)
- [x] Sidebar appears after login

---

## 🆘 Need Help?

1. **Check browser console** (F12 → Console)
2. **Read error message**
3. **Try QUICK_FIX.md solutions**
4. **Run diagnose.bat** (Windows)

---

## 🎯 What You Should See

### Login Page
- Blue theme
- Email & password fields
- "Sign In" button

### After Login
- Sidebar with 8 menu items
- Header with user info
- Dashboard content

---

## 🔧 Quick Commands

```bash
# Install
npm install

# Start
npm run dev

# Build
npm run build

# Diagnose (Windows)
diagnose.bat

# Clear cache
rm -rf node_modules/.vite
```

---

## 📞 System Requirements

- Node.js 16+
- npm 8+
- Modern browser (Chrome, Firefox, Safari, Edge)
- Backend running on port 8000

---

**Most common issue:** Backend not running  
**Quick fix:** `cd ../backend && php artisan serve`

**Second most common:** Browser cache  
**Quick fix:** `Ctrl + Shift + R`
