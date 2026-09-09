import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  Users,
  Clock,
  Award,
  TrendingUp,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  Eye,
  Copy,
  Trash2,
  CheckCircle2,
  Calendar,
  BookOpen,
  UserCheck,
  Video,
  MapPin,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function TrainingManagement() {
  const [selectedOverviewFilter, setSelectedOverviewFilter] = useState('This Year')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [activeActionMenuId, setActiveActionMenuId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  // State for Training Programs List
  const [programs, setPrograms] = useState([
    {
      id: 1,
      name: 'Data Security Awareness',
      category: 'Compliance',
      trainer: 'Rohit Gupta',
      enrolled: 45,
      completed: 32,
      pct: '71.11%',
      status: 'In Progress',
      mode: 'Online'
    },
    {
      id: 2,
      name: 'JavaScript Fundamentals',
      category: 'Technical Skills',
      trainer: 'Ankit Verma',
      enrolled: 30,
      completed: 30,
      pct: '100%',
      status: 'Completed',
      mode: 'Online'
    },
    {
      id: 3,
      name: 'Customer Service Excellence',
      category: 'Soft Skills',
      trainer: 'Neha Verma',
      enrolled: 28,
      completed: 20,
      pct: '71.43%',
      status: 'In Progress',
      mode: 'Classroom'
    },
    {
      id: 4,
      name: 'Project Management Basics',
      category: 'Leadership',
      trainer: 'Vikram Singh',
      enrolled: 35,
      completed: 15,
      pct: '42.86%',
      status: 'Upcoming',
      mode: 'Classroom'
    },
    {
      id: 5,
      name: 'Workplace Ethics',
      category: 'Compliance',
      trainer: 'Pooja Sharma',
      enrolled: 40,
      completed: 40,
      pct: '100%',
      status: 'Completed',
      mode: 'Online'
    }
  ])

  // New Training Form state
  const [newProgram, setNewProgram] = useState({
    name: '',
    category: 'Technical Skills',
    trainer: '',
    enrolled: 25,
    mode: 'Online',
    startDate: ''
  })

  // Upcoming Trainings Data
  const upcomingTrainings = [
    {
      id: 1,
      day: '22',
      month: 'May',
      title: 'Effective Communication',
      trainer: 'Neha Verma',
      time: '10:00 AM - 12:00 PM',
      mode: 'Online'
    },
    {
      id: 2,
      day: '25',
      month: 'May',
      title: 'Time Management',
      trainer: 'Amit Kumar',
      time: '02:00 PM - 04:00 PM',
      mode: 'Classroom'
    },
    {
      id: 3,
      day: '28',
      month: 'May',
      title: 'Excel Advanced',
      trainer: 'Pooja Sharma',
      time: '11:00 AM - 01:00 PM',
      mode: 'Online'
    },
    {
      id: 4,
      day: '30',
      month: 'May',
      title: 'Leadership Essentials',
      trainer: 'Vikram Singh',
      time: '03:00 PM - 05:00 PM',
      mode: 'Classroom'
    }
  ]

  // Top Learners Leaderboard Data
  const topLearners = [
    {
      rank: 1,
      name: 'Rahul Sharma',
      role: 'Software Developer',
      completedCount: 12,
      score: 960,
      avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=FEF3C7&color=B45309'
    },
    {
      rank: 2,
      name: 'Priya Singh',
      role: 'UI/UX Designer',
      completedCount: 10,
      score: 850,
      avatar: 'https://ui-avatars.com/api/?name=Priya+Singh&background=E0E7FF&color=3730A3'
    },
    {
      rank: 3,
      name: 'Amit Kumar',
      role: 'System Analyst',
      completedCount: 9,
      score: 780,
      avatar: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=FFEDD5&color=C2410C'
    },
    {
      rank: 4,
      name: 'Sneha Patel',
      role: 'HR Executive',
      completedCount: 8,
      score: 720,
      avatar: 'https://ui-avatars.com/api/?name=Sneha+Patel&background=F3E8FF&color=6B21A8'
    },
    {
      rank: 5,
      name: 'Ankit Verma',
      role: 'Backend Engineer',
      completedCount: 8,
      score: 700,
      avatar: 'https://ui-avatars.com/api/?name=Ankit+Verma&background=DCFCE7&color=15803D'
    }
  ]

  const handleAddProgram = (e) => {
    e.preventDefault()
    if (!newProgram.name || !newProgram.trainer) {
      toast.error('Please enter program name and trainer')
      return
    }

    const created = {
      id: Date.now(),
      name: newProgram.name,
      category: newProgram.category,
      trainer: newProgram.trainer,
      enrolled: Number(newProgram.enrolled) || 20,
      completed: 0,
      pct: '0%',
      status: 'Upcoming',
      mode: newProgram.mode
    }

    setPrograms([created, ...programs])
    setIsAddModalOpen(false)
    setNewProgram({ name: '', category: 'Technical Skills', trainer: '', enrolled: 25, mode: 'Online', startDate: '' })
    toast.success('Training Program added successfully!')
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Top Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Training Management</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-medium">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gray-700 font-semibold">Training</span>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98] w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Training Program</span>
        </button>
      </div>

      {/* 5 Top Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-gray-500 truncate">Total Programs</p>
            <p className="text-xl font-extrabold text-gray-900 leading-tight mt-0.5">24</p>
            <p className="text-[10px] text-blue-600 font-semibold truncate mt-0.5">Active Programs</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-gray-500 truncate">Enrolled Employees</p>
            <p className="text-xl font-extrabold text-gray-900 leading-tight mt-0.5">312</p>
            <p className="text-[10px] text-emerald-600 font-semibold truncate mt-0.5">This Year</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-gray-500 truncate">Training Hours</p>
            <p className="text-xl font-extrabold text-gray-900 leading-tight mt-0.5">1,245</p>
            <p className="text-[10px] text-purple-600 font-semibold truncate mt-0.5">Total Hours</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-gray-500 truncate">Completed Trainings</p>
            <p className="text-xl font-extrabold text-gray-900 leading-tight mt-0.5">186</p>
            <p className="text-[10px] text-amber-600 font-semibold truncate mt-0.5">This Year</p>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-gray-500 truncate">Completion Rate</p>
            <p className="text-xl font-extrabold text-gray-900 leading-tight mt-0.5">78.85%</p>
            <p className="text-[10px] text-cyan-600 font-semibold truncate mt-0.5">This Year</p>
          </div>
        </div>
      </div>

      {/* Middle Grid Row (3 Cards: Overview + Categories + Upcoming) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Card 1: Training Overview (Span 5) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-3 h-full">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Training Overview</h3>
              <select
                value={selectedOverviewFilter}
                onChange={(e) => setSelectedOverviewFilter(e.target.value)}
                className="text-[11px] font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200 focus:outline-none cursor-pointer"
              >
                <option value="This Year">This Year</option>
                <option value="Q2 2024">Q2 2024</option>
                <option value="Last Year">Last Year</option>
              </select>
            </div>

            {/* Legend indicator */}
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-[11px]">Enrolled Employees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px]">Completed Employees</span>
              </div>
            </div>
          </div>

          {/* Dual Line Graph SVG */}
          <div className="pt-1">
            <div className="relative h-36 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 360 130">
                {/* Horizontal Grid lines */}
                <line x1="20" y1="15" x2="355" y2="15" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="20" y1="45" x2="355" y2="45" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="20" y1="75" x2="355" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="20" y1="105" x2="355" y2="105" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

                {/* Enrolled Path (Blue) */}
                <path
                  d="M 25 90 L 55 70 L 85 65 L 115 60 L 145 48 L 175 46 L 205 36 L 235 28 L 265 20 L 295 10 L 325 16 L 355 20"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Completed Path (Green) */}
                <path
                  d="M 25 105 L 55 88 L 85 84 L 115 76 L 145 64 L 175 66 L 205 56 L 235 48 L 265 40 L 295 32 L 325 32 L 355 32"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Dots on Enrolled (Blue) */}
                <circle cx="25" cy="90" r="3" fill="#2563eb" />
                <circle cx="85" cy="65" r="3" fill="#2563eb" />
                <circle cx="145" cy="48" r="3" fill="#2563eb" />
                <circle cx="205" cy="36" r="3" fill="#2563eb" />
                <circle cx="265" cy="20" r="3" fill="#2563eb" />
                <circle cx="325" cy="16" r="3" fill="#2563eb" />

                {/* Dots on Completed (Green) */}
                <circle cx="25" cy="105" r="3" fill="#10b981" />
                <circle cx="85" cy="84" r="3" fill="#10b981" />
                <circle cx="145" cy="64" r="3" fill="#10b981" />
                <circle cx="205" cy="56" r="3" fill="#10b981" />
                <circle cx="265" cy="40" r="3" fill="#10b981" />
                <circle cx="325" cy="32" r="3" fill="#10b981" />

                {/* X Axis Month Labels */}
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => (
                  <text key={m} x={25 + idx * 30} y="124" textAnchor="middle" className="text-[9px] fill-gray-400 font-semibold">
                    {m}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2: Training Categories (Span 4) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-3 h-full">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900">Training Categories</h3>
          </div>

          <div className="flex items-center gap-3 pt-1 flex-1">
            {/* SVG Donut Chart */}
            <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
              <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="58" stroke="#2563eb" strokeWidth="20" fill="transparent" strokeDasharray="121.5 242.9" strokeDashoffset="0" />
                <circle cx="80" cy="80" r="58" stroke="#10b981" strokeWidth="20" fill="transparent" strokeDasharray="91.1 273.3" strokeDashoffset="-121.5" />
                <circle cx="80" cy="80" r="58" stroke="#8b5cf6" strokeWidth="20" fill="transparent" strokeDasharray="60.7 303.7" strokeDashoffset="-212.6" />
                <circle cx="80" cy="80" r="58" stroke="#f59e0b" strokeWidth="20" fill="transparent" strokeDasharray="45.5 318.9" strokeDashoffset="-273.3" />
                <circle cx="80" cy="80" r="58" stroke="#64748b" strokeWidth="20" fill="transparent" strokeDasharray="45.5 318.9" strokeDashoffset="-318.8" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-gray-900 leading-none">24</span>
                <span className="text-[9px] font-semibold text-gray-400 mt-0.5">Programs</span>
              </div>
            </div>

            {/* Category Legend */}
            <div className="space-y-1.5 text-xs flex-1 min-w-0">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  <span className="text-gray-700 font-semibold truncate">Technical Skills</span>
                </div>
                <span className="font-bold text-gray-900 shrink-0 ml-1 font-mono">8 <span className="text-[9px] text-gray-400 font-normal">(33.3%)</span></span>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-gray-700 font-semibold truncate">Soft Skills</span>
                </div>
                <span className="font-bold text-gray-900 shrink-0 ml-1 font-mono">6 <span className="text-[9px] text-gray-400 font-normal">(25.0%)</span></span>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                  <span className="text-gray-700 font-semibold truncate">Compliance</span>
                </div>
                <span className="font-bold text-gray-900 shrink-0 ml-1 font-mono">4 <span className="text-[9px] text-gray-400 font-normal">(16.7%)</span></span>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-gray-700 font-semibold truncate">Leadership</span>
                </div>
                <span className="font-bold text-gray-900 shrink-0 ml-1 font-mono">3 <span className="text-[9px] text-gray-400 font-normal">(12.5%)</span></span>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0" />
                  <span className="text-gray-700 font-semibold truncate">Others</span>
                </div>
                <span className="font-bold text-gray-900 shrink-0 ml-1 font-mono">3 <span className="text-[9px] text-gray-400 font-normal">(12.5%)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Upcoming Trainings (Span 3) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-3 h-full">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900">Upcoming Trainings</h3>
          </div>

          <div className="space-y-2 pt-1 flex-1">
            {upcomingTrainings.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Date Badge */}
                  <div className="w-9 h-10 rounded-lg bg-slate-100 text-gray-800 flex flex-col items-center justify-center shrink-0 border border-slate-200/80">
                    <span className="text-xs font-black leading-none">{item.day}</span>
                    <span className="text-[8px] font-bold text-gray-500 uppercase mt-0.5">{item.month}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-gray-900 truncate">{item.title}</p>
                    <p className="text-[10px] text-gray-400 truncate">By: {item.trainer}</p>
                    <p className="text-[9px] text-gray-500 font-mono">{item.time}</p>
                  </div>
                </div>

                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold shrink-0 border ${
                  item.mode === 'Online'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                    : 'bg-blue-50 text-blue-700 border-blue-200/60'
                }`}>
                  {item.mode}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid Row (Recent Training Programs Table + Top Learners) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Training Programs Table Card (Span 8) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Recent Training Programs</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  <th className="py-3 px-4">PROGRAM NAME</th>
                  <th className="py-3 px-4">CATEGORY</th>
                  <th className="py-3 px-4">TRAINER</th>
                  <th className="py-3 px-4 text-center">ENROLLED</th>
                  <th className="py-3 px-4 text-center">COMPLETED</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {programs.map((prog) => (
                  <tr key={prog.id} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{prog.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{prog.category}</td>
                    <td className="py-3.5 px-4 text-slate-600">{prog.trainer}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{prog.enrolled}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                      {prog.completed} <span className="text-[10px] text-gray-400">({prog.pct})</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        prog.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : prog.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {prog.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveActionMenuId(activeActionMenuId === prog.id ? null : prog.id)
                        }}
                        className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeActionMenuId === prog.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveActionMenuId(null)}
                          />
                          <div className="absolute right-4 top-10 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1.5 text-left text-xs space-y-0.5">
                            <button
                              onClick={() => {
                                setActiveActionMenuId(null)
                                toast.info(`Viewing "${prog.name}"`)
                              }}
                              className="w-full px-3 py-1.5 flex items-center gap-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Program</span>
                            </button>

                            {prog.status !== 'Completed' && (
                              <button
                                onClick={() => {
                                  setActiveActionMenuId(null)
                                  setPrograms(programs.map(p => p.id === prog.id ? { ...p, completed: p.enrolled, pct: '100%', status: 'Completed' } : p))
                                  toast.success(`"${prog.name}" marked as completed!`)
                                }}
                                className="w-full px-3 py-1.5 flex items-center gap-2 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Mark Completed</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setActiveActionMenuId(null)
                                const cloned = { ...prog, id: Date.now(), name: `${prog.name} (Copy)` }
                                setPrograms([cloned, ...programs])
                                toast.success(`Duplicated "${prog.name}"`)
                              }}
                              className="w-full px-3 py-1.5 flex items-center gap-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Duplicate</span>
                            </button>

                            <div className="border-t border-gray-100 my-1" />

                            <button
                              onClick={() => {
                                setActiveActionMenuId(null)
                                setPrograms(programs.filter(p => p.id !== prog.id))
                                toast.success(`Deleted "${prog.name}"`)
                              }}
                              className="w-full px-3 py-1.5 flex items-center gap-2 text-red-600 hover:bg-red-50 font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
            <span>Showing 1 to {programs.length} of 24 programs</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[1, 2, 3, '...', 5].map((page, i) => (
                <button
                  key={i}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  className={`w-6 h-6 rounded-md text-[11px] font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="p-1 rounded text-gray-400 hover:text-gray-700">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Top Learners Card (Span 4) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900">Top Learners</h3>
          </div>

          <div className="space-y-3">
            {topLearners.map((learner) => (
              <div key={learner.rank} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    learner.rank === 1
                      ? 'bg-amber-400 text-white shadow-2xs'
                      : learner.rank === 2
                      ? 'bg-slate-300 text-slate-800'
                      : learner.rank === 3
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {learner.rank}
                  </span>

                  <img
                    src={learner.avatar}
                    alt={learner.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <p className="font-bold text-xs text-gray-900">{learner.name}</p>
                    <p className="text-[10px] font-medium text-gray-400">Completed {learner.completedCount} Trainings</p>
                  </div>
                </div>

                <span className="text-xs font-mono font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {learner.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Training Program Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-base font-bold text-gray-900">Add Training Program</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProgram} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Program Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Advanced React & TypeScript Mastery"
                    value={newProgram.name}
                    onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Category</label>
                    <select
                      value={newProgram.category}
                      onChange={(e) => setNewProgram({ ...newProgram, category: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="Technical Skills">Technical Skills</option>
                      <option value="Soft Skills">Soft Skills</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Training Mode</label>
                    <select
                      value={newProgram.mode}
                      onChange={(e) => setNewProgram({ ...newProgram, mode: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="Online">Online</option>
                      <option value="Classroom">Classroom</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Trainer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohit Gupta"
                      value={newProgram.trainer}
                      onChange={(e) => setNewProgram({ ...newProgram, trainer: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Enrolled Count</label>
                    <input
                      type="number"
                      value={newProgram.enrolled}
                      onChange={(e) => setNewProgram({ ...newProgram, enrolled: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newProgram.startDate}
                    onChange={(e) => setNewProgram({ ...newProgram, startDate: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-all"
                  >
                    Save & Add Program
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
