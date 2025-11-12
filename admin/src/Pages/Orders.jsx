import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from './../App';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Hash, Calendar, ShoppingBag, User, MapPin, Phone, CheckCircle2, XCircle } from 'lucide-react';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, {
        headers: { token }
      });

      if (response.data.success) {
        const sortedOrders = response.data.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      toast.error("An error occurred while fetching orders.");
      console.error(error);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`, {
        orderId,
        status: event.target.value
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success("Order status updated successfully!");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred while updating status.");
      console.error(error);
    }
  };
  
  const getStatusPill = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700';
      case 'Out For Delivery': return 'bg-blue-100 text-blue-700';
      case 'Shipped': case 'Packing': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-['Inter'] text-slate-900">
      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-slate-500 mt-1">Manage and track all customer orders.</p>
        </motion.div>

        {/* Orders List */}
        <div className="flex flex-col gap-6">
          <AnimatePresence>
            {orders.map((order) => (
              <motion.div
                layout
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <Truck size={16} className="text-indigo-500" />
                        <span>Order</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Hash size={14} />
                        <span>{order._id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={14} />
                        <span>{order.items.length} items</span>
                    </div>
                </div>

                {/* Card Body with Image */}
                <div className="p-5 flex flex-col md:flex-row gap-5">
                  {order.items.length > 0 && order.items[0].image?.length > 0 && (
                    <div className="w-full md:w-28 flex-shrink-0">
                      <img 
                        src={order.items[0].image[0]} 
                        alt={order.items[0].name}
                        className="w-full h-full object-cover rounded-lg border border-slate-200"
                        onError={(e) => e.target.src = '/placeholder.png'} // fallback if broken
                      />
                    </div>
                  )}

                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Items & Payment Info */}
                    <div>
                        <h3 className="font-semibold mb-3">Order Items</h3>
                        <div className="text-slate-700 text-sm space-y-1 mb-4">
                            {order.items.map((item, i) => (
                                <p key={i}>- {item.name} x {item.quantity}</p>
                            ))}
                        </div>
                        <h3 className="font-semibold mb-2">Payment</h3>
                        <div className="flex items-center gap-2 text-sm">
                          {order.payment ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-rose-500" />}
                          <span className={`font-medium ${order.payment ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {order.payment ? 'Paid' : 'Pending'} via {order.paymentMethod}
                          </span>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div>
                        <h3 className="font-semibold mb-3">Shipping Details</h3>
                        <div className="text-slate-700 text-sm space-y-2">
                            <p className="flex items-center gap-2 font-medium"><User size={14} />{order.address.firstName} {order.address.lastName}</p>
                            <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5" />{order.address.address}, {order.address.city}, {order.address.zipcode}</p>
                            <p className="flex items-center gap-2"><Phone size={14} /> {order.address.phone}</p>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bg-slate-50/70 p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-xl font-bold text-slate-800">
                    Total: {currency}{order.amount.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusPill(order.status)}`}>
                        {order.status}
                      </span>
                    <select
                      onChange={(e) => statusHandler(e, order._id)}
                      value={order.status}
                      className="w-full sm:w-auto border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Packing">Packing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out For Delivery">Out For Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Orders;
