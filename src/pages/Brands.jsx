import { useState, useEffect } from 'react'
import Card from '../components/Card'
import { Search, Edit3, Check, X, ToggleLeft, ToggleRight, Building2, Upload, AlertCircle, Image as ImageIcon } from 'lucide-react'

const API_BASE = 'https://api.brandeduk.com'

const Brands = () => {
    const [brands, setBrands] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchBrands()
    }, [])

    const fetchBrands = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_BASE}/api/admin/brands`)
            if (!response.ok) throw new Error('Failed to fetch brands')
            const data = await response.json()

            // Check for data.items as per your response, fall back to .brands
            const raw = data.items || data.brands || []

            const brandsList = raw.map(b => ({
                id: b.id,
                name: b.name,
                logo: b.logo || null,
                productCount: parseInt(b.product_count || 0),
                active: b.is_active
            }))
            // Sort by name A-Z by default 
            brandsList.sort((a, b) => a.name.localeCompare(b.name))

            setBrands(brandsList)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleActive = async (brand) => {
        // Optimistic update
        const originalBrands = [...brands]
        setBrands(prev => prev.map(b =>
            b.id === brand.id ? { ...b, active: !b.active } : b
        ))

        try {
            const response = await fetch(`${API_BASE}/api/admin/brands/${brand.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_active: !brand.active }),
            })

            if (!response.ok) {
                throw new Error('Failed to update brand status')
            }
        } catch (err) {
            // Revert on error
            setBrands(originalBrands)
            alert('Failed to update brand status: ' + err.message)
        }
    }

    const startEditing = (brand) => {
        setEditingId(brand.id)
        setEditName(brand.name)
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditName('')
    }

    const saveEdit = async (brand) => {
        if (!editName.trim()) return

        setSaving(true)
        setBrands(prev => prev.map(b =>
            b.id === brand.id ? { ...b, name: editName } : b
        ))
        // TODO: Call API when available

        setEditingId(null)
        setEditName('')
        setSaving(false)
    }

    const handleImageUpload = (brandId) => {
        // TODO: Implement image upload
        alert('Image upload will be available when the API is ready')
    }

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const stats = {
        total: brands.length,
        active: brands.filter(b => b.active).length,
        withLogos: brands.filter(b => b.logo).length
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-gray-500">Loading brands...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <div className="text-red-500 font-medium">Error: {error}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
                <p className="text-gray-500 mt-2">Manage brand profiles, logos, and visibility</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 border-none shadow-sm bg-gradient-to-br from-blue-50/50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-500">Total Brands</div>
                            <div className="text-2xl font-black text-gray-900">{stats.total}</div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-none shadow-sm bg-gradient-to-br from-green-50/50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <ToggleRight className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-500">Active Brands</div>
                            <div className="text-2xl font-black text-gray-900">{stats.active}</div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-none shadow-sm bg-gradient-to-br from-purple-50/50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-500">With Logos</div>
                            <div className="text-2xl font-black text-gray-900">{stats.withLogos}</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search brands..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBrands.map((brand) => (
                    <Card key={brand.id} className={`p-6 transition-all ${!brand.active ? 'opacity-60' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                            {/* Logo */}
                            <div className="relative group">
                                <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {brand.logo ? (
                                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <Building2 className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <button
                                    onClick={() => handleImageUpload(brand.id)}
                                    className="absolute inset-0 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                    <Upload className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* Status Toggle */}
                            <button
                                onClick={() => handleToggleActive(brand)}
                                className={`p-2 rounded transition-colors
                  ${brand.active
                                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                    }`}
                            >
                                {brand.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Name */}
                        <div className="mb-4">
                            {editingId === brand.id ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="flex-1 px-3 py-2 border-2 border-primary rounded-lg focus:outline-none text-lg font-semibold"
                                        autoFocus
                                    />
                                    <button
                                        onClick={cancelEditing}
                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => saveEdit(brand)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
                                    <button
                                        onClick={() => startEditing(brand)}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Product Count */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Products</span>
                            <span className="font-medium text-gray-900">{brand.productCount || 0}</span>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredBrands.length === 0 && (
                <Card className="p-12 text-center">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <div className="text-gray-500">No brands found</div>
                </Card>
            )}
        </div>
    )
}

export default Brands
