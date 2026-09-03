import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Clock3, Users } from 'lucide-react'

const highlights = [
  { icon: Clock3, title: 'Attendance, settled daily', copy: 'Punches, short leave and WFH in one register.' },
  { icon: Users, title: 'Every record in one place', copy: 'Profiles, assets and payroll without the spreadsheets.' },
  { icon: ShieldCheck, title: 'Approvals you can trust', copy: 'Clear trails for every leave and reimbursement.' },
]

/** Fields are glass here rather than the app's usual white — the video reads through them. */
const glassInput =
  'w-full rounded-lg border border-white/20 bg-white/[0.08] py-2.5 pl-11 text-sm text-white ' +
  'placeholder:text-white/40 backdrop-blur-sm transition-all ' +
  'focus:border-brass-300/60 focus:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-brass-400/40'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Honour reduced-motion: hold the poster frame instead of looping footage.
  const [playVideo] = useState(
    () => typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(email, password)

      // Redirect based on user role
      const userRole = response.user?.role
      if (userRole === 'admin' || userRole === 'hr') {
        navigate('/dashboard')
      } else {
        navigate('/my-attendance')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-primary-950">
      {/* ---------------- Background film ---------------- */}
      {playVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/hrms/login-video.mp4"
          poster="/hrms/login-poster.jpg"
          style={{ filter: 'brightness(1.24) contrast(1.04) saturate(1.06)' }}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        />
      ) : (
        <img
          src="/hrms/login-poster.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: 'brightness(1.24) contrast(1.04) saturate(1.06)' }}
        />
      )}

      {/* Ink wash — only as heavy as the headline needs; the film stays legible elsewhere */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(8,16,28,0.86) 0%, rgba(9,18,31,0.62) 32%, rgba(11,21,36,0.26) 58%, rgba(10,20,34,0.14) 100%)',
        }}
      />
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to top, rgba(8,16,28,0.58) 0%, rgba(8,16,28,0.04) 48%, rgba(8,16,28,0.24) 100%)',
        }}
      />
      <span className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
      <span className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-brass-400/10 blur-3xl" />

      {/* ---------------- Content ---------------- */}
      <div className="relative grid min-h-screen lg:grid-cols-[70%_30%]">
        {/* Brand column */}
        <aside className="hidden flex-col justify-between p-12 lg:flex">
          <div>
            <span className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 shadow-lg">
              <img src="/hrms/logo.png" alt="TM-Manavsetu" className="h-9 w-auto object-contain" />
            </span>
          </div>

          {/* The footage swings from dark desks to bright screens — the copy carries
              its own shadow so it stays readable on every frame. */}
          <div className="max-w-lg" style={{ textShadow: '0 1px 12px rgba(8,16,28,0.72)' }}>
            <p className="eyebrow text-brass-300/90">TM-Manavsetu</p>
            <h1 className="mt-4 font-display text-[42px] font-semibold leading-[1.1] text-white drop-shadow-[0_2px_12px_rgba(8,16,28,0.6)]">
              Centralizing People,
              <span className="block text-brass-300">Powering Performance.</span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-primary-100/80">
              The human resource suite for the TruckMitr team — attendance, leave, payroll and assets,
              kept in one calm place.
            </p>

            <div className="mt-10 space-y-5">
              {highlights.map((item) => (
                <div key={item.title} className="flex items-start gap-3.5">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brass-300 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
                    <item.icon className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-primary-100/60">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] uppercase tracking-eyebrow text-primary-100/35">
            © {new Date().getFullYear()} TruckMitr · Human Resource Suite
          </p>
        </aside>

        {/* Form column — a full-height frosted panel, not a floating card */}
        <main
          className="relative flex flex-col justify-center border-white/10 px-6 py-12 backdrop-blur-3xl sm:px-9 lg:border-l"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(10,19,32,0.32) 0%, rgba(8,16,28,0.42) 55%, rgba(9,18,31,0.48) 100%)',
            boxShadow: '-32px 0 64px -32px rgba(4, 9, 18, 0.6)',
          }}
        >
          {/* Brass filament down the panel's leading edge */}
          <span className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-brass-400/40 to-transparent lg:block" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-[340px]"
          >
            {/* Compact brand lockup for small screens */}
            <div className="mb-8 flex justify-center lg:hidden">
              <span className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 shadow-lg">
                <img src="/hrms/logo.png" alt="TM-Manavsetu" className="h-8 w-auto object-contain" />
              </span>
            </div>

            <div>
              <div className="mb-8">
                <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-brass-300/80">Sign in</p>
                <h2 className="mt-2 font-display text-[28px] font-semibold leading-tight text-white">Welcome back</h2>
                <p className="mt-2 text-sm text-primary-100/65">Use your work email to access the HR suite.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-red-300/30 bg-red-500/15 px-3.5 py-3 text-sm text-red-100 backdrop-blur-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-primary-100/85">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/45" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={glassInput}
                      placeholder="you@truckmitr.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-primary-100/85">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-brass-300 transition-colors hover:text-brass-200"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/45" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${glassInput} pr-11`}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-white/45 transition-colors hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-brass-300 to-brass-500 py-3 text-sm font-semibold text-primary-950 shadow-lg transition-all hover:from-brass-200 hover:to-brass-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-950/30 border-t-primary-950" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/15" />
                <span className="text-[10px] uppercase tracking-eyebrow text-white/40">Secure access</span>
                <span className="h-px flex-1 bg-white/15" />
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-primary-100/55">
                Trouble signing in? Reach out to the HR desk and we will get you back in.
              </p>
            </div>

            {/* The brand column already carries this on desktop */}
            <p className="mt-10 text-center text-[10px] uppercase tracking-eyebrow text-white/30 lg:hidden">
              © {new Date().getFullYear()} TruckMitr · Human Resource Suite
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Login
