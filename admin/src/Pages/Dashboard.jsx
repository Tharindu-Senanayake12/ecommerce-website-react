import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { backendUrl, currency } from '../App';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  ShoppingCart, DollarSign, Package, AlertTriangle, Users,
  BarChartBig, ClipboardList, FileSpreadsheet, FileText, LineChart as LineChartIcon
} from 'lucide-react';

// Custom Tooltip for Recharts for consistent styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white rounded-lg shadow-lg border border-slate-200">
        <p className="label text-sm text-slate-600">{`${label}`}</p>
        <p className="intro text-indigo-600 font-bold">{`${currency}${(payload[0].value || 0).toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  const [statusData, setStatusData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [dailyRevenueData, setDailyRevenueData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // State for toggling chart data and view
  const [revenueView, setRevenueView] = useState('monthly'); // 'monthly' or 'daily'
  const [chartType, setChartType] = useState('line'); // 'line' or 'bar'

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const [orderRes, productRes] = await Promise.all([
        axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } }),
        axios.get(`${backendUrl}/api/product/list`)
      ]);

      if (orderRes.data.success) {
        const fetchedOrders = orderRes.data.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(fetchedOrders);
        setTotalRevenue(fetchedOrders.reduce((total, o) => total + o.amount, 0));
        processChartData(fetchedOrders);
      }

      if (productRes.data.success) {
        const fetchedProducts = productRes.data.products;
        setProducts(fetchedProducts);
        setOutOfStock(fetchedProducts.filter(p => p.stock <= 0).length);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const processChartData = (orders) => {
    const statusMap = {};
    const monthMap = {};
    const dayMap = {};

    orders.forEach(order => {
      statusMap[order.status] = (statusMap[order.status] || 0) + 1;
      const date = new Date(order.date);
      
      const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthMap[monthKey] = (monthMap[monthKey] || 0) + order.amount;

      const dayKey = date.toLocaleDateString('en-CA'); // YYYY-MM-DD for sorting
      dayMap[dayKey] = (dayMap[dayKey] || 0) + order.amount;
    });

    setStatusData(Object.keys(statusMap).map(k => ({ status: k, count: statusMap[k] })));

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      let d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString('default', { month: 'short', year: '2-digit' });
    }).reverse();

    setMonthlyRevenueData(last6Months.map(month => ({
      month,
      revenue: monthMap[month] || 0
    })));
    
    const sortedDays = Object.keys(dayMap).sort().slice(-30);
    setDailyRevenueData(sortedDays.map(day => ({
        day: new Date(day + 'T00:00:00').toLocaleDateString('default', { month: 'short', day: 'numeric' }),
        revenue: dayMap[day]
    })));
  };

  const exportData = (type) => {
    setIsExporting(true);
    const data = orders.map(order => ({
      Customer: `${order.address.firstName} ${order.address.lastName}`,
      Phone: order.address.phone,
      Payment: order.payment ? 'Done' : 'Pending',
      Date: new Date(order.date).toLocaleDateString(),
      Amount: `${currency}${order.amount}`,
      Status: order.status
    }));

    setTimeout(() => {
      if (type === 'excel') {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');
        XLSX.writeFile(wb, 'Orders_Report.xlsx');
      } else if (type === 'pdf') {
        const doc = new jsPDF();
        doc.text('Orders Report', 14, 16);
        autoTable(doc, {
          head: [['Customer', 'Phone', 'Payment', 'Date', 'Amount', 'Status']],
          body: data.map(Object.values),
          startY: 20,
          theme: 'striped',
          headStyles: { fillColor: '#4f46e5' },
        });
        doc.save('Orders_Report.pdf');
      }
      setIsExporting(false);
    }, 500);
  };

  const filteredOrders = orders.filter(order =>
    `${order.address.firstName} ${order.address.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700';
      case 'Out for Delivery': return 'bg-blue-100 text-blue-700';
      case 'Processing': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };
  
  const currentRevenueData = revenueView === 'monthly' ? monthlyRevenueData : dailyRevenueData;
  const currentDataKey = revenueView === 'monthly' ? 'month' : 'day';

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-['Inter'] text-slate-900">
      <main className="max-w-7xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-slate-500 mt-1">Here is Bellini Progress Overview.</p>
            </div>
            <div className="flex space-x-2">
                <ExportButton icon={<FileSpreadsheet size={16} />} onClick={() => exportData('excel')} disabled={isExporting} label="Excel" />
                <ExportButton icon={<FileText size={16} />} onClick={() => exportData('pdf')} disabled={isExporting} label="PDF" />
            </div>
        </motion.div>

        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="show"
        >
            <StatCard title="Total Revenue" value={`${currency}${totalRevenue.toLocaleString()}`} icon={<DollarSign />} colorClass="bg-emerald-100 text-emerald-600" />
            <StatCard title="Total Orders" value={orders.length} icon={<ShoppingCart />} colorClass="bg-indigo-100 text-indigo-600" />
            <StatCard title="Total Products" value={products.length} icon={<Package />} colorClass="bg-blue-100 text-blue-600" />
            <StatCard title="Out of Stock" value={outOfStock} icon={<AlertTriangle />} colorClass="bg-rose-100 text-rose-600" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                 <div className="flex items-center">
                    <h2 className="text-xl font-bold mr-4">{revenueView === 'monthly' ? 'Monthly' : 'Daily'} Revenue</h2>
                    <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                        <ToggleButton onClick={() => setRevenueView('monthly')} isActive={revenueView === 'monthly'}>Monthly</ToggleButton>
                        <ToggleButton onClick={() => setRevenueView('daily')} isActive={revenueView === 'daily'}>Daily</ToggleButton>
                    </div>
                </div>
                <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                    <IconToggleButton onClick={() => setChartType('line')} isActive={chartType === 'line'}><LineChartIcon size={18} /></IconToggleButton>
                    <IconToggleButton onClick={() => setChartType('bar')} isActive={chartType === 'bar'}><BarChartBig size={18} /></IconToggleButton>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
                {chartType === 'line' ? (
                    <LineChart 
                        data={currentRevenueData} 
                        margin={{ top: 5, right: 20, left: 20, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                            dataKey={currentDataKey} 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            stroke="#cbd5e1"
                            interval={"preserveStartEnd"}
                         />
                        <YAxis 
                            tickFormatter={(value) => `${currency}${value >= 1000 ? `${value / 1000}k` : value}`} 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            stroke="#cbd5e1" 
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} />
                    </LineChart>
                ) : (
                    <BarChart 
                        data={currentRevenueData} 
                        margin={{ top: 5, right: 20, left: 20, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                            dataKey={currentDataKey} 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            stroke="#cbd5e1" 
                            interval={"preserveStartEnd"}
                        />
                        <YAxis 
                            tickFormatter={(value) => `${currency}${value >= 1000 ? `${value / 1000}k` : value}`} 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            stroke="#cbd5e1" 
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }} />
                        <Bar dataKey="revenue" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                    </BarChart>
                )}
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
          >
             <div className="flex items-center mb-4">
              <Users className="w-6 h-6 mr-2 text-indigo-500" />
              <h2 className="text-xl font-bold">Orders by Status</h2>
            </div>
            <div className="space-y-4">
              {statusData.map(item => (
                <div key={item.status}>
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>{item.status}</span>
                    <span>{item.count} / {orders.length}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${(item.count / orders.length) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-100"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div className="flex items-center">
                <ClipboardList className="w-6 h-6 mr-2 text-indigo-500" />
                <h2 className="text-xl font-bold">Recent Orders</h2>
              </div>
              <input
                type="text"
                placeholder="Search by customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-3 sm:mt-0 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition w-full sm:w-auto"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold">
                  <tr>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredOrders.slice(0, 5).map((order) => (
                      <motion.tr
                        key={order._id}
                        layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-3 font-medium">{order.address.firstName} {order.address.lastName}</td>
                        <td className="p-3 text-slate-600">{currency}{order.amount.toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, colorClass }) => (
    <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
        className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4"
    >
        <div className={`p-3 rounded-lg ${colorClass}`}>
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </motion.div>
);

const ExportButton = ({ icon, onClick, disabled, label }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition flex items-center space-x-2 text-sm font-medium ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    {icon}
    <span>{disabled ? 'Exporting...' : label}</span>
  </button>
);

const ToggleButton = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
            isActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
        }`}
    >
        {children}
    </button>
);

const IconToggleButton = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`p-1.5 rounded-md transition-colors ${
            isActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-600'
        }`}
    >
        {children}
    </button>
);

export default Dashboard;