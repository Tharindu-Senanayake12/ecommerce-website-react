import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from 'framer-motion';
import { FilePenLine, Trash2, X } from "lucide-react";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching product list.");
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await axios.post(`${backendUrl}/api/product/remove`, { id }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error removing product.");
    }
  };

  const updateProduct = async (updatedProductData) => {
    try {
      const response = await axios.post(`${backendUrl}/api/product/update`, updatedProductData, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        setEditProduct(null);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating product.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-['Inter'] text-slate-900">
      <main className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight">Product List</h1>
          <p className="text-slate-500 mt-1">View, edit, or delete products from your store.</p>
        </motion.div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold">
                <tr>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => {
                  // ✅ Use the first image from `image` array
                  const imageUrl = item.image?.length > 0 
                    ? item.image[0] 
                    : 'https://via.placeholder.com/50'; // fallback image

                  return (
                    <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="h-[9rem] w-auto object-contain rounded-md border border-slate-200"
                        />
                      </td>
                      <td className="p-3 font-medium text-slate-800">{item.name}</td>
                      <td className="p-3 text-slate-600">{item.category}</td>
                      <td className="p-3 text-slate-800 font-semibold">
                        {currency}{(item.price || 0).toFixed(2)}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-4 justify-center">
                          <button onClick={() => setEditProduct(item)} className="text-slate-500 hover:text-indigo-600 transition-colors">
                            <FilePenLine size={22} />
                          </button>
                          <button onClick={() => removeProduct(item._id)} className="text-slate-500 hover:text-rose-600 transition-colors">
                            <Trash2 size={22} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {editProduct && (
          <EditModal 
            product={editProduct} 
            onClose={() => setEditProduct(null)} 
            onSave={updateProduct} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const EditModal = ({ product, onClose, onSave }) => {
  const [productData, setProductData] = useState(product);

  const handleSave = () => {
    onSave(productData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Edit Product</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <Input label="Product Name" value={productData.name} onChange={(e) => setProductData({ ...productData, name: e.target.value })} />
          <Input label="Category" value={productData.category} onChange={(e) => setProductData({ ...productData, category: e.target.value })} />
          <Input label="Price" type="number" value={productData.price} onChange={(e) => setProductData({ ...productData, price: Number(e.target.value) })} />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
    <input {...props} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
  </div>
);

export default List;
