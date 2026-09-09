import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  Users,
  CheckCircle2,
  Star,
  Award,
  Plus,
  Calendar,
  Filter,
  ChevronRight,
  MoreVertical,
  Target,
  MessageSquare,
  Sliders,
  BarChart2,
  ArrowRight,
  X,
  UserCheck,
  Building2,
  Clock,
  Sparkles,
  Eye,
  Copy,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function Performance() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [selectedDept, setSelectedDept] = useState('All Departments')
  const [selectedCycleFilter, setSelectedCycleFilter] = useState('2024 Annual Review')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [activeActionMenuId, setActiveActionMenuId] = useState(null)

  // New Cycle Form state
  const [newCycle, setNewCycle] = useState({
    cycleName: '',
    type: 'Annual',
    startDate: '',
    endDate: '',
    department: 'All Departments',
    description: ''
  })

  // Sample Cycles State
  const [reviewCycles, setReviewCycles] = useState([
    {
      id: 1,
      name: '2024 Annual Review',
      type: 'Annual',
      duration: '01 Jan 2024 - 31 Dec 2024',
      employees: 186,
      completed: 112,
      pct: 60,
      status: 'In Progress'
    },
    {
      id: 2,
      name: 'Q2 Review 2024',
      type: 'Quarterly',
      duration: '01 Apr 2024 - 30 Jun 2024',
      employees: 186,
      completed: 48,
      pct: 26,
      status: 'In Progress'
    },
    {
      id: 3,
      name: 'Probation Review',
      type: 'Probation',
      duration: 'Ongoing',
      employees: 24,
      completed: 18,
      pct: 75,
      status: 'In Progress'
    }
  ])

  // Top Performers Data
  const topPerformers = [
    { name: 'Priya Singh', role: 'UI/UX Designer', score: '4.9', avatar: 'https://ui-avatars.com/api/?name=Priya+Singh&background=E0E7FF&color=3730A3' },
    { name: 'Rahul Sharma', role: 'Software Developer', score: '4.8', avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=DCFCE7&color=15803D' },
    { name: 'Sneha Patel', role: 'HR Executive', score: '4.7', avatar: 'https://ui-avatars.com/api/?name=Sneha+Patel&background=FEF3C7&color=B45309' },
    { name: 'Amit Kumar', role: 'System Analyst', score: '4.6', avatar: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=F3E8FF&color=6B21A8' },
    { name: 'Vikram Singh', role: 'Marketing Manager', score: '4.6', avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=DBEAFE&color=1E40AF' }
  ]

  const handleCreateCycle = (e) => {
    e.preventDefault()
    if (!newCycle.cycleName) {
      toast.error('Please enter a cycle name')
      return
    }

    const created = {
      id: Date.now(),
      name: newCycle.cycleName,
      type: newCycle.type,
      duration: `${newCycle.startDate || '01 Oct 2024'} - ${newCycle.endDate || '31 Dec 2024'}`,
      employees: 186,
      completed: 0,
      pct: 0,
      status: 'In Progress'
    }

    setReviewCycles([created, ...reviewCycles])
    setIsCreateModalOpen(false)
    setNewCycle({ cycleName: '', type: 'Annual', startDate: '', endDate: '', department: 'All Departments', description: '' })
    toast.success('Performance Review Cycle created successfully!')
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Top Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Performance Management</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-medium">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gray-700">Performance Management</span>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98] w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Review Cycle</span>
        </button>
      </div>

      {/* 5 Top Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-gray-500 truncate">Active Cycles</p>
            <p className="text-xl font-extrabold text-gray-900 leading-tight mt-0.5">{reviewCycles.length}</p>
            <p className="text-[10px] text-blue-600 font-semibold truncate mt-0.5">3 Running</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-gray-500 truncate">Employees Under Review</p>
            <p className="text-xl font-extrabold text-gray-900 leading-tight mt-0.5">186</p>
            <p className="text-[10px] text-emerald-600 font-semibold truncate mt-0.5">68.9% of Total</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-gray-500 truncate">Completed Reviews</p>
            <p className="text-xl font-extrabold text-gray-900 leading-tight mt-0.5">112</p>
            <p className="text-[10px] text-purple-600 font-semibold truncate mt-0.5">60.2% Progress</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-gray-500 truncate">Average Rating</p>
            <p className="text-xl font-extrabold text-gray-900 leading-tight mt-0.5">4.12 <span className="text-xs text-gray-400 font-normal">/ 5</span></p>
            <p className="text-[10px] text-amber-600 font-semibold truncate mt-0.5">Org Average</p>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-gray-500 truncate">High Performers</p>
            <p className="text-xl font-extrabold text-gray-900 leading-tight mt-0.5">32</p>
            <p className="text-[10px] text-teal-600 font-semibold truncate mt-0.5">17.2% of Total</p>
          </div>
        </div>
      </div>

      {/* Tabs & Controls Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-2.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto text-xs font-semibold">
          {['Overview', 'My Reviews', 'Team Reviews', 'Goals', 'Feedback', 'Calibration'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-blue-50 text-blue-600 border border-blue-100 font-bold shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right Filter Dropdowns */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none cursor-pointer pr-8"
            >
              <option value="All Departments">All Departments</option>
              <option value="IT">IT Infrastructure</option>
              <option value="HR">Human Resources</option>
              <option value="Design">Product Design</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedCycleFilter}
              onChange={(e) => setSelectedCycleFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none cursor-pointer pr-8"
            >
              <option value="2024 Annual Review">2024 Annual Review</option>
              <option value="Q2 Review 2024">Q2 Review 2024</option>
              <option value="Probation Review">Probation Review</option>
            </select>
          </div>
        </div>
      </div>

      {activeTab === 'Overview' && (
        <div className="space-y-6">
          {/* Middle 3 Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Card 1: Rating Distribution (Span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-900">Rating Distribution</h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  186 Total
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                {/* SVG Donut Chart */}
                <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
                  <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 160 160">
                    {/* Circumference = 2 * PI * 58 ≈ 364.42 */}
                    <circle cx="80" cy="80" r="58" stroke="#10b981" strokeWidth="20" fill="transparent" strokeDasharray="35.2 329.2" strokeDashoffset="0" />
                    <circle cx="80" cy="80" r="58" stroke="#3b82f6" strokeWidth="20" fill="transparent" strokeDasharray="109.7 254.7" strokeDashoffset="-35.2" />
                    <circle cx="80" cy="80" r="58" stroke="#f59e0b" strokeWidth="20" fill="transparent" strokeDasharray="141.0 223.4" strokeDashoffset="-144.9" />
                    <circle cx="80" cy="80" r="58" stroke="#8b5cf6" strokeWidth="20" fill="transparent" strokeDasharray="54.8 309.6" strokeDashoffset="-285.9" />
                    <circle cx="80" cy="80" r="58" stroke="#ef4444" strokeWidth="20" fill="transparent" strokeDasharray="23.5 340.9" strokeDashoffset="-340.7" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-extrabold text-gray-900 leading-none">186</span>
                    <span className="text-[9px] font-semibold text-gray-400 mt-0.5">Employees</span>
                  </div>
                </div>

                {/* Clean Fitted Rating Legend (No Text Overflow) */}
                <div className="space-y-1.5 text-xs flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-gray-700 font-semibold truncate text-[10px]">5 - Outstanding</span>
                    </div>
                    <span className="font-bold text-gray-900 text-[10px] shrink-0 ml-1 font-mono">18 <span className="text-[9px] text-gray-400 font-normal">(9.7%)</span></span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <span className="text-gray-700 font-semibold truncate text-[10px]">4 - Exceeds Exp.</span>
                    </div>
                    <span className="font-bold text-gray-900 text-[10px] shrink-0 ml-1 font-mono">56 <span className="text-[9px] text-gray-400 font-normal">(30.1%)</span></span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-gray-700 font-semibold truncate text-[10px]">3 - Meets Exp.</span>
                    </div>
                    <span className="font-bold text-gray-900 text-[10px] shrink-0 ml-1 font-mono">72 <span className="text-[9px] text-gray-400 font-normal">(38.7%)</span></span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                      <span className="text-gray-700 font-semibold truncate text-[10px]">2 - Needs Imp.</span>
                    </div>
                    <span className="font-bold text-gray-900 text-[10px] shrink-0 ml-1 font-mono">28 <span className="text-[9px] text-gray-400 font-normal">(15.1%)</span></span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span className="text-gray-700 font-semibold truncate text-[10px]">1 - Unsatisfactory</span>
                    </div>
                    <span className="font-bold text-gray-900 text-[10px] shrink-0 ml-1 font-mono">12 <span className="text-[9px] text-gray-400 font-normal">(6.5%)</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Performance Trend (Span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-900">Performance Trend</h3>
                <span className="text-[10px] font-semibold text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                  Average Rating
                </span>
              </div>

              {/* Line Graph SVG sitting right below header */}
              <div className="pt-1">
                <div className="relative h-36 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 130">
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid Lines */}
                    <line x1="25" y1="15" x2="285" y2="15" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="25" y1="45" x2="285" y2="45" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="25" y1="75" x2="285" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="25" y1="105" x2="285" y2="105" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Y Axis Labels */}
                    <text x="10" y="19" className="text-[9px] fill-gray-400 font-semibold">5</text>
                    <text x="10" y="49" className="text-[9px] fill-gray-400 font-semibold">4</text>
                    <text x="10" y="79" className="text-[9px] fill-gray-400 font-semibold">3</text>
                    <text x="10" y="109" className="text-[9px] fill-gray-400 font-semibold">2</text>

                    {/* Gradient Area Fill */}
                    <path
                      d="M 45 61.5 L 115 56.4 L 185 48.3 L 265 41.4 L 265 105 L 45 105 Z"
                      fill="url(#trendGradient)"
                    />

                    {/* Trend Line Path */}
                    <path
                      d="M 45 61.5 L 115 56.4 L 185 48.3 L 265 41.4"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Points & Labels */}
                    {/* 2021 */}
                    <circle cx="45" cy="61.5" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                    <text x="45" y="48" textAnchor="middle" className="text-[10px] fill-gray-700 font-bold">3.45</text>
                    <text x="45" y="122" textAnchor="middle" className="text-[10px] fill-gray-500 font-semibold">2021</text>

                    {/* 2022 */}
                    <circle cx="115" cy="56.4" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                    <text x="115" y="43" textAnchor="middle" className="text-[10px] fill-gray-700 font-bold">3.62</text>
                    <text x="115" y="122" textAnchor="middle" className="text-[10px] fill-gray-500 font-semibold">2022</text>

                    {/* 2023 */}
                    <circle cx="185" cy="48.3" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                    <text x="185" y="35" textAnchor="middle" className="text-[10px] fill-gray-700 font-bold">3.89</text>
                    <text x="185" y="122" textAnchor="middle" className="text-[10px] fill-gray-500 font-semibold">2023</text>

                    {/* 2024 */}
                    <circle cx="265" cy="41.4" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                    <text x="265" y="28" textAnchor="middle" className="text-[10px] fill-blue-700 font-extrabold">4.12</text>
                    <text x="265" y="122" textAnchor="middle" className="text-[10px] fill-gray-900 font-bold">2024</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 3: Goal Achievement (Span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-900">Goal Achievement</h3>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  Target: 80%
                </span>
              </div>

              {/* Semi-Circle Gauge sitting right below header */}
              <div className="flex flex-col items-center justify-center pt-1">
                <div className="relative flex items-center justify-center w-44 h-24">
                  <svg className="w-44 h-32" viewBox="0 0 160 90">
                    {/* Background Semi-Circle Track */}
                    <path
                      d="M 20 75 A 60 60 0 0 1 140 75"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="15"
                      strokeLinecap="round"
                    />
                    {/* Progress Semi-Circle Arc (78% filled) */}
                    <path
                      d="M 20 75 A 60 60 0 0 1 140 75"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="15"
                      strokeDasharray="188.49"
                      strokeDashoffset="41.47"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute top-10 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-extrabold text-gray-900 leading-none">78%</span>
                    <span className="text-[10px] font-semibold text-gray-400 mt-0.5">Goals Achieved</span>
                  </div>
                </div>

                <div className="mt-1 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-700">
                    <span className="text-emerald-600 font-extrabold">145</span> of 186 Company Goals Done
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Active Review Cycles (Span 8) + Top Performers (Span 4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Active Review Cycles Table Card */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Active Review Cycles</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      <th className="py-3 px-4">CYCLE NAME</th>
                      <th className="py-3 px-4">TYPE</th>
                      <th className="py-3 px-4">DURATION</th>
                      <th className="py-3 px-4 text-center">EMPLOYEES</th>
                      <th className="py-3 px-4 text-center">COMPLETED</th>
                      <th className="py-3 px-4">PROGRESS</th>
                      <th className="py-3 px-4 text-center">STATUS</th>
                      <th className="py-3 px-4 text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                    {reviewCycles.map((cycle) => (
                      <tr key={cycle.id} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{cycle.name}</td>
                        <td className="py-3.5 px-4 text-slate-600">{cycle.type}</td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{cycle.duration}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-900">{cycle.employees}</td>
                        <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                          {cycle.completed} <span className="text-[10px] text-gray-400">({cycle.pct}%)</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${cycle.pct}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500">{cycle.pct}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            cycle.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {cycle.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveActionMenuId(activeActionMenuId === cycle.id ? null : cycle.id)
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeActionMenuId === cycle.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveActionMenuId(null)}
                              />
                              <div className="absolute right-4 top-10 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1.5 text-left text-xs space-y-0.5">
                                <button
                                  onClick={() => {
                                    setActiveActionMenuId(null)
                                    toast.info(`Viewing details for "${cycle.name}"`)
                                  }}
                                  className="w-full px-3 py-1.5 flex items-center gap-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View Details</span>
                                </button>

                                {cycle.status !== 'Completed' && (
                                  <button
                                    onClick={() => {
                                      setActiveActionMenuId(null)
                                      setReviewCycles(reviewCycles.map(c => c.id === cycle.id ? { ...c, completed: c.employees, pct: 100, status: 'Completed' } : c))
                                      toast.success(`"${cycle.name}" marked as completed`)
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
                                    const cloned = { ...cycle, id: Date.now(), name: `${cycle.name} (Copy)` }
                                    setReviewCycles([cloned, ...reviewCycles])
                                    toast.success(`Duplicated "${cycle.name}"`)
                                  }}
                                  className="w-full px-3 py-1.5 flex items-center gap-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Duplicate Cycle</span>
                                </button>

                                <div className="border-t border-gray-100 my-1" />

                                <button
                                  onClick={() => {
                                    setActiveActionMenuId(null)
                                    setReviewCycles(reviewCycles.filter(c => c.id !== cycle.id))
                                    toast.success(`Deleted "${cycle.name}"`)
                                  }}
                                  className="w-full px-3 py-1.5 flex items-center gap-2 text-red-600 hover:bg-red-50 font-medium"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Cycle</span>
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
                <span>Showing 1 to {reviewCycles.length} of {reviewCycles.length} cycles</span>
              </div>
            </div>

            {/* Top Performers Card (Span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col">
              <div className="pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Top Performers</h3>
              </div>

              <div className="space-y-2.5 pt-3">
                {topPerformers.map((emp, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-bold text-xs text-gray-900">{emp.name}</p>
                        <p className="text-[10px] font-medium text-gray-400">{emp.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-xs">
                      <span>{emp.score}</span>
                      <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'Overview' && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-3">
          <Sparkles className="w-12 h-12 text-blue-500 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">{activeTab} Section</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Viewing detailed {activeTab.toLowerCase()} data and appraisal workflows for 2024 Annual Review.
          </p>
          <button
            onClick={() => setActiveTab('Overview')}
            className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
          >
            Back to Overview
          </button>
        </div>
      )}

      {/* Create Review Cycle Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-base font-bold text-gray-900">Create Review Cycle</h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCycle} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Cycle Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q3 Review 2024 or Annual Appraisal 2025"
                    value={newCycle.cycleName}
                    onChange={(e) => setNewCycle({ ...newCycle, cycleName: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Review Type</label>
                    <select
                      value={newCycle.type}
                      onChange={(e) => setNewCycle({ ...newCycle, type: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="Annual">Annual</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Probation">Probation</option>
                      <option value="Half-Yearly">Half-Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Department</label>
                    <select
                      value={newCycle.department}
                      onChange={(e) => setNewCycle({ ...newCycle, department: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="All Departments">All Departments</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={newCycle.startDate}
                      onChange={(e) => setNewCycle({ ...newCycle, startDate: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={newCycle.endDate}
                      onChange={(e) => setNewCycle({ ...newCycle, endDate: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Instructions / Description</label>
                  <textarea
                    rows="3"
                    placeholder="Enter instructions for employees and reviewers..."
                    value={newCycle.description}
                    onChange={(e) => setNewCycle({ ...newCycle, description: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-all"
                  >
                    Save & Launch Cycle
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
