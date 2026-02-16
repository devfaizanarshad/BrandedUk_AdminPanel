import { useState, useEffect } from 'react'
import Card from '../components/Card'
import { Search, Star, Eye, Check, X, Sparkles, TrendingUp, RefreshCw, Layers, Zap, ExternalLink } from 'lucide-react'

const API_BASE = 'https://api.brandeduk.com'

const FeaturedProducts = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterType, setFilterType] = useState('all') // 'all' | 'best' | 'recommended'
    const [searchTerm, setSearchTerm] = useState('')
    // Product types state (from summary)
    const [productTypes, setProductTypes] = useState([])
    const [selectedType, setSelectedType] = useState(null)

    useEffect(() => {
        fetchFeatured()
    }, [filterType, selectedType])

    const fetchFeatured = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (filterType !== 'all') {
                params.append('type', filterType)
            }
            if (selectedType) {
                params.append('product_type_id', selectedType.id)
            }

            const response = await fetch(`${API_BASE}/api/admin/products/featured?${params}`)
            if (!response.ok) throw new Error('Failed to fetch featured products')
            const data = await response.json()

            setProducts(data.items || [])

            // Extract summary with live counts
            if (data.by_product_type) {
                setProductTypes(data.by_product_type)
                // Auto-select first category if none selected
                if (data.by_product_type.length > 0 && !selectedType) {
                    setSelectedType(data.by_product_type[0])
                }
            }
        } catch (err) {
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    const toggleFeatured = async (product, isBestSeller, isRecommended) => {
        try {
            const response = await fetch(`${API_BASE}/api/admin/products/bulk-featured`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    style_codes: [product.style_code],
                    is_best_seller: isBestSeller,
                    is_recommended: isRecommended
                })
            })

            if (!response.ok) throw new Error('Failed to update product')
            await fetchFeatured()
        } catch (err) {
            alert('Error: ' + err.message)
        }
    }

    const filteredList = products.filter(p =>
        p.style_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.style_name || p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Layers className="w-6 h-6 text-primary" />
                        Featured Catalog
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage Best Sellers and Recommended products.</p>
                </div>
            </div>



            <div className="flex gap-8">
                {/* Custom Sidebar for Product Types */}
                <aside className="w-64 flex-shrink-0 hidden lg:block bg-white/50 p-4 rounded-3xl border-2 border-slate-100/50">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Categories</h3>
                        <Layers className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="space-y-1.5 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                        {productTypes.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-[13px] transition-all duration-300 ${selectedType?.id === type.id
                                    ? 'bg-primary text-white font-bold shadow-md shadow-primary/20'
                                    : 'text-slate-500 hover:bg-white hover:text-slate-900 font-bold hover:shadow-md hover:shadow-slate-200/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="truncate">{type.name}</span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-lg ${selectedType?.id === type.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {type.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 space-y-6">
                    {/* Controls Bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        <div className="relative flex-1 w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter results..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 h-10 bg-transparent text-sm font-medium focus:outline-none text-slate-700 placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg h-10 w-full md:w-auto">
                            {[
                                { id: 'all', label: 'All', icon: Layers },
                                { id: 'best', label: 'Best Sellers', icon: Star },
                                { id: 'recommended', label: 'Recommended', icon: Sparkles }
                            ].map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setFilterType(type.id)}
                                    className={`flex-1 md:flex-none px-4 flex items-center justify-center gap-2 h-full rounded-md transition-all ${filterType === type.id
                                        ? 'bg-white text-slate-900 shadow-sm text-xs font-bold'
                                        : 'text-slate-500 hover:text-slate-700 text-xs font-medium hover:bg-slate-200/50'
                                        }`}
                                >
                                    <type.icon className={`w-3.5 h-3.5 ${filterType === type.id ? 'text-primary' : 'text-slate-400'}`} />
                                    <span className="truncate">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table View */}
                    <Card className="p-0 overflow-hidden shadow-sm border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="py-3 px-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider w-16">Image</th>
                                        <th className="py-3 px-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Code</th>
                                        <th className="py-3 px-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Product Name</th>
                                        <th className="py-3 px-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Brand</th>
                                        <th className="py-3 px-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="py-3 px-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Price</th>
                                        <th className="py-3 px-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="py-20 text-center">
                                                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-slate-300 mb-2" />
                                                <p className="text-slate-400 text-sm font-medium">Loading featured products...</p>
                                            </td>
                                        </tr>
                                    ) : filteredList.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-20 text-center">
                                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Layers className="w-6 h-6 text-slate-300" />
                                                </div>
                                                <p className="text-slate-900 font-bold">No products found</p>
                                                <p className="text-slate-500 text-sm mt-1">Try changing your filters or category.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredList.map((product) => (
                                            <tr key={product.style_code} className="border-b border-gray-50 last:border-none hover:bg-slate-50/50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="w-10 h-10 rounded-lg border border-gray-100 bg-white p-0.5 overflow-hidden">
                                                        <img
                                                            src={product.image}
                                                            alt={product.style_name || product.name}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => { e.target.src = 'https://placehold.co/400x500/f8fafc/94a3b8?text=No+Image' }}
                                                        />
                                                    </div>
                                                </td>

                                                <td className="py-3 px-4">
                                                    <span className="text-xs font-bold text-slate-700">{product.style_code}</span>
                                                </td>

                                                <td className="py-3 px-4">
                                                    <span className="text-sm font-medium text-slate-900 line-clamp-1">{product.style_name || product.name || 'Untitled'}</span>
                                                    <span className="text-[10px] text-slate-400">{product.product_type_name || product.product_type || 'Unknown Type'}</span>
                                                </td>

                                                <td className="py-3 px-4">
                                                    <span className="text-xs text-slate-600">{product.brand_name || product.brand || 'No Brand'}</span>
                                                </td>

                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => toggleFeatured(product, !product.is_best_seller, product.is_recommended)}
                                                            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${product.is_best_seller
                                                                ? 'bg-amber-400 border-amber-400 text-white shadow-sm'
                                                                : 'bg-white border-slate-200 text-slate-400 hover:border-amber-400 hover:text-amber-500'
                                                                }`}
                                                        >
                                                            <Star className="w-3 h-3 fill-current" />
                                                            Best Seller
                                                        </button>
                                                        <button
                                                            onClick={() => toggleFeatured(product, product.is_best_seller, !product.is_recommended)}
                                                            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${product.is_recommended
                                                                ? 'bg-indigo-500 border-indigo-500 text-white shadow-sm'
                                                                : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-500 hover:text-indigo-500'
                                                                }`}
                                                        >
                                                            <Sparkles className="w-3 h-3 fill-current" />
                                                            Recommended
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="py-3 px-4 text-right">
                                                    <span className="text-sm font-bold text-slate-900">£{Number(product.price || 0).toFixed(2)}</span>
                                                </td>

                                                <td className="py-3 px-4 text-right">
                                                    <a
                                                        href={`/products/${product.style_code}`}
                                                        className="inline-flex p-2 text-slate-400 hover:text-primary transition-colors hover:bg-slate-100 rounded-full"
                                                        title="View Details"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default FeaturedProducts
