import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Laptop, Smartphone, Monitor, Box, Wrench, RotateCcw, 
  Plus, Search, ChevronRight, CheckCircle2, Clock, 
  AlertTriangle, ShieldCheck, Tag, Info, FileText, X, Send,
  Cpu, HardDrive, RefreshCw, Eye
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

/* ─── Initial Employee Data ─── */
const INITIAL_MY_ASSETS = [
  {
    id: 1,
    asset_tag: 'AST-LAP-1023',
    asset_name: 'MacBook Pro 14"',
    category: 'Laptop',
    brand: 'Apple',
    model: 'M3 Pro (18GB RAM, 512GB SSD)',
    serial_number: 'C02G1234MD6R',
    assigned_date: '20 May 2024',
    expected_return: '20 May 2027',
    condition: 'GOOD',
    location: 'Primary Workplace / Home',
    specs: 'Apple M3 Pro chip, 11-core CPU, 14-core GPU, Space Black',
    icon: Laptop,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 2,
    asset_tag: 'AST-MON-3041',
    asset_name: 'Dell 24" UltraSharp Monitor',
    category: 'Monitor',
    brand: 'Dell',
    model: 'U2422H 1080p FHD',
    serial_number: 'CN-098765-43210',
    assigned_date: '18 May 2024',
    expected_return: 'Permanent Assignment',
    condition: 'GOOD',
    location: 'Bangalore HQ - Desk B-14',
    specs: 'IPS Panel, USB-C 65W Power Delivery, 99% sRGB',
    icon: Monitor,
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  {
    id: 3,
    asset_tag: 'AST-ACC-4022',
    asset_name: 'Logitech MX Master 3S',
    category: 'Accessories',
    brand: 'Logitech',
    model: 'Performance Ergonomic Mouse',
    serial_number: 'LZ8829103847',
    assigned_date: '17 May 2024',
    expected_return: 'N/A',
    condition: 'GOOD',
    location: 'Remote / Work Desk',
    specs: '8K DPI tracking, Quiet clicks, USB-C fast charging',
    icon: Box,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 4,
    asset_tag: 'AST-ACC-5102',
    asset_name: 'Jabra Evolve2 75 ANC Headset',
    category: 'Accessories',
    brand: 'Jabra',
    model: 'ANC Stereo Headset',
    serial_number: 'JB992019482',
    assigned_date: '10 May 2024',
    expected_return: 'N/A',
    condition: 'GOOD',
    location: 'Remote / Work Desk',
    specs: 'Advanced ANC, 36h battery life, Link 380 USB adapter',
    icon: Box,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
  }
]

const INITIAL_REQUESTS = [
  { id: 'REQ-101', asset_type: 'Dual Monitor Setup (27" 4K)', request_date: '22 May 2024', priority: 'High', reason: 'High-resolution UI designing and side-by-side code review', status: 'Pending Approval' },
  { id: 'REQ-088', asset_type: 'USB-C Docking Station 11-in-1', request_date: '10 Apr 2024', priority: 'Medium', reason: 'Connecting external monitors & peripherals', status: 'Approved & Fulfilled' }
]

const INITIAL_ISSUES = [
  { id: 'TKT-402', asset_name: 'Logitech MX Master 3S', issue_type: 'Scroll Wheel Sensitivity', report_date: '17 May 2024', status: 'Under Inspection', remarks: 'IT Helpdesk scheduled mouse replacement.' }
]

export default function EmployeeAssets() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('My Assets')
  const [searchTerm, setSearchTerm] = useState('')

  // State Management
  const [assignedAssets, setAssignedAssets] = useState(INITIAL_MY_ASSETS)
  const [myRequests, setMyRequests] = useState(INITIAL_REQUESTS)
  const [reportedIssues, setReportedIssues] = useState(INITIAL_ISSUES)

  // Modals Visibility
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [showReportIssueModal, setShowReportIssueModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Selected Action Assets
  const [selectedAsset, setSelectedAsset] = useState(null)

  // Forms State
  const [requestFormData, setRequestFormData] = useState({
    asset_type: '',
    priority: 'Medium',
    reason: ''
  })

  const [returnFormData, setReturnFormData] = useState({
    asset_tag: '',
    returned_date: new Date().toISOString().split('T')[0],
    reason: 'Resignation / Offboarding',
    condition: 'GOOD'
  })

  const [issueFormData, setIssueFormData] = useState({
    asset_tag: '',
    issue_type: 'Hardware Malfunction',
    description: ''
  })

  /* ── Filtered Assets ── */
  const filteredAssets = useMemo(() => {
    return assignedAssets.filter(item => 
      item.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asset_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [assignedAssets, searchTerm])

  /* ── Handlers ── */
  const handleOpenReturnModal = (asset) => {
    setSelectedAsset(asset)
    setReturnFormData(prev => ({ ...prev, asset_tag: asset.asset_tag }))
    setShowReturnModal(true)
  }

  const handleOpenReportIssueModal = (asset) => {
    setSelectedAsset(asset || assignedAssets[0])
    setIssueFormData(prev => ({ ...prev, asset_tag: asset ? asset.asset_tag : assignedAssets[0]?.asset_tag || '' }))
    setShowReportIssueModal(true)
  }

  const handleOpenDetailModal = (asset) => {
    setSelectedAsset(asset)
    setShowDetailModal(true)
  }

  const handleRequestSubmit = (e) => {
    e.preventDefault()
    if (!requestFormData.asset_type || !requestFormData.reason) {
      toast.error('Please fill in required fields')
      return
    }

    const newReq = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      asset_type: requestFormData.asset_type,
      request_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      priority: requestFormData.priority,
      reason: requestFormData.reason,
      status: 'Pending Approval'
    }

    setMyRequests(prev => [newReq, ...prev])
    toast.success('Asset request submitted to HR & IT team! 🚀')
    setShowNewRequestModal(false)
    setRequestFormData({ asset_type: '', priority: 'Medium', reason: '' })
    setActiveTab('My Requests')
  }

  const handleReturnSubmit = (e) => {
    e.preventDefault()
    toast.success(`Return request for ${selectedAsset?.asset_name || returnFormData.asset_tag} submitted! HR will arrange handover. 📦`)
    setShowReturnModal(false)
    setSelectedAsset(null)
  }

  const handleIssueSubmit = (e) => {
    e.preventDefault()
    if (!issueFormData.description) {
      toast.error('Please describe the problem')
      return
    }

    const targetAsset = assignedAssets.find(a => a.asset_tag === issueFormData.asset_tag) || selectedAsset
    const newIssue = {
      id: `TKT-${Math.floor(400 + Math.random() * 500)}`,
      asset_name: targetAsset?.asset_name || issueFormData.asset_tag,
      issue_type: issueFormData.issue_type,
      report_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Submitted',
      remarks: issueFormData.description
    }

    setReportedIssues(prev => [newIssue, ...prev])
    toast.success('Issue ticket created! IT Support notified. 🛠️')
    setShowReportIssueModal(false)
    setSelectedAsset(null)
    setActiveTab('Reported Issues')
  }

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-800">
      {/* ── Header & Breadcrumbs ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Company Assets</h1>
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
            <span className="hover:text-slate-800 cursor-pointer">Home</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="hover:text-slate-800 cursor-pointer">Workplace</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-600 font-bold">My Assets</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenReportIssueModal(null)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-amber-300 text-amber-800 text-xs font-bold rounded-lg hover:bg-amber-50 transition-all shadow-xs active:scale-95"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Report Issue
          </button>
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Request New Asset
          </button>
        </div>
      </div>

      {/* ── 4 KPI Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned Assets</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{assignedAssets.length} Items</h3>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">Active Hardware & Gear</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Asset Condition</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">100% Good</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">All Items Operational</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 border border-cyan-100">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Return Due Status</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">Up to Date</h3>
            <p className="text-xs text-cyan-600 font-semibold mt-0.5">No overdue returns</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Value</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">₹2,45,000</h3>
            <p className="text-xs text-purple-600 font-semibold mt-0.5">Company Owned Assets</p>
          </div>
        </div>
      </div>

      {/* ── Sub-Tabs Navigation ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('My Assets')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'My Assets'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          My Assigned Assets ({assignedAssets.length})
        </button>
        <button
          onClick={() => setActiveTab('My Requests')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'My Requests'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          My Requests ({myRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('Reported Issues')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'Reported Issues'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          Reported Issues ({reportedIssues.length})
        </button>
      </div>

      {/* ── TAB 1: MY ASSIGNED ASSETS ── */}
      {activeTab === 'My Assets' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your assets by tag, name or brand..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-2xs"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssets.map((asset) => {
              const IconComp = asset.icon || Box
              return (
                <div key={asset.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mb-1 border border-blue-100">
                          {asset.category}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900">{asset.asset_name}</h3>
                        <p className="text-xs text-slate-500 font-semibold">{asset.brand} · {asset.model}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      {asset.asset_tag}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1.5 text-slate-600 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Serial Number:</span>
                      <span className="font-mono font-bold text-slate-900">{asset.serial_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Assigned Date:</span>
                      <span className="font-bold text-slate-900">{asset.assigned_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Specifications:</span>
                      <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">{asset.specs}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Condition: {asset.condition}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenDetailModal(asset)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenReportIssueModal(asset)}
                        className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold rounded-lg transition-all flex items-center gap-1 border border-amber-200 active:scale-95"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        Report Issue
                      </button>
                      <button
                        onClick={() => handleOpenReturnModal(asset)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1 active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Return Asset
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Directory Table View */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Asset Directory & Serial Records</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-4 py-3">Tag #</th>
                    <th className="px-4 py-3">Asset Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Serial Number</th>
                    <th className="px-4 py-3">Assigned Date</th>
                    <th className="px-4 py-3">Condition</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-blue-600">{asset.asset_tag}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{asset.asset_name}</td>
                      <td className="px-4 py-3 text-slate-600 font-semibold">{asset.category}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{asset.serial_number}</td>
                      <td className="px-4 py-3 text-slate-600 font-medium">{asset.assigned_date}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                          {asset.condition}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => handleOpenReportIssueModal(asset)} className="px-2.5 py-1 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded text-[11px] font-bold">Report Issue</button>
                        <button onClick={() => handleOpenReturnModal(asset)} className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-bold">Return</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: MY REQUESTS ── */}
      {activeTab === 'My Requests' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Submitted Asset Requests</h3>
            <button onClick={() => setShowNewRequestModal(true)} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-xs transition-all">
              + New Request
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3">Req ID</th>
                  <th className="px-4 py-3">Requested Hardware</th>
                  <th className="px-4 py-3">Date Submitted</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Justification</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{req.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{req.asset_type}</td>
                    <td className="px-4 py-3 text-slate-500 font-medium">{req.request_date}</td>
                    <td className="px-4 py-3 font-bold text-amber-700">{req.priority}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs">{req.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${req.status.includes('Approved') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: REPORTED ISSUES ── */}
      {activeTab === 'Reported Issues' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Reported Hardware Malfunctions & Repair Tickets</h3>
            <button onClick={() => handleOpenReportIssueModal(null)} className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 shadow-xs transition-all">
              Report New Issue
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3">Ticket ID</th>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Issue Category</th>
                  <th className="px-4 py-3">Date Reported</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">IT Support Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {reportedIssues.map((tkt) => (
                  <tr key={tkt.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{tkt.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{tkt.asset_name}</td>
                    <td className="px-4 py-3 text-amber-700 font-bold">{tkt.issue_type}</td>
                    <td className="px-4 py-3 text-slate-500 font-medium">{tkt.report_date}</td>
                    <td className="px-4 py-3"><span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">{tkt.status}</span></td>
                    <td className="px-4 py-3 text-slate-600 italic">{tkt.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {/* 1. Request New Asset Modal */}
      <AnimatePresence>
        {showNewRequestModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowNewRequestModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
                <h2 className="text-base font-bold text-slate-900">Request New Asset / Equipment</h2>
                <button onClick={() => setShowNewRequestModal(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleRequestSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Asset Required / Model *</label>
                  <input type="text" value={requestFormData.asset_type} onChange={e => setRequestFormData({ ...requestFormData, asset_type: e.target.value })} placeholder="e.g. Dell 27 inch 4K USB-C Monitor" className="w-full p-2.5 border border-slate-300 rounded-lg font-bold" required />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
                  <select value={requestFormData.priority} onChange={e => setRequestFormData({ ...requestFormData, priority: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-semibold">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent Work Requirement)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Reason *</label>
                  <textarea rows={3} value={requestFormData.reason} onChange={e => setRequestFormData({ ...requestFormData, reason: e.target.value })} placeholder="State why this equipment is needed..." className="w-full p-2.5 border border-slate-300 rounded-lg" required></textarea>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowNewRequestModal(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-lg">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Submit Request</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Report Issue Modal */}
      <AnimatePresence>
        {showReportIssueModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowReportIssueModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
                <h2 className="text-base font-bold text-slate-900">Report Asset Issue / Damage</h2>
                <button onClick={() => setShowReportIssueModal(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleIssueSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Asset *</label>
                  <select value={issueFormData.asset_tag} onChange={e => setIssueFormData({ ...issueFormData, asset_tag: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-bold" required>
                    {assignedAssets.map(a => (
                      <option key={a.id} value={a.asset_tag}>{a.asset_name} ({a.asset_tag})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issue Category</label>
                  <select value={issueFormData.issue_type} onChange={e => setIssueFormData({ ...issueFormData, issue_type: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-semibold">
                    <option value="Hardware Malfunction">Hardware Malfunction</option>
                    <option value="Physical Damage / Crack">Physical Damage / Crack</option>
                    <option value="Battery / Charging Problem">Battery / Charging Problem</option>
                    <option value="Display / Screen Defect">Display / Screen Defect</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Problem Description *</label>
                  <textarea rows={3} value={issueFormData.description} onChange={e => setIssueFormData({ ...issueFormData, description: e.target.value })} placeholder="Describe the error or damage..." className="w-full p-2.5 border border-slate-300 rounded-lg" required></textarea>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowReportIssueModal(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-lg">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700">Submit IT Ticket</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Return Asset Modal */}
      <AnimatePresence>
        {showReturnModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowReturnModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
                <h2 className="text-base font-bold text-slate-900">Initiate Asset Return</h2>
                <button onClick={() => setShowReturnModal(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleReturnSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Asset Tag</label>
                  <input type="text" disabled value={selectedAsset?.asset_tag || returnFormData.asset_tag} className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-mono font-bold" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Return Date *</label>
                  <input type="date" value={returnFormData.returned_date} onChange={e => setReturnFormData({ ...returnFormData, returned_date: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white" required />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason for Return</label>
                  <select value={returnFormData.reason} onChange={e => setReturnFormData({ ...returnFormData, reason: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-semibold">
                    <option value="Resignation / Offboarding">Resignation / Offboarding</option>
                    <option value="Hardware Upgrade">Hardware Upgrade</option>
                    <option value="No Longer Needed">No Longer Needed</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowReturnModal(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-lg">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">Submit Return Request</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Asset Detail Modal */}
      <AnimatePresence>
        {showDetailModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowDetailModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
                <h2 className="text-base font-bold text-slate-900">Asset Specifications</h2>
                <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h3 className="text-base font-black text-slate-900">{selectedAsset?.asset_name}</h3>
                  <p className="text-xs font-mono font-bold text-blue-600 mt-0.5">{selectedAsset?.asset_tag}</p>
                </div>

                <div className="space-y-2 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div><span className="text-slate-400 block">Brand & Model:</span><span className="font-bold">{selectedAsset?.brand} - {selectedAsset?.model}</span></div>
                  <div><span className="text-slate-400 block">Serial Number:</span><span className="font-mono font-bold">{selectedAsset?.serial_number}</span></div>
                  <div><span className="text-slate-400 block">Assigned Date:</span><span className="font-bold">{selectedAsset?.assigned_date}</span></div>
                  <div><span className="text-slate-400 block">Work Location:</span><span className="font-bold">{selectedAsset?.location}</span></div>
                  <div><span className="text-slate-400 block">Specifications:</span><span className="font-medium text-slate-800">{selectedAsset?.specs}</span></div>
                </div>

                <div className="pt-2">
                  <button onClick={() => setShowDetailModal(false)} className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200">
                    Close Specs
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
