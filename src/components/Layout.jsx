import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Package,
  Percent,
  Tags,
  Building2,
  Sparkles,
  Settings,
  ShoppingCart,
  RefreshCw,
  Palette,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  LayoutDashboard,
  Home,
  Layers,
  Search,
  MessageSquare,
  HelpCircle,
  Bell,
  ExternalLink,
  Store,
  ShieldCheck,
  LogOut,
  X
} from 'lucide-react'
import { useState } from 'react'

const Layout = ({ children, onLogout }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState(null)
  const [showSyncModal, setShowSyncModal] = useState(false)

  // State for collapsible sub-menus
  const [expandedMenus, setExpandedMenus] = useState(['Products'])

  const toggleMenu = (name) => {
    setExpandedMenus(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const handleSyncPrices = async () => {
    setShowSyncModal(false)
    if (syncing) return

    try {
      setSyncing(true)
      setSyncStatus({
        type: 'processing',
        message: 'Starting the background update process...'
      })

      const response = await fetch('https://api.brandeduk.com/api/admin/pricing/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wait: false }) // Background Mode
      })

      if (!response.ok) throw new Error('Failed to trigger sync')

      setSyncStatus({
        type: 'success',
        message: 'Sync process has successfully started in the background. The storefront will update automatically in about 5 minutes.'
      })
    } catch (err) {
      console.error('Sync Error:', err)
      setSyncStatus({
        type: 'error',
        message: 'Failed to start sync. Please check your connection and try again.'
      })
      setTimeout(() => setSyncStatus(null), 10000)
    } finally {
      setSyncing(false)
    }
  }

  const sections = [
    {
      title: 'Navigation',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Products',
      items: [
        {
          name: 'Products',
          path: '/products',
          icon: Package,
          subItems: [
            { name: 'All Products', path: '/products' },
            { name: 'Markup-override', path: '/markup-overrides' },
            { name: 'Price break override', path: '/price-overrides' },
            { name: 'Product Type', path: '/product-types' },
            { name: 'Featured', path: '/featured' },
          ]
        }
      ]
    },
    {
      title: 'Pricing & Tiers',
      items: [
        { name: 'Markup Tiers', path: '/markup-tiers', icon: Sparkles },
        { name: 'Price Breaks', path: '/discount-tiers', icon: ShieldCheck },
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'Orders', path: '/orders', icon: ShoppingCart },
        { name: 'Brands', path: '/brands', icon: Building2 },
        { name: 'Customization', path: '/customization', icon: Palette },
        { name: 'System', path: '/system', icon: Settings },
      ]
    }
  ]

  const isActive = (path) => {
    if (!path) return false
    if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/products/')
    if (path.includes('ignore')) return false
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* Sidebar - Premium Black with Purple Accents */}
      <aside className="w-[232px] bg-[#09090b] flex flex-col z-20 border-r border-white/5 relative overflow-hidden">
        {/* Subtle Branding Glow */}
        <div className="absolute top-0 left-0 w-full h-32 bg-primary/5 blur-[80px] -translate-y-16 -translate-x-16 pointer-events-none" />

        {/* Logo Section - Sharp & Dark */}
        <div className="h-16 flex items-center px-6 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              <span className="text-white font-black text-base">B</span>
            </div>
            <div>
              <h1 className="text-[14px] font-bold text-white tracking-tight leading-none">BrandedUK</h1>
              <p className="text-[10px] text-primary/60 font-medium mt-1 uppercase tracking-wider">Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation - Calm & Structured */}
        <nav className="flex-1 overflow-y-auto px-2 py-10 space-y-10 thin-scrollbar relative z-10">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <div className="flex items-center gap-2 px-4 mb-3">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.08em]">
                  {section.title}
                </h3>
              </div>
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const hasSubItems = item.subItems && item.subItems.length > 0
                  const isExpanded = expandedMenus.includes(item.name)
                  const active = isActive(item.path) || (hasSubItems && item.subItems.some(sub => isActive(sub.path)))

                  const activeStyles = "bg-primary/[0.12] text-white border-l-[3px] border-primary shadow-[inset_10px_0_15px_-10px_rgba(124,58,237,0.2)]"
                  const inactiveStyles = "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100 border-l-[3px] border-transparent"

                  return (
                    <div key={item.name} className="flex flex-col">
                      {hasSubItems ? (
                        <div className="flex flex-col">
                          <div
                            className={`
                              group flex items-center justify-between px-4 py-2.5 text-[13px] font-semibold transition-all cursor-pointer
                              ${active ? activeStyles : inactiveStyles}
                            `}
                            onClick={() => toggleMenu(item.name)}
                          >
                            <Link
                              to={item.path}
                              className="flex items-center flex-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Icon className={`w-3.5 h-3.5 mr-3 flex-shrink-0 ${active ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'}`} />
                              <span className="tracking-tight">{item.name}</span>
                            </Link>
                            <div className="p-1 -mr-1 hover:bg-white/10 rounded-sm transition-colors" onClick={(e) => { e.stopPropagation(); toggleMenu(item.name); }}>
                              <ChevronDown className={`w-3 h-3 transition-transform duration-200 opacity-40 ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={item.path.includes('ignore') ? '#' : item.path}
                          className={`
                            group flex items-center justify-between px-4 py-2.5 text-[13px] font-semibold transition-all
                            ${active ? activeStyles : inactiveStyles}
                          `}
                        >
                          <div className="flex items-center">
                            <Icon className={`w-3.5 h-3.5 mr-3 flex-shrink-0 ${active ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            <span className="tracking-tight">{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${active ? 'bg-primary/20 text-primary font-bold' : 'bg-white/5 text-slate-500 font-medium'}`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )}

                      {/* Sub-items - Purple guide lines */}
                      {hasSubItems && isExpanded && (
                        <div className="mt-1 ml-[39px] border-l border-primary/20 space-y-1">
                          {item.subItems.map(sub => {
                            const subActive = isActive(sub.path)
                            return (
                              <Link
                                key={sub.name}
                                to={sub.path}
                                className={`
                                  flex items-center px-4 py-2 text-[12px] font-normal transition-all
                                  ${subActive
                                    ? 'text-primary font-medium'
                                    : 'text-slate-500 hover:text-slate-200'
                                  }
                                `}
                              >
                                {sub.name}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* System Controls - Premium High-Visibility Action */}
        <div className="px-3 pb-6 pt-6 border-t border-white/5 bg-white/[0.02]">
          <div className="space-y-3">
            <button
              onClick={() => setShowSyncModal(true)}
              disabled={syncing}
              className={`
                w-full group flex items-center justify-center gap-3 px-4 py-3 text-[13px] font-extrabold transition-all duration-300 rounded-lg border relative overflow-hidden shadow-[0_4px_20px_rgba(124,58,237,0.25)]
                ${syncing
                  ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-primary border-primary/30 text-white hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(124,58,237,0.4)] active:scale-[0.98]'
                }
              `}
            >
              {/* Permanent Premium Gradient Bottom Layer */}
              {!syncing && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#9333ea] z-0" />
              )}

              <div className="flex items-center gap-3 relative z-10">
                <Cloud className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${syncing ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                <span className="tracking-widest uppercase">{syncing ? 'SYNCING...' : 'PUSH LIVE'}</span>
              </div>
            </button>
          </div>
        </div>

      </aside >

      < div className="flex-1 flex flex-col overflow-hidden relative" >
        {/* Simple & User-Friendly Confirmation Modal */}
        {showSyncModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60" onClick={() => setShowSyncModal(false)} />
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Cloud className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sync Storefront?</h2>
                    <p className="text-sm text-slate-500">Publish changes to the live site</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-8">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    This update will refresh the database and clear the cache. The process runs in the background and takes approximately <span className="font-bold text-slate-900">5 minutes</span>.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSyncModal(false)}
                    className="flex-1 py-3 px-4 bg-white border border-gray-200 text-slate-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSyncPrices}
                    className="flex-[2] py-3 px-4 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                  >
                    Confirm & Publish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sync Status Toast - Bottom Center Floating (Solid Style) */}
        {syncStatus && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
            <div className={`
              min-w-[320px] p-4 bg-white rounded-xl border shadow-2xl flex items-center gap-4
              ${syncStatus.type === 'success' ? 'border-emerald-500/30' :
                syncStatus.type === 'error' ? 'border-red-500/30' :
                  'border-primary/20'}
            `}>
              <div className={`p-2 rounded-lg ${syncStatus.type === 'success' ? 'bg-emerald-50 text-emerald-600' : syncStatus.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-primary/5 text-primary'}`}>
                {syncStatus.type === 'processing' ? <Loader2 className="w-5 h-5 animate-spin" /> :
                  syncStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                    <AlertCircle className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-bold text-slate-900 uppercase tracking-wider leading-none">
                  {syncStatus.type === 'processing' ? 'Processing Sync' :
                    syncStatus.type === 'success' ? 'Sync Started' : 'Sync Alert'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">{syncStatus.message}</p>
              </div>
              <button
                onClick={() => setSyncStatus(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Top Header */}
        < header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10" >
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search products, orders..."
                className="w-full bg-gray-50 border border-gray-200 rounded py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-4">
            <div className="flex items-center gap-4 text-gray-400 pr-6 border-r border-gray-100">
              <button className="p-2 hover:text-primary transition-colors"><Bell className="w-5 h-5" /></button>
              <button className="p-2 hover:text-primary transition-colors"><MessageSquare className="w-5 h-5" /></button>
            </div>

            <div className="flex items-center gap-5">
              <a href="https://www.brandeduk.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] font-black text-slate-500 hover:text-primary transition-colors uppercase tracking-tight font-sans">
                <Store className="w-4 h-4" />
                <span>Storefront</span>
              </a>
              <div className="h-8 w-px bg-gray-100 mx-1"></div>

              <div className="flex items-center gap-4 relative group">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-900 leading-none">Admin</p>
                  <p className="text-[10px] text-gray-500 mt-1">Super User</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 p-0.5 border border-gray-200">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=7c3aed&color=fff" alt="User" className="w-full h-full rounded-md" />
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to log out?')) {
                        onLogout()
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg border border-transparent hover:border-red-100"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header >

        {/* Content Area */}
        < main className="flex-1 overflow-auto p-10 relative" >
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main >
      </div >
    </div >
  )
}

export default Layout
