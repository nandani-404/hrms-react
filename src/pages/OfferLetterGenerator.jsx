import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  ShieldCheck,
  Download,
  Printer,
  Send,
  Save,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Eye,
  Plus,
  Search,
  X,
  FileEdit,
  ShieldAlert,
  ArrowLeft,
  Copy,
  Check,
  FolderInput,
  Trash2,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { HR_ROLES } from '../config/navigation'
import { cx } from '../components/ui'
import jsPDF from 'jspdf'

const STORAGE_KEY = 'manavsetu_offer_letters_history'

// Number to Words Converter for Indian Rupee CTC
const numberToWordsRupees = (amount) => {
  if (!amount) return 'Zero Only'
  const num = parseInt(String(amount).replace(/[^0-9]/g, ''), 10)
  if (isNaN(num) || num === 0) return 'Zero Only'

  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ]
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  function inWords(n) {
    if ((n = n.toString()).length > 9) return 'overflow'
    let n_array = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
    if (!n_array) return ''
    let str = ''
    str += (n_array[1] != 0) ? (a[Number(n_array[1])] || b[n_array[1][0]] + ' ' + a[n_array[1][1]]) + 'Crore ' : ''
    str += (n_array[2] != 0) ? (a[Number(n_array[2])] || b[n_array[2][0]] + ' ' + a[n_array[2][1]]) + 'Lakh ' : ''
    str += (n_array[3] != 0) ? (a[Number(n_array[3])] || b[n_array[3][0]] + ' ' + a[n_array[3][1]]) + 'Thousand ' : ''
    str += (n_array[4] != 0) ? (a[Number(n_array[4])] || b[n_array[4][0]] + ' ' + a[n_array[4][1]]) + 'Hundred ' : ''
    str += (n_array[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n_array[5])] || b[n_array[5][0]] + ' ' + a[n_array[5][1]]) : ''
    return str
  }

  const words = inWords(num)
  return (words ? words.trim() : '') + ' Only'
}

// Pre-configured templates
const TEMPLATES = [
  { id: 'corporate', name: 'ABC Corporate Standard', primaryColor: '#1E40AF', tag: 'Recommended', badgeBg: 'bg-blue-50 text-blue-700' },
  { id: 'modern', name: 'TruckMit Executive', primaryColor: '#0F766E', tag: 'Modern', badgeBg: 'bg-teal-50 text-teal-700' },
  { id: 'startup', name: 'Dynamic Tech Minimal', primaryColor: '#4F46E5', tag: 'Clean', badgeBg: 'bg-indigo-50 text-indigo-700' },
]

// Mock Saved History Data
const INITIAL_HISTORY = [
  {
    id: 'OL-2024-1256',
    candidateName: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    designation: 'Software Engineer',
    department: 'IT Development',
    reportingManager: 'Amit Kumar',
    location: 'Noida, Uttar Pradesh',
    date: '2024-05-20',
    joiningDate: '2024-06-01',
    status: 'Sent',
    ctc: '8,00,000',
    probationPeriod: '6 Months',
    otherBenefits: 'Health Insurance, PF, Gratuity, Performance Bonus',
    noticePeriod: '30 Days',
    workingHours: '9:00 AM - 6:00 PM (Mon-Fri)',
    joiningBonus: '₹ 50,000',
    specialNotes: 'Please submit signed copy within 3 working days.'
  },
  {
    id: 'OL-2024-1255',
    candidateName: 'Rohan Verma',
    email: 'rohan.verma@email.com',
    phone: '+91 98111 22334',
    designation: 'Product Designer',
    department: 'Product & Design',
    reportingManager: 'Neha Malhotra',
    location: 'Gurugram, Haryana',
    date: '2024-05-18',
    joiningDate: '2024-06-15',
    status: 'Accepted',
    ctc: '12,50,000',
    probationPeriod: '3 Months',
    otherBenefits: 'Medical Cover, Learning Stipend',
    noticePeriod: '60 Days',
    workingHours: '9:30 AM - 6:30 PM',
    joiningBonus: '',
    specialNotes: 'Equipment will be dispatched prior to joining date.'
  },
  {
    id: 'OL-2024-1254',
    candidateName: 'Ananya Gupta',
    email: 'ananya.g@email.com',
    phone: '+91 99000 88776',
    designation: 'HR Specialist',
    department: 'Human Resources',
    reportingManager: 'Aditya Tiwari',
    location: 'Noida, Uttar Pradesh',
    date: '2024-05-15',
    joiningDate: '2024-06-10',
    status: 'Pending',
    ctc: '6,50,000',
    probationPeriod: '6 Months',
    otherBenefits: 'PF, ESI, Group Insurance',
    noticePeriod: '30 Days',
    workingHours: '9:00 AM - 6:00 PM',
    joiningBonus: '',
    specialNotes: 'Awaiting signature.'
  },
  {
    id: 'OL-2024-1253',
    candidateName: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 97777 55443',
    designation: 'Backend Lead',
    department: 'Engineering',
    reportingManager: 'Sanjay Dutt',
    location: 'Bengaluru, Karnataka',
    date: '2024-05-10',
    joiningDate: '2024-06-01',
    status: 'Rejected',
    ctc: '18,00,000',
    probationPeriod: '3 Months',
    otherBenefits: 'Relocation Allowance, ESOPs',
    noticePeriod: '60 Days',
    workingHours: 'Flexible',
    joiningBonus: '₹ 1,00,000',
    specialNotes: 'Candidate declined due to location constraints.'
  },
]

export default function OfferLetterGenerator() {
  const { user } = useAuth()
  const userRole = user?.role || 'employee'
  const isHR = HR_ROLES.includes(userRole)

  // Accordion section collapse state
  const [openSections, setOpenSections] = useState({
    candidate: true,
    compensation: true,
    terms: false,
    additional: false,
  })

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState('corporate')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [copiedRef, setCopiedRef] = useState(false)

  // Form Fields State
  const [formData, setFormData] = useState({
    refNo: 'ABC/OL/2024/1256',
    letterDate: new Date().toISOString().split('T')[0],
    candidateName: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    joiningDate: '2024-06-01',
    designation: 'Software Engineer',
    department: 'IT Development',
    reportingManager: 'Amit Kumar',
    location: 'Noida, Uttar Pradesh',
    annualCtc: '8,00,000',
    payFrequency: 'Annual',
    probationPeriod: '6 Months',
    otherBenefits: 'Health Insurance, PF, Gratuity, Performance Bonus',
    noticePeriod: '30 Days',
    workingHours: '9:00 AM - 6:00 PM (Mon-Fri)',
    joiningBonus: '₹ 50,000 (Payable after 90 days)',
    specialNotes: 'Please submit signed copy within 3 working days.',
  })

  // Email form state
  const [emailForm, setEmailForm] = useState({
    to: 'priya.sharma@email.com',
    subject: 'Employment Offer Letter - ABC Corporation Pvt. Ltd.',
    body: `Dear Priya Sharma,\n\nWe are delighted to offer you the position of Software Engineer at ABC Corporation Pvt. Ltd. Please find your detailed offer letter attached herewith.\n\nKindly review, sign, and send back a copy to confirm your acceptance.\n\nBest regards,\nHR Department\nABC Corporation Pvt. Ltd.`,
  })

  // Sync email body when candidate details change
  useEffect(() => {
    setEmailForm({
      to: formData.email || '',
      subject: `Employment Offer Letter (${formData.refNo}) - ${formData.candidateName}`,
      body: `Dear ${formData.candidateName || 'Candidate'},\n\nWe are delighted to offer you the position of ${formData.designation || 'Team Member'} at ABC Corporation Pvt. Ltd.\n\nKey Details:\n- Role: ${formData.designation}\n- Department: ${formData.department}\n- Date of Joining: ${formData.joiningDate}\n- Annual CTC: ₹ ${formData.annualCtc}\n\nPlease review the attached offer letter, sign, and return a copy within 3 working days.\n\nBest regards,\n${formData.reportingManager || 'HR Manager'}\nABC Corporation Pvt. Ltd.`
    })
  }, [formData.candidateName, formData.email, formData.designation, formData.department, formData.joiningDate, formData.annualCtc, formData.refNo, formData.reportingManager])

  // History list state synced with localStorage
  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_HISTORY
    } catch (e) {
      return INITIAL_HISTORY
    }
  })
  const [historySearch, setHistorySearch] = useState('')

  const printRef = useRef(null)

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Save Draft to LocalStorage and History
  const handleSaveDraft = () => {
    if (!formData.candidateName) {
      toast.error('Please enter candidate name before saving draft')
      return
    }

    const draftItem = {
      id: formData.refNo || `OL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      candidateName: formData.candidateName,
      email: formData.email,
      phone: formData.phone,
      designation: formData.designation,
      department: formData.department,
      reportingManager: formData.reportingManager,
      location: formData.location,
      date: formData.letterDate,
      joiningDate: formData.joiningDate,
      status: 'Pending',
      ctc: formData.annualCtc,
      probationPeriod: formData.probationPeriod,
      otherBenefits: formData.otherBenefits,
      noticePeriod: formData.noticePeriod,
      workingHours: formData.workingHours,
      joiningBonus: formData.joiningBonus,
      specialNotes: formData.specialNotes,
    }

    setHistoryList((prev) => {
      const filtered = prev.filter((h) => h.id !== draftItem.id)
      const updated = [draftItem, ...filtered]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })

    toast.success('Offer Letter saved as Draft!')
  }

  // Generate Action
  const handleGenerate = (e) => {
    if (e) e.preventDefault()
    if (!formData.candidateName || !formData.email || !formData.designation || !formData.annualCtc) {
      toast.error('Please fill in all required fields marked with *')
      return
    }

    const generatedItem = {
      id: formData.refNo,
      candidateName: formData.candidateName,
      email: formData.email,
      phone: formData.phone,
      designation: formData.designation,
      department: formData.department,
      reportingManager: formData.reportingManager,
      location: formData.location,
      date: formData.letterDate,
      joiningDate: formData.joiningDate,
      status: 'Sent',
      ctc: formData.annualCtc,
      probationPeriod: formData.probationPeriod,
      otherBenefits: formData.otherBenefits,
      noticePeriod: formData.noticePeriod,
      workingHours: formData.workingHours,
      joiningBonus: formData.joiningBonus,
      specialNotes: formData.specialNotes,
    }

    setHistoryList((prev) => {
      const filtered = prev.filter((h) => h.id !== generatedItem.id)
      const updated = [generatedItem, ...filtered]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })

    if (printRef.current) {
      printRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    toast.success('Offer Letter generated successfully! Review preview on the right.')
  }

  // Load history item into form
  const handleLoadHistoryItem = (item) => {
    setFormData({
      refNo: item.id || `ABC/OL/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      letterDate: item.date || new Date().toISOString().split('T')[0],
      candidateName: item.candidateName || '',
      email: item.email || '',
      phone: item.phone || '+91 98765 43210',
      joiningDate: item.joiningDate || '2024-06-01',
      designation: item.designation || '',
      department: item.department || 'IT Development',
      reportingManager: item.reportingManager || 'Amit Kumar',
      location: item.location || 'Noida, Uttar Pradesh',
      annualCtc: item.ctc || '8,00,000',
      payFrequency: 'Annual',
      probationPeriod: item.probationPeriod || '6 Months',
      otherBenefits: item.otherBenefits || 'Health Insurance, PF, Gratuity',
      noticePeriod: item.noticePeriod || '30 Days',
      workingHours: item.workingHours || '9:00 AM - 6:00 PM (Mon-Fri)',
      joiningBonus: item.joiningBonus || '',
      specialNotes: item.specialNotes || 'Please submit signed copy within 3 working days.',
    })
    setShowHistoryModal(false)
    toast.success(`Loaded offer letter for ${item.candidateName}`)
  }

  // Delete history item
  const handleDeleteHistoryItem = (id, e) => {
    e.stopPropagation()
    setHistoryList((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
    toast.success('Record removed from history')
  }

  // PDF Generator using jsPDF
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
      })

      const isModern = selectedTemplate === 'modern'
      const isStartup = selectedTemplate === 'startup'

      // Header Brand
      if (isModern) {
        doc.setFillColor(15, 118, 110) // Teal
        doc.rect(0, 0, 210, 8, 'F')
        doc.setFillColor(240, 253, 250)
        doc.rect(0, 8, 210, 28, 'F')
      } else if (isStartup) {
        doc.setFillColor(79, 70, 229) // Indigo
        doc.rect(0, 0, 8, 297, 'F')
        doc.setFillColor(245, 243, 255)
        doc.rect(8, 0, 202, 35, 'F')
      } else {
        doc.setFillColor(248, 250, 252)
        doc.rect(0, 0, 210, 35, 'F')
      }

      const startX = isStartup ? 20 : 15

      doc.setFont('Helvetica', 'bold')
      doc.setFontSize(20)
      doc.setTextColor(30, 41, 59)
      doc.text('ABC Corporation Pvt. Ltd.', startX, 18)

      doc.setFont('Helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100, 116, 139)
      doc.text('Building the future together | 123, Corporate Tower, Sector 62, Noida, U.P.', startX, 25)

      // Divider Line
      doc.setDrawColor(226, 232, 240)
      doc.setLineWidth(0.5)
      doc.line(startX, 35, 195, 35)

      // Meta Header (Date & Ref)
      doc.setFontSize(10)
      doc.setTextColor(71, 85, 105)
      doc.text(`Date: ${formData.letterDate}`, startX, 45)
      doc.text(`Ref No: ${formData.refNo}`, 140, 45)

      // Candidate Greeting
      doc.setFont('Helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(15, 23, 42)
      doc.text(`Dear ${formData.candidateName || 'Candidate'},`, startX, 58)

      doc.setFont('Helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(51, 65, 85)

      const p1 = `We are pleased to offer you the position of ${formData.designation} in the ${formData.department} department at ABC Corporation Pvt. Ltd. Your date of joining will be ${formData.joiningDate}. You will be reporting to ${formData.reportingManager} at our ${formData.location} office.`
      const splitP1 = doc.splitTextToSize(p1, 175)
      doc.text(splitP1, startX, 68)

      let currentY = 68 + splitP1.length * 5 + 4

      const ctcWords = numberToWordsRupees(formData.annualCtc)
      const p2 = `Your annual Cost to Company (CTC) will be Rs. ${formData.annualCtc} (${ctcWords}) as per the terms discussed and agreed.`
      const splitP2 = doc.splitTextToSize(p2, 175)
      doc.text(splitP2, startX, currentY)

      currentY += splitP2.length * 5 + 4

      const p3 = `You will be on probation for a period of ${formData.probationPeriod} from your date of joining. During this period, your performance will be evaluated periodically.`
      const splitP3 = doc.splitTextToSize(p3, 175)
      doc.text(splitP3, startX, currentY)

      currentY += splitP3.length * 5 + 8

      // Key Terms Box
      doc.setFillColor(241, 245, 249)
      doc.roundedRect(startX, currentY, 175, 45, 3, 3, 'F')

      doc.setFont('Helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(30, 41, 59)
      doc.text('Key Terms & Benefits Overview:', startX + 5, currentY + 8)

      doc.setFont('Helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(71, 85, 105)
      doc.text(`• Work Location: ${formData.location}`, startX + 7, currentY + 16)
      doc.text(`• Notice Period: ${formData.noticePeriod}`, startX + 7, currentY + 22)
      doc.text(`• Benefits Included: ${formData.otherBenefits}`, startX + 7, currentY + 28)
      if (formData.joiningBonus) {
        doc.text(`• Joining Bonus: ${formData.joiningBonus}`, startX + 7, currentY + 34)
      }

      currentY += 55

      const p4 = `Please find detailed terms and conditions of your employment attached. Kindly sign and return a copy of this letter within 3 working days to accept this offer.`
      const splitP4 = doc.splitTextToSize(p4, 175)
      doc.text(splitP4, startX, currentY)

      currentY += splitP4.length * 5 + 15

      // Sign-off
      doc.setFont('Helvetica', 'normal')
      doc.text('Sincerely,', startX, currentY)
      doc.setFont('Helvetica', 'bold')
      doc.text('ABC Corporation Pvt. Ltd.', startX, currentY + 6)

      doc.setFont('Helvetica', 'normal')
      doc.text(formData.reportingManager, startX, currentY + 20)
      doc.text('HR Manager / Authorized Signatory', startX, currentY + 25)

      // Footer
      doc.setFontSize(8)
      doc.setTextColor(148, 163, 184)
      doc.text('Confidential - ABC Corporation Pvt. Ltd. | Offer Letter', startX, 285)

      doc.save(`Offer_Letter_${formData.candidateName.replace(/\s+/g, '_')}.pdf`)
      toast.success('PDF Downloaded successfully! 📄')
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate PDF')
    }
  }

  // Print function
  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const win = window.open('', '', 'width=900,height=900')
    win.document.write(`
      <html>
        <head>
          <title>Offer Letter - ${formData.candidateName}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
            .brand-name { font-size: 24px; font-weight: bold; color: #0f172a; }
            .subtitle { font-size: 12px; color: #64748b; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 14px; font-weight: 500; }
            .content { font-size: 14px; margin-bottom: 24px; }
            .content p { margin-bottom: 14px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; }
            .footer { margin-top: 50px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => {
      win.print()
      win.close()
    }, 400)
  }

  // Handle Send Email
  const handleSendEmailSubmit = (e) => {
    e.preventDefault()
    setShowEmailModal(false)

    const sentItem = {
      id: formData.refNo,
      candidateName: formData.candidateName,
      email: emailForm.to,
      phone: formData.phone,
      designation: formData.designation,
      department: formData.department,
      reportingManager: formData.reportingManager,
      location: formData.location,
      date: formData.letterDate,
      joiningDate: formData.joiningDate,
      status: 'Sent',
      ctc: formData.annualCtc,
      probationPeriod: formData.probationPeriod,
      otherBenefits: formData.otherBenefits,
      noticePeriod: formData.noticePeriod,
      workingHours: formData.workingHours,
      joiningBonus: formData.joiningBonus,
      specialNotes: formData.specialNotes,
    }

    setHistoryList((prev) => {
      const filtered = prev.filter((h) => h.id !== sentItem.id)
      const updated = [sentItem, ...filtered]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })

    toast.success(`Offer Letter sent to ${emailForm.to}! ✉️`)

    // Launch mailto for client email dispatch
    const mailtoUrl = `mailto:${encodeURIComponent(emailForm.to)}?subject=${encodeURIComponent(emailForm.subject)}&body=${encodeURIComponent(emailForm.body)}`
    window.open(mailtoUrl, '_blank')
  }

  const copyRefNumber = () => {
    navigator.clipboard.writeText(formData.refNo)
    setCopiedRef(true)
    setTimeout(() => setCopiedRef(false), 2000)
    toast.success('Reference number copied!')
  }

  // Statistics counters
  const totalGenerated = historyList.length
  const acceptedCount = historyList.filter((h) => h.status === 'Accepted').length
  const pendingCount = historyList.filter((h) => h.status === 'Pending' || h.status === 'Sent').length
  const rejectedCount = historyList.filter((h) => h.status === 'Rejected').length

  // Unauthorized screen if not HR
  if (!isHR) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-black/5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Access Restricted</h2>
          <p className="mt-2 text-sm text-gray-600">
            The Offer Letter Generator is restricted to HR Administrators and Managers. You do not have permission to view or access this module.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const ctcInWords = numberToWordsRupees(formData.annualCtc)
  const currentTmpl = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0]

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* HEADER & TOP BAR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Home</span>
            <span>/</span>
            <span>Offer Letter</span>
            <span>/</span>
            <span className="font-medium text-gray-900">Generate Offer Letter</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Offer Letter Generator
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50"
          >
            <Clock className="h-4 w-4 text-gray-500" />
            Offer History & Drafts ({historyList.length})
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50"
          >
            <Save className="h-4 w-4 text-gray-500" />
            Save as Draft
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-700"
          >
            <Sparkles className="h-4 w-4" />
            Generate Offer Letter
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MAIN CONTENT GRID (Form Left + Live Preview Right) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: FORM SECTIONS (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          <form onSubmit={handleGenerate} className="space-y-4">
            {/* 1. Candidate Information Accordion */}
            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs transition-all">
              <button
                type="button"
                onClick={() => toggleSection('candidate')}
                className="flex w-full items-center justify-between p-4 font-semibold text-gray-900"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-base">Candidate Information</span>
                </div>
                {openSections.candidate ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>

              <AnimatePresence initial={false}>
                {openSections.candidate && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-gray-100 p-4 pt-3"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Candidate Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.candidateName}
                          onChange={(e) => handleInputChange('candidateName', e.target.value)}
                          placeholder="e.g. Priya Sharma"
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Email ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="e.g. priya.sharma@email.com"
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700">Date of Joining <span className="text-red-500">*</span></label>
                        <input
                          type="date"
                          required
                          value={formData.joiningDate}
                          onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700">Designation <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={formData.designation}
                          onChange={(e) => handleInputChange('designation', e.target.value)}
                          placeholder="e.g. Software Engineer"
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700">Department <span className="text-red-500">*</span></label>
                        <select
                          value={formData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        >
                          <option value="IT Development">IT Development</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Human Resources">Human Resources</option>
                          <option value="Product & Design">Product & Design</option>
                          <option value="Finance & Accounts">Finance & Accounts</option>
                          <option value="Marketing & Sales">Marketing & Sales</option>
                          <option value="Operations">Operations</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700">Reporting Manager <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={formData.reportingManager}
                          onChange={(e) => handleInputChange('reportingManager', e.target.value)}
                          placeholder="e.g. Amit Kumar"
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700">Location <span className="text-red-500">*</span></label>
                        <select
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        >
                          <option value="Noida, Uttar Pradesh">Noida, Uttar Pradesh</option>
                          <option value="Gurugram, Haryana">Gurugram, Haryana</option>
                          <option value="Bengaluru, Karnataka">Bengaluru, Karnataka</option>
                          <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
                          <option value="Remote">Remote</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Compensation Details Accordion */}
            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs transition-all">
              <button
                type="button"
                onClick={() => toggleSection('compensation')}
                className="flex w-full items-center justify-between p-4 font-semibold text-gray-900"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <IndianRupee className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-base">Compensation Details</span>
                </div>
                {openSections.compensation ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>

              <AnimatePresence initial={false}>
                {openSections.compensation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-gray-100 p-4 pt-3"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Annual CTC (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.annualCtc}
                          onChange={(e) => handleInputChange('annualCtc', e.target.value)}
                          placeholder="e.g. 8,00,000"
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                        <span className="mt-1 block text-[11px] text-gray-500 italic">
                          In words: {ctcInWords}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700">Pay Frequency</label>
                        <select
                          value={formData.payFrequency}
                          onChange={(e) => handleInputChange('payFrequency', e.target.value)}
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        >
                          <option value="Annual">Annual</option>
                          <option value="Monthly">Monthly</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700">Probation Period <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={formData.probationPeriod}
                          onChange={(e) => handleInputChange('probationPeriod', e.target.value)}
                          placeholder="e.g. 6 Months"
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-medium text-gray-700">Other Benefits</label>
                        <input
                          type="text"
                          value={formData.otherBenefits}
                          onChange={(e) => handleInputChange('otherBenefits', e.target.value)}
                          placeholder="e.g. Health Insurance, PF, Gratuity, Performance Bonus"
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Terms & Conditions Accordion */}
            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs transition-all">
              <button
                type="button"
                onClick={() => toggleSection('terms')}
                className="flex w-full items-center justify-between p-4 font-semibold text-gray-900"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-base">Terms & Conditions</span>
                </div>
                {openSections.terms ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>

              <AnimatePresence initial={false}>
                {openSections.terms && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-gray-100 p-4 pt-3"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Notice Period</label>
                        <input
                          type="text"
                          value={formData.noticePeriod}
                          onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                          placeholder="e.g. 30 Days"
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700">Working Hours</label>
                        <input
                          type="text"
                          value={formData.workingHours}
                          onChange={(e) => handleInputChange('workingHours', e.target.value)}
                          placeholder="e.g. 9:00 AM - 6:00 PM"
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. Additional Information Accordion */}
            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs transition-all">
              <button
                type="button"
                onClick={() => toggleSection('additional')}
                className="flex w-full items-center justify-between p-4 font-semibold text-gray-900"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-base">Additional Information</span>
                </div>
                {openSections.additional ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>

              <AnimatePresence initial={false}>
                {openSections.additional && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-gray-100 p-4 pt-3"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Joining Bonus / Perks (Optional)</label>
                        <input
                          type="text"
                          value={formData.joiningBonus}
                          onChange={(e) => handleInputChange('joiningBonus', e.target.value)}
                          placeholder="e.g. ₹ 50,000"
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700">Special Instructions / Remarks</label>
                        <textarea
                          rows={2}
                          value={formData.specialNotes}
                          onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                          placeholder="e.g. Please submit signed copy within 3 working days."
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-2xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary Form Submission Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700 active:scale-[0.99]"
            >
              Generate & Save Offer Letter
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: OFFER LETTER LIVE PREVIEW (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs">
            {/* Live Preview Header */}
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4.5 w-4.5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Offer Letter Preview</h3>
                <span className={cx('px-2 py-0.5 rounded-full text-[10px] font-semibold', currentTmpl.badgeBg)}>
                  {currentTmpl.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
              >
                <Layers className="h-3.5 w-3.5 text-gray-500" />
                Template
              </button>
            </div>

            {/* Document Preview Box (Official Paper Style) */}
            <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-md" ref={printRef}>
              {/* Watermark Logo background */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
                <img src="/truckmit-logo-white.png" alt="Watermark" className="h-48 w-auto invert" onError={(e) => (e.target.style.display = 'none')} />
              </div>

              {/* Dynamic Header according to selected template */}
              {selectedTemplate === 'corporate' && (
                <div className="mb-6 border-b-2 border-blue-800 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-800 text-white font-bold shadow-2xs">
                        ABC
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 leading-tight">ABC Corporation</h4>
                        <p className="text-xs text-blue-700 font-medium">Building the future together</p>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-gray-500 leading-tight">
                      <p className="font-semibold text-gray-800">ABC Corporation Pvt. Ltd.</p>
                      <p>123, Corporate Tower, Sector 62</p>
                      <p>Noida, Uttar Pradesh - 201301</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === 'modern' && (
                <div className="mb-6 border-b-2 border-teal-600 pb-4 bg-teal-50/50 p-3 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white font-bold shadow-2xs">
                        TM
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-teal-950 leading-tight">TruckMit Executive</h4>
                        <p className="text-xs text-teal-700 font-medium">Logistics & Technology HR Suite</p>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-teal-800 leading-tight">
                      <p className="font-bold">TruckMit Technology Hub</p>
                      <p>Cyber City, Gurugram</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === 'startup' && (
                <div className="mb-6 border-l-4 border-indigo-600 pl-4 py-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Confidential Employment Offer</span>
                      <h4 className="text-xl font-extrabold text-gray-900 leading-tight">ABC Tech</h4>
                    </div>
                    <div className="text-right text-[10px] text-gray-500">
                      <p className="font-semibold text-gray-700">ABC Corporation</p>
                      <p>India Operations</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Meta Date & Ref */}
              <div className="mb-6 flex items-center justify-between text-xs text-gray-600">
                <span>Date: <strong className="text-gray-800">{formData.letterDate}</strong></span>
                <div className="flex items-center gap-1">
                  <span>Ref No: <strong className="text-gray-800">{formData.refNo}</strong></span>
                  <button type="button" onClick={copyRefNumber} className="text-gray-400 hover:text-gray-600" title="Copy Ref">
                    {copiedRef ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              {/* Body Letter Content */}
              <div className="space-y-4 text-xs leading-relaxed text-gray-700">
                <p>
                  Dear <strong className="font-semibold text-gray-900">{formData.candidateName || '[Candidate Name]'}</strong>,
                </p>

                <p>
                  We are pleased to offer you the position of{' '}
                  <strong className="font-semibold text-gray-900">{formData.designation || '[Designation]'}</strong> in the{' '}
                  <strong className="font-semibold text-gray-900">{formData.department || '[Department]'}</strong> department at{' '}
                  <strong className="font-semibold text-gray-900">ABC Corporation Pvt. Ltd.</strong> Your date of joining will be{' '}
                  <strong className="font-semibold text-gray-900">{formData.joiningDate || '[Date]'}</strong>. You will be reporting to{' '}
                  <strong className="font-semibold text-gray-900">{formData.reportingManager || '[Manager]'}</strong> at our{' '}
                  <strong className="font-semibold text-gray-900">{formData.location || 'Noida'}</strong> office.
                </p>

                <p>
                  Your annual Cost to Company (CTC) will be{' '}
                  <strong className="font-semibold text-gray-900">₹{formData.annualCtc || '0'} ({ctcInWords})</strong> as per the details discussed and agreed.
                </p>

                <p>
                  You will be on probation for a period of{' '}
                  <strong className="font-semibold text-gray-900">{formData.probationPeriod || '6 Months'}</strong> from your date of joining. During this period, your performance will be evaluated periodically.
                </p>

                {formData.otherBenefits && (
                  <div className="rounded-lg bg-gray-50 p-3 ring-1 ring-black/5">
                    <p className="font-semibold text-gray-800 mb-1">Key Benefits & Offer Highlights:</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-gray-600">
                      <li>Included Benefits: {formData.otherBenefits}</li>
                      <li>Work Location: {formData.location}</li>
                      <li>Notice Period: {formData.noticePeriod}</li>
                      {formData.joiningBonus && <li>Joining Bonus: {formData.joiningBonus}</li>}
                    </ul>
                  </div>
                )}

                <p>
                  Please find the detailed terms and conditions of your employment attached. Kindly sign and return a copy of this letter within 3 working days to accept this offer.
                </p>

                <p>We look forward to welcoming you to our team.</p>

                {/* Signature Block */}
                <div className="pt-6">
                  <p className="mb-4 font-medium text-gray-800">Sincerely,</p>
                  <div className="font-serif italic text-gray-600 text-sm tracking-wide">
                    {formData.reportingManager || 'Amit Kumar'}
                  </div>
                  <div className="mt-1 pt-1 border-t border-gray-200 w-44">
                    <p className="font-semibold text-gray-900 text-xs">{formData.reportingManager || 'Amit Kumar'}</p>
                    <p className="text-[10px] text-gray-500">HR Manager / Authorized Signatory</p>
                    <p className="text-[10px] text-gray-500">ABC Corporation Pvt. Ltd.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Toolbar Below Preview */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white py-2.5 px-3 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition active:scale-95"
              >
                <Download className="h-4 w-4 text-primary-600" />
                Download PDF
              </button>

              <button
                type="button"
                onClick={() => setShowEmailModal(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white py-2.5 px-3 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition active:scale-95"
              >
                <Send className="h-4 w-4 text-blue-600" />
                Send Email
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white py-2.5 px-3 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition active:scale-95"
              >
                <Printer className="h-4 w-4 text-gray-600" />
                Print Letter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* BOTTOM SECTION: KPI STAT CARDS (Overview Counters) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Offers */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileEdit className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Generated</p>
            <p className="text-lg font-bold text-gray-900">{totalGenerated} <span className="text-xs font-normal text-gray-500">Offer Letters</span></p>
          </div>
        </div>

        {/* Card 2: Accepted Offers */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-2xs">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-800">Accepted Offers</p>
            <p className="text-lg font-bold text-emerald-950">{acceptedCount} <span className="text-xs font-normal text-emerald-700">Confirmed</span></p>
          </div>
        </div>

        {/* Card 3: Pending / Sent */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 shadow-2xs">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-amber-800">Pending / Sent</p>
            <p className="text-lg font-bold text-amber-950">{pendingCount} <span className="text-xs font-normal text-amber-700">Awaiting Signature</span></p>
          </div>
        </div>

        {/* Card 4: Rejected Offers */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-purple-100 bg-purple-50/40 p-4 shadow-2xs">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-purple-800">Rejected Offers</p>
            <p className="text-lg font-bold text-purple-950">{rejectedCount} <span className="text-xs font-normal text-purple-700">Declined</span></p>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: CHANGE TEMPLATE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showTemplateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Select Offer Letter Template</h3>
                <button onClick={() => setShowTemplateModal(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedTemplate(tmpl.id)
                      setShowTemplateModal(false)
                      toast.success(`Switched template to ${tmpl.name}`)
                    }}
                    className={cx(
                      'flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all',
                      selectedTemplate === tmpl.id
                        ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/20'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{tmpl.name}</span>
                        <span className={cx('rounded-full px-2 py-0.5 text-[10px] font-semibold', tmpl.badgeBg)}>{tmpl.tag}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Includes corporate branding, live parameters & official signature layout.</p>
                    </div>
                    {selectedTemplate === tmpl.id && <CheckCircle2 className="h-5 w-5 text-primary-600 shrink-0" />}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: OFFER HISTORY & DRAFTS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Offer Letter History & Drafts</h3>
                  <p className="text-xs text-gray-500">Track sent, accepted, and pending candidate offer letters. Click "Load" to edit any offer.</p>
                </div>
                <button onClick={() => setShowHistoryModal(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="mt-4 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search candidate name, designation or ref ID..."
                    className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-xs text-gray-900 focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* History Table */}
              <div className="mt-4 max-h-80 overflow-y-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2.5">Ref ID</th>
                      <th className="px-4 py-2.5">Candidate</th>
                      <th className="px-4 py-2.5">Designation</th>
                      <th className="px-4 py-2.5">CTC (₹)</th>
                      <th className="px-4 py-2.5">Date</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historyList
                      .filter((h) =>
                        h.candidateName.toLowerCase().includes(historySearch.toLowerCase()) ||
                        h.designation.toLowerCase().includes(historySearch.toLowerCase()) ||
                        h.id.toLowerCase().includes(historySearch.toLowerCase())
                      )
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-mono font-medium text-gray-900">{item.id}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900">{item.candidateName}</td>
                          <td className="px-4 py-3 text-gray-600">{item.designation} ({item.department})</td>
                          <td className="px-4 py-3 text-gray-900 font-medium">{item.ctc}</td>
                          <td className="px-4 py-3 text-gray-500">{item.date}</td>
                          <td className="px-4 py-3">
                            <span
                              className={cx(
                                'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold',
                                item.status === 'Accepted' && 'bg-emerald-100 text-emerald-800',
                                item.status === 'Sent' && 'bg-blue-100 text-blue-800',
                                item.status === 'Pending' && 'bg-amber-100 text-amber-800',
                                item.status === 'Rejected' && 'bg-purple-100 text-purple-800'
                              )}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleLoadHistoryItem(item)}
                                className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100"
                                title="Load into form"
                              >
                                <FolderInput className="h-3.5 w-3.5" />
                                Load
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                title="Delete record"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: SEND VIA EMAIL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Send Offer Letter via Email</h3>
                <button onClick={() => setShowEmailModal(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSendEmailSubmit} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-gray-700">Recipient Email</label>
                  <input
                    type="email"
                    required
                    value={emailForm.to}
                    onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700">Subject Line</label>
                  <input
                    type="text"
                    required
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700">Message Body</label>
                  <textarea
                    rows={6}
                    value={emailForm.body}
                    onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 rounded-xl border border-gray-300 bg-white py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-primary-600 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-700"
                  >
                    Send Offer Letter
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
