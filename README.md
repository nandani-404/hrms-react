# HR Portal - Frontend

A modern, mobile-friendly HR management portal built with React, Tailwind CSS, and Framer Motion.

## Features

- **Dashboard**: Overview of key HR metrics and statistics
- **Employee Management**: Add, edit, and manage employee records
- **Attendance Tracking**: Monitor and manage employee attendance
- **Payroll Management**: Generate and view payroll reports
- **Reports**: Comprehensive attendance and performance reports

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - API calls
- **date-fns** - Date formatting
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx      # Main layout wrapper
│   ├── Header.jsx      # Top navigation bar
│   ├── Sidebar.jsx     # Side navigation
│   └── ProtectedRoute.jsx
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Dashboard.jsx   # Dashboard
│   ├── Employees.jsx   # Employee management
│   ├── Attendance.jsx  # Attendance tracking
│   ├── Payroll.jsx     # Payroll management
│   └── Reports.jsx     # Reports
├── context/            # React context
│   └── AuthContext.jsx # Authentication
├── services/           # API services
│   └── api.js         # Axios instance
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## API Integration

The app connects to the backend API at `/api`. Update the proxy in `vite.config.js` if your backend runs on a different port:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true
    }
  }
}
```

## Features

### Authentication
- Login with email and password
- Token-based authentication
- Auto-redirect on session expiry

### Employee Management
- View all employees in a table
- Add new employees with complete details
- Edit existing employee information
- Delete employees
- Search and filter employees

### Attendance
- View attendance records by date
- Filter by employee
- See check-in/check-out times
- Track work hours
- Status indicators (Present, Absent, Late, etc.)

### Payroll
- Generate payroll for date ranges
- View salary calculations
- See attendance-based deductions
- Export payroll data

### Reports
- Comprehensive attendance reports
- Visual attendance rate indicators
- Export functionality
- Date range filtering

## Design Features

- **Mobile-First**: Fully responsive design
- **Blue Theme**: Primary blue color scheme
- **Light UI**: Clean, light interface
- **Smooth Animations**: Framer Motion animations
- **Modern Components**: Rounded corners, shadows, and gradients
- **Accessible**: Proper contrast and focus states

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

The `.env.example` file is provided as a template. Copy it to `.env` and update as needed:

```bash
cp .env.example .env
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - Internal Use Only
