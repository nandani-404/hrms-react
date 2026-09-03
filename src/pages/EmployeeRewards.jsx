import { useState } from 'react'
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
  ThumbsUp,
  Sparkles,
  ChevronRight,
  Send,
  X,
  Star,
  Medal,
  Heart,
  ShoppingBag,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import EmployeeOfTheMonthCard from '../components/EmployeeOfTheMonthCard'
import { useAuth } from '../context/AuthContext'
import { Avatar, cx } from '../components/ui'

/* ─── My Received Recognitions ─── */
const myReceivedRecognitions = [
  {
    id: 'MY-REC-001',
    achievement: 'Innovation Pioneer',
    achievementDesc: 'Developed new automated deployment pipeline',
    reward: 'Amazon Voucher',
    rewardValue: 10000,
    pointsWon: 1000,
    recognizedBy: { name: 'Saurabh Singh', role: 'CTO', avatar: '/storage/avatars/amit.jpg' },
    date: '18 May 2024',
    comment: 'Amazing innovation and problem-solving skills. You inspire the whole team!',
  },
  {
    id: 'MY-REC-002',
    achievement: 'Team Player Award',
    achievementDesc: 'Outstanding cross-department support during sprint release',
    reward: 'Smart Watch',
    rewardValue: 12999,
    pointsWon: 850,
    recognizedBy: { name: 'Amit Kumar', role: 'HR Manager', avatar: '/storage/avatars/amit.jpg' },
    date: '10 Apr 2024',
    comment: 'Exceptional teamwork and willingness to step up when needed!',
  },
  {
    id: 'MY-REC-003',
    achievement: 'Star Performer Q1',
    achievementDesc: 'Highest productivity score in Q1 2024',
    reward: 'Cash Bonus',
    rewardValue: 15000,
    pointsWon: 1500,
    recognizedBy: { name: 'Neha Verma', role: 'HR Executive', avatar: '/storage/avatars/neha.jpg' },
    date: '15 Mar 2024',
    comment: 'Consistently exceeding expectations and delivering high quality code.',
  },
]

/* ─── Redeem Catalog Data ─── */
const giftCatalog = [
  { id: 'cat-1', name: 'Amazon Gift Card', points: 1000, value: '₹1,000', icon: '🛒', bg: 'from-amber-500/10 to-orange-500/10 border-amber-200' },
  { id: 'cat-2', name: 'Flipkart Voucher', points: 1000, value: '₹1,000', icon: '🛍️', bg: 'from-blue-500/10 to-indigo-500/10 border-blue-200' },
  { id: 'cat-3', name: 'Starbucks Card', points: 500, value: '₹500', icon: '☕', bg: 'from-emerald-500/10 to-teal-500/10 border-emerald-200' },
  { id: 'cat-4', name: 'Swiggy Gourmet', points: 750, value: '₹750', icon: '🍔', bg: 'from-rose-500/10 to-pink-500/10 border-rose-200' },
  { id: 'cat-5', name: 'Apple Store Credit', points: 2500, value: '₹2,500', icon: '🍎', bg: 'from-slate-500/10 to-gray-500/10 border-slate-200' },
]

export default function EmployeeRewards() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('My Recognitions')
  const [pointsBalance, setPointsBalance] = useState(2450)
  const [isKudosModalOpen, setIsKudosModalOpen] = useState(false)
  const [selectedRec, setSelectedRec] = useState(null)

  const handleRedeem = (item) => {
    if (pointsBalance < item.points) {
      toast.error('Insufficient points balance!')
      return
    }
    setPointsBalance(prev => prev - item.points)
    toast.success(`Redeemed ${item.name} (${item.value}) successfully! Voucher sent to email.`)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5">
            <span className="hover:text-gray-800 cursor-pointer">Home</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="hover:text-gray-800 cursor-pointer">Rewards</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-800 font-semibold">My Rewards</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-950">My Rewards & Recognition</h1>
          <p className="mt-1 text-sm text-gray-500">Track your recognitions, redeem points for vouchers, and appreciate your peers.</p>
        </div>
        <button
          onClick={() => setIsKudosModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          <Heart className="h-4.5 w-4.5 text-rose-300" />
          Send Peer Kudos
        </button>
      </div>

      {/* ── 4 Employee KPI Summary Cards ── */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Reward Points Balance',
            value: `${pointsBalance.toLocaleString('en-IN')} Pts`,
            sub: 'Available to Redeem',
            icon: <Gift className="h-4.5 w-4.5 text-amber-600" />,
            iconBg: 'bg-amber-50 border-amber-100',
          },
          {
            label: 'Recognitions Received',
            value: '14 Badges',
            sub: 'Lifetime Awards',
            icon: <Trophy className="h-4.5 w-4.5 text-blue-600" />,
            iconBg: 'bg-blue-50 border-blue-100',
          },
          {
            label: 'Spot Rewards Won',
            value: '₹37,999',
            sub: 'Vouchers & Cash',
            icon: <Award className="h-4.5 w-4.5 text-emerald-600" />,
            iconBg: 'bg-emerald-50 border-emerald-100',
          },
          {
            label: 'Peer Kudos Given',
            value: '18 Sent',
            sub: 'Appreciations Sent',
            icon: <Heart className="h-4.5 w-4.5 text-rose-600" />,
            iconBg: 'bg-rose-50 border-rose-100',
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
              {['My Recognitions', 'Redeem Points Catalog', 'Company Wall'].map((tab) => (
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

          {/* Tab 1: My Recognitions */}
          {activeTab === 'My Recognitions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Recognitions Received ({myReceivedRecognitions.length})</h2>
              </div>

              <div className="space-y-3.5">
                {myReceivedRecognitions.map((rec) => (
                  <div
                    key={rec.id}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-3 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
                          <Trophy className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-gray-950">{rec.achievement}</h3>
                          <p className="text-xs text-gray-500">{rec.achievementDesc}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
                        +{rec.pointsWon} Pts
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">
                      "{rec.comment}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Avatar name={rec.recognizedBy.name} src={rec.recognizedBy.avatar} size="xs" />
                        <span>Awarded by <strong>{rec.recognizedBy.name}</strong> ({rec.recognizedBy.role})</span>
                      </div>
                      <span className="font-semibold text-gray-400">{rec.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Redeem Points Catalog */}
          {activeTab === 'Redeem Points Catalog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Gift Vouchers & Rewards Store</h2>
                  <p className="text-xs text-gray-500">Use your reward points to redeem instant digital vouchers.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                  Balance: {pointsBalance} Pts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {giftCatalog.map((item) => (
                  <div
                    key={item.id}
                    className={cx(
                      'rounded-xl border p-5 bg-gradient-to-br shadow-2xs space-y-3 flex flex-col justify-between hover:scale-[1.01] transition-all',
                      item.bg
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{item.icon}</span>
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-white text-gray-900 shadow-2xs">
                          {item.value}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-950">{item.name}</h3>
                      <p className="text-xs text-gray-600 font-medium mt-0.5">{item.points} Points required</p>
                    </div>

                    <button
                      onClick={() => handleRedeem(item)}
                      disabled={pointsBalance < item.points}
                      className={cx(
                        'w-full py-2 px-4 rounded-lg text-xs font-bold shadow-2xs transition-all',
                        pointsBalance >= item.points
                          ? 'bg-gray-950 text-white hover:bg-gray-800 active:scale-95'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      )}
                    >
                      {pointsBalance >= item.points ? 'Redeem Voucher' : 'Insufficient Points'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Company Wall */}
          {activeTab === 'Company Wall' && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-gray-900">Company Recognition Feed</h2>
              <p className="text-xs text-gray-500">Cheer and celebrate accomplishments across all teams.</p>
              <div className="space-y-4 pt-2">
                {[
                  { name: 'Neha Verma', role: 'HR Executive', award: 'Exceptional Performance', by: 'Amit Kumar', date: '20 May 2024', comment: 'Excellent leadership and dedication to the HR initiatives. Keep up the great work!', likes: 24 },
                  { name: 'Rahul Sharma', role: 'Senior Developer', award: 'Innovation Award', by: 'Saurabh Singh', date: '18 May 2024', comment: 'Amazing innovation and problem-solving skills. You inspire the whole team!', likes: 18 },
                ].map((feed, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-900">{feed.by} → {feed.name}</span>
                      <span className="text-gray-400">{feed.date}</span>
                    </div>
                    <p className="text-xs text-gray-700 italic">"{feed.comment}"</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-bold text-blue-600">🏆 {feed.award}</span>
                      <button onClick={() => toast.success('Cheered!')} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-blue-600">
                        <ThumbsUp className="h-3.5 w-3.5 text-blue-600" /> {feed.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Card 1: Employee of the Month Spotlight */}
          <EmployeeOfTheMonthCard
            name="Rahul Sharma"
            role="Senior Developer"
            month="April 2024"
            onViewAll={() => toast.success('Viewing Employee of the Month winners history...')}
          />

          {/* Card 2: My Badges Collection */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-gray-900">My Unlocked Badges</h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                { label: 'Star Performer', icon: '⭐', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                { label: 'Innovator', icon: '🚀', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                { label: 'Team Player', icon: '🤝', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                { label: 'Problem Solver', icon: '🧩', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                { label: 'Customer Champ', icon: '👑', color: 'bg-rose-50 text-rose-700 border-rose-200' },
                { label: 'High Flyer', icon: '🕊️', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
              ].map((b) => (
                <div key={b.label} className={cx('p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1', b.color)}>
                  <span className="text-lg">{b.icon}</span>
                  <span className="text-[10px] font-bold leading-tight">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Quick Actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-gray-900 mb-2">Quick Actions</h3>
            <button
              onClick={() => setIsKudosModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all text-xs font-semibold text-gray-800 shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="h-4 w-4 text-rose-500" />
                <span>Send Peer Kudos</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>

            <button
              onClick={() => setActiveTab('Redeem Points Catalog')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all text-xs font-semibold text-gray-800 shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4 text-amber-500" />
                <span>Redeem Gift Vouchers</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </div>

        </div>

      </div>

      {/* Peer Kudos Modal */}
      <AnimatePresence>
        {isKudosModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsKudosModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50/70">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  <h2 className="text-base font-bold text-gray-950">Send Peer Appreciation / Kudos</h2>
                </div>
                <button onClick={() => setIsKudosModalOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200/60 hover:text-gray-700 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  toast.success('Peer Kudos sent successfully!')
                  setIsKudosModalOpen(false)
                }}
                className="space-y-4 p-6"
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Select Colleague <span className="text-rose-500">*</span></label>
                  <select required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none">
                    <option value="">Select Peer</option>
                    <option value="Neha Verma">Neha Verma (HR Executive)</option>
                    <option value="Priya Patel">Priya Patel (Sales Executive)</option>
                    <option value="Arjun Singh">Arjun Singh (Product Designer)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Appreciation Badge</label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none">
                    <option>🌟 Star Performer</option>
                    <option>🤝 Team Player</option>
                    <option>🚀 Innovation Champion</option>
                    <option>💡 Problem Solver</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Appreciation Message</label>
                  <textarea rows={3} placeholder="Write why you are appreciating them..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none resize-none" />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button type="button" onClick={() => setIsKudosModalOpen(false)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm">
                    Send Kudos
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
