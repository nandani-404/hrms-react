import { useState } from 'react'
import {
  Briefcase,
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Plus,
  Globe,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
  Search,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function Recruitment() {
  const [activeJobTab, setActiveJobTab] = useState('all')
  const [selectedFunnelPeriod, setSelectedFunnelPeriod] = useState('This Month')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form state for creating a job opening
  const [newJob, setNewJob] = useState({
    title: '',
    department: 'IT',
    location: 'Noida, India',
    type: 'Full Time',
    applicants: 0,
    status: 'Active',
  })

  // Sample Job Openings Data
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Software Developer', type: 'Full Time', department: 'IT', location: 'Noida, India', applicants: 45, status: 'Active', postedOn: '20 May 2024' },
    { id: 2, title: 'UI/UX Designer', type: 'Full Time', department: 'Design', location: 'Bangalore, India', applicants: 28, status: 'Active', postedOn: '18 May 2024' },
    { id: 3, title: 'Digital Marketing Executive', type: 'Full Time', department: 'Marketing', location: 'Mumbai, India', applicants: 36, status: 'Active', postedOn: '15 May 2024' },
    { id: 4, title: 'HR Executive', type: 'Full Time', department: 'Human Resources', location: 'Delhi, India', applicants: 22, status: 'On Hold', postedOn: '10 May 2024' },
    { id: 5, title: 'QA Engineer', type: 'Full Time', department: 'IT', location: 'Hyderabad, India', applicants: 18, status: 'Closed', postedOn: '05 May 2024' },
  ])

  // Sample Recent Applications
  const recentApplications = [
    { id: 1, name: 'Rohit Mehta', role: 'Software Developer', email: 'rohit.mehta@email.com', date: '21 May 2024', status: 'Shortlisted', badgeColor: 'bg-purple-100/80 text-purple-700 border-purple-200' },
    { id: 2, name: 'Neha Verma', role: 'UI/UX Designer', email: 'neha.verma@email.com', date: '20 May 2024', status: 'Under Review', badgeColor: 'bg-amber-100/80 text-amber-700 border-amber-200' },
    { id: 3, name: 'Sourabh Singh', role: 'QA Engineer', email: 'sourabh.singh@email.com', date: '19 May 2024', status: 'Interview', badgeColor: 'bg-blue-100/80 text-blue-700 border-blue-200' },
    { id: 4, name: 'Pooja Sharma', role: 'HR Executive', email: 'pooja.sharma@email.com', date: '18 May 2024', status: 'Applied', badgeColor: 'bg-emerald-100/80 text-emerald-700 border-emerald-200' },
    { id: 5, name: 'Aman Gupta', role: 'Digital Marketing', email: 'aman.gupta@email.com', date: '17 May 2024', status: 'Rejected', badgeColor: 'bg-rose-100/80 text-rose-700 border-rose-200' },
  ]

  // Sample Upcoming Interviews
  const upcomingInterviews = [
    { id: 1, date: '24 May', candidate: 'Rohit Mehta', role: 'Software Developer', time: '10:00 AM - 11:00 AM', status: 'Scheduled' },
    { id: 2, date: '25 May', candidate: 'Neha Verma', role: 'UI/UX Designer', time: '02:00 PM - 03:00 PM', status: 'Scheduled' },
    { id: 3, date: '26 May', candidate: 'Sourabh Singh', role: 'QA Engineer', time: '11:00 AM - 12:00 PM', status: 'Scheduled' },
    { id: 4, date: '27 May', candidate: 'Pooja Sharma', role: 'HR Executive', time: '03:30 PM - 04:30 PM', status: 'Scheduled' },
  ]

  // Filter jobs based on selected tab and search term
  const filteredJobs = jobs.filter(j => {
    const matchesTab = activeJobTab === 'all' || j.status.toLowerCase() === activeJobTab.toLowerCase()
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.department.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleCreateJobSubmit = (e) => {
    e.preventDefault()
    if (!newJob.title) {
      toast.error('Please enter a job title')
      return
    }
    const created = {
      id: Date.now(),
      title: newJob.title,
      type: newJob.type,
      department: newJob.department,
      location: newJob.location,
      applicants: 0,
      status: newJob.status,
      postedOn: 'Today',
    }
    setJobs([created, ...jobs])
    setIsModalOpen(false)
    setNewJob({ title: '', department: 'IT', location: 'Noida, India', type: 'Full Time', applicants: 0, status: 'Active' })
    toast.success(`Job opening created for ${created.title}!`)
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header with Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Recruitment</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gray-700">Recruitment</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toast.success('Career portal link copied!')}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-gray-500" />
            <span>Career Page</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job Opening</span>
          </button>
        </div>
      </div>

      {/* Top 5 Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Job Openings</p>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">28</p>
            <p className="text-[11px] font-medium text-gray-400">Active Jobs</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Candidates</p>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">512</p>
            <p className="text-[11px] font-medium text-gray-400">All Applicants</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Shortlisted</p>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">86</p>
            <p className="text-[11px] font-medium text-gray-400">16.8% of Total</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Hired (This Month)</p>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">15</p>
            <p className="text-[11px] font-semibold text-emerald-600">+20% vs Last Month</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rejected</p>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">112</p>
            <p className="text-[11px] font-medium text-gray-400">21.9% of Total</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shrink-0">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Job Openings Table (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            {/* Header & Tabs */}
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Job Openings</h2>
              </div>
              <button className="text-xs font-semibold text-blue-600 hover:underline">View All Jobs</button>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2 bg-slate-50/60 border-b border-gray-100 flex items-center justify-between gap-2 overflow-x-auto text-xs">
              <div className="flex gap-1.5">
                {[
                  { id: 'all', label: 'All Jobs' },
                  { id: 'active', label: 'Active' },
                  { id: 'on hold', label: 'On Hold' },
                  { id: 'closed', label: 'Closed' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveJobTab(tab.id)}
                    className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                      activeJobTab === tab.id
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-36">
                <input
                  type="text"
                  placeholder="Filter jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 bg-white"
                />
                <Search className="w-3 h-3 text-gray-400 absolute left-2 top-2" />
              </div>
            </div>

            {/* Jobs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-2.5 px-3">JOB TITLE</th>
                    <th className="py-2.5 px-3">DEPARTMENT</th>
                    <th className="py-2.5 px-3">LOCATION</th>
                    <th className="py-2.5 px-3">APPLICANTS</th>
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-3">POSTED ON</th>
                    <th className="py-2.5 px-3 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                      <tr key={job.id} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                              <Briefcase className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{job.title}</p>
                              <p className="text-[10px] text-slate-400 font-normal">{job.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{job.department}</td>
                        <td className="py-3 px-3 text-slate-600">{job.location}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{job.applicants}</span>
                            <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-blue-600 h-full rounded-full"
                                style={{ width: `${Math.min(job.applicants * 2, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            job.status === 'Active' ? 'bg-emerald-100/70 text-emerald-700 border border-emerald-200/50' :
                            job.status === 'On Hold' ? 'bg-amber-100/70 text-amber-700 border border-amber-200/50' :
                            'bg-rose-100/70 text-rose-700 border border-rose-200/50'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">{job.postedOn}</td>
                        <td className="py-3 px-3 text-center">
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-6 text-center text-xs text-gray-400">No jobs found matching criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Recruitment Funnel (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Recruitment Funnel</h3>
              <select
                value={selectedFunnelPeriod}
                onChange={(e) => setSelectedFunnelPeriod(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="This Quarter">This Quarter</option>
              </select>
            </div>

            <div className="flex flex-col items-center justify-center py-2">
              <svg className="w-full max-w-[360px] h-[260px]" viewBox="0 0 360 260">
                {/* Stage 1: Applications */}
                <polygon points="10,0 350,0 308,48 52,48" fill="#0256c6" />
                <text x="180" y="21" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Applications</text>
                <text x="180" y="37" fill="#ffffff" fontSize="11" opacity="0.9" textAnchor="middle">512 (100%)</text>

                {/* Stage 2: Screening */}
                <polygon points="54,52 306,52 268,100 92,100" fill="#00a896" />
                <text x="180" y="73" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Screening</text>
                <text x="180" y="89" fill="#ffffff" fontSize="11" opacity="0.9" textAnchor="middle">221 (43.2%)</text>

                {/* Stage 3: Shortlisted */}
                <polygon points="94,104 266,104 230,152 130,152" fill="#f26419" />
                <text x="180" y="125" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Shortlisted</text>
                <text x="180" y="141" fill="#ffffff" fontSize="11" opacity="0.9" textAnchor="middle">86 (16.8%)</text>

                {/* Stage 4: Interviews */}
                <polygon points="132,156 228,156 214,204 146,204" fill="#8f2d56" />
                <text x="180" y="177" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Interviews</text>
                <text x="180" y="193" fill="#ffffff" fontSize="10" opacity="0.9" textAnchor="middle">32 (6.3%)</text>

                {/* Stage 5: Hired (Wide Top Line, Soft Flat Base) */}
                <polygon points="144,208 216,208 190,254 170,254" fill="#2a9d8f" />
                <text x="180" y="225" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Hired</text>
                <text x="180" y="239" fill="#ffffff" fontSize="10" opacity="0.95" textAnchor="middle">15 (2.9%)</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Applications (Span 6) + Upcoming Interviews (Span 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Applications Card */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Recent Applications</h3>
            <button className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
          </div>

          <div className="space-y-3">
            {recentApplications.map(app => (
              <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{app.name}</p>
                    <p className="text-[11px] text-gray-400">Applied for: <span className="font-medium text-gray-600">{app.role}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs justify-between sm:justify-end">
                  <span className="text-gray-400 text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {app.date}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${app.badgeColor}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Interviews Card */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Upcoming Interviews</h3>
            <button className="text-xs font-semibold text-blue-600 hover:underline">View Calendar</button>
          </div>

          <div className="space-y-3">
            {upcomingInterviews.map(inv => (
              <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold flex flex-col items-center justify-center text-[10px] shrink-0 leading-tight">
                    <span className="text-xs font-black">{inv.date.split(' ')[0]}</span>
                    <span>{inv.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{inv.candidate}</p>
                    <p className="text-[11px] text-blue-600 font-medium">{inv.role}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {inv.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Create Job Opening */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-gray-900">Create Job Opening</h3>

            <form onSubmit={handleCreateJobSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Department</label>
                  <select
                    value={newJob.department}
                    onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="IT">IT</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Job Type</label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Noida, India"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                >
                  Post Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
