import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FileText,
  ShieldCheck,
  Hourglass,
  Archive,
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  ChevronRight,
  Clock,
  Plane,
  Home,
  Shield,
  Lock,
  Briefcase,
  UserCheck,
  SlidersHorizontal,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Layers,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Avatar, cx } from '../components/ui'

/* ─── Initial Policies Data ─── */
const initialPolicies = [
  {
    id: 'POL-001',
    name: 'Attendance Policy',
    desc: 'Guidelines on attendance, working hours and punctuality expectations.',
    category: 'Attendance',
    icon: Clock,
    iconBg: 'bg-purple-100 text-purple-600',
    categoryBadge: 'bg-purple-50 text-purple-700 border-purple-200',
    effectiveDate: '01 Jan 2024',
    lastUpdated: '15 May 2024',
    updatedBy: { name: 'Aditya Tiwari', role: 'HR Manager', avatar: '/storage/avatars/amit.jpg' },
    status: 'Active',
    fileSize: '1.4 MB',
    acknowledgedPct: '94%',
  },
  {
    id: 'POL-002',
    name: 'Leave Policy',
    desc: 'Defines the types of leave and the process for availing leave.',
    category: 'Leave',
    icon: Plane,
    iconBg: 'bg-emerald-100 text-emerald-600',
    categoryBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    effectiveDate: '01 Jan 2024',
    lastUpdated: '10 May 2024',
    updatedBy: { name: 'Neha Verma', role: 'HR Executive', avatar: '/storage/avatars/neha.jpg' },
    status: 'Active',
    fileSize: '2.1 MB',
    acknowledgedPct: '91%',
  },
  {
    id: 'POL-003',
    name: 'Work From Home Policy',
    desc: 'Guidelines and eligibility for work from home arrangements.',
    category: 'Work Arrangement',
    icon: Home,
    iconBg: 'bg-amber-100 text-amber-600',
    categoryBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    effectiveDate: '15 Feb 2024',
    lastUpdated: '22 Apr 2024',
    updatedBy: { name: 'Amit Kumar', role: 'HR Manager', avatar: '/storage/avatars/amit.jpg' },
    status: 'Active',
    fileSize: '950 KB',
    acknowledgedPct: '88%',
  },
  {
    id: 'POL-004',
    name: 'Code of Conduct',
    desc: 'Standards of professional behavior and ethical conduct.',
    category: 'Code of Conduct',
    icon: Shield,
    iconBg: 'bg-blue-100 text-blue-600',
    categoryBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    effectiveDate: '01 Jan 2024',
    lastUpdated: '05 May 2024',
    updatedBy: { name: 'Aditya Tiwari', role: 'HR Manager', avatar: '/storage/avatars/amit.jpg' },
    status: 'Active',
    fileSize: '3.2 MB',
    acknowledgedPct: '98%',
  },
  {
    id: 'POL-005',
    name: 'Information Security Policy',
    desc: 'Rules for protecting company and employee data.',
    category: 'Information Security',
    icon: Lock,
    iconBg: 'bg-rose-100 text-rose-600',
    categoryBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    effectiveDate: '10 Jan 2024',
    lastUpdated: '18 Apr 2024',
    updatedBy: { name: 'Neha Verma', role: 'HR Executive', avatar: '/storage/avatars/neha.jpg' },
    status: 'Active',
    fileSize: '1.8 MB',
    acknowledgedPct: '85%',
  },
  {
    id: 'POL-006',
    name: 'Travel Policy',
    desc: 'Guidelines for business travel, expenses and reimbursements.',
    category: 'Travel',
    icon: Briefcase,
    iconBg: 'bg-orange-100 text-orange-600',
    categoryBadge: 'bg-orange-50 text-orange-700 border-orange-200',
    effectiveDate: '01 Mar 2024',
    lastUpdated: '02 May 2024',
    updatedBy: { name: 'Amit Kumar', role: 'HR Manager', avatar: '/storage/avatars/amit.jpg' },
    status: 'Under Review',
    fileSize: '1.1 MB',
    acknowledgedPct: '62%',
  },
  {
    id: 'POL-007',
    name: 'Anti-Harassment Policy',
    desc: 'Policy to prevent harassment and ensure a safe workplace.',
    category: 'Employee Policy',
    icon: UserCheck,
    iconBg: 'bg-cyan-100 text-cyan-600',
    categoryBadge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    effectiveDate: '01 Jan 2024',
    lastUpdated: '28 Mar 2024',
    updatedBy: { name: 'Neha Verma', role: 'HR Executive', avatar: '/storage/avatars/neha.jpg' },
    status: 'Active',
    fileSize: '1.5 MB',
    acknowledgedPct: '96%',
  },
  {
    id: 'POL-008',
    name: 'Dress Code Policy',
    desc: 'Dress code guidelines for all employees.',
    category: 'Employee Policy',
    icon: Layers,
    iconBg: 'bg-slate-100 text-slate-600',
    categoryBadge: 'bg-slate-100 text-slate-700 border-slate-200',
    effectiveDate: '01 Jan 2024',
    lastUpdated: '12 Apr 2024',
    updatedBy: { name: 'Aditya Tiwari', role: 'HR Manager', avatar: '/storage/avatars/amit.jpg' },
    status: 'Archived',
    fileSize: '800 KB',
    acknowledgedPct: '75%',
  },
]

/* ─── Policy Categories List ─── */
const policyCategories = [
  { name: 'Attendance', count: 3, icon: Clock, color: 'text-purple-600 bg-purple-50' },
  { name: 'Leave', count: 3, icon: Plane, color: 'text-emerald-600 bg-emerald-50' },
  { name: 'Work Arrangement', count: 2, icon: Home, color: 'text-amber-600 bg-amber-50' },
  { name: 'Code of Conduct', count: 2, icon: Shield, color: 'text-blue-600 bg-blue-50' },
  { name: 'Information Security', count: 2, icon: Lock, color: 'text-rose-600 bg-rose-50' },
  { name: 'Travel', count: 2, icon: Briefcase, color: 'text-orange-600 bg-orange-50' },
  { name: 'Employee Policy', count: 6, icon: UserCheck, color: 'text-cyan-600 bg-cyan-50' },
  { name: 'Others', count: 4, icon: Layers, color: 'text-slate-600 bg-slate-50' },
]

export default function HRPolicies() {
  const { user } = useAuth()
  const [policies, setPolicies] = useState(initialPolicies)
  const [activeTab, setActiveTab] = useState('All Policies')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [previewPolicy, setPreviewPolicy] = useState(null)
  const [isAckStatusModalOpen, setIsAckStatusModalOpen] = useState(false)

  // Filter policies
  const filteredPolicies = policies.filter((p) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch = p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    
    let matchesTab = true
    if (activeTab === 'Active') matchesTab = p.status === 'Active'
    if (activeTab === 'Under Review') matchesTab = p.status === 'Under Review'
    if (activeTab === 'Archived') matchesTab = p.status === 'Archived'

    const matchesCategory = categoryFilter === 'All Categories' || p.category === categoryFilter
    const matchesStatus = statusFilter === 'All Status' || p.status === statusFilter

    return matchesSearch && matchesTab && matchesCategory && matchesStatus
  })

  const ITEMS_PER_PAGE = 8
  const paginatedPolicies = filteredPolicies.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5">
            <span className="hover:text-gray-800 cursor-pointer">Home</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="hover:text-gray-800 cursor-pointer">Policies</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-800 font-semibold">All Policies</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-950">Policies</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              <ShieldCheck className="h-3.5 w-3.5" /> HR Management
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          <Plus className="h-4.5 w-4.5" />
          Add New Policy
        </button>
      </div>

      {/* ── 5 KPI Summary Cards ── */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: 'Total Policies',
            value: '24',
            sub: 'Published Policies',
            icon: <FileText className="h-4.5 w-4.5 text-blue-600" />,
            iconBg: 'bg-blue-50 border-blue-100',
          },
          {
            label: 'Active Policies',
            value: '18',
            sub: 'Currently Active',
            icon: <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />,
            iconBg: 'bg-emerald-50 border-emerald-100',
          },
          {
            label: 'Under Review',
            value: '3',
            sub: 'Awaiting Review',
            icon: <Hourglass className="h-4.5 w-4.5 text-amber-600" />,
            iconBg: 'bg-amber-50 border-amber-100',
          },
          {
            label: 'Archived Policies',
            value: '3',
            sub: 'No Longer Active',
            icon: <Archive className="h-4.5 w-4.5 text-purple-600" />,
            iconBg: 'bg-purple-50 border-purple-100',
          },
          {
            label: 'Acknowledged',
            value: '87%',
            sub: 'By Employees',
            icon: <Users className="h-4.5 w-4.5 text-cyan-600" />,
            iconBg: 'bg-cyan-50 border-cyan-100',
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

        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex gap-2 overflow-x-auto">
              {['All Policies', 'Active', 'Under Review', 'Archived'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setCurrentPage(1) }}
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

          {/* Filter Bar & Table Container */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
            
            {/* Filter Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-200 bg-gray-50/60">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative min-w-[240px] flex-1">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search policies by name or keyword..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                    className="w-full rounded-lg border border-gray-300 bg-white pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1) }}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="All Categories">All Categories</option>
                  {policyCategories.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.success('Applying filters...')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                </button>
                <button
                  onClick={() => toast.success('Exporting policies list...')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
              </div>
            </div>

            {/* Policies Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-200 bg-gray-50/70 text-gray-600">
                  <tr>
                    <th className="py-3 px-5 font-semibold uppercase tracking-wider text-[11px]">Policy Name</th>
                    <th className="py-3 px-5 font-semibold uppercase tracking-wider text-[11px]">Category</th>
                    <th className="py-3 px-5 font-semibold uppercase tracking-wider text-[11px]">Effective Date</th>
                    <th className="py-3 px-5 font-semibold uppercase tracking-wider text-[11px]">Last Updated</th>
                    <th className="py-3 px-5 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                    <th className="py-3 px-5 font-semibold uppercase tracking-wider text-[11px] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedPolicies.map((pol) => {
                    const IconComp = pol.icon
                    return (
                      <tr key={pol.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span className={cx('flex h-8 w-8 items-center justify-center rounded-lg border shrink-0', pol.iconBg)}>
                              <IconComp className="h-4 w-4" />
                            </span>
                            <div>
                              <p className="text-xs font-bold text-gray-900 leading-tight">{pol.name}</p>
                              <p className="text-[11px] text-gray-500 mt-0.5 max-w-[220px] truncate">{pol.desc}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <span className={cx('inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border', pol.categoryBadge)}>
                            {pol.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-gray-600 whitespace-nowrap">{pol.effectiveDate}</td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <p className="text-xs font-semibold text-gray-900">{pol.lastUpdated}</p>
                          <p className="text-[10px] text-gray-400">{pol.updatedBy.name}</p>
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <span className={cx(
                            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold',
                            pol.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            pol.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-gray-100 text-gray-600 border border-gray-200'
                          )}>
                            <span className={cx(
                              'h-1.5 w-1.5 rounded-full',
                              pol.status === 'Active' ? 'bg-emerald-500' :
                              pol.status === 'Under Review' ? 'bg-amber-500' : 'bg-gray-400'
                            )} />
                            {pol.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap text-center">
                          <div className="inline-flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setPreviewPolicy(pol)}
                              title="View Document"
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-2xs"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => toast.success(`Downloading ${pol.name} PDF...`)}
                              title="Download PDF"
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-2xs"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => toast.success(`More actions for ${pol.name}`)}
                              title="More Options"
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-2xs"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 bg-gray-50/60 text-xs">
              <span className="text-gray-500">
                Showing 1 to {paginatedPolicies.length} of {filteredPolicies.length} policies
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button disabled className="h-7 px-2.5 rounded border border-gray-200 bg-white text-gray-400 disabled:opacity-40">&lt;</button>
                  {[1, 2, 3, '...', 6].map((p, idx) => (
                    <button
                      key={idx}
                      className={cx(
                        'h-7 w-7 rounded text-xs font-semibold transition-colors',
                        p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                  <button className="h-7 px-2.5 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100">&gt;</button>
                </div>
                <select className="h-7 rounded border border-gray-300 bg-white px-2 text-xs font-semibold text-gray-700">
                  <option>10 / page</option>
                  <option>20 / page</option>
                  <option>50 / page</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Card 1: Policy Categories */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Policy Categories</h3>
              <button onClick={() => toast.success('Viewing all policy categories...')} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View All
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {policyCategories.map((cat) => {
                const IconComp = cat.icon
                return (
                  <div
                    key={cat.name}
                    onClick={() => { setCategoryFilter(categoryFilter === cat.name ? 'All Categories' : cat.name); setCurrentPage(1) }}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-gray-300 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={cx('flex h-7 w-7 items-center justify-center rounded-md border', cat.color)}>
                        <IconComp className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-semibold text-gray-800">{cat.name}</span>
                    </div>
                    <span className="font-bold text-gray-900 px-2 py-0.5 rounded bg-gray-200/60 text-xs">
                      {cat.count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Card 2: Recent Updates */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Recent Updates</h3>
              <button onClick={() => toast.success('Viewing update log...')} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View All
              </button>
            </div>
            <div className="space-y-3 text-xs">
              {[
                { user: 'Aditya Tiwari', action: 'updated Attendance Policy', date: '15 May 2024', avatar: '/storage/avatars/amit.jpg' },
                { user: 'Neha Verma', action: 'updated Information Security Policy', date: '18 Apr 2024', avatar: '/storage/avatars/neha.jpg' },
                { user: 'Amit Kumar', action: 'updated Work From Home Policy', date: '22 Apr 2024', avatar: '/storage/avatars/amit.jpg' },
                { user: 'Neha Verma', action: 'added Travel Policy', date: '02 May 2024', avatar: '/storage/avatars/neha.jpg' },
              ].map((upd, idx) => (
                <div key={idx} className="flex items-start gap-2.5 pb-2.5 border-b border-gray-100 last:border-0 last:pb-0">
                  <Avatar name={upd.user} src={upd.avatar} size="xs" className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 leading-tight">
                      {upd.user} <span className="font-normal text-gray-500">{upd.action}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{upd.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Policy Acknowledgement Status */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                <ShieldCheck className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-base font-bold text-gray-950">Policy Acknowledgement</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Employees must acknowledge policies to confirm they have read and understood them.
            </p>
            <button
              onClick={() => setIsAckStatusModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-blue-700 font-bold text-xs border border-blue-200 shadow-2xs hover:bg-blue-100/80 transition-all text-center"
            >
              View Acknowledgement Status
            </button>
          </div>

        </div>

      </div>

      {/* ── Modals ── */}

      {/* 1. Add New Policy Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsAddModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50/70">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h2 className="text-base font-bold text-gray-950">Publish New Company Policy</h2>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200/60 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  toast.success('Policy published successfully!')
                  setIsAddModalOpen(false)
                }}
                className="space-y-4 p-6"
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Policy Title <span className="text-rose-500">*</span></label>
                  <input required type="text" placeholder="e.g. Remote Work & Security Policy" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                    <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none">
                      <option>Attendance</option>
                      <option>Leave</option>
                      <option>Work Arrangement</option>
                      <option>Code of Conduct</option>
                      <option>Information Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Effective Date</label>
                    <input type="date" defaultValue="2024-06-01" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Policy Description</label>
                  <textarea rows={2} placeholder="Brief summary of policy expectations..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Upload Policy Document (PDF)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100/80 cursor-pointer transition-all">
                    <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-gray-700">Click to upload or drag PDF document</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Maximum file size 10 MB</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm">
                    Publish Policy
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Policy Document Preview Reader Modal */}
      <AnimatePresence>
        {previewPolicy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setPreviewPolicy(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className={cx('flex h-9 w-9 items-center justify-center rounded-lg border', previewPolicy.iconBg)}>
                    <FileText className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-gray-950">{previewPolicy.name}</h2>
                    <p className="text-xs text-gray-500">{previewPolicy.category} · Effective {previewPolicy.effectiveDate}</p>
                  </div>
                </div>
                <button onClick={() => setPreviewPolicy(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs leading-relaxed text-gray-700">
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-900 font-medium">
                  <strong>Policy Overview:</strong> {previewPolicy.desc}
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-3">
                  <h4 className="font-bold text-gray-950 text-sm">1. Purpose & Scope</h4>
                  <p>This policy outlines the official corporate guidelines for all full-time, part-time, and contracted employees at TruckMit. Adherence to these standards is compulsory to maintain operational excellence and compliance.</p>
                  
                  <h4 className="font-bold text-gray-950 text-sm">2. Key Regulations & Guidelines</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Employees must review policy revisions within 14 business days of issuance.</li>
                    <li>Digital acknowledgement logs are stored permanently in employee personnel files.</li>
                    <li>Any non-compliance or breach must be reported immediately to HR Management.</li>
                  </ul>

                  <h4 className="font-bold text-gray-950 text-sm">3. Effective Date & Revisions</h4>
                  <p>Effective Date: <strong>{previewPolicy.effectiveDate}</strong> | Last revised by: <strong>{previewPolicy.updatedBy.name}</strong> ({previewPolicy.lastUpdated}).</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 bg-gray-50">
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Employee Acknowledgement: {previewPolicy.acknowledgedPct}
                </span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setPreviewPolicy(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                    Close Preview
                  </button>
                  <button onClick={() => toast.success('Downloading Policy Document...')} className="px-4 py-2 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm flex items-center gap-1.5">
                    <Download className="h-3.5 w-3.5" /> Download PDF ({previewPolicy.fileSize})
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Acknowledgement Status Modal */}
      <AnimatePresence>
        {isAckStatusModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsAckStatusModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-gray-950">Employee Acknowledgement Compliance</h2>
                </div>
                <button onClick={() => setIsAckStatusModalOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold flex items-center justify-between">
                  <span>Overall Company Compliance</span>
                  <span className="text-base font-extrabold">87%</span>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="font-bold text-gray-900">Recent Employee Sign-offs:</p>
                  {[
                    { name: 'Rahul Sharma', dept: 'Engineering', status: 'Acknowledged', date: '20 May 2024' },
                    { name: 'Neha Verma', dept: 'HR', status: 'Acknowledged', date: '19 May 2024' },
                    { name: 'Priya Patel', dept: 'Sales', status: 'Pending Review', date: '15 May 2024' },
                    { name: 'Arjun Singh', dept: 'Design', status: 'Acknowledged', date: '12 May 2024' },
                  ].map((emp, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-gray-50">
                      <div>
                        <p className="font-bold text-gray-900">{emp.name}</p>
                        <p className="text-[10px] text-gray-500">{emp.dept}</p>
                      </div>
                      <span className={cx(
                        'px-2 py-0.5 rounded text-[10px] font-bold',
                        emp.status === 'Acknowledged' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      )}>
                        {emp.status} ({emp.date})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
