# Attendance System - Flow Diagrams

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Dashboard  │  │  Attendance  │  │   Sidebar    │  │
│  │   (Role-     │  │   (Selfie    │  │  (Role-based │  │
│  │   Aware)     │  │   Capture)   │  │  Navigation) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   REACT HOOKS LAYER                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  useAttendance | useCheckIn | useCheckOut        │   │
│  │  useEmployeeTodayStatus | useAuth                │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   API SERVICE LAYER                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Axios Instance with JWT Authentication          │   │
│  │  Base URL: http://127.0.0.1:8000/api            │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND APIs                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │  POST /attendance/check-in (with selfie)         │   │
│  │  POST /attendance/check-out                      │   │
│  │  GET  /attendance/employee/{id}/today            │   │
│  │  GET  /attendance (HR only)                      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      DATABASE                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │  attendance table                                 │   │
│  │  tm_emp_details table                            │   │
│  │  users table                                     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Check-In Flow

```
┌─────────────┐
│   Employee  │
│   Logs In   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Navigate to        │
│  Attendance Page    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Click "Check In"   │
│  Button             │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Camera Modal       │
│  Opens              │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Browser Requests   │
│  Camera Permission  │
└──────┬──────────────┘
       │
       ├─── Denied ──────────┐
       │                     │
       │                     ▼
       │              ┌─────────────┐
       │              │ Show Error  │
       │              │ Toast       │
       │              └─────────────┘
       │
       └─── Allowed ────────┐
                            │
                            ▼
                     ┌─────────────────┐
                     │ Camera Preview  │
                     │ Starts          │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ User Positions  │
                     │ Face            │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Click "Capture" │
                     │ Button          │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Photo Captured  │
                     │ to Canvas       │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Convert to Blob │
                     │ (JPEG, 80%)     │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Show Preview    │
                     │ with Options    │
                     └────────┬────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │   Retake     │    │   Submit     │
            └──────┬───────┘    └──────┬───────┘
                   │                   │
                   │                   ▼
                   │          ┌─────────────────┐
                   │          │ Create FormData │
                   │          │ with:           │
                   │          │ - employee_id   │
                   │          │ - selfie file   │
                   │          └────────┬────────┘
                   │                   │
                   │                   ▼
                   │          ┌─────────────────┐
                   │          │ POST to API     │
                   │          │ /check-in       │
                   │          └────────┬────────┘
                   │                   │
                   │          ┌────────┴────────┐
                   │          │                 │
                   │          ▼                 ▼
                   │   ┌──────────┐      ┌──────────┐
                   │   │ Success  │      │  Error   │
                   │   └────┬─────┘      └────┬─────┘
                   │        │                 │
                   │        ▼                 ▼
                   │   ┌──────────────┐  ┌──────────────┐
                   │   │ Show Success │  │ Show Error   │
                   │   │ Toast        │  │ Toast        │
                   │   └────┬─────────┘  └──────────────┘
                   │        │
                   │        ▼
                   │   ┌──────────────┐
                   │   │ Invalidate   │
                   │   │ Queries      │
                   │   └────┬─────────┘
                   │        │
                   │        ▼
                   │   ┌──────────────┐
                   │   │ Status       │
                   │   │ Updates      │
                   │   └────┬─────────┘
                   │        │
                   │        ▼
                   │   ┌──────────────┐
                   │   │ Check-in     │
                   │   │ Time Shows   │
                   │   └────┬─────────┘
                   │        │
                   │        ▼
                   │   ┌──────────────┐
                   │   │ Check-out    │
                   │   │ Button       │
                   │   │ Appears      │
                   │   └──────────────┘
                   │
                   └──► Back to Camera Preview
```

---

## 🚪 Check-Out Flow

```
┌─────────────┐
│   Employee  │
│   Checked In│
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Click "Check Out"  │
│  Button             │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Camera Modal       │
│  Opens (Optional)   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Click "Submit"     │
│  (No selfie needed) │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  POST to API        │
│  /check-out         │
└──────┬──────────────┘
       │
       ├─── Success ────────┐
       │                    │
       │                    ▼
       │           ┌─────────────────┐
       │           │ Calculate Work  │
       │           │ Hours           │
       │           └────────┬────────┘
       │                    │
       │                    ▼
       │           ┌─────────────────┐
       │           │ Show Success    │
       │           │ Toast           │
       │           └────────┬────────┘
       │                    │
       │                    ▼
       │           ┌─────────────────┐
       │           │ Update Status   │
       │           │ Display         │
       │           └────────┬────────┘
       │                    │
       │                    ▼
       │           ┌─────────────────┐
       │           │ Show Work Hours │
       │           │ & Times         │
       │           └─────────────────┘
       │
       └─── Error ─────────┐
                           │
                           ▼
                  ┌─────────────────┐
                  │ Show Error      │
                  │ Toast           │
                  └─────────────────┘
```

---

## 👔 HR View Flow

```
┌─────────────┐
│  HR User    │
│  Logs In    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Dashboard Shows:   │
│  - Personal Stats   │
│  - HR Statistics    │
│  - All Quick Actions│
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Navigate to        │
│  Attendance Page    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  See Two Sections:  │
│  1. Personal        │
│  2. HR Records      │
└──────┬──────────────┘
       │
       ├──► Personal Section ────┐
       │                         │
       │                         ▼
       │                ┌─────────────────┐
       │                │ Mark Own        │
       │                │ Attendance      │
       │                │ (Same as        │
       │                │ Employee)       │
       │                └─────────────────┘
       │
       └──► HR Records Section ──┐
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ Select Date     │
                        │ Filter          │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ Select Employee │
                        │ Filter          │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ GET /attendance │
                        │ with filters    │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ Display Table   │
                        │ with:           │
                        │ - Employee      │
                        │ - Date          │
                        │ - Check-in      │
                        │ - Check-out     │
                        │ - Hours         │
                        │ - Status        │
                        └─────────────────┘
```

---

## 🔐 Role-Based Access Flow

```
┌─────────────┐
│  User Login │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  POST /login        │
│  Returns:           │
│  - token            │
│  - user (with role) │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Store in           │
│  localStorage:      │
│  - token            │
│  - user object      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  AuthContext        │
│  Loads User         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Check user.role    │
└──────┬──────────────┘
       │
       ├──► employee ────────┐
       │                     │
       │                     ▼
       │            ┌─────────────────┐
       │            │ Sidebar Shows:  │
       │            │ - Dashboard     │
       │            │ - Attendance    │
       │            └────────┬────────┘
       │                     │
       │                     ▼
       │            ┌─────────────────┐
       │            │ Dashboard Shows:│
       │            │ - Personal view │
       │            │ - No HR stats   │
       │            └────────┬────────┘
       │                     │
       │                     ▼
       │            ┌─────────────────┐
       │            │ Attendance:     │
       │            │ - Personal only │
       │            │ - No HR section │
       │            └─────────────────┘
       │
       └──► hr/admin ───────┐
                            │
                            ▼
                   ┌─────────────────┐
                   │ Sidebar Shows:  │
                   │ - Dashboard     │
                   │ - Attendance    │
                   │ - Employees     │
                   │ - WFH Requests  │
                   │ - Leave Req.    │
                   │ - Helpdesk      │
                   │ - Payroll       │
                   │ - Reports       │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Dashboard Shows:│
                   │ - Personal view │
                   │ - HR statistics │
                   │ - All actions   │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Attendance:     │
                   │ - Personal      │
                   │ - HR Records    │
                   │ - Filters       │
                   └─────────────────┘
```

---

## 📱 Mobile Responsive Flow

```
┌─────────────────────┐
│  User Opens App     │
│  on Mobile Device   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Detect Screen Size │
│  < 768px = Mobile   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Apply Mobile       │
│  Styles:            │
│  - Single column    │
│  - Larger buttons   │
│  - Touch targets    │
│  - Hamburger menu   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Sidebar Hidden     │
│  by Default         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Click Hamburger    │
│  Menu (☰)           │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Sidebar Slides In  │
│  with Overlay       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Select Menu Item   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Sidebar Closes     │
│  Page Loads         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Camera for         │
│  Check-in:          │
│  - Full screen      │
│  - Portrait mode    │
│  - Large buttons    │
└─────────────────────┘
```

---

## 🔄 Data Flow

```
┌──────────────────────────────────────────────┐
│              USER ACTION                      │
│  (Check-in, Check-out, View Records)         │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│           REACT COMPONENT                     │
│  (Attendance.jsx, Dashboard.jsx)             │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│           CUSTOM HOOK                         │
│  (useCheckIn, useCheckOut, useAttendance)    │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│         TANSTACK QUERY                        │
│  (useMutation, useQuery)                     │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│           API SERVICE                         │
│  (axios instance with JWT)                   │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│         BACKEND API                           │
│  (Laravel Controllers)                       │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│           DATABASE                            │
│  (MySQL - attendance table)                  │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│         RESPONSE BACK                         │
│  (Success/Error with data)                   │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│      QUERY INVALIDATION                       │
│  (Refresh cached data)                       │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│         UI UPDATE                             │
│  (Show new status, toast notification)       │
└──────────────────────────────────────────────┘
```

---

## 🎯 Component Hierarchy

```
App.jsx
│
├── AuthProvider
│   └── AuthContext (user, role, login, logout)
│
├── QueryClientProvider
│   └── TanStack Query (caching, mutations)
│
└── Router
    │
    ├── Login.jsx
    │
    └── ProtectedRoute
        │
        └── Layout.jsx
            │
            ├── Sidebar.jsx
            │   ├── Role-based navigation
            │   └── Role badge
            │
            ├── Header.jsx
            │   ├── Hamburger menu
            │   ├── Notifications
            │   └── User menu
            │
            └── Outlet (Page Content)
                │
                ├── Dashboard.jsx
                │   ├── Personal attendance card
                │   ├── HR statistics (if HR)
                │   ├── Quick actions
                │   └── Personal stats
                │
                ├── Attendance.jsx
                │   ├── Personal attendance card
                │   │   ├── Status display
                │   │   ├── Check-in button
                │   │   ├── Check-out button
                │   │   └── Camera modal
                │   │       ├── Video preview
                │   │       ├── Capture button
                │   │       └── Submit button
                │   │
                │   └── HR Records (if HR)
                │       ├── Date filter
                │       ├── Employee filter
                │       └── Attendance table
                │
                ├── Employees.jsx (HR only)
                ├── WfhRequests.jsx (HR only)
                ├── LeaveRequests.jsx (HR only)
                ├── Helpdesk.jsx (HR only)
                ├── Payroll.jsx (HR only)
                └── Reports.jsx (HR only)
```

---

## 🔄 State Management Flow

```
┌──────────────────────────────────────────────┐
│         GLOBAL STATE                          │
│  (AuthContext)                               │
│  - user                                      │
│  - role                                      │
│  - loading                                   │
└────────────────┬─────────────────────────────┘
                 │
                 ├──► Used by all components
                 │
                 └──► Determines UI rendering
                      │
                      ▼
┌──────────────────────────────────────────────┐
│         SERVER STATE                          │
│  (TanStack Query)                            │
│  - attendance data                           │
│  - employee data                             │
│  - today's status                            │
└────────────────┬─────────────────────────────┘
                 │
                 ├──► Cached automatically
                 │
                 ├──► Invalidated on mutations
                 │
                 └──► Refetched on focus
                      │
                      ▼
┌──────────────────────────────────────────────┐
│         LOCAL STATE                           │
│  (Component useState)                        │
│  - camera modal open                         │
│  - captured image                            │
│  - filters (date, employee)                  │
│  - sidebar open                              │
└──────────────────────────────────────────────┘
```

---

**Last Updated**: November 28, 2025
**Version**: 1.0.0
