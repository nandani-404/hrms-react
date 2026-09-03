import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Trophy,
  Gift,
  Award,
  Users,
  Plus,
  Search,
  Eye,
  MoreVertical,
  ThumbsUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  Upload,
  CheckCircle2,
  Medal,
  Star,
  Filter,
  ShieldCheck,
  Trash2,
  Copy,
  CalendarDays,
  Settings2,
  ChevronDown,
} from 'lucide-react'
import EmployeeOfTheMonthCard from '../components/EmployeeOfTheMonthCard'
import { useAuth } from '../context/AuthContext'
import { Avatar, cx } from '../components/ui'

/* ─── Initial Recognitions Data ─── */
const initialRecognitions = [
  {
    id: 'REC-2024-001',
    employee: { name: 'Neha Verma', role: 'HR Executive', dept: 'Human Resources', avatar: '/storage/avatars/neha.jpg' },
    achievement: 'Exceptional Performance',
    achievementDesc: 'Outstanding performance in Q1 2024',
    reward: 'iPad Air',
    rewardValue: 54900,
    rewardIcon: 'tablet',
    category: 'Performance',
    recognizedBy: { name: 'Amit Kumar', role: 'HR Manager', avatar: '/storage/avatars/amit.jpg' },
    date: '20 May 2024',
    likes: 24,
    comment: 'Excellent leadership and dedication to the HR initiatives. Keep up the great work!',
  },
  {
    id: 'REC-2024-002',
    employee: { name: 'Rahul Sharma', role: 'Senior Developer', dept: 'Engineering', avatar: '/storage/avatars/amit.jpg' },
    achievement: 'Innovation Award',
    achievementDesc: 'Developed new automation framework',
    reward: 'Amazon Voucher',
    rewardValue: 10000,
    rewardIcon: 'voucher',
    category: 'Innovation',
    recognizedBy: { name: 'Saurabh Singh', role: 'CTO', avatar: '/storage/avatars/amit.jpg' },
    date: '18 May 2024',
    likes: 18,
    comment: 'Amazing innovation and problem-solving skills. You inspire the whole team!',
  },
  {
    id: 'REC-2024-003',
    employee: { name: 'Priya Patel', role: 'Sales Executive', dept: 'Sales', avatar: '/storage/avatars/neha.jpg' },
    achievement: 'Sales Excellence',
    achievementDesc: 'Highest sales achievement in April',
    reward: 'Cash Award',
    rewardValue: 25000,
    rewardIcon: 'cash',
    category: 'Performance',
    recognizedBy: { name: 'Vikram Mehta', role: 'Sales Manager', avatar: '/storage/avatars/amit.jpg' },
    date: '15 May 2024',
    likes: 32,
    comment: 'Congratulations on achieving the highest sales this month. Well deserved!',
  },
  {
    id: 'REC-2024-004',
    employee: { name: 'Arjun Singh', role: 'Product Designer', dept: 'Design', avatar: '/storage/avatars/amit.jpg' },
    achievement: 'Team Player',
    achievementDesc: 'Excellent collaboration and support',
    reward: 'Smart Watch',
    rewardValue: 12999,
    rewardIcon: 'watch',
    category: 'Teamwork',
    recognizedBy: { name: 'Rohan Das', role: 'Product Manager', avatar: '/storage/avatars/amit.jpg' },
    date: '12 May 2024',
    likes: 15,
    comment: 'Thank you for always being supportive and a great team player!',
  },
  {
    id: 'REC-2024-005',
    employee: { name: 'Deepika Kumari', role: 'QA Engineer', dept: 'Engineering', avatar: '/storage/avatars/neha.jpg' },
    achievement: 'Above & Beyond',
    achievementDesc: 'Went above and beyond for the project',
    reward: 'Flipkart Voucher',
    rewardValue: 8000,
    rewardIcon: 'voucher',
    category: 'Customer Focus',
    recognizedBy: { name: 'Neha Verma', role: 'HR Executive', avatar: '/storage/avatars/neha.jpg' },
    date: '10 May 2024',
    likes: 21,
    comment: 'Went extra miles to ensure clean release quality. Fantastic commitment!',
  },
]

/* ─── Top Performers List ─── */
const topPerformersData = [
  { rank: 1, name: 'Rahul Sharma', dept: 'Engineering', awardsCount: 5, totalValue: 85000, avatar: '/storage/avatars/amit.jpg' },
  { rank: 2, name: 'Priya Patel', dept: 'Sales', awardsCount: 4, totalValue: 62000, avatar: '/storage/avatars/neha.jpg' },
  { rank: 3, name: 'Neha Verma', dept: 'HR', awardsCount: 4, totalValue: 59900, avatar: '/storage/avatars/neha.jpg' },
  { rank: 4, name: 'Arjun Singh', dept: 'Design', awardsCount: 3, totalValue: 35000, avatar: '/storage/avatars/amit.jpg' },
  { rank: 5, name: 'Deepika Kumari', dept: 'QA', awardsCount: 3, totalValue: 24000, avatar: '/storage/avatars/neha.jpg' },
]

/* ─── Upcoming Awards Calendar ─── */
const initialUpcomingAwards = [
  { id: 'UPC-001', title: 'Employee of the Month — May', category: 'Performance', date: '01 Jun 2024', status: 'Nominations Open', owner: 'HR Committee' },
  { id: 'UPC-002', title: 'Quarterly Innovation Award', category: 'Innovation', date: '15 Jun 2024', status: 'Scheduled', owner: 'CTO Office' },
  { id: 'UPC-003', title: 'Long Service Awards (5 / 10 Yrs)', category: 'Milestone', date: '30 Jun 2024', status: 'Scheduled', owner: 'HR Committee' },
  { id: 'UPC-004', title: 'Customer Champion of the Quarter', category: 'Customer Focus', date: '10 Jul 2024', status: 'Nominations Open', owner: 'Sales Leadership' },
]

/* ─── Nominations raised by HR ─── */
const initialNominations = [
  { id: 'NOM-2024-001', employee: 'Deepika Kumari', dept: 'Engineering', award: 'Quarterly Innovation Award', reason: 'Automated the entire regression suite, cutting release time by 40%.', date: '16 May 2024', status: 'Under Review' },
  { id: 'NOM-2024-002', employee: 'Arjun Singh', dept: 'Design', award: 'Employee of the Month — May', reason: 'Redesigned the onboarding flow with measurable drop-off improvement.', date: '14 May 2024', status: 'Approved' },
]

/* ─── Past Employee of the Month winners ─── */
const pastWinners = [
  { month: 'April 2024', name: 'Rahul Sharma', dept: 'Engineering', avatar: '/storage/avatars/amit.jpg' },
  { month: 'March 2024', name: 'Priya Patel', dept: 'Sales', avatar: '/storage/avatars/neha.jpg' },
  { month: 'February 2024', name: 'Neha Verma', dept: 'Human Resources', avatar: '/storage/avatars/neha.jpg' },
  { month: 'January 2024', name: 'Arjun Singh', dept: 'Design', avatar: '/storage/avatars/amit.jpg' },
]

const CATEGORIES = ['Performance', 'Innovation', 'Teamwork', 'Customer Focus', 'Milestone']

const EMPLOYEE_DIRECTORY = [
  { name: 'Neha Verma', role: 'HR Executive', dept: 'Human Resources', avatar: '/storage/avatars/neha.jpg' },
  { name: 'Rahul Sharma', role: 'Senior Developer', dept: 'Engineering', avatar: '/storage/avatars/amit.jpg' },
  { name: 'Priya Patel', role: 'Sales Executive', dept: 'Sales', avatar: '/storage/avatars/neha.jpg' },
  { name: 'Arjun Singh', role: 'Product Designer', dept: 'Design', avatar: '/storage/avatars/amit.jpg' },
  { name: 'Deepika Kumari', role: 'QA Engineer', dept: 'Engineering', avatar: '/storage/avatars/neha.jpg' },
]

const REWARD_TYPES = ['Amazon Voucher', 'Cash Award', 'Gadget / Electronic', 'Flipkart Voucher', 'Extra Leave Day']

const todayLabel = () =>
  new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

export default function HRRewards() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [recognitions, setRecognitions] = useState(initialRecognitions)
  const [activeTab, setActiveTab] = useState('Recent Recognitions')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRec, setSelectedRec] = useState(null)
  
  const [nominations, setNominations] = useState(initialNominations)
  const [upcomingAwards] = useState(initialUpcomingAwards)
  const [rewardTypes, setRewardTypes] = useState(REWARD_TYPES)

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isNominateModalOpen, setIsNominateModalOpen] = useState(false)
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false)
  const [isWinnersModalOpen, setIsWinnersModalOpen] = useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)

  // Recognition wall + row action menu
  const [showFullWall, setShowFullWall] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const [likedIds, setLikedIds] = useState(() => new Set())
  const [giftFileName, setGiftFileName] = useState('')
  const menuRef = useRef(null)

  // Close the row action menu on outside click or Escape.
  useEffect(() => {
    if (!openMenuId) return undefined
    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null)
    }
    const onKeyDown = (e) => { if (e.key === 'Escape') setOpenMenuId(null) }
    // The menu is position-fixed to escape the table's overflow clipping, so it
    // cannot follow the row — close it rather than let it drift.
    const onReflow = () => setOpenMenuId(null)
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onReflow, true)
    window.addEventListener('resize', onReflow)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onReflow, true)
      window.removeEventListener('resize', onReflow)
    }
  }, [openMenuId])

  const toggleRowMenu = (e, id) => {
    if (openMenuId === id) {
      setOpenMenuId(null)
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    const MENU_W = 176
    setMenuPos({
      top: rect.bottom + 6,
      left: Math.max(8, Math.min(rect.right - MENU_W, window.innerWidth - MENU_W - 8)),
    })
    setOpenMenuId(id)
  }

  // Applaud toggles, so a second click takes the applause back.
  const handleLike = (id) => {
    const alreadyLiked = likedIds.has(id)
    setLikedIds((prev) => {
      const next = new Set(prev)
      if (alreadyLiked) next.delete(id)
      else next.add(id)
      return next
    })
    setRecognitions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + (alreadyLiked ? -1 : 1) } : r))
    )
    toast.success(alreadyLiked ? 'Applause removed' : 'Applauded recognition!')
  }

  const handleIssueReward = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const employeeName = data.get('employee')
    const person = EMPLOYEE_DIRECTORY.find((x) => x.name === employeeName)
    const created = {
      id: `REC-${new Date().getFullYear()}-${String(recognitions.length + 1).padStart(3, '0')}`,
      employee: person || { name: employeeName, role: 'Employee', dept: 'General', avatar: '' },
      achievement: (data.get('achievement') || '').trim() || `${data.get('category')} Award`,
      achievementDesc: (data.get('message') || '').trim() || 'Recognised for an outstanding contribution.',
      reward: data.get('reward'),
      rewardValue: Number(data.get('value')) || 0,
      rewardIcon: 'voucher',
      category: data.get('category'),
      recognizedBy: {
        name: user?.full_name || 'Diksha Rajvansh',
        role: 'HR',
        avatar: user?.profile_photo || '/storage/avatars/neha.jpg',
      },
      date: todayLabel(),
      likes: 0,
      comment: (data.get('message') || '').trim() || 'Thank you for your outstanding contribution!',
    }
    setRecognitions((prev) => [created, ...prev])
    setActiveTab('Recent Recognitions')
    setCurrentPage(1)
    setIsCreateModalOpen(false)
    toast.success(`Reward issued to ${created.employee.name}`)
  }

  const handleNominate = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const employeeName = data.get('employee')
    const person = EMPLOYEE_DIRECTORY.find((x) => x.name === employeeName)
    const created = {
      id: `NOM-${new Date().getFullYear()}-${String(nominations.length + 1).padStart(3, '0')}`,
      employee: employeeName,
      dept: person?.dept || 'General',
      award: data.get('award'),
      reason: (data.get('reason') || '').trim() || 'No justification provided.',
      date: todayLabel(),
      status: 'Under Review',
    }
    setNominations((prev) => [created, ...prev])
    setActiveTab('My Nominations')
    setIsNominateModalOpen(false)
    toast.success(`${employeeName} nominated for ${created.award}`)
  }

  const handleWithdrawNomination = (id) => {
    setNominations((prev) => prev.filter((n) => n.id !== id))
    toast.success(`Nomination ${id} withdrawn`)
  }

  const handleGiftUpload = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setIsGiftModalOpen(false)
    setGiftFileName('')
    toast.success(`Gift details saved for ${data.get('vendor') || 'the selected vendor'}`)
  }

  const handleDeleteRecognition = (id) => {
    setRecognitions((prev) => prev.filter((r) => r.id !== id))
    setOpenMenuId(null)
    toast.success(`Recognition ${id} deleted`)
  }

  const handleDuplicateRecognition = (rec) => {
    const copy = {
      ...rec,
      id: `REC-${new Date().getFullYear()}-${String(recognitions.length + 1).padStart(3, '0')}`,
      date: todayLabel(),
      likes: 0,
    }
    setRecognitions((prev) => [copy, ...prev])
    setOpenMenuId(null)
    setCurrentPage(1)
    toast.success(`Duplicated as ${copy.id}`)
  }

  const handleCopyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id)
      toast.success(`Copied ${id}`)
    } catch {
      toast.error('Clipboard is unavailable in this browser')
    }
    setOpenMenuId(null)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('All')
    setCurrentPage(1)
    setActiveTab('Recent Recognitions')
  }

  const handleRemoveRewardType = (type) => {
    setRewardTypes((prev) => prev.filter((t) => t !== type))
    toast.success(`Removed "${type}" from the reward catalogue`)
  }

  const handleAddRewardType = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const value = String(new FormData(form).get('type') || '').trim()
    if (!value) return
    if (rewardTypes.some((t) => t.toLowerCase() === value.toLowerCase())) {
      toast.error(`"${value}" is already in the catalogue`)
      return
    }
    setRewardTypes((prev) => [...prev, value])
    form.reset()
    toast.success(`Added "${value}" to the reward catalogue`)
  }

  // Filtered recognitions
  const filteredRecognitions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return recognitions.filter((r) => {
      const matchesQuery =
        !q ||
        r.employee.name.toLowerCase().includes(q) ||
        r.achievement.toLowerCase().includes(q) ||
        r.reward.toLowerCase().includes(q) ||
        r.recognizedBy.name.toLowerCase().includes(q)
      const matchesCat = categoryFilter === 'All' || r.category === categoryFilter
      return matchesQuery && matchesCat
    })
  }, [recognitions, searchQuery, categoryFilter])

  const ITEMS_PER_PAGE = 5
  const totalPages = Math.max(1, Math.ceil(filteredRecognitions.length / ITEMS_PER_PAGE))
  // Filtering can shrink the list below the current page — clamp so the table never renders blank.
  const safePage = Math.min(currentPage, totalPages)
  const firstIndex = (safePage - 1) * ITEMS_PER_PAGE
  const paginatedRecs = filteredRecognitions.slice(firstIndex, firstIndex + ITEMS_PER_PAGE)
  const wallItems = showFullWall ? filteredRecognitions : filteredRecognitions.slice(0, 4)
  const isFiltered = searchQuery.trim() !== '' || categoryFilter !== 'All'

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5">
            <button type="button" onClick={() => navigate('/dashboard')} className="hover:text-gray-800 hover:underline">Home</button>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <button type="button" onClick={clearFilters} className="hover:text-gray-800 hover:underline">Rewards &amp; Recognition</button>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-800 font-semibold">Overview</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-950">Rewards & Recognition</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              <ShieldCheck className="h-3.5 w-3.5" /> HR Portal
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          <Plus className="h-4.5 w-4.5" />
          Create New Reward
        </button>
      </div>

      {/* ── 5 KPI Summary Cards ── */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: 'Total Rewards Given',
            value: '126',
            sub: 'This Year',
            icon: <Trophy className="h-4.5 w-4.5 text-blue-600" />,
            iconBg: 'bg-blue-50 border-blue-100',
          },
          {
            label: 'Total Gifts Given',
            value: '₹8,45,000',
            sub: 'This Year',
            icon: <Gift className="h-4.5 w-4.5 text-emerald-600" />,
            iconBg: 'bg-emerald-50 border-emerald-100',
          },
          {
            label: 'Employees Recognized',
            value: '98',
            sub: 'This Year',
            icon: <Star className="h-4.5 w-4.5 text-amber-600" />,
            iconBg: 'bg-amber-50 border-amber-100',
          },
          {
            label: 'Pending Approvals',
            value: '12',
            sub: 'Requires Approval',
            icon: <Award className="h-4.5 w-4.5 text-purple-600" />,
            iconBg: 'bg-purple-50 border-purple-100',
          },
          {
            label: 'Active Nominations',
            value: String(nominations.length),
            sub: 'Open for review',
            icon: <Users className="h-4.5 w-4.5 text-indigo-600" />,
            iconBg: 'bg-indigo-50 border-indigo-100',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-2xs hover:shadow-xs hover:border-gray-300 transition-all group"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{card.label}</p>
              <h2 className="text-xl font-extrabold text-gray-950 mt-1 tracking-tight">{card.value}</h2>
              <p className="text-[11px] font-medium text-gray-400 mt-0.5">{card.sub}</p>
            </div>
            <span className={cx('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105', card.iconBg)}>
              {card.icon}
            </span>
          </div>
        ))}
      </div>

      {/* ── Main Layout: 70% Left / 30% Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols = 67%) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex gap-2 overflow-x-auto">
              {['Recent Recognitions', 'Top Performers', 'Upcoming Awards', 'My Nominations'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cx(
                    'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab: Recent Recognitions Table */}
          {activeTab === 'Recent Recognitions' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50/60">
                  <h2 className="text-base font-bold text-gray-900">Recent Recognitions</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search recognition..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                        className="w-56 rounded-lg border border-gray-300 bg-white pl-8 pr-8 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => { setSearchQuery(''); setCurrentPage(1) }}
                          title="Clear search"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                      <select
                        value={categoryFilter}
                        onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1) }}
                        aria-label="Filter by category"
                        className="appearance-none rounded-lg border border-gray-300 bg-white pl-8 pr-7 py-1.5 text-xs font-semibold text-gray-800 focus:border-blue-500 focus:outline-none cursor-pointer"
                      >
                        <option value="All">All Categories</option>
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                    </div>

                    <button
                      onClick={clearFilters}
                      disabled={!isFiltered}
                      title={isFiltered ? 'Clear search and category filters' : 'No filters applied'}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      View All Recognitions
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-gray-200 bg-gray-50/70 text-gray-600">
                      <tr>
                        <th className="py-3 px-5 font-semibold uppercase tracking-wider text-[11px]">Employee</th>
                        <th className="py-3 px-5 font-semibold uppercase tracking-wider text-[11px]">Achievement</th>
                        <th className="py-3 px-5 font-semibold uppercase tracking-wider text-[11px]">Reward / Gift</th>
                        <th className="py-3 px-5 font-semibold uppercase tracking-wider text-[11px]">Recognized By</th>
                        <th className="py-3 px-5 font-semibold uppercase tracking-wider text-[11px]">Date</th>
                        <th className="py-3 px-5 font-semibold uppercase tracking-wider text-[11px] text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedRecs.map((rec) => (
                        <tr key={rec.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={rec.employee.name} src={rec.employee.avatar} size="xs" />
                              <div>
                                <p className="text-xs font-bold text-gray-900 leading-tight">{rec.employee.name}</p>
                                <p className="text-[11px] text-gray-500 mt-0.5">{rec.employee.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <p className="text-xs font-bold text-gray-900">{rec.achievement}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[180px]">{rec.achievementDesc}</p>
                          </td>
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
                                <Gift className="h-3.5 w-3.5" />
                              </span>
                              <div>
                                <p className="text-xs font-bold text-gray-950">{rec.reward}</p>
                                <p className="text-[11px] font-semibold text-emerald-600">₹{rec.rewardValue.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Avatar name={rec.recognizedBy.name} src={rec.recognizedBy.avatar} size="xs" />
                              <div>
                                <p className="text-xs font-semibold text-gray-900">{rec.recognizedBy.name}</p>
                                <p className="text-[10px] text-gray-400">{rec.recognizedBy.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-5 text-xs text-gray-600 whitespace-nowrap">{rec.date}</td>
                          <td className="py-3.5 px-5 whitespace-nowrap text-center">
                            <div className="inline-flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedRec(rec)}
                                title="View Details"
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-2xs"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              <div ref={openMenuId === rec.id ? menuRef : null}>
                                <button
                                  onClick={(e) => toggleRowMenu(e, rec.id)}
                                  title="More Actions"
                                  aria-haspopup="menu"
                                  aria-expanded={openMenuId === rec.id}
                                  className={cx(
                                    'inline-flex h-7 w-7 items-center justify-center rounded-md border bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-2xs',
                                    openMenuId === rec.id ? 'border-blue-400 text-blue-600' : 'border-gray-200'
                                  )}
                                >
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </button>
                                {openMenuId === rec.id && (
                                  <div
                                    role="menu"
                                    style={{ top: menuPos.top, left: menuPos.left }}
                                    className="fixed z-40 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-left shadow-lg"
                                  >
                                    <button
                                      role="menuitem"
                                      onClick={() => { setSelectedRec(rec); setOpenMenuId(null) }}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                      <Eye className="h-3.5 w-3.5 text-gray-400" /> View details
                                    </button>
                                    <button
                                      role="menuitem"
                                      onClick={() => handleCopyId(rec.id)}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                      <Copy className="h-3.5 w-3.5 text-gray-400" /> Copy award ID
                                    </button>
                                    <button
                                      role="menuitem"
                                      onClick={() => handleDuplicateRecognition(rec)}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                      <Sparkles className="h-3.5 w-3.5 text-gray-400" /> Duplicate award
                                    </button>
                                    <div className="my-1 border-t border-gray-100" />
                                    <button
                                      role="menuitem"
                                      onClick={() => handleDeleteRecognition(rec.id)}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" /> Delete recognition
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredRecognitions.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-gray-400">
                            <Trophy className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                            <p className="text-xs font-semibold">No recognitions match your filters</p>
                            {isFiltered && (
                              <button
                                onClick={clearFilters}
                                className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700"
                              >
                                Clear filters
                              </button>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-t border-gray-100 bg-gray-50/60 text-xs">
                  <span className="text-gray-500">
                    {filteredRecognitions.length === 0
                      ? 'No recognitions to show'
                      : <>Showing <strong className="font-semibold text-gray-800">{firstIndex + 1}</strong> to <strong className="font-semibold text-gray-800">{firstIndex + paginatedRecs.length}</strong> of <strong className="font-semibold text-gray-800">{filteredRecognitions.length}</strong> recognitions</>}
                  </span>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                        title="Previous page"
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          aria-current={page === safePage ? 'page' : undefined}
                          className={cx(
                            'h-7 w-7 rounded text-xs font-semibold transition-colors',
                            page === safePage
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                          )}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                        title="Next page"
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Recognition Wall (Social Feed) ── */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                    <h2 className="text-base font-bold text-gray-900">Recognition Wall</h2>
                  </div>
                  <button
                    onClick={() => setShowFullWall((v) => !v)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {showFullWall ? 'Show Less' : `View Full Wall (${filteredRecognitions.length})`}
                    <ChevronDown className={cx('h-3.5 w-3.5 transition-transform', showFullWall && 'rotate-180')} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wallItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3 hover:border-gray-300 hover:bg-white transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar name={item.recognizedBy.name} src={item.recognizedBy.avatar} size="xs" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {item.recognizedBy.name} <span className="font-normal text-gray-500">recognized</span> {item.employee.name}
                          </p>
                          <p className="text-[10px] text-gray-400">{item.date}</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed font-medium bg-white/80 p-2.5 rounded-lg border border-gray-100">
                        "{item.comment}"
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                          <Gift className="h-3.5 w-3.5" />
                          {item.reward}
                        </span>
                        <button
                          onClick={() => handleLike(item.id)}
                          title={likedIds.has(item.id) ? 'Remove your applause' : 'Applaud this recognition'}
                          aria-pressed={likedIds.has(item.id)}
                          className={cx(
                            'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border shadow-2xs active:scale-95 transition-colors',
                            likedIds.has(item.id)
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-white text-gray-600 border-gray-200 hover:text-blue-600'
                          )}
                        >
                          <ThumbsUp className={cx('h-3.5 w-3.5', likedIds.has(item.id) ? 'fill-blue-600 text-blue-600' : 'text-blue-600')} />
                          <span>{item.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {wallItems.length === 0 && (
                    <p className="col-span-full py-8 text-center text-xs font-semibold text-gray-400">
                      No recognitions match your filters yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Top Performers */}
          {activeTab === 'Top Performers' && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-gray-900">Leaderboard · Top Recognized Performers</h2>
              <div className="space-y-3">
                {topPerformersData.map((tp) => (
                  <div key={tp.rank} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-gray-300 transition-all">
                    <div className="flex items-center gap-3">
                      <span className={cx(
                        'flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs shadow-2xs',
                        tp.rank === 1 ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-200' :
                        tp.rank === 2 ? 'bg-slate-300 text-slate-900' :
                        tp.rank === 3 ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-600'
                      )}>
                        #{tp.rank}
                      </span>
                      <Avatar name={tp.name} src={tp.avatar} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{tp.name}</p>
                        <p className="text-xs text-gray-500">{tp.dept}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-950">{tp.awardsCount} Rewards Won</p>
                        <p className="text-[11px] font-semibold text-emerald-600">₹{tp.totalValue.toLocaleString('en-IN')}</p>
                      </div>
                      <button
                        onClick={() => { setSearchQuery(tp.name); setCategoryFilter('All'); setCurrentPage(1); setActiveTab('Recent Recognitions') }}
                        title={`See every recognition for ${tp.name}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-gray-700 shadow-2xs hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all"
                      >
                        View Awards
                        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Upcoming Awards */}
          {activeTab === 'Upcoming Awards' && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-gray-50/60 px-6 py-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4.5 w-4.5 text-blue-600" />
                  <h2 className="text-base font-bold text-gray-900">Upcoming Award Cycles</h2>
                </div>
                <button
                  onClick={() => setIsNominateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" /> Nominate Someone
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {upcomingAwards.map((award) => (
                  <div key={award.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-gray-50/70 transition-colors">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600">
                        <Trophy className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900">{award.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {award.category} · Owned by {award.owner}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-900">{award.date}</p>
                        <span className={cx(
                          'mt-0.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold',
                          award.status === 'Nominations Open'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        )}>
                          {award.status}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (award.status !== 'Nominations Open') {
                            toast.error(`Nominations for "${award.title}" have not opened yet`)
                            return
                          }
                          setIsNominateModalOpen(true)
                        }}
                        className={cx(
                          'inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-[11px] font-bold shadow-2xs active:scale-95 transition-all',
                          award.status === 'Nominations Open'
                            ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                            : 'border-gray-200 bg-white text-gray-400'
                        )}
                      >
                        Nominate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: My Nominations */}
          {activeTab === 'My Nominations' && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-gray-50/60 px-6 py-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900">My Nominations</h2>
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[11px] font-bold text-gray-700">
                    {nominations.length}
                  </span>
                </div>
                <button
                  onClick={() => setIsNominateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" /> New Nomination
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {nominations.map((nom) => (
                  <div key={nom.id} className="flex flex-wrap items-start justify-between gap-3 px-6 py-4 hover:bg-gray-50/70 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">{nom.employee}</p>
                        <span className="font-mono text-[10px] text-gray-400">{nom.id}</span>
                        <span className={cx(
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold',
                          nom.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        )}>
                          {nom.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] font-semibold text-blue-600">{nom.award}</p>
                      <p className="mt-1 text-xs leading-relaxed text-gray-600">{nom.reason}</p>
                      <p className="mt-1 text-[10px] text-gray-400">{nom.dept} · Raised {nom.date}</p>
                    </div>
                    <button
                      onClick={() => handleWithdrawNomination(nom.id)}
                      title="Withdraw this nomination"
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-[11px] font-bold text-rose-600 shadow-2xs hover:bg-rose-50 active:scale-95 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Withdraw
                    </button>
                  </div>
                ))}
                {nominations.length === 0 && (
                  <div className="py-12 text-center">
                    <Users className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    <p className="text-xs font-semibold text-gray-400">You have not raised any nominations yet</p>
                    <button
                      onClick={() => setIsNominateModalOpen(true)}
                      className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      Nominate an employee
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols = 33%) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Employee of the Month Spotlight */}
          <EmployeeOfTheMonthCard
            name="Rahul Sharma"
            role="Senior Developer"
            month="April 2024"
            onViewAll={() => setIsWinnersModalOpen(true)}
          />

          {/* Card 2: Recognition by Category Donut Chart */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900">Recognition by Category</h3>
            <div className="flex items-center justify-center my-2">
              <div className="relative flex items-center justify-center">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="46" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                  <circle cx="60" cy="60" r="46" stroke="#3b82f6" strokeWidth="12" fill="none" strokeDasharray="103 289" strokeDashoffset="0" />
                  <circle cx="60" cy="60" r="46" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="64 289" strokeDashoffset="-103" />
                  <circle cx="60" cy="60" r="46" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="59 289" strokeDashoffset="-167" />
                  <circle cx="60" cy="60" r="46" stroke="#8b5cf6" strokeWidth="12" fill="none" strokeDasharray="39 289" strokeDashoffset="-226" />
                  <circle cx="60" cy="60" r="46" stroke="#9ca3af" strokeWidth="12" fill="none" strokeDasharray="23 289" strokeDashoffset="-265" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-lg font-extrabold text-gray-950 leading-none">126</p>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-1">Total</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Performance', val: '45 (35.7%)', dot: 'bg-blue-500' },
                { label: 'Innovation', val: '28 (22.2%)', dot: 'bg-emerald-500' },
                { label: 'Teamwork', val: '26 (20.6%)', dot: 'bg-amber-500' },
                { label: 'Customer Focus', val: '17 (13.5%)', dot: 'bg-purple-500' },
                { label: 'Other', val: '10 (7.9%)', dot: 'bg-gray-400' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    const target = item.label === 'Other' ? 'All' : item.label
                    setCategoryFilter(categoryFilter === target ? 'All' : target)
                    setCurrentPage(1)
                    setActiveTab('Recent Recognitions')
                  }}
                  title={`Filter recognitions by ${item.label}`}
                  className={cx(
                    'flex w-full items-center justify-between rounded-md px-2 py-1 -mx-2 text-gray-700 transition-colors hover:bg-gray-50',
                    categoryFilter === item.label && 'bg-blue-50 text-blue-800'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cx('h-2.5 w-2.5 rounded-full', item.dot)} />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">{item.val}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card 3: Quick Actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-gray-900 mb-2">Quick Actions</h3>
            {[
              { label: 'Nominate Employee', icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-200', action: () => setIsNominateModalOpen(true) },
              { label: 'Give Spot Reward', icon: Gift, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', action: () => setIsCreateModalOpen(true) },
              { label: 'Upload Gift Details', icon: Upload, color: 'text-amber-600 bg-amber-50 border-amber-200', action: () => setIsGiftModalOpen(true) },
              { label: 'Manage Rewards', icon: Award, color: 'text-purple-600 bg-purple-50 border-purple-200', action: () => setIsManageModalOpen(true) },
            ].map((qa) => {
              const Icon = qa.icon
              return (
                <button
                  key={qa.label}
                  onClick={qa.action}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50/80 hover:border-gray-300 transition-all text-xs font-semibold text-gray-800 shadow-2xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={cx('flex h-7 w-7 items-center justify-center rounded-md border', qa.color)}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span>{qa.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )
            })}
          </div>

        </div>
      </div>

      {/* ── Modals ── */}

      {/* 1. Create New Reward / Spot Award Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsCreateModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50/70">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                    <Trophy className="h-4 w-4" />
                  </span>
                  <h2 className="text-base font-bold text-gray-950">Issue New Reward / Spot Award</h2>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200/60 hover:text-gray-700 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleIssueReward} className="space-y-4 p-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Select Employee <span className="text-rose-500">*</span></label>
                  <select name="employee" required defaultValue="" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none">
                    <option value="" disabled>Select Employee</option>
                    {EMPLOYEE_DIRECTORY.map((emp) => (
                      <option key={emp.name} value={emp.name}>{emp.name} ({emp.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Achievement Title</label>
                  <input name="achievement" type="text" placeholder="e.g. Innovation Award" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Achievement Category</label>
                    <select name="category" defaultValue="Performance" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Gift / Reward Type</label>
                    <select name="reward" defaultValue={rewardTypes[0]} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none">
                      {rewardTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Monetary Value (₹)</label>
                  <input name="value" type="number" min="0" placeholder="e.g. 10000" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Appreciation Message / Note</label>
                  <textarea name="message" rows={3} placeholder="Write a note of appreciation..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none resize-none" />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm active:scale-95 transition-all">
                    <Send className="h-3.5 w-3.5" /> Issue Reward
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. View Details Modal */}
      <AnimatePresence>
        {selectedRec && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedRec(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50/70">
                <h2 className="text-base font-bold text-gray-950">Recognition Details · {selectedRec.id}</h2>
                <button onClick={() => setSelectedRec(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 p-6 text-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <Avatar name={selectedRec.employee.name} src={selectedRec.employee.avatar} size="md" />
                  <div>
                    <h3 className="text-sm font-bold text-gray-950">{selectedRec.employee.name}</h3>
                    <p className="text-xs text-gray-500">{selectedRec.employee.role} · {selectedRec.employee.dept}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="font-semibold text-gray-500 uppercase tracking-wider">Achievement</p>
                    <p className="font-bold text-gray-900 mt-0.5">{selectedRec.achievement}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase tracking-wider">Category</p>
                    <p className="font-bold text-blue-600 mt-0.5">{selectedRec.category}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase tracking-wider">Reward</p>
                    <p className="font-bold text-emerald-600 mt-0.5">{selectedRec.reward} (₹{selectedRec.rewardValue.toLocaleString('en-IN')})</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase tracking-wider">Date</p>
                    <p className="font-bold text-gray-900 mt-0.5">{selectedRec.date}</p>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-500 uppercase tracking-wider">Recognition Note</p>
                  <p className="mt-1 bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-700 leading-relaxed font-medium">
                    "{selectedRec.comment}"
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-gray-500">
                  <span>Recognized by: <strong>{selectedRec.recognizedBy.name}</strong></span>
                  <span className="flex items-center gap-1 font-semibold text-blue-600"><ThumbsUp className="h-3.5 w-3.5" /> {selectedRec.likes} Applauds</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Nominate Employee Modal */}
      <AnimatePresence>
        {isNominateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsNominateModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50/70">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                    <Users className="h-4 w-4" />
                  </span>
                  <h2 className="text-base font-bold text-gray-950">Nominate an Employee</h2>
                </div>
                <button onClick={() => setIsNominateModalOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200/60 hover:text-gray-700 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleNominate} className="space-y-4 p-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Employee <span className="text-rose-500">*</span></label>
                  <select name="employee" required defaultValue="" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none">
                    <option value="" disabled>Select Employee</option>
                    {EMPLOYEE_DIRECTORY.map((emp) => (
                      <option key={emp.name} value={emp.name}>{emp.name} — {emp.dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Award <span className="text-rose-500">*</span></label>
                  <select name="award" required defaultValue={upcomingAwards[0]?.title} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none">
                    {upcomingAwards.map((a) => (
                      <option key={a.id} value={a.title}>{a.title} · {a.date}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Justification <span className="text-rose-500">*</span></label>
                  <textarea name="reason" required rows={4} placeholder="Why does this person deserve the award?" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none resize-none" />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button type="button" onClick={() => setIsNominateModalOpen(false)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm active:scale-95 transition-all">
                    <Send className="h-3.5 w-3.5" /> Submit Nomination
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Upload Gift Details Modal */}
      <AnimatePresence>
        {isGiftModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsGiftModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50/70">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
                    <Upload className="h-4 w-4" />
                  </span>
                  <h2 className="text-base font-bold text-gray-950">Upload Gift Details</h2>
                </div>
                <button onClick={() => setIsGiftModalOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200/60 hover:text-gray-700 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleGiftUpload} className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Vendor / Supplier <span className="text-rose-500">*</span></label>
                    <input name="vendor" required type="text" placeholder="e.g. Amazon Business" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Invoice Amount (₹)</label>
                    <input name="amount" type="number" min="0" placeholder="e.g. 25000" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Gift Type</label>
                  <select name="giftType" defaultValue={rewardTypes[0]} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none">
                    {rewardTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Invoice / Receipt</label>
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/60 px-4 py-6 text-center hover:border-amber-400 hover:bg-amber-50/40 transition-colors">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-700">
                      {giftFileName || 'Click to upload a PDF or image'}
                    </span>
                    <span className="text-[10px] text-gray-400">PDF, PNG or JPG · max 5 MB</span>
                    <input
                      name="invoice"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => setGiftFileName(e.target.files?.[0]?.name || '')}
                    />
                  </label>
                  {giftFileName && (
                    <button
                      type="button"
                      onClick={() => setGiftFileName('')}
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700"
                    >
                      <X className="h-3 w-3" /> Remove file
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button type="button" onClick={() => { setIsGiftModalOpen(false); setGiftFileName('') }} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600 shadow-sm active:scale-95 transition-all">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Save Gift Details
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Employee of the Month — Winners History Modal */}
      <AnimatePresence>
        {isWinnersModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsWinnersModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-amber-50/70">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
                    <Medal className="h-4 w-4" />
                  </span>
                  <h2 className="text-base font-bold text-gray-950">Employee of the Month · History</h2>
                </div>
                <button onClick={() => setIsWinnersModalOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200/60 hover:text-gray-700 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {pastWinners.map((w, idx) => (
                  <div key={w.month} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar name={w.name} src={w.avatar} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{w.name}</p>
                        <p className="text-[11px] text-gray-500">{w.dept}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cx(
                        'rounded-full border px-2.5 py-0.5 text-[11px] font-bold',
                        idx === 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                      )}>
                        {w.month}
                      </span>
                      <button
                        onClick={() => { setSearchQuery(w.name); setCategoryFilter('All'); setCurrentPage(1); setActiveTab('Recent Recognitions'); setIsWinnersModalOpen(false) }}
                        title={`See ${w.name}'s recognitions`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 shadow-2xs transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 bg-gray-50/60 px-6 py-3">
                <button
                  onClick={() => setIsWinnersModalOpen(false)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Manage Rewards Catalogue Modal */}
      <AnimatePresence>
        {isManageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsManageModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50/70">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white shadow-xs">
                    <Settings2 className="h-4 w-4" />
                  </span>
                  <h2 className="text-base font-bold text-gray-950">Manage Reward Catalogue</h2>
                </div>
                <button onClick={() => setIsManageModalOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200/60 hover:text-gray-700 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 p-6">
                <div className="space-y-2">
                  {rewardTypes.map((type) => (
                    <div key={type} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-800">
                        <Gift className="h-3.5 w-3.5 text-purple-500" />
                        {type}
                      </span>
                      <button
                        onClick={() => handleRemoveRewardType(type)}
                        title={`Remove ${type}`}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {rewardTypes.length === 0 && (
                    <p className="py-4 text-center text-xs font-semibold text-gray-400">
                      The catalogue is empty — add a reward type below.
                    </p>
                  )}
                </div>

                <form onSubmit={handleAddRewardType} className="flex items-center gap-2 border-t border-gray-100 pt-4">
                  <input
                    name="type"
                    type="text"
                    placeholder="New reward type..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-purple-500 focus:outline-none"
                  />
                  <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700 shadow-sm active:scale-95 transition-all">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
