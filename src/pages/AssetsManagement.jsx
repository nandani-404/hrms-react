import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Filter, ChevronRight, Edit, Trash2, X, 
  UserPlus, Eye, History, Tag, Download, CheckCircle, 
  Clock, AlertTriangle, Laptop, Smartphone, Monitor, HardDrive, 
  MoreVertical, RefreshCw, ShoppingBag, ArrowUpRight, Box, 
  RotateCcw, ShieldAlert, CheckCircle2, ChevronDown, Building2,
  Users, Layers, ExternalLink, Calendar, Wrench, Check, ThumbsUp, ThumbsDown
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { useEmployees } from '../hooks/useEmployees'
import {
  useAssets,
  useAssetCategories,
  useAssetSubCategories,
  useCreateAsset,
  useUpdateAsset,
  useAssignAsset,
  useReturnAsset
} from '../hooks/useAssets'

/* ─── Status and Condition Badge Helpers ─── */
const getStatusBadgeStyle = (status) => {
  switch (status?.toUpperCase()) {
    case "AVAILABLE": return "bg-emerald-50 text-emerald-700 border border-emerald-200"
    case "ASSIGNED": return "bg-blue-50 text-blue-700 border border-blue-200 font-semibold"
    case "UNDER REPAIR":
    case "REPAIR": return "bg-amber-50 text-amber-700 border border-amber-200 font-semibold"
    case "RETIRED": return "bg-rose-50 text-rose-700 border border-rose-200"
    default: return "bg-slate-100 text-slate-700 border border-slate-200"
  }
}

const getConditionBadgeStyle = (condition) => {
  switch (condition?.toUpperCase()) {
    case "GOOD": return "bg-emerald-50 text-emerald-700 border border-emerald-200"
    case "DAMAGED": return "bg-amber-50 text-amber-700 border border-amber-200"
    case "LOST": return "bg-rose-50 text-rose-700 border border-rose-200"
    default: return "bg-slate-50 text-slate-700 border border-slate-200"
  }
}

/* ─── Initial Dataset ─── */
const INITIAL_ASSETS = [
  { asset_id: 101, asset_tag: 'AST-LAP-1023', asset_name: 'MacBook Pro 14"', category: 'Laptops', brand: 'Apple', model: 'M3 Pro 18GB', serial_number: 'C02G1234MD6R', purchase_date: '2024-01-15', purchase_cost: 169900, vendor_name: 'Apple India Pvt. Ltd.', asset_status: 'ASSIGNED', condition_status: 'GOOD', assigned_to: { name: 'Amit Kumar', role: 'HR Manager', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' }, assigned_on: '20 May 2024' },
  { asset_id: 102, asset_tag: 'AST-MOB-2045', asset_name: 'iPhone 15 Pro', category: 'Mobiles', brand: 'Apple', model: '256GB Titanium', serial_number: 'F92K5678QW90', purchase_date: '2024-02-10', purchase_cost: 134900, vendor_name: 'Amazon India Pvt. Ltd.', asset_status: 'ASSIGNED', condition_status: 'GOOD', assigned_to: { name: 'Neha Verma', role: 'HR Executive', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' }, assigned_on: '19 May 2024' },
  { asset_id: 103, asset_tag: 'AST-MON-3041', asset_name: 'Dell 24 Monitor', category: 'Monitors', brand: 'Dell', model: 'P2419H 1080p', serial_number: 'CN0987654321', purchase_date: '2024-03-01', purchase_cost: 18500, vendor_name: 'Dell Technologies', asset_status: 'ASSIGNED', condition_status: 'GOOD', assigned_to: { name: 'Rahul Sharma', role: 'Sr. Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' }, assigned_on: '18 May 2024' },
  { asset_id: 104, asset_tag: 'AST-ACC-4022', asset_name: 'Logitech MX Master 3', category: 'Accessories', brand: 'Logitech', model: 'MX Master 3S', serial_number: 'LZ8829103847', purchase_date: '2024-03-12', purchase_cost: 9995, vendor_name: 'Amazon India Pvt. Ltd.', asset_status: 'UNDER REPAIR', condition_status: 'DAMAGED', assigned_to: { name: 'Priya Patel', role: 'UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150' }, assigned_on: '17 May 2024' },
  { asset_id: 105, asset_tag: 'AST-ACC-4028', asset_name: 'HP Laptop Bag', category: 'Accessories', brand: 'HP', model: 'Executive 15.6', serial_number: 'HPBAG992012', purchase_date: '2024-04-05', purchase_cost: 3200, vendor_name: 'HP India Sales Pvt. Ltd.', asset_status: 'ASSIGNED', condition_status: 'GOOD', assigned_to: { name: 'Vikram Singh', role: 'DevOps Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' }, assigned_on: '16 May 2024' },
  { asset_id: 106, asset_tag: 'AST-LAP-1050', asset_name: 'Dell XPS 15', category: 'Laptops', brand: 'Dell', model: 'XPS 9530 i9', serial_number: 'DL992019482', purchase_date: '2024-04-18', purchase_cost: 210000, vendor_name: 'Dell Technologies', asset_status: 'AVAILABLE', condition_status: 'GOOD', assigned_to: null, assigned_on: null },
  { asset_id: 107, asset_tag: 'AST-MON-3099', asset_name: 'LG UltraFine 27"', category: 'Monitors', brand: 'LG', model: '27UK850 4K', serial_number: 'LG88402910', purchase_date: '2024-04-20', purchase_cost: 38000, vendor_name: 'Amazon India Pvt. Ltd.', asset_status: 'AVAILABLE', condition_status: 'GOOD', assigned_to: null, assigned_on: null },
  { asset_id: 108, asset_tag: 'AST-ACC-4090', asset_name: 'Keychron K2 Keyboard', category: 'Accessories', brand: 'Keychron', model: 'K2 Wireless', serial_number: 'KC33029102', purchase_date: '2024-05-01', purchase_cost: 7500, vendor_name: 'Flipkart Business', asset_status: 'AVAILABLE', condition_status: 'GOOD', assigned_to: null, assigned_on: null },
]

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Laptops', total: 256, assigned: '196 (76.56%)', available: '48 (18.75%)', underRepair: '12 (4.69%)', icon: Laptop, color: 'text-purple-600 bg-purple-50 border-purple-100' },
  { id: 2, name: 'Mobiles', total: 112, assigned: '88 (78.57%)', available: '18 (16.07%)', underRepair: '6 (5.36%)', icon: Smartphone, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { id: 3, name: 'Monitors', total: 48, assigned: '36 (75.00%)', available: '8 (16.67%)', underRepair: '4 (8.33%)', icon: Monitor, color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { id: 4, name: 'Accessories', total: 64, assigned: '48 (75.00%)', available: '12 (18.75%)', underRepair: '4 (6.25%)', icon: Box, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  { id: 5, name: 'Others', total: 32, assigned: '18 (56.25%)', available: '10 (31.25%)', underRepair: '4 (12.50%)', icon: Layers, color: 'text-pink-600 bg-pink-50 border-pink-100' },
]

const INITIAL_VENDORS = [
  { id: 1, name: 'Amazon India Pvt. Ltd.', totalAssets: 186, totalValue: '₹24,85,600', lastPurchase: '15 May 2024', logo: '📦', contact: 'business-support@amazon.in' },
  { id: 2, name: 'Dell Technologies', totalAssets: 128, totalValue: '₹18,40,000', lastPurchase: '10 May 2024', logo: '💻', contact: 'enterprise@dell.com' },
  { id: 3, name: 'Apple India Pvt. Ltd.', totalAssets: 96, totalValue: '₹14,75,200', lastPurchase: '05 May 2024', logo: '🍎', contact: 'b2b-india@apple.com' },
  { id: 4, name: 'HP India Sales Pvt. Ltd.', totalAssets: 64, totalValue: '₹6,20,000', lastPurchase: '25 Apr 2024', logo: '🖥️', contact: 'corporate@hp.com' },
  { id: 5, name: 'Flipkart Business', totalAssets: 38, totalValue: '₹3,25,400', lastPurchase: '18 Apr 2024', logo: '🛒', contact: 'b2b@flipkart.com' },
]

const INITIAL_NEW_REQUESTS = [
  { id: 'REQ-101', employee: 'Ananya Roy', role: 'Frontend Engineer', assetType: 'MacBook Pro 16" M3', requestDate: '22 May 2024', priority: 'High', reason: 'Replacement for broken old laptop', status: 'Pending' },
  { id: 'REQ-102', employee: 'Rohan Sharma', role: 'Backend Lead', assetType: 'Dell 27" 4K Monitor', requestDate: '21 May 2024', priority: 'Medium', reason: 'Dual monitor setup requirement', status: 'Pending' },
  { id: 'REQ-103', employee: 'Meera Nair', role: 'UX Researcher', assetType: 'iPad Pro 11"', requestDate: '19 May 2024', priority: 'Low', reason: 'Design testing & prototyping', status: 'Approved' },
]

const INITIAL_RETURN_REQUESTS = [
  { id: 'RET-201', employee: 'Karan Mehta', asset: 'MacBook Air M1 (AST-LAP-098)', returnDate: '23 May 2024', reason: 'Resignation / Offboarding', condition: 'Good', status: 'Pending Verification' },
  { id: 'RET-202', employee: 'Siddharth Rao', asset: 'Logitech Wireless Keyboard (AST-ACC-203)', returnDate: '20 May 2024', reason: 'Upgraded to mechanical keyboard', condition: 'Good', status: 'Received & Verified' },
]

const INITIAL_ASSET_HISTORY = [
  { id: 'HST-1', date: '20 May 2024', assetTag: 'AST-LAP-1023', assetName: 'MacBook Pro 14"', action: 'Assigned', performer: 'Aditya Tiwari (HR Manager)', recipient: 'Amit Kumar', notes: 'Issued brand new laptop for HR role' },
  { id: 'HST-2', date: '19 May 2024', assetTag: 'AST-MOB-2045', assetName: 'iPhone 15 Pro', action: 'Assigned', performer: 'Aditya Tiwari (HR Manager)', recipient: 'Neha Verma', notes: 'Official company mobile phone assignment' },
  { id: 'HST-3', date: '17 May 2024', assetTag: 'AST-ACC-4022', assetName: 'Logitech MX Master 3', action: 'Status Changed', performer: 'IT Helpdesk', recipient: 'Priya Patel', notes: 'Sent to Dell/Logitech Service Center for battery repair' },
]

const TABS = [
  { id: 'Dashboard', label: 'Dashboard' },
  { id: 'All Assets', label: 'All Assets' },
  { id: 'Assigned Assets', label: 'Assigned Assets' },
  { id: 'New Asset Request', label: 'New Asset Request' },
  { id: 'Return Request', label: 'Return Request' },
  { id: 'Asset History', label: 'Asset History' },
  { id: 'Asset Categories', label: 'Asset Categories' },
  { id: 'Vendors', label: 'Vendors' },
]

export default function AssetsManagement() {
  const { user } = useAuth()
  const isAdminOrHR = user?.role === 'super_admin' || user?.role === 'hr' || user?.role === 'admin'

  const [activeTab, setActiveTab] = useState('Dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedOverviewCategory, setSelectedOverviewCategory] = useState('All Categories')
  const [hoveredOverviewCategory, setHoveredOverviewCategory] = useState(null)

  const overviewChartData = [
    { id: 'laptops', name: 'Laptops', count: 256, percent: '50.00%', color: 'stroke-blue-700', bg: 'bg-blue-600', iconBg: 'bg-blue-50 text-blue-600 border-blue-100', textColor: 'text-blue-700', dasharray: '50 100', dashoffset: '0', icon: Laptop },
    { id: 'mobiles', name: 'Mobiles', count: 112, percent: '21.88%', color: 'stroke-emerald-600', bg: 'bg-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100', textColor: 'text-emerald-600', dasharray: '21.88 100', dashoffset: '-50', icon: Smartphone },
    { id: 'accessories', name: 'Accessories', count: 64, percent: '12.50%', color: 'stroke-amber-600', bg: 'bg-amber-500', iconBg: 'bg-amber-50 text-amber-600 border-amber-100', textColor: 'text-amber-600', dasharray: '12.5 100', dashoffset: '-71.88', icon: Box },
    { id: 'monitors', name: 'Monitors', count: 48, percent: '9.38%', color: 'stroke-cyan-500', bg: 'bg-cyan-500', iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-100', textColor: 'text-cyan-600', dasharray: '9.38 100', dashoffset: '-84.38', icon: Monitor },
    { id: 'others', name: 'Others', count: 32, percent: '6.25%', color: 'stroke-pink-500', bg: 'bg-pink-500', iconBg: 'bg-pink-50 text-pink-600 border-pink-100', textColor: 'text-pink-600', dasharray: '6.25 100', dashoffset: '-93.76', icon: Layers },
  ]

  // Dynamic Persistent States
  const [assets, setAssets] = useState(INITIAL_ASSETS)
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [vendors, setVendors] = useState(INITIAL_VENDORS)
  const [newRequests, setNewRequests] = useState(INITIAL_NEW_REQUESTS)
  const [returnRequests, setReturnRequests] = useState(INITIAL_RETURN_REQUESTS)
  const [assetHistoryLogs, setAssetHistoryLogs] = useState(INITIAL_ASSET_HISTORY)

  // Active Row Actions Menu Popover
  const [activeRowMenuId, setActiveRowMenuId] = useState(null)

  // Modals Visibility
  const [showAddEditModal, setShowAddEditModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [showReportIssueModal, setShowReportIssueModal] = useState(false)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showAddVendorModal, setShowAddVendorModal] = useState(false)
  const [showAssetDetailModal, setShowAssetDetailModal] = useState(false)

  // Selected Item Contexts for Modals
  const [selectedAsset, setSelectedAsset] = useState(null)

  // Filter Form State
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    condition: ''
  })

  // Asset Form State
  const [assetFormData, setAssetFormData] = useState({
    asset_tag: '',
    asset_name: '',
    category: 'Laptops',
    brand: '',
    model: '',
    serial_number: '',
    purchase_date: new Date().toISOString().split('T')[0],
    purchase_cost: '',
    vendor_name: 'Amazon India Pvt. Ltd.',
    location: 'Head Office - Bangalore'
  })

  // Assign Form State
  const [assignFormData, setAssignFormData] = useState({
    employee_name: 'Amit Kumar',
    employee_role: 'HR Manager',
    assigned_date: new Date().toISOString().split('T')[0]
  })

  // Category Form State
  const [categoryFormData, setCategoryFormData] = useState({ name: '', icon: 'Laptop' })

  // Vendor Form State
  const [vendorFormData, setVendorFormData] = useState({ name: '', contact: '', logo: '🏬' })

  /* ─── Handlers ─── */
  const handleResetFilters = () => {
    setFilters({ status: '', category: '', condition: '' })
    setSearchTerm('')
  }

  const handleExportReport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Generating asset management report (Excel / PDF)...',
        success: 'Asset report exported successfully! 📄',
        error: 'Failed to export report'
      }
    )
  }

  const handleAddAssetSubmit = (e) => {
    e.preventDefault()
    if (!assetFormData.asset_tag || !assetFormData.asset_name) {
      toast.error('Please enter asset tag and name')
      return
    }

    if (selectedAsset) {
      // Edit existing
      setAssets(prev => prev.map(a => a.asset_id === selectedAsset.asset_id ? { ...a, ...assetFormData } : a))
      toast.success(`Asset ${assetFormData.asset_tag} updated successfully! ✅`)
    } else {
      // Create new
      const newAsset = {
        asset_id: Date.now(),
        asset_tag: assetFormData.asset_tag,
        asset_name: assetFormData.asset_name,
        category: assetFormData.category,
        brand: assetFormData.brand || 'Generic',
        model: assetFormData.model || 'Standard Edition',
        serial_number: assetFormData.serial_number || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
        purchase_date: assetFormData.purchase_date,
        purchase_cost: parseFloat(assetFormData.purchase_cost) || 45000,
        vendor_name: assetFormData.vendor_name,
        asset_status: 'AVAILABLE',
        condition_status: 'GOOD',
        assigned_to: null,
        assigned_on: null
      }
      setAssets(prev => [newAsset, ...prev])
      setAssetHistoryLogs(prev => [{
        id: `HST-${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        assetTag: newAsset.asset_tag,
        assetName: newAsset.asset_name,
        action: 'Created',
        performer: `${user?.name || 'HR Admin'}`,
        recipient: 'Inventory',
        notes: `Added asset to ${newAsset.category} inventory`
      }, ...prev])
      toast.success(`New Asset ${newAsset.asset_tag} created successfully! 🎉`)
    }
    setShowAddEditModal(false)
    setSelectedAsset(null)
  }

  const handleAssignSubmit = (e) => {
    e.preventDefault()
    if (!selectedAsset) return

    const updatedAssets = assets.map(a => {
      if (a.asset_id === selectedAsset.asset_id) {
        return {
          ...a,
          asset_status: 'ASSIGNED',
          assigned_to: {
            name: assignFormData.employee_name,
            role: assignFormData.employee_role,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
          },
          assigned_on: assignFormData.assigned_date
        }
      }
      return a
    })

    setAssets(updatedAssets)
    setAssetHistoryLogs(prev => [{
      id: `HST-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      assetTag: selectedAsset.asset_tag,
      assetName: selectedAsset.asset_name,
      action: 'Assigned',
      performer: `${user?.name || 'HR Manager'}`,
      recipient: assignFormData.employee_name,
      notes: `Assigned hardware to ${assignFormData.employee_name}`
    }, ...prev])

    toast.success(`Asset ${selectedAsset.asset_tag} assigned to ${assignFormData.employee_name}! 🚀`)
    setShowAssignModal(false)
    setSelectedAsset(null)
  }

  const handleReturnSubmit = (e) => {
    e.preventDefault()
    if (!selectedAsset) return

    const updatedAssets = assets.map(a => {
      if (a.asset_id === selectedAsset.asset_id) {
        return {
          ...a,
          asset_status: 'AVAILABLE',
          assigned_to: null,
          assigned_on: null
        }
      }
      return a
    })

    setAssets(updatedAssets)
    setAssetHistoryLogs(prev => [{
      id: `HST-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      assetTag: selectedAsset.asset_tag,
      assetName: selectedAsset.asset_name,
      action: 'Returned',
      performer: `${user?.name || 'HR Manager'}`,
      recipient: 'Inventory',
      notes: `Asset returned and verified into available inventory.`
    }, ...prev])

    toast.success(`Asset ${selectedAsset.asset_tag} returned to available inventory! 📦`)
    setShowReturnModal(false)
    setSelectedAsset(null)
  }

  const handleApproveRequest = (reqId) => {
    setNewRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Approved' } : r))
    toast.success(`Request ${reqId} approved! IT team queued for allocation. ✅`)
  }

  const handleRejectRequest = (reqId) => {
    setNewRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Rejected' } : r))
    toast.error(`Request ${reqId} rejected. Employee notified.`)
  }

  const handleAcceptReturn = (retId) => {
    setReturnRequests(prev => prev.map(r => r.id === retId ? { ...r, status: 'Received & Verified' } : r))
    toast.success(`Asset return ${retId} verified into company storage! 📦`)
  }

  const handleAddCategorySubmit = (e) => {
    e.preventDefault()
    if (!categoryFormData.name) return
    const newCat = {
      id: Date.now(),
      name: categoryFormData.name,
      total: 0,
      assigned: '0 (0.00%)',
      available: '0 (0.00%)',
      underRepair: '0 (0.00%)',
      icon: Box,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    }
    setCategories(prev => [...prev, newCat])
    toast.success(`Category "${categoryFormData.name}" created!`)
    setShowAddCategoryModal(false)
    setCategoryFormData({ name: '', icon: 'Laptop' })
  }

  const handleAddVendorSubmit = (e) => {
    e.preventDefault()
    if (!vendorFormData.name) return
    const newV = {
      id: Date.now(),
      name: vendorFormData.name,
      totalAssets: 0,
      totalValue: '₹0',
      lastPurchase: 'Today',
      logo: vendorFormData.logo || '🏢',
      contact: vendorFormData.contact || 'sales@vendor.com'
    }
    setVendors(prev => [...prev, newV])
    toast.success(`Vendor "${vendorFormData.name}" added to directory!`)
    setShowAddVendorModal(false)
    setVendorFormData({ name: '', contact: '', logo: '🏬' })
  }

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = 
        (asset.asset_tag?.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (asset.asset_name?.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (asset.serial_number?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (asset.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
        
      const matchesStatus = !filters.status || asset.asset_status === filters.status
      const matchesCategory = !filters.category || asset.category === filters.category
      const matchesCondition = !filters.condition || asset.condition_status === filters.condition
      
      return matchesSearch && matchesStatus && matchesCategory && matchesCondition
    })
  }, [assets, searchTerm, filters])

  // Stat calculations
  const totalAssetsCount = 512
  const assignedCount = assets.filter(a => a.asset_status === 'ASSIGNED').length + 381
  const availableCount = assets.filter(a => a.asset_status === 'AVAILABLE').length + 94
  const repairCount = assets.filter(a => a.asset_status === 'UNDER REPAIR').length + 17

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-800">
      {/* ── Page Header & Top Breadcrumb ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Asset Management</h1>
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
            <span className="hover:text-slate-800 cursor-pointer">Home</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="hover:text-slate-800 cursor-pointer">Asset Management</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-600 font-semibold">{activeTab}</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Report
          </button>
          {isAdminOrHR && (
            <button
              onClick={() => { setSelectedAsset(null); setAssetFormData({ asset_tag: `AST-LAP-${Math.floor(1000 + Math.random()*9000)}`, asset_name: '', category: 'Laptops', brand: '', model: '', serial_number: '', purchase_date: new Date().toISOString().split('T')[0], purchase_cost: '', vendor_name: 'Amazon India Pvt. Ltd.', location: 'Head Office' }); setShowAddEditModal(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add New Asset
            </button>
          )}
        </div>
      </div>

      {/* ── Sub-Navigation Tabs ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 scrollbar-none pb-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 font-bold border-b-2 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT 1: DASHBOARD VIEW ── */}
      {activeTab === 'Dashboard' && (
        <div className="space-y-6">
          {/* ── 5 Top Summary Stat Cards (Exact match to provided screenshot) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Total Assets */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                <Box className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Assets</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">512</h3>
                <p className="text-xs text-slate-500 mt-0.5">All Company Assets</p>
              </div>
            </div>

            {/* 2. Assigned Assets */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned Assets</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">386</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">75.39% of Total</p>
              </div>
            </div>

            {/* 3. Available Assets */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available Assets</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">96</h3>
                <p className="text-xs text-cyan-600 font-semibold mt-0.5">18.75% of Total</p>
              </div>
            </div>

            {/* 4. Assets Under Repair */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center shrink-0">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assets Under Repair</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">18</h3>
                <p className="text-xs text-orange-600 font-semibold mt-0.5">3.52% of Total</p>
              </div>
            </div>

            {/* 5. Assets Due for Return */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assets Due for Return</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">12</h3>
                <button onClick={() => setActiveTab('Return Request')} className="text-xs text-blue-600 hover:text-blue-700 font-bold mt-0.5 hover:underline block">
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* ── Middle Row: Asset Overview Donut Chart & Recent Assigned Assets ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Box: Asset Overview */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Asset Overview</h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 pt-1">
                  {/* Donut SVG Chart */}
                  <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-xs overflow-visible" viewBox="0 0 36 36">
                      {/* Background Track */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        className="stroke-slate-100"
                        strokeWidth="3.8"
                      />
                      {overviewChartData.map((item) => {
                        const isHovered = hoveredOverviewCategory?.id === item.id;
                        const isAnyHovered = Boolean(hoveredOverviewCategory);
                        return (
                          <circle
                            key={item.id}
                            cx="18"
                            cy="18"
                            r="15.9155"
                            fill="none"
                            className={`${item.color} transition-all duration-300 cursor-pointer`}
                            strokeWidth={isHovered ? "5.4" : "4.2"}
                            strokeDasharray={item.dasharray}
                            strokeDashoffset={item.dashoffset}
                            style={{ opacity: isAnyHovered ? (isHovered ? 1 : 0.3) : 1 }}
                            onMouseEnter={() => setHoveredOverviewCategory(item)}
                            onMouseLeave={() => setHoveredOverviewCategory(null)}
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none transition-all duration-300">
                      {hoveredOverviewCategory ? (
                        <>
                          <span className={`text-2xl font-black ${hoveredOverviewCategory.textColor} tracking-tight`}>
                            {hoveredOverviewCategory.count}
                          </span>
                          <span className={`text-[10px] font-extrabold ${hoveredOverviewCategory.textColor} uppercase tracking-wider`}>
                            {hoveredOverviewCategory.name} ({hoveredOverviewCategory.percent})
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl font-black text-slate-900 tracking-tight">512</span>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Assets</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Legend List */}
                  <div className="space-y-2.5 text-xs font-semibold text-slate-700 flex-1 pl-4 sm:pl-6">
                    {overviewChartData.map((item) => {
                      const isHovered = hoveredOverviewCategory?.id === item.id;
                      const IconComp = item.icon;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-0.5"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-6 h-6 rounded-lg ${item.iconBg} border flex items-center justify-center shrink-0 transition-transform ${isHovered ? 'scale-110 shadow-xs' : ''}`}>
                              {IconComp && <IconComp className="w-3.5 h-3.5" />}
                            </div>
                            <span className={isHovered ? item.textColor + ' font-bold' : 'text-slate-700'}>{item.name}</span>
                          </div>
                          <span className={`font-bold ${isHovered ? item.textColor : 'text-slate-900'}`}>
                            {item.count} ({item.percent})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Horizontal Category Breakdown Bar */}
              <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>Category Share Breakdown</span>
                  <span className={`transition-colors font-extrabold ${hoveredOverviewCategory ? hoveredOverviewCategory.textColor : 'text-slate-900'}`}>
                    {hoveredOverviewCategory ? `${hoveredOverviewCategory.name}: ${hoveredOverviewCategory.count} units (${hoveredOverviewCategory.percent})` : '512 Total Units'}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                  {overviewChartData.map((item, idx) => {
                    const isHovered = hoveredOverviewCategory?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        style={{ width: item.percent }}
                        className={`${item.bg} h-full transition-all duration-200 ${
                          idx === 0 ? 'rounded-l-full' : ''
                        } ${idx === overviewChartData.length - 1 ? 'rounded-r-full' : ''} ${
                          isHovered ? 'brightness-110' : ''
                        }`}
                        title={`${item.name} (${item.percent})`}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-0.5">
                  {overviewChartData.slice(0, 3).map((item) => (
                    <span 
                      key={item.id} 
                      className={`flex items-center gap-1 transition-colors ${
                        hoveredOverviewCategory?.id === item.id ? item.textColor + ' font-bold' : ''
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${item.bg}`}></span> 
                      {item.name} {item.percent}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Box: Recent Assigned Assets */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Recent Assigned Assets</h3>
                <button onClick={() => setActiveTab('Assigned Assets')} className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-3 py-2.5">Asset Name</th>
                      <th className="px-3 py-2.5">Asset ID</th>
                      <th className="px-3 py-2.5">Assigned To</th>
                      <th className="px-3 py-2.5">Assigned On</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {assets.slice(0, 5).map((item) => (
                      <tr key={item.asset_id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-3 py-3 font-bold text-slate-900 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 font-bold">
                            {item.category === 'Laptops' && <Laptop className="w-3.5 h-3.5 text-blue-600" />}
                            {item.category === 'Mobiles' && <Smartphone className="w-3.5 h-3.5 text-emerald-600" />}
                            {item.category === 'Monitors' && <Monitor className="w-3.5 h-3.5 text-cyan-600" />}
                            {item.category === 'Accessories' && <Box className="w-3.5 h-3.5 text-amber-600" />}
                            {item.category === 'Others' && <Layers className="w-3.5 h-3.5 text-pink-600" />}
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-900">{item.asset_name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{item.category}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-slate-600 font-semibold">{item.asset_tag}</td>
                        <td className="px-3 py-3">
                          {item.assigned_to ? (
                            <div className="flex items-center gap-2">
                              <img src={item.assigned_to.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                              <div>
                                <span className="block font-bold text-slate-900">{item.assigned_to.name}</span>
                                <span className="text-[10px] text-slate-400">{item.assigned_to.role}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-slate-500 font-medium">{item.assigned_on || '-'}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${getStatusBadgeStyle(item.asset_status)}`}>
                            {item.asset_status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right relative">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => { setSelectedAsset(item); setShowAssetDetailModal(true); }}
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setActiveRowMenuId(activeRowMenuId === item.asset_id ? null : item.asset_id)}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {activeRowMenuId === item.asset_id && (
                            <div className="absolute right-0 top-8 z-30 bg-white border border-slate-200 rounded-xl shadow-lg w-40 py-1 text-left text-xs font-semibold">
                              <button onClick={() => { setSelectedAsset(item); setAssetFormData({ asset_tag: item.asset_tag, asset_name: item.asset_name, category: item.category, brand: item.brand, model: item.model, serial_number: item.serial_number, purchase_date: item.purchase_date, purchase_cost: item.purchase_cost, vendor_name: item.vendor_name, location: 'Head Office' }); setShowAddEditModal(true); setActiveRowMenuId(null); }} className="w-full px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                <Edit className="w-3.5 h-3.5 text-blue-600" /> Edit Asset
                              </button>
                              {item.asset_status === 'AVAILABLE' && (
                                <button onClick={() => { setSelectedAsset(item); setShowAssignModal(true); setActiveRowMenuId(null); }} className="w-full px-3 py-1.5 text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                                  <UserPlus className="w-3.5 h-3.5" /> Assign Asset
                                </button>
                              )}
                              {item.asset_status === 'ASSIGNED' && (
                                <button onClick={() => { setSelectedAsset(item); setShowReturnModal(true); setActiveRowMenuId(null); }} className="w-full px-3 py-1.5 text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                                  <RotateCcw className="w-3.5 h-3.5" /> Return Asset
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Lower Middle Row: Asset Categories & Top Asset Vendors ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Box: Asset Categories */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Asset Categories</h3>
                <button onClick={() => setActiveTab('Asset Categories')} className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-3 py-2.5">Category</th>
                      <th className="px-3 py-2.5 text-center">Total Assets</th>
                      <th className="px-3 py-2.5">Assigned</th>
                      <th className="px-3 py-2.5">Available</th>
                      <th className="px-3 py-2.5">Under Repair</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {categories.map((cat, idx) => {
                      const IconComp = cat.icon || Box
                      return (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-3 py-3 font-bold text-slate-900 flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-lg ${cat.color || 'bg-slate-100 text-slate-600'} flex items-center justify-center shrink-0`}>
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <span>{cat.name}</span>
                          </td>
                          <td className="px-3 py-3 text-center font-black text-slate-900">{cat.total}</td>
                          <td className="px-3 py-3 font-semibold text-slate-700">{cat.assigned}</td>
                          <td className="px-3 py-3 text-emerald-600 font-semibold">{cat.available}</td>
                          <td className="px-3 py-3 text-amber-600 font-semibold">{cat.underRepair}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Box: Top Asset Vendors */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Top Asset Vendors</h3>
                <button onClick={() => setActiveTab('Vendors')} className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-3 py-2.5">Vendor Name</th>
                      <th className="px-3 py-2.5 text-center">Total Assets</th>
                      <th className="px-3 py-2.5">Total Value</th>
                      <th className="px-3 py-2.5 text-right">Last Purchase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {vendors.map((vendor, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-3 py-3 font-bold text-slate-900 flex items-center gap-2.5">
                          <span className="text-base shrink-0">{vendor.logo}</span>
                          <span className="truncate">{vendor.name}</span>
                        </td>
                        <td className="px-3 py-3 text-center font-black text-slate-900">{vendor.totalAssets}</td>
                        <td className="px-3 py-3 font-black text-blue-600">{vendor.totalValue}</td>
                        <td className="px-3 py-3 text-right text-slate-500 font-medium">{vendor.lastPurchase}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Bottom Row: 4 Quick Action Cards (Exact match to screenshot) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: New Asset Request */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">New Asset Request</h4>
                  <p className="text-[11px] text-slate-500">Request a new asset for your work</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNewRequestModal(true)}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-lg transition-all shrink-0 ml-2 shadow-2xs active:scale-95"
              >
                Request Now
              </button>
            </div>

            {/* Card 2: Return Asset */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Return Asset</h4>
                  <p className="text-[11px] text-slate-500">Initiate return for assigned asset</p>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedAsset(assets[0]); setShowReturnModal(true); }}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold rounded-lg transition-all shrink-0 ml-2 shadow-2xs active:scale-95"
              >
                Return Now
              </button>
            </div>

            {/* Card 3: Report Issue */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Report Issue</h4>
                  <p className="text-[11px] text-slate-500">Report any issue with asset</p>
                </div>
              </div>
              <button 
                onClick={() => setShowReportIssueModal(true)}
                className="px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 text-xs font-bold rounded-lg transition-all shrink-0 ml-2 shadow-2xs active:scale-95"
              >
                Report Now
              </button>
            </div>

            {/* Card 4: Assets Due for Return */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Assets Due for Return</h4>
                  <p className="text-[11px] text-slate-500">12 assets are due for return</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('Return Request')}
                className="px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 text-xs font-bold rounded-lg transition-all shrink-0 ml-2 shadow-2xs active:scale-95"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT 2: ALL ASSETS ── */}
      {activeTab === 'All Assets' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by asset tag, name, brand, or serial number..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-3 py-2 text-xs border rounded-lg font-bold transition-all ${showFilters || Object.values(filters).some(v => v) ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
              >
                <Filter className="w-3.5 h-3.5" />
                Filters
              </button>
              {(searchTerm || Object.values(filters).some(v => v)) && (
                <button onClick={handleResetFilters} className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700">
                  Reset
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg bg-white">
                    <option value="">All Statuses</option>
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="UNDER REPAIR">UNDER REPAIR</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg bg-white">
                    <option value="">All Categories</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Mobiles">Mobiles</option>
                    <option value="Monitors">Monitors</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Condition</label>
                  <select value={filters.condition} onChange={e => setFilters({ ...filters, condition: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg bg-white">
                    <option value="">All Conditions</option>
                    <option value="GOOD">GOOD</option>
                    <option value="DAMAGED">DAMAGED</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3">Tag #</th>
                  <th className="px-4 py-3">Asset Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Brand & Model</th>
                  <th className="px-4 py-3">Serial Number</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Condition</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAssets.map((asset) => (
                  <tr key={asset.asset_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{asset.asset_tag}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{asset.asset_name}</td>
                    <td className="px-4 py-3 text-slate-600 font-semibold">{asset.category}</td>
                    <td className="px-4 py-3 text-slate-600">{asset.brand} {asset.model}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{asset.serial_number}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold rounded-full ${getStatusBadgeStyle(asset.asset_status)}`}>
                        {asset.asset_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold rounded-full ${getConditionBadgeStyle(asset.condition_status)}`}>
                        {asset.condition_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => { setSelectedAsset(asset); setShowAssetDetailModal(true); }} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setSelectedAsset(asset); setAssetFormData({ asset_tag: asset.asset_tag, asset_name: asset.asset_name, category: asset.category, brand: asset.brand, model: asset.model, serial_number: asset.serial_number, purchase_date: asset.purchase_date, purchase_cost: asset.purchase_cost, vendor_name: asset.vendor_name, location: 'Head Office' }); setShowAddEditModal(true); }} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {asset.asset_status === 'AVAILABLE' && (
                          <button onClick={() => { setSelectedAsset(asset); setShowAssignModal(true); }} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded" title="Assign">
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {asset.asset_status === 'ASSIGNED' && (
                          <button onClick={() => { setSelectedAsset(asset); setShowReturnModal(true); }} className="p-1 text-amber-600 hover:bg-amber-50 rounded" title="Return">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT 3: ASSIGNED ASSETS ── */}
      {activeTab === 'Assigned Assets' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Currently Assigned Hardware Directory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3">Asset Tag</th>
                  <th className="px-4 py-3">Asset Name</th>
                  <th className="px-4 py-3">Assigned Employee</th>
                  <th className="px-4 py-3">Assigned On</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {assets.filter(a => a.asset_status === 'ASSIGNED' || a.asset_status === 'UNDER REPAIR').map((item) => (
                  <tr key={item.asset_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{item.asset_tag}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{item.asset_name} ({item.category})</td>
                    <td className="px-4 py-3">
                      {item.assigned_to ? (
                        <div className="flex items-center gap-2">
                          <img src={item.assigned_to.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 block">{item.assigned_to.name}</span>
                            <span className="text-[10px] text-slate-400">{item.assigned_to.role}</span>
                          </div>
                        </div>
                      ) : <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{item.assigned_on || '15 May 2024'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold rounded-full ${getStatusBadgeStyle(item.asset_status)}`}>
                        {item.asset_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { setSelectedAsset(item); setShowReturnModal(true); }} className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-xs font-bold transition-all">
                        Initiate Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT 4: NEW ASSET REQUEST ── */}
      {activeTab === 'New Asset Request' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Employee Hardware Requests</h3>
            <button onClick={() => setShowNewRequestModal(true)} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all shadow-xs">
              + New Request
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3">Req ID</th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Requested Hardware</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {newRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{req.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{req.employee} ({req.role})</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{req.assetType}</td>
                    <td className="px-4 py-3 text-slate-500 font-medium">{req.requestDate}</td>
                    <td className="px-4 py-3 font-bold text-amber-700">{req.priority}</td>
                    <td className="px-4 py-3 text-slate-600">{req.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {req.status === 'Pending' && (
                        <>
                          <button onClick={() => handleApproveRequest(req.id)} className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700">Approve</button>
                          <button onClick={() => handleRejectRequest(req.id)} className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded text-[11px] font-bold hover:bg-rose-100">Reject</button>
                        </>
                      )}
                      {req.status !== 'Pending' && <span className="text-slate-400 italic">Completed</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT 5: RETURN REQUEST ── */}
      {activeTab === 'Return Request' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Pending Asset Returns</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3">Return ID</th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Asset Details</th>
                  <th className="px-4 py-3">Return Date</th>
                  <th className="px-4 py-3">Condition</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {returnRequests.map((ret) => (
                  <tr key={ret.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{ret.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{ret.employee}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{ret.asset}</td>
                    <td className="px-4 py-3 text-slate-500 font-medium">{ret.returnDate}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">{ret.condition}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ret.status.includes('Verified') ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800'}`}>{ret.status}</span></td>
                    <td className="px-4 py-3 text-right">
                      {ret.status !== 'Received & Verified' ? (
                        <button onClick={() => handleAcceptReturn(ret.id)} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700">
                          Accept & Verify
                        </button>
                      ) : <span className="text-emerald-600 font-bold">Verified ✅</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT 6: ASSET HISTORY ── */}
      {activeTab === 'Asset History' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Asset Audit & History Logs</h3>
          <div className="space-y-3">
            {assetHistoryLogs.map((log) => (
              <div key={log.id} className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs">
                  {log.action.charAt(0)}
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{log.assetName} ({log.assetTag})</span>
                    <span className="text-[11px] text-slate-400 font-mono font-medium">{log.date}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5"><span className="font-bold text-blue-700">{log.action}</span> by {log.performer} to {log.recipient}</p>
                  <p className="text-slate-500 text-[11px] mt-1 italic">"{log.notes}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB CONTENT 7: CATEGORIES ── */}
      {activeTab === 'Asset Categories' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Asset Categories Directory</h3>
            <button onClick={() => setShowAddCategoryModal(true)} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all shadow-xs">
              + Add Category
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="p-4 border border-slate-200/80 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-full text-xs">{cat.total} items</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1.5 mt-3">
                  <p className="flex justify-between"><span>Assigned:</span> <span className="font-bold text-slate-800">{cat.assigned}</span></p>
                  <p className="flex justify-between"><span>Available:</span> <span className="font-bold text-emerald-600">{cat.available}</span></p>
                  <p className="flex justify-between"><span>Under Repair:</span> <span className="font-bold text-amber-600">{cat.underRepair}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB CONTENT 8: VENDORS ── */}
      {activeTab === 'Vendors' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Hardware & Equipment Vendors Directory</h3>
            <button onClick={() => setShowAddVendorModal(true)} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all shadow-xs">
              + Add Vendor
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendors.map((v, i) => (
              <div key={i} className="p-4 border border-slate-200/80 rounded-xl bg-white shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{v.logo}</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{v.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">Contact: {v.contact}</p>
                    <p className="text-[11px] text-slate-400">Last Order: {v.lastPurchase}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-blue-600">{v.totalValue}</p>
                  <p className="text-xs text-slate-500 font-semibold">{v.totalAssets} Assets Supplied</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {/* 1. Add / Edit Asset Modal */}
      <AnimatePresence>
        {showAddEditModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowAddEditModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-base font-bold text-slate-900">{selectedAsset ? "Edit Asset" : "Add New Company Asset"}</h2>
                <button onClick={() => setShowAddEditModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-500"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddAssetSubmit} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Asset Tag *</label>
                    <input type="text" value={assetFormData.asset_tag} onChange={e => setAssetFormData({ ...assetFormData, asset_tag: e.target.value })} placeholder="AST-LAP-1023" className="w-full p-2.5 border border-slate-300 rounded-lg font-mono" required />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Asset Name *</label>
                    <input type="text" value={assetFormData.asset_name} onChange={e => setAssetFormData({ ...assetFormData, asset_name: e.target.value })} placeholder="MacBook Pro 16" className="w-full p-2.5 border border-slate-300 rounded-lg font-bold" required />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category *</label>
                    <select value={assetFormData.category} onChange={e => setAssetFormData({ ...assetFormData, category: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white">
                      <option value="Laptops">Laptops</option>
                      <option value="Mobiles">Mobiles</option>
                      <option value="Monitors">Monitors</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Brand</label>
                    <input type="text" value={assetFormData.brand} onChange={e => setAssetFormData({ ...assetFormData, brand: e.target.value })} placeholder="Apple / Dell" className="w-full p-2.5 border border-slate-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Serial Number</label>
                    <input type="text" value={assetFormData.serial_number} onChange={e => setAssetFormData({ ...assetFormData, serial_number: e.target.value })} placeholder="SN-992019" className="w-full p-2.5 border border-slate-300 rounded-lg font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Purchase Cost (₹)</label>
                    <input type="number" value={assetFormData.purchase_cost} onChange={e => setAssetFormData({ ...assetFormData, purchase_cost: e.target.value })} placeholder="125000" className="w-full p-2.5 border border-slate-300 rounded-lg" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowAddEditModal(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm">Save Asset</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Assign Asset Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowAssignModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
                <h2 className="text-base font-bold text-slate-900">Assign Asset to Employee</h2>
                <button onClick={() => setShowAssignModal(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAssignSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Asset Tag & Name</label>
                  <input type="text" disabled value={`${selectedAsset?.asset_name} (${selectedAsset?.asset_tag})`} className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employee Name *</label>
                  <select value={assignFormData.employee_name} onChange={e => setAssignFormData({ ...assignFormData, employee_name: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-semibold">
                    <option value="Amit Kumar">Amit Kumar (HR Manager)</option>
                    <option value="Neha Verma">Neha Verma (HR Executive)</option>
                    <option value="Rahul Sharma">Rahul Sharma (Sr. Developer)</option>
                    <option value="Priya Patel">Priya Patel (UI/UX Designer)</option>
                    <option value="Vikram Singh">Vikram Singh (DevOps Lead)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Date *</label>
                  <input type="date" value={assignFormData.assigned_date} onChange={e => setAssignFormData({ ...assignFormData, assigned_date: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white" required />
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowAssignModal(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-lg">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Assign Asset</button>
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
                <h2 className="text-base font-bold text-slate-900">Return Asset to Storage</h2>
                <button onClick={() => setShowReturnModal(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleReturnSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selected Asset</label>
                  <input type="text" disabled value={`${selectedAsset?.asset_name} (${selectedAsset?.asset_tag})`} className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-bold" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Return Condition</label>
                  <select className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-semibold">
                    <option value="GOOD">GOOD (Working Fine)</option>
                    <option value="DAMAGED">DAMAGED (Needs Repair)</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowReturnModal(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-lg">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">Confirm Return</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Asset Detail Modal */}
      <AnimatePresence>
        {showAssetDetailModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowAssetDetailModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
                <h2 className="text-base font-bold text-slate-900">Asset Full Specification</h2>
                <button onClick={() => setShowAssetDetailModal(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">{selectedAsset?.asset_name}</h3>
                    <p className="text-xs font-mono font-bold text-blue-600 mt-0.5">{selectedAsset?.asset_tag}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusBadgeStyle(selectedAsset?.asset_status)}`}>
                    {selectedAsset?.asset_status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div><span className="text-slate-400 block">Category:</span><span className="font-bold">{selectedAsset?.category}</span></div>
                  <div><span className="text-slate-400 block">Brand / Model:</span><span className="font-bold">{selectedAsset?.brand} {selectedAsset?.model}</span></div>
                  <div><span className="text-slate-400 block">Serial Number:</span><span className="font-mono font-bold text-slate-900">{selectedAsset?.serial_number}</span></div>
                  <div><span className="text-slate-400 block">Purchase Value:</span><span className="font-bold text-blue-600">₹{selectedAsset?.purchase_cost?.toLocaleString()}</span></div>
                  <div><span className="text-slate-400 block">Vendor:</span><span className="font-bold">{selectedAsset?.vendor_name}</span></div>
                  <div><span className="text-slate-400 block">Purchase Date:</span><span className="font-bold">{selectedAsset?.purchase_date}</span></div>
                </div>

                <div className="pt-3">
                  <button onClick={() => setShowAssetDetailModal(false)} className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200">
                    Close Window
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Add Category Modal */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowAddCategoryModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
                <h2 className="text-base font-bold text-slate-900">Add New Category</h2>
                <button onClick={() => setShowAddCategoryModal(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddCategorySubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                  <input type="text" value={categoryFormData.name} onChange={e => setCategoryFormData({ ...categoryFormData, name: e.target.value })} placeholder="e.g. Network Equipment" className="w-full p-2.5 border border-slate-300 rounded-lg" required />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddCategoryModal(false)} className="flex-1 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Add Vendor Modal */}
      <AnimatePresence>
        {showAddVendorModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowAddVendorModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
                <h2 className="text-base font-bold text-slate-900">Add New Vendor</h2>
                <button onClick={() => setShowAddVendorModal(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddVendorSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vendor Name *</label>
                  <input type="text" value={vendorFormData.name} onChange={e => setVendorFormData({ ...vendorFormData, name: e.target.value })} placeholder="e.g. Lenovo Commercial India" className="w-full p-2.5 border border-slate-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Email / Phone</label>
                  <input type="text" value={vendorFormData.contact} onChange={e => setVendorFormData({ ...vendorFormData, contact: e.target.value })} placeholder="corporate@vendor.com" className="w-full p-2.5 border border-slate-300 rounded-lg" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddVendorModal(false)} className="flex-1 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg">Add Vendor</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. New Request Modal (Bottom Card Action) */}
      <AnimatePresence>
        {showNewRequestModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowNewRequestModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
                <h2 className="text-base font-bold text-slate-900">Request New Asset</h2>
                <button onClick={() => setShowNewRequestModal(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); const newR = { id: `REQ-${Math.floor(100+Math.random()*900)}`, employee: user?.name || 'Current User', role: 'Staff', assetType: 'Dell 27" 4K Monitor', requestDate: 'Today', priority: 'High', reason: 'Dual Monitor Workstation setup', status: 'Pending' }; setNewRequests(prev => [newR, ...prev]); toast.success('New Asset Request created! 🎉'); setShowNewRequestModal(false); setActiveTab('New Asset Request'); }} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Asset Name / Model *</label>
                  <input type="text" placeholder="e.g. Dell 27 inch 4K USB-C Monitor" className="w-full p-2.5 border border-slate-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-semibold">
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent project deliverable)</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Reason</label>
                  <textarea rows={3} placeholder="Provide justification for equipment request..." className="w-full p-2.5 border border-slate-300 rounded-lg"></textarea>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowNewRequestModal(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-lg">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-lg">Submit Request</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. Report Issue Modal */}
      <AnimatePresence>
        {showReportIssueModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowReportIssueModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
                <h2 className="text-base font-bold text-slate-900">Report Asset Malfunction / Issue</h2>
                <button onClick={() => setShowReportIssueModal(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); toast.success("IT Repair Ticket created! Hardware team notified. 🛠️"); setShowReportIssueModal(false); }} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Asset *</label>
                  <select className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-semibold">
                    {assets.map(a => (<option key={a.asset_id} value={a.asset_tag}>{a.asset_name} ({a.asset_tag})</option>))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issue Category</label>
                  <select className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-semibold">
                    <option value="Hardware">Hardware Malfunction</option>
                    <option value="Battery">Battery / Power Issue</option>
                    <option value="Screen">Screen Cracks / Display Bleed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea rows={3} placeholder="Describe the malfunction..." className="w-full p-2.5 border border-slate-300 rounded-lg"></textarea>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowReportIssueModal(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-lg">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-orange-600 text-white font-bold rounded-lg">Log Ticket</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
