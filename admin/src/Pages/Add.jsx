import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App'; // FIX 3: Imported 'currency'
import { toast } from 'react-toastify';
// FIX 1: Removed unused 'motion' import
import { UploadCloud, LoaderCircle } from 'lucide-react';

const Add = ({ token }) => {
  const [images, setImages] = useState(Array(4).fill({ file: null, preview: null }));
  
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Tops',
    availability: true,
    bestSeller: false,
    sizes: [],
    colors: []
  });

  const [loading, setLoading] = useState(false);

  const handleDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = { file, preview: URL.createObjectURL(file) };
      setImages(newImages);
    }
  };

  const toggleValue = (field, value) => {
    setData(prevData => {
      const currentValues = prevData[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prevData, [field]: newValues };
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));
    formData.append('category', data.category);
    formData.append('bestSeller', data.bestSeller);
    formData.append('availability', data.availability);
    formData.append('sizes', JSON.stringify(data.sizes));
    formData.append('colors', JSON.stringify(data.colors));
    
    images.forEach((img, index) => {
      if (img.file) {
        formData.append(`image${index + 1}`, img.file);
      }
    });

    try {
      const response = await axios.post(`${backendUrl}/api/product/add`, formData, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        setData({ name: '', description: '', price: '', category: 'Tops', availability: true, bestSeller: false, sizes: [], colors: [] });
        setImages(Array(4).fill({ file: null, preview: null }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // FIX 2: Used the 'error' object to provide a more specific toast message
      toast.error(error.response?.data?.message || "An error occurred while adding the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-['Inter'] text-slate-900">
      <main className="max-w-7xl mx-auto">
        {/* FIX 1: Changed motion.div to a regular div */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add a New Product</h1>
          <p className="text-slate-500 mt-1">Fill in the details to add a new item to your store.</p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Main Details */}
            <div className="lg:col-span-2 space-y-8">
              <Card title="Primary Details">
                <Input label="Product Name" name="name" value={data.name} onChange={handleDataChange} required />
                <Textarea label="Description" name="description" value={data.description} onChange={handleDataChange} required />
              </Card>

              <Card title="Pricing & Attributes">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select label="Category" name="category" value={data.category} onChange={handleDataChange}>
                    <option value="Tops">Top</option>
                    <option value="Dresses">Dress</option>
                    <option value="Pants">Pant</option>
                    <option value="Shorts">Short</option>
                    <option value="Skirts">Skirt</option>
                    <option value="Denims">Denim</option>
                  </Select>
                  <Input label={`Price (${currency})`} name="price" type="number" value={data.price} onChange={handleDataChange} required />
                </div>
                <MultiToggleButton label="Available Sizes" options={['S', 'M', 'L', 'XL', 'XXL']} selected={data.sizes} onToggle={(size) => toggleValue('sizes', size)} />
                <MultiToggleButton label="Available Colors" options={['Black', 'Red', 'Blue', 'Green', 'Pink', 'Yellow', 'Purple']} selected={data.colors} onToggle={(color) => toggleValue('colors', color)} />
              </Card>
            </div>

            {/* Right Column: Images and Settings */}
            <div className="lg:col-span-1 space-y-8">
              <Card title="Product Images">
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img, idx) => (
                    <label key={idx} className="cursor-pointer">
                      <div className="aspect-square border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-500 transition-colors flex flex-col items-center justify-center text-slate-400">
                        {img.preview ? (
                          <img src={img.preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover rounded-md" />
                        ) : (
                          <>
                            <UploadCloud size={24} />
                            <span className="text-xs mt-1">Image {idx + 1}</span>
                          </>
                        )}
                      </div>
                      <input type="file" onChange={(e) => handleImageChange(e, idx)} hidden />
                    </label>
                  ))}
                </div>
              </Card>

              <Card title="Settings">
                <Checkbox label="Product is Available" name="availability" checked={data.availability} onChange={handleDataChange} />
                <Checkbox label="Add to Best Sellers" name="bestSeller" checked={data.bestSeller} onChange={handleDataChange} />
              </Card>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? <LoaderCircle size={20} className="animate-spin" /> : null}
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

// Reusable Form Components
const Card = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <h3 className="text-lg font-bold text-slate-800 mb-6">{title}</h3>
    <div className="space-y-6">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
    <input {...props} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
    <textarea rows={4} {...props} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
    <select {...props} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
      {children}
    </select>
  </div>
);

const MultiToggleButton = ({ label, options, selected, onToggle }) => (
  <div>
    <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
    <div className="flex gap-2 flex-wrap">
      {options.map(option => (
        <button
          type="button"
          key={option}
          onClick={() => onToggle(option)}
          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
            selected.includes(option)
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const Checkbox = ({ label, ...props }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <input type="checkbox" {...props} className="w-4 h-4 rounded accent-indigo-600" />
    <span className="text-sm font-medium text-slate-700">{label}</span>
  </label>
);

export default Add;