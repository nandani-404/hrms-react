# 🚀 HR Portal - Quick Reference Card

## ⚡ Quick Start

```bash
cd tasksuite/frontend
npm install
npm run dev
```

**URL**: http://localhost:3000  
**API**: http://127.0.0.1:8000/api

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env` | API configuration |
| `src/pages/` | All page components |
| `src/components/` | Reusable components |
| `src/hooks/` | Custom React hooks |
| `src/services/api.js` | API client |

---

## 🎯 Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/login` | Login.jsx | Authentication |
| `/dashboard` | Dashboard.jsx | Overview |
| `/employees` | Employees.jsx | Employee CRUD |
| `/attendance` | Attendance.jsx | Attendance tracking |
| `/payroll` | Payroll.jsx | Payroll management |
| `/reports` | Reports.jsx | Analytics |

---

## 🔧 Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Environment

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

**Note**: Restart dev server after changing `.env`

---

## 🎨 Customization

### Change Primary Color
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    600: '#2563eb', // Change this
  }
}
```

### Change API URL
Edit `.env`:
```env
VITE_API_BASE_URL=http://your-api-url.com/api
```

---

## 🔌 API Endpoints

### Employees
- `GET /api/employees` - List all
- `POST /api/employees` - Create
- `PUT /api/employees/{id}` - Update
- `DELETE /api/employees/{id}` - Delete

### Attendance
- `GET /api/attendance` - List with filters
- `GET /api/attendance/report` - Generate report

### Payroll
- `GET /api/payroll` - Get payroll data
- `GET /api/payroll/summary` - Get summary

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Can't connect to API | Check `.env` and backend |
| Blank page | Check browser console |
| Styles broken | Restart dev server |
| Port in use | Kill process or change port |
| Build fails | Delete node_modules, reinstall |

**Full guide**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](QUICK_START.md) | Get started fast |
| [SETUP_COMPLETE.md](SETUP_COMPLETE.md) | Complete guide |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Fix issues |
| [TANSTACK_QUERY_GUIDE.md](TANSTACK_QUERY_GUIDE.md) | Data fetching |

---

## 🎯 Tech Stack

- React 18
- Vite
- Tailwind CSS
- TanStack Query
- Framer Motion
- React Router
- Axios

---

## 📱 Features

✅ Mobile responsive  
✅ Blue theme  
✅ Smooth animations  
✅ Data caching  
✅ Protected routes  
✅ Token auth  

---

## 🔍 Debugging

### Browser Console
Press `F12` → Console tab

### Network Tab
Press `F12` → Network tab

### React DevTools
Install browser extension

---

## ⚡ Performance

- Fast initial load
- Code splitting
- Lazy loading
- Cached API calls
- Optimized renders

---

## 🚀 Deployment

```bash
# Build
npm run build

# Output
dist/
```

Deploy `dist/` folder to:
- Netlify
- Vercel
- Your server

---

## 📞 Need Help?

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Check [SETUP_COMPLETE.md](SETUP_COMPLETE.md)
3. Check browser console
4. Check backend logs

---

**Quick tip**: Most issues are solved by restarting the dev server!

```bash
# Stop (Ctrl+C) then:
npm run dev
```
