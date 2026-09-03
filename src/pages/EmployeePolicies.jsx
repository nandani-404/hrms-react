import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FileText,
  ShieldCheck,
  Hourglass,
  Clock,
  Plane,
  Home,
  Shield,
  Lock,
  Briefcase,
  UserCheck,
  Search,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  FileCheck,
  X,
  Layers,
  HelpCircle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cx } from '../components/ui'

/* ─── Employee Policies Data ─── */
const myPoliciesList = [
  {
    id: 'POL-001',
    name: 'Attendance & Punctuality Policy',
    desc: 'Guidelines on daily check-in times, working hours, and shift flexibility.',
    category: 'Attendance',
    icon: Clock,
    iconBg: 'bg-purple-100 text-purple-600',
    categoryBadge: 'bg-purple-50 text-purple-700 border-purple-200',
    effectiveDate: '01 Jan 2024',
    status: 'Acknowledged',
    ackDate: '10 Jan 2024',
    fileSize: '1.4 MB',
  },
  {
    id: 'POL-002',
    name: 'Employee Leave & Holiday Rules',
    desc: 'Comprehensive guide to casual, sick, earned leave and holiday entitlement.',
    category: 'Leave',
    icon: Plane,
    iconBg: 'bg-emerald-100 text-emerald-600',
    categoryBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    effectiveDate: '01 Jan 2024',
    status: 'Acknowledged',
    ackDate: '12 Jan 2024',
    fileSize: '2.1 MB',
  },
  {
    id: 'POL-003',
    name: 'Work From Home & Hybrid Guidelines',
    desc: 'Rules and eligibility for remote work, internet allowance & equipment.',
    category: 'Work Arrangement',
    icon: Home,
    iconBg: 'bg-amber-100 text-amber-600',
    categoryBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    effectiveDate: '15 Feb 2024',
    status: 'Action Required',
    ackDate: null,
    fileSize: '950 KB',
  },
  {
    id: 'POL-004',
    name: 'Code of Professional Ethics',
    desc: 'Standards of ethical conduct, workplace harassment prevention and values.',
    category: 'Code of Conduct',
    icon: Shield,
    iconBg: 'bg-blue-100 text-blue-600',
    categoryBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    effectiveDate: '01 Jan 2024',
    status: 'Acknowledged',
    ackDate: '05 Jan 2024',
    fileSize: '3.2 MB',
  },
  {
    id: 'POL-005',
    name: 'IT Security & Data Protection',
    desc: 'Mandatory password policies, device encryption and confidential data safety.',
    category: 'Information Security',
    icon: Lock,
    iconBg: 'bg-rose-100 text-rose-600',
    categoryBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    effectiveDate: '10 Jan 2024',
    status: 'Action Required',
    ackDate: null,
    fileSize: '1.8 MB',
  },
  {
    id: 'POL-006',
    name: 'Business Travel & Expense Rules',
    desc: 'Travel booking procedures, daily allowance caps and reimbursement claims.',
    category: 'Travel',
    icon: Briefcase,
    iconBg: 'bg-orange-100 text-orange-600',
    categoryBadge: 'bg-orange-50 text-orange-700 border-orange-200',
    effectiveDate: '01 Mar 2024',
    status: 'Acknowledged',
    ackDate: '05 Mar 2024',
    fileSize: '1.1 MB',
  },
]

export default function EmployeePolicies() {
  const { user } = useAuth()
  const [policies, setPolicies] = useState(myPoliciesList)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [readingPolicy, setReadingPolicy] = useState(null)

  // Filtered policies
  const filteredPolicies = policies.filter((p) => {
    const q = searchQuery.toLowerCase()
    const matchesQuery = p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    const matchesCat = activeCategory === 'All' || p.category === activeCategory
    return matchesQuery && matchesCat
  })

  // Handle digital acknowledgement
  const handleAcknowledge = (policyId) => {
    setPolicies(prev =>
      prev.map(p => p.id === policyId ? { ...p, status: 'Acknowledged', ackDate: 'Today' } : p)
    )
    toast.success('Policy acknowledged successfully!')
    setReadingPolicy(null)
  }

  const acknowledgedCount = policies.filter(p => p.status === 'Acknowledged').length
  const pendingCount = policies.filter(p => p.status === 'Action Required').length

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
            <span className="text-gray-800 font-semibold">My Policies</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-950">Company Policies & Guidelines</h1>
          <p className="mt-1 text-sm text-gray-500">Read and acknowledge official company policies, codes of conduct, and guidelines.</p>
        </div>
        {pendingCount > 0 && (
          <button
            onClick={() => setReadingPolicy(policies.find(p => p.status === 'Action Required'))}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 active:scale-[0.98] transition-all"
          >
            <AlertCircle className="h-4.5 w-4.5" />
            {pendingCount} Policy Acknowledgement Pending
          </button>
        )}
      </div>

      {/* ── 4 KPI Summary Cards ── */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total Policies',
            value: `${policies.length}`,
            sub: 'Published Guidelines',
            icon: <FileText className="h-4.5 w-4.5 text-blue-600" />,
            iconBg: 'bg-blue-50 border-blue-100',
          },
          {
            label: 'My Acknowledged',
            value: `${acknowledgedCount} / ${policies.length}`,
            sub: `${Math.round((acknowledgedCount / policies.length) * 100)}% Compliance Rate`,
            icon: <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />,
            iconBg: 'bg-emerald-50 border-emerald-100',
          },
          {
            label: 'Pending Review',
            value: `${pendingCount} Required`,
            sub: pendingCount > 0 ? 'Requires Action' : 'All Up to Date',
            icon: <AlertCircle className="h-4.5 w-4.5 text-amber-600" />,
            iconBg: 'bg-amber-50 border-amber-100',
          },
          {
            label: 'Last Revised Policy',
            value: 'WFH Guidelines',
            sub: 'Effective 15 Feb 2024',
            icon: <Clock className="h-4.5 w-4.5 text-purple-600" />,
            iconBg: 'bg-purple-50 border-purple-100',
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

          {/* Search Bar & Category Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search policy name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white pl-8 pr-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['All', 'Attendance', 'Leave', 'Work Arrangement', 'Code of Conduct', 'Information Security'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cx(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Policy Cards Grid */}
          <div className="space-y-4">
            {filteredPolicies.map((pol) => {
              const IconComp = pol.icon
              const isAck = pol.status === 'Acknowledged'
              return (
                <div
                  key={pol.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4 hover:border-gray-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className={cx('flex h-10 w-10 items-center justify-center rounded-xl border shrink-0 mt-0.5', pol.iconBg)}>
                        <IconComp className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-gray-950">{pol.name}</h3>
                          <span className={cx('px-2 py-0.5 rounded text-[11px] font-semibold border', pol.categoryBadge)}>
                            {pol.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{pol.desc}</p>
                      </div>
                    </div>

                    <span className={cx(
                      'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shrink-0',
                      isAck ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    )}>
                      {isAck ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                      {isAck ? 'Acknowledged' : 'Action Required'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
                    <div className="text-gray-500 flex items-center gap-3">
                      <span>Effective: <strong>{pol.effectiveDate}</strong></span>
                      <span>•</span>
                      <span>PDF Size: <strong>{pol.fileSize}</strong></span>
                      {isAck && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">Signed: {pol.ackDate}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setReadingPolicy(pol)}
                        className={cx(
                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-all',
                          isAck ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50' : 'bg-blue-600 text-white hover:bg-blue-700'
                        )}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {isAck ? 'Read Policy' : 'Read & Acknowledge'}
                      </button>

                      <button
                        onClick={() => toast.success(`Downloading ${pol.name} PDF...`)}
                        title="Download PDF"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-2xs"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Card 1: My Compliance Progress */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900">Acknowledgement Compliance</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-600">Completion Score</span>
                <span className="text-blue-600 font-bold">{Math.round((acknowledgedCount / policies.length) * 100)}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${(acknowledgedCount / policies.length) * 100}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              You have completed <strong>{acknowledgedCount}</strong> out of <strong>{policies.length}</strong> required policy acknowledgements.
            </p>
          </div>

          {/* Card 2: Need Policy Clarification */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-bold text-gray-950">Questions about Policies?</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              If you have questions regarding remote work rules, leave entitlement, or expenses, reach out to the HR team.
            </p>
            <button
              onClick={() => toast.success('Opening HR Helpdesk ticket modal...')}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition-all text-center"
            >
              Contact HR Helpdesk
            </button>
          </div>

        </div>

      </div>

      {/* ── Policy Reader & Digital Signature Modal ── */}
      <AnimatePresence>
        {readingPolicy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setReadingPolicy(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className={cx('flex h-9 w-9 items-center justify-center rounded-lg border', readingPolicy.iconBg)}>
                    <FileText className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-gray-950">{readingPolicy.name}</h2>
                    <p className="text-xs text-gray-500">{readingPolicy.category} · Effective {readingPolicy.effectiveDate}</p>
                  </div>
                </div>
                <button onClick={() => setReadingPolicy(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs leading-relaxed text-gray-700">
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-900 font-medium">
                  <strong>Policy Summary:</strong> {readingPolicy.desc}
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-3">
                  <h4 className="font-bold text-gray-950 text-sm">1. Purpose & Scope</h4>
                  <p>This document governs company expectations regarding {readingPolicy.name.toLowerCase()} at TruckMit. All team members must adhere to these policies during their tenure.</p>
                  
                  <h4 className="font-bold text-gray-950 text-sm">2. Employee Responsibilities</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Maintain compliance with all stated operational and safety procedures.</li>
                    <li>Seek clarification from HR regarding any ambiguous terms or special cases.</li>
                    <li>Acknowledge policy revisions within 14 days of publication.</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between border-t border-gray-200 px-6 py-4 bg-gray-50 gap-3">
                {readingPolicy.status === 'Acknowledged' ? (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Acknowledged by you on {readingPolicy.ackDate}
                  </span>
                ) : (
                  <button
                    onClick={() => handleAcknowledge(readingPolicy.id)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    I Have Read & Acknowledge This Policy
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button onClick={() => setReadingPolicy(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                    Close
                  </button>
                  <button onClick={() => toast.success('Downloading Policy PDF...')} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-800 hover:bg-gray-50 shadow-2xs flex items-center gap-1.5">
                    <Download className="h-3.5 w-3.5" /> PDF ({readingPolicy.fileSize})
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
