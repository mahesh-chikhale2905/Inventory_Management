import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Package,
  Tags,
  AlertTriangle,
  TrendingUp,
  Plus,
  Search,
  Box,
  Layers,
  Trash2,
  RefreshCw,
  X,
  BarChart2,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  ShoppingCart,
  Monitor,
  Speaker,
  Coffee,
  ShoppingBag,
  Shirt,
  Apple,
  FileText,
  PenTool,
  MousePointer2,
  Camera,
  Armchair,
  Lock,
  User,
  LogIn,
  LogOut
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import api, { getDashboardStats } from './api';

const ProductVisual = ({ name, categoryName, size = 48 }) => {
  const n = name?.toLowerCase() || "";
  const fontSize = size * 0.45;

  const getIconClass = () => {
    // Electronics
    if (n.includes('phone') || n.includes('iphone') || n.includes('pixel')) return 'fa-solid fa-mobile-screen-button';
    if (n.includes('laptop') || n.includes('macbook')) return 'fa-solid fa-laptop';
    if (n.includes('monitor') || n.includes('screen')) return 'fa-solid fa-desktop';
    if (n.includes('watch')) return 'fa-solid fa-clock';
    if (n.includes('headphone') || n.includes('airpods') || n.includes('earbuds')) return 'fa-solid fa-headphones';
    if (n.includes('speaker') || n.includes('audio')) return 'fa-solid fa-volume-high';
    if (n.includes('mouse')) return 'fa-solid fa-mouse';
    if (n.includes('camera')) return 'fa-solid fa-camera';

    // Fashion
    if (n.includes('shirt') || n.includes('t-shirt') || n.includes('hoodie')) return 'fa-solid fa-shirt';
    if (n.includes('bag') || n.includes('backpack') || n.includes('handbag')) return 'fa-solid fa-shopping-bag';

    // Stationery
    if (n.includes('pen') || n.includes('pencil') || n.includes('marker')) return 'fa-solid fa-pen';
    if (n.includes('notebook') || n.includes('paper') || n.includes('sticky') || n.includes('journal')) return 'fa-solid fa-book';

    // Groceries
    if (n.includes('milk') || n.includes('coffee') || n.includes('tea') || n.includes('beverage')) return 'fa-solid fa-mug-hot';
    if (n.includes('apple') || n.includes('fruit') || n.includes('banana') || n.includes('orange')) return 'fa-solid fa-apple-whole';

    // Furniture
    if (n.includes('chair') || n.includes('sofa') || n.includes('couch')) return 'fa-solid fa-chair';

    // Category fallbacks
    if (categoryName?.toLowerCase().includes('electronics')) return 'fa-solid fa-microchip';
    if (categoryName?.toLowerCase().includes('fashion')) return 'fa-solid fa-vest';
    if (categoryName?.toLowerCase().includes('furniture')) return 'fa-solid fa-couch';
    if (categoryName?.toLowerCase().includes('grocery')) return 'fa-solid fa-basket-shopping';
    if (categoryName?.toLowerCase().includes('stationery')) return 'fa-solid fa-pen-nib';

    return 'fa-solid fa-box-open';
  };

  const getColors = () => {
    if (n.includes('phone') || n.includes('laptop')) return { bg: '#e0e7ff', icon: '#4338ca' }; // Indigo
    if (n.includes('shirt') || n.includes('bag')) return { bg: '#fef3c7', icon: '#b45309' }; // Amber
    if (n.includes('milk') || n.includes('apple')) return { bg: '#dcfce7', icon: '#15803d' }; // Green
    if (n.includes('pen') || n.includes('notebook')) return { bg: '#fae8ff', icon: '#a21caf' }; // Fuchsia
    if (n.includes('chair')) return { bg: '#ffedd5', icon: '#c2410c' }; // Orange
    return { bg: '#f1f5f9', icon: '#475569' }; // Slate (default)
  };

  const colors = getColors();

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: size * 0.25,
      background: colors.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.icon,
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      flexShrink: 0
    }}>
      <i className={getIconClass()} style={{ fontSize: fontSize }}></i>
    </div>
  );
};

function App() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'add-product', 'products', 'categories'
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    categoryId: '',
    unitsSold: 0
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategoryId, setFilterCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  // Reusable Advanced Back Button
  const renderBackButton = (targetView, label = "Return", customAction = null) => (
    <div
      className="back-btn-container"
      onClick={() => {
        if (customAction) customAction();
        setCurrentView(targetView);
      }}
      title={`Back to ${targetView}`}
    >
      <div className="back-btn-icon">
        <ArrowLeft size={16} />
      </div>
      <span className="back-btn-text">{label}</span>
    </div>
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    // Pre-select category if we're adding a product from a filtered view
    if (currentView === 'add-product' && filterCategoryId && !newProduct.categoryId) {
      setNewProduct(prev => ({ ...prev, categoryId: filterCategoryId }));
    }
  }, [currentView, filterCategoryId, newProduct.categoryId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchInitialData();
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await api.post('/auth/login', loginData);
      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        fetchInitialData();
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setLoginData({ username: '', password: '' });
    setLoginError('');
    setCurrentView('dashboard');
  };

  // For horizontal scroll dragging
  const categoryScrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - categoryScrollRef.current.offsetLeft);
    setScrollLeft(categoryScrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - categoryScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    categoryScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const fetchInitialData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchCategories(),
      fetchAllProducts()
    ]);
    setLoading(false);
  };

  const fetchAllProducts = async () => {
    try {
      const response = await api.get('/products');
      // Sort by ID DESC to show newest first
      const sortedProducts = response.data.sort((a, b) => b.id - a.id);
      setAllProducts(sortedProducts);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      // Sort by ID DESC to show newest first
      const sortedCategories = response.data.sort((a, b) => b.id - a.id);
      setCategories(sortedCategories);
      if (sortedCategories.length > 0 && !newProduct.categoryId) {
        setNewProduct(prev => ({ ...prev, categoryId: sortedCategories[0].id }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        await Promise.all([fetchStats(), fetchAllProducts()]);
        showToast("Product deleted successfully");
      } catch (error) {
        showToast("Error deleting product", "error");
      }
    }
  };

  const handleUpdateStock = async (id, currentProduct, newStock) => {
    try {
      await api.put(`/products/${id}/stock`, {
        ...currentProduct,
        stockQuantity: parseInt(newStock)
      });
      await Promise.all([fetchStats(), fetchAllProducts()]);
      showToast(`Stock updated to ${newStock}`);
    } catch (error) {
      showToast("Error updating stock", "error");
    }
  };

  const handleSell = async (id, quantity = 1) => {
    try {
      await api.post(`/products/${id}/sell?quantity=${quantity}`);
      await Promise.all([fetchStats(), fetchAllProducts()]);
      showToast(`Recorded sale of ${quantity} unit(s)`);
      // If we are in analysis view, refresh the selected product
      if (selectedProduct && selectedProduct.id === id) {
        const updated = await api.get(`/products/${id}`);
        setSelectedProduct(updated.data);
      }
    } catch (error) {
      showToast(error.response?.data || "Error processing sale", "error");
    }
  };
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.categoryId) {
      alert("Please select a category");
      return;
    }
    try {
      await api.post('/products', newProduct);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        categoryId: filterCategoryId || (categories.length > 0 ? categories[0].id : ''),
        unitsSold: 0
      });
      await Promise.all([fetchStats(), fetchAllProducts()]);
      showToast(`${newProduct.name} added to inventory!`);
      setCurrentView('dashboard');
    } catch (error) {
      console.error("Add Product Error:", error.response?.data || error.message);
      showToast("Error adding product: " + (error.response?.data?.message || "Internal Server Error"), "error");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', newCategory);
      const categoryName = newCategory.name;
      setNewCategory({
        name: '',
        description: ''
      });
      await fetchCategories();
      showToast(`${categoryName} category created!`);
      setCurrentView('categories');
    } catch (error) {
      console.error("Add Category Error:", error.response?.data || error.message);
      showToast("Error adding category: " + (error.response?.data?.message || "Internal Server Error"), "error");
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"? This will also delete ALL products inside it.`)) {
      try {
        await api.delete(`/categories/${id}`);
        // Immediately fetch all data to reflect changes
        await Promise.all([fetchCategories(), fetchAllProducts(), fetchStats()]);
        showToast(`Category "${name}" deleted`);
      } catch (error) {
        console.error("Delete Category Error:", error);
        showToast("Error deleting category", "error");
        // Refresh anyway to Sync UI
        fetchCategories();
      }
    }
  };

  if (loading) return <div className="loading">Loading StockGenius...</div>;

  const renderProductTable = (products, title) => {
    const filteredDisplay = searchQuery
      ? products?.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : products;

    return (
      <div className="data-card">
        <div className="card-header">
          <h3>{title}</h3>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 16px 10px 42px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.05)',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)',
                width: '300px',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              className="search-inventory"
            />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDisplay?.length > 0 ? (
                filteredDisplay.map(product => (
                  <tr
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setCurrentView('product-analysis');
                    }}
                    style={{ cursor: 'pointer' }}
                    className="hover-row"
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <ProductVisual name={product.name} categoryName={product.categoryName} size={48} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{product.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>#{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{product.categoryName}</td>
                    <td>${product.price?.toFixed(2)}</td>
                    <td>
                      <div className="stock-controller" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="stock-adjust-btn down"
                          onClick={() => handleUpdateStock(product.id, product, Math.max(0, product.stockQuantity - 1))}
                        >
                          <ChevronDown size={14} />
                        </button>
                        <input
                          type="number"
                          className="stock-input"
                          value={product.stockQuantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) handleUpdateStock(product.id, product, val);
                          }}
                        />
                        <button
                          className="stock-adjust-btn up"
                          onClick={() => handleUpdateStock(product.id, product, product.stockQuantity + 1)}
                        >
                          <ChevronUp size={14} />
                        </button>
                      </div>
                    </td>
                    <td>
                      {product.stockQuantity === 0 ? (
                        <span className="badge badge-danger">Out of Stock</span>
                      ) : product.stockQuantity < 10 ? (
                        <span className="badge badge-warning">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">In Stock</span>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="actions-cell">
                        <button
                          className="action-btn"
                          onClick={() => handleSell(product.id)}
                          title="Sell 1 Unit"
                          style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
                        >
                          <ShoppingCart size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(product.id)}
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <div style={{ opacity: 0.3 }}>
                        <Package size={64} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                          {searchQuery ? "No matching products" : "Empty Inventory"}
                        </h4>
                        <p style={{ maxWidth: '300px', margin: '0 auto' }}>
                          {searchQuery
                            ? `Product "${searchQuery}" is not available in inventory.`
                            : "This list is currently empty."}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    const pieData = categories.map(cat => ({
      name: cat.name,
      value: allProducts.filter(p => p.categoryId === cat.id).length
    })).filter(item => item.value > 0).sort((a, b) => a.name.localeCompare(b.name));

    const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

    const categoryPerformanceData = categories.map(cat => ({
      name: cat.name,
      value: allProducts.filter(p => p.categoryId === cat.id).reduce((sum, p) => sum + (p.unitsSold || 0), 0)
    })).filter(item => item.value > 0).sort((a, b) => a.name.localeCompare(b.name));

    return (
      <div className="view-transition">
        <header className="header">
          <div className="header-info">
            <h1>Inventory Overview</h1>
            <p>Real-time metrics and recently added items.</p>
          </div>
        </header>

        <section className="stats-grid">
          <StatCard
            title="Total Products"
            value={stats?.totalProducts}
            icon={<Package size={24} color="#6366f1" />}
            bg="#eef2ff"
            onClick={() => setCurrentView('products')}
          />
          <StatCard
            title="Total Categories"
            value={stats?.totalCategories}
            icon={<Tags size={24} color="#10b981" />}
            bg="#ecfdf5"
            onClick={() => setCurrentView('categories')}
          />
          <StatCard
            title="Low Stock"
            value={stats?.lowStockItems}
            icon={<AlertTriangle size={24} color="#f59e0b" />}
            bg="#fffbeb"
            onClick={() => setCurrentView('low-stock')}
          />
          <StatCard
            title="Inventory Value"
            value={`$${stats?.totalInventoryValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<TrendingUp size={24} color="#3b82f6" />}
            bg="#eff6ff"
            onClick={() => setCurrentView('products')}
          />
        </section>

        <div className="dashboard-grid">
          <div className="data-card">
            <div className="card-header">
              <h3>Weekly Sales Overview</h3>
            </div>
            <div style={{ height: 350, padding: '0 32px 32px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={categoryPerformanceData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="data-card">
            <div className="card-header">
              <h3>Category Distribution</h3>
            </div>
            <div style={{ height: 350, padding: '0 32px 32px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => {
                      const total = pieData.reduce((sum, entry) => sum + entry.value, 0);
                      const percent = ((value / total) * 100).toFixed(1);
                      return [`${value} items (${percent}%)`, 'Quantity'];
                    }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="data-card" style={{ overflow: 'visible' }}>
          <div className="card-header">
            <div>
              <h3>Available Categories</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Browse groups and manage classifications.</p>
            </div>
          </div>
          <div
            ref={categoryScrollRef}
            className="category-scroll custom-scrollbar no-select"
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
              scrollBehavior: isDragging ? 'auto' : 'smooth'
            }}
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                className="category-card"
                onClick={() => {
                  setFilterCategoryId(cat.id);
                  setCurrentView('products');
                }}
              >
                <div className="stat-icon">
                  <Layers size={24} color="#fff" />
                </div>
                <div>
                  <h4>{cat.name}</h4>
                  <div className="badge badge-success" style={{ fontSize: '10px', padding: '6px 12px', borderRadius: '20px', marginTop: '8px' }}>
                    {allProducts.filter(p => p.categoryId === cat.id).length} Products
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="view-transition">
          {renderProductTable(stats?.recentProducts, "Recently Added Products")}
        </div>
      </div>
    );
  };


  const renderProducts = () => {
    const filteredProducts = filterCategoryId
      ? allProducts.filter(p => p.categoryId === filterCategoryId)
      : allProducts;

    const filterCategoryName = filterCategoryId
      ? categories.find(c => c.id === filterCategoryId)?.name
      : null;

    return (
      <div className="view-transition">
        <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {renderBackButton('dashboard', 'Dashboard', () => setFilterCategoryId(null))}
            <div className="header-info">
              <h1>{filterCategoryName ? `${filterCategoryName} Products` : "Product Catalog"}</h1>
              <p>{filterCategoryName ? `Showing items in ${filterCategoryName} group.` : "Detailed view of all inventory items."}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {filterCategoryId && (
              <button
                className="btn-primary"
                style={{ background: 'var(--secondary-gradient)' }}
                onClick={() => setFilterCategoryId(null)}
              >
                Clear Filter
              </button>
            )}
            <button className="btn-primary" onClick={() => setCurrentView('add-product')}>
              <Plus size={18} /> New Product
            </button>
          </div>
        </header>
        <div className="stats-grid" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <StatCard
            title="Items in View"
            value={filteredProducts.length}
            icon={<Package size={20} color="#6366f1" />}
            bg="#eef2ff"
          />
          <StatCard
            title="Total Stock"
            value={filteredProducts.reduce((sum, p) => sum + p.stockQuantity, 0)}
            icon={<Box size={20} color="#10b981" />}
            bg="#ecfdf5"
          />
          <StatCard
            title="Inventory Value"
            value={`$${filteredProducts.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<TrendingUp size={20} color="#3b82f6" />}
            bg="#eff6ff"
          />
        </div>
        {renderProductTable(filteredProducts, filterCategoryName ? `Products: ${filterCategoryName}` : "All Products")}
      </div>
    );
  };

  const renderLowStock = () => {
    const lowStockProducts = allProducts.filter(p => p.stockQuantity < 10);
    return (
      <div className="view-transition">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {renderBackButton('dashboard')}
            <div className="header-info">
              <h1>Low Stock Alerts</h1>
              <p>Products that require immediate replenishment.</p>
            </div>
          </div>
        </header>
        {renderProductTable(lowStockProducts, `Low Stock Items (${lowStockProducts.length})`)}
      </div>
    );
  };

  const renderCategories = () => {
    // Calculate statistics for each category
    const categoryStats = categories.map(cat => {
      const categoryProducts = allProducts.filter(p => p.categoryId === cat.id);
      const productCount = categoryProducts.length;
      const totalValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);
      const totalSales = categoryProducts.reduce((sum, p) => sum + (p.unitsSold || 0), 0);
      const lowStockCount = categoryProducts.filter(p => p.stockQuantity < 10).length;

      return {
        ...cat,
        productCount,
        totalValue,
        totalSales,
        lowStockCount
      };
    });

    const CATEGORY_COLORS = {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: '#667eea',
      text: '#4f46e5'
    };

    return (
      <div className="view-transition">
        <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {renderBackButton('dashboard')}
            <div className="header-info">
              <h1>Product Categories</h1>
              <p>Organize and manage your inventory by category groups.</p>
            </div>
          </div>
          <button className="btn-primary" onClick={() => setCurrentView('add-category')}>
            <Plus size={18} /> New Category
          </button>
        </header>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
          {categoryStats.map((cat, index) => {
            return (
              <div
                key={cat.id}
                className="data-card"
                style={{
                  padding: '32px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => {
                  setFilterCategoryId(cat.id);
                  setCurrentView('products');
                }}
              >
                {/* Header with icon and badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div
                    className="stat-icon"
                    style={{
                      background: CATEGORY_COLORS.gradient,
                      width: '64px',
                      height: '64px',
                      borderRadius: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 8px 24px rgba(102, 126, 234, 0.4)`
                    }}
                  >
                    <Tags size={28} color="#ffffff" />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      className="action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(cat.id, cat.name);
                      }}
                      title="Delete Category"
                      style={{ padding: '4px', height: '32px', width: '32px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <span className="badge badge-success" style={{ fontSize: '10px' }}>ID: {cat.id}</span>
                  </div>
                </div>

                {/* Category name and description */}
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    color: CATEGORY_COLORS.text,
                    marginBottom: '8px'
                  }}>
                    {cat.name}
                  </h2>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}>
                    {cat.description || "No description provided."}
                  </p>
                </div>

                {/* Statistics grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Products
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)' }}>
                      {cat.productCount}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Total Value
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)' }}>
                      ${cat.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Units Sold
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)' }}>
                      {cat.totalSales.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Low Stock
                    </div>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '900',
                      color: cat.lowStockCount > 0 ? '#f5576c' : '#10b981'
                    }}>
                      {cat.lowStockCount}
                    </div>
                  </div>
                </div>

                {/* Percentage of total inventory */}
                <div style={{
                  marginTop: '20px',
                  padding: '16px',
                  background: 'rgba(99, 102, 241, 0.05)',
                  borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                      Share of Inventory
                    </span>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: CATEGORY_COLORS.text }}>
                      {((cat.productCount / (allProducts.length || 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(cat.productCount / (allProducts.length || 1)) * 100}%`,
                      height: '100%',
                      background: CATEGORY_COLORS.gradient,
                      borderRadius: '3px',
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderProductAnalysis = () => {
    if (!selectedProduct) return null;

    // Calculate this product's impact within its Category
    const categoryProducts = allProducts.filter(p => p.categoryId === selectedProduct.categoryId);

    // Category Stock Dominance
    const totalCategoryStock = categoryProducts.reduce((sum, p) => sum + (p.stockQuantity || 0), 0) || 1;
    const catStockShare = ((selectedProduct.stockQuantity / totalCategoryStock) * 100).toFixed(1);

    // Category Value Dominance
    const totalCategoryValue = categoryProducts.reduce((sum, p) => sum + ((p.price || 0) * (p.stockQuantity || 0)), 0) || 1;
    const productValue = (selectedProduct.price || 0) * (selectedProduct.stockQuantity || 0);
    const catValueShare = ((productValue / totalCategoryValue) * 100).toFixed(1);

    // Sales Dominance within Category
    const totalCategorySales = categoryProducts.reduce((sum, p) => sum + (p.unitsSold || 0), 0) || 1;
    const salesVolumeShare = (((selectedProduct.unitsSold || 0) / totalCategorySales) * 100).toFixed(1);

    // Data for Inventory Dominance Chart (PEELED BACK VIEW)
    const dominanceData = [
      { name: selectedProduct.name, value: selectedProduct.stockQuantity, color: '#667eea' },
      { name: 'Others in ' + selectedProduct.categoryName, value: totalCategoryStock - selectedProduct.stockQuantity, color: 'rgba(0,0,0,0.05)' }
    ];

    // Data for Top 5 competitors in category
    const topCompetitors = [...categoryProducts]
      .sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0))
      .slice(0, 5);

    return (
      <div className="view-transition">
        <header className="header" style={{ marginBottom: 40 }}>
          <div className="header-info" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {renderBackButton('products', 'Products')}
            <div>
              <h1 style={{ fontSize: 36 }}>Product Analytics</h1>
              <p>Performance profile for <strong>{selectedProduct.name}</strong></p>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          {/* Main Info Card */}
          <div className="data-card" style={{ padding: 40 }}>
            <div style={{ display: 'flex', gap: 40, marginBottom: 40 }}>
              <ProductVisual name={selectedProduct.name} categoryName={selectedProduct.categoryName} size={180} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <span className="badge" style={{ background: 'var(--primary-gradient)', color: 'white' }}>{selectedProduct.categoryName}</span>
                  <span className="badge" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)' }}>ID: #{selectedProduct.id}</span>
                </div>
                <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, color: 'var(--text-primary)' }}>{selectedProduct.name}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
                  {selectedProduct.description || 'Comprehensive inventory performance analysis and market share insights within the ' + selectedProduct.categoryName + ' category.'}
                </p>

                <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
                  <button
                    className="btn-primary"
                    onClick={() => handleSell(selectedProduct.id, 1)}
                    style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '12px' }}
                  >
                    <ShoppingCart size={18} style={{ marginRight: 8 }} /> Record Sale (1 Unit)
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div className="stat-card" style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', boxShadow: 'none' }}>
                    <div className="stat-info">
                      <h3>Retail Price</h3>
                      <div className="value" style={{ fontSize: 24 }}>${selectedProduct.price?.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="stat-card" style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', boxShadow: 'none' }}>
                    <div className="stat-info">
                      <h3>Units in Stock</h3>
                      <div className="value" style={{ fontSize: 24 }}>{selectedProduct.stockQuantity}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 32 }}>
              <h4 style={{ marginBottom: 24, fontSize: 14, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: 1 }}>Category Market Share</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>STOCK SHARE</div>
                  <div style={{ fontSize: 32, fontWeight: 900, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{catStockShare}%</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>VALUE SHARE</div>
                  <div style={{ fontSize: 32, fontWeight: 900, background: 'var(--secondary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{catValueShare}%</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>SALES SHARE</div>
                  <div style={{ fontSize: 32, fontWeight: 900, background: 'var(--success-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{salesVolumeShare}%</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>UNIT SOLD</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)' }}>{selectedProduct.unitsSold || 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Inventory Dominance Pie */}
            <div className="data-card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>Inventory Dominance (%)</h3>
              <div style={{ height: 220, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dominanceData}
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {dominanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip cursor={{ opacity: 0 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)' }}>{catStockShare}%</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Of {selectedProduct.categoryName}</div>
                </div>
              </div>
            </div>

            {/* Sales Comparison Bar */}
            <div className="data-card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>Sales Comparison (Category)</h3>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCompetitors} layout="vertical" margin={{ left: -20 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      width={100}
                      tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-secondary)' }}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="unitsSold" radius={[0, 6, 6, 0]} barSize={24}>
                      {topCompetitors.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.id === selectedProduct.id ? 'url(#primaryGradient)' : '#e2e8f0'}
                        />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="primaryGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="100%" stopColor="#764ba2" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddCategory = () => {
    return (
      <div className="view-transition">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {renderBackButton('categories', 'Categories')}
            <div>
              <h1>Create New Category</h1>
              <p>Define a new group for your products.</p>
            </div>
          </div>
        </header>

        <div className="form-container">
          <form onSubmit={handleAddCategory}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Peripherals"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="What kind of products belong here?"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </div>

              <div className="form-group full-width" style={{ marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', justifyContent: 'center', fontSize: '16px' }}>
                  Create Category
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };



  const renderAddProduct = () => {
    const totalStackValue = (parseFloat(newProduct.price) || 0) * (parseInt(newProduct.stockQuantity) || 0);

    return (
      <div className="view-transition">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {renderBackButton('products')}
            <div>
              <h1>Create New Product</h1>
              <p>Fill in the details to add a new item to the system.</p>
            </div>
          </div>
        </header>

        <div className="form-container">
          <form onSubmit={handleAddProduct}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MacBook Pro 16"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  required
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  placeholder="Paste link (optional)"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Unit Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Opening Stock *</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={newProduct.stockQuantity}
                  onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>Additional Notes</label>
                <textarea
                  rows="3"
                  placeholder="Details, specs, or special handling instructions..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <div className="summary-card">
                  <div className="summary-row">
                    <span>Individual Price:</span>
                    <span>${parseFloat(newProduct.price || 0).toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Total Units:</span>
                    <span>{newProduct.stockQuantity || 0}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Projected Inventory Value:</span>
                    <span>${totalStackValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="form-group full-width" style={{ marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', justifyContent: 'center', fontSize: '16px' }}>
                  Register Product
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderLogin = () => {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        padding: '24px',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif"
      }}>
        {/* Animated Background Decoration */}
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          top: '-10%',
          right: '-5%',
          animation: 'pulse 10s infinite alternate',
          pointerEvents: 'none'
        }}></div>

        <div className="view-transition" style={{
          maxWidth: '1200px',
          width: '100%',
          minHeight: '700px',
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '32px',
          overflow: 'hidden',
          boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.5)',
          zIndex: 10
        }}>
          {/* Left Side: Illustration & Branding */}
          <div style={{
            flex: '1.4',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px',
            color: 'white',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.85) 100%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)'
          }} className="login-hero">
            {/* Background Image Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: -1,
              opacity: 0.3,
              transform: 'scale(1.1)',
              animation: 'slowZoom 20s infinite alternate'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '40px'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'var(--primary-gradient)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
                }}>
                  <Box size={32} color="white" />
                </div>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  margin: 0
                }}>StockGenius</h1>
              </div>

              <h2 style={{
                fontSize: '56px',
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: '24px'
              }}>
                Smart <br />
                <span style={{ color: '#818cf8' }}>Inventory</span> Hub
              </h2>

              <p style={{
                fontSize: '18px',
                color: '#94a3b8',
                lineHeight: 1.6,
                marginBottom: '48px',
                maxWidth: '480px'
              }}>
                Streamline operations with our cutting-edge tracking suite.
              </p>

              <div style={{ display: 'flex', gap: '48px' }}>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 700 }}>10k+</div>
                  <div style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Items</div>
                </div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 700 }}>99.9%</div>
                  <div style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Precision</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div style={{
            flex: '0.8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px'
          }}>
            <div style={{
              maxWidth: '360px',
              width: '100%',
              animation: 'fadeInUp 0.8s ease-out'
            }}>
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ color: 'white', fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>Security Login</h3>
                <p style={{ color: '#94a3b8', fontSize: '16px' }}>Authorize access to the dashboard.</p>
              </div>

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div className="form-group">
                  <label style={{ color: '#94a3b8', marginBottom: '10px', display: 'block', fontWeight: 600, fontSize: '14px' }}>Username</label>
                  <div style={{ position: 'relative' }}>
                    <User size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                    <input
                      type="text"
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 52px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '15px',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      className="login-input"
                      placeholder="Username"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ color: '#94a3b8', marginBottom: '10px', display: 'block', fontWeight: 600, fontSize: '14px' }}>Secret Key</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                    <input
                      type="password"
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 52px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '16px',
                        borderRadius: '14px',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      className="login-input"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                  </div>
                </div>

                {loginError && (
                  <div style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    fontSize: '14px',
                    fontWeight: '600',
                    textAlign: 'center',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    animation: 'shake 0.4s ease-in-out'
                  }}>
                    {loginError}
                  </div>
                )}

                <button
                  className="btn-primary"
                  type="submit"
                  style={{
                    width: '100%',
                    height: '60px',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 700,
                    marginTop: '12px',
                    background: 'var(--primary-gradient)',
                    boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
                    cursor: 'pointer',
                    border: 'none',
                    borderRadius: '14px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Enter System <LogIn size={22} />
                </button>
              </form>

              <div style={{ marginTop: '48px', textAlign: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '14px', letterSpacing: '0.5px' }}>
                  System secured by OAuth 2.0
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Styles for Animations */}
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); opacity: 0.2; }
              100% { transform: scale(1.4); opacity: 0.4; }
            }
            @keyframes slowZoom {
              0% { transform: scale(1); }
              100% { transform: scale(1.1); }
            }
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-5px); }
              75% { transform: translateX(5px); }
            }
            .login-input:focus {
              border-color: #6366f1 !important;
              background: rgba(255, 255, 255, 0.08) !important;
            }
            @media (max-width: 900px) {
              .login-hero { display: none !important; }
            }
          `}
        </style>
      </div>
    );
  };


  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return renderDashboard();
      case 'add-product': return renderAddProduct();
      case 'products': return renderProducts();
      case 'categories': return renderCategories();
      case 'add-category': return renderAddCategory();
      case 'low-stock': return renderLowStock();
      case 'product-analysis': return renderProductAnalysis();
      default: return renderDashboard();
    }
  };

  if (!isAuthenticated) return renderLogin();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo" onClick={() => setCurrentView('dashboard')} style={{ cursor: 'pointer' }}>
          <Box size={32} />
          <span>StockGenius</span>
        </div>
        <nav>
          <ul className="nav-links">
            <li className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}>
              <LayoutDashboard size={20} />
              Dashboard
            </li>
            <li className={`nav-item ${currentView === 'products' ? 'active' : ''}`} onClick={() => {
              setFilterCategoryId(null);
              setCurrentView('products');
            }}>
              <Package size={20} />
              Inventory List
            </li>
            <li className={`nav-item ${currentView === 'low-stock' ? 'active' : ''}`} onClick={() => setCurrentView('low-stock')}>
              <AlertTriangle size={20} />
              Low Stock
            </li>
            <li className={`nav-item ${currentView === 'categories' ? 'active' : ''}`} onClick={() => setCurrentView('categories')}>
              <Layers size={20} />
              Groups
            </li>

            <li className="nav-item" onClick={handleLogout} style={{ marginTop: 'auto', color: '#f5576c' }}>
              <LogOut size={20} />
              Sign Out
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
      {renderToasts()}
    </div>
  );

  function renderToasts() {
    return (
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 9999,
        pointerEvents: 'none'
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              padding: '16px 24px',
              background: toast.type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '280px',
              animation: 'slideInRight 0.3s ease-out forwards',
              pointerEvents: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {toast.type === 'success' ? <Box size={14} /> : <AlertTriangle size={14} />}
            </div>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>{toast.message}</span>
          </div>
        ))}
      </div>
    );
  }
}

function StatCard({ title, value, icon, bg, onClick }) {
  return (
    <div
      className={`stat-card ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stat-icon" style={{ backgroundColor: bg }}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <div className="value">{value === undefined ? '...' : value}</div>
      </div>
    </div>
  );
}

export default App;
