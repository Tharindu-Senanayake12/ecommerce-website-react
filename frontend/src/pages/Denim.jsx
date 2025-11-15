import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import SubFilters from '../components/SubFilterProducts';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Denim = () => {
  const { products, search } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [sortOption, setSortOption] = useState('relavent');

  // Toggle selected size
  const toggleSize = (e) => {
    const value = e.target.value;
    setSize(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  // Toggle selected color
  const toggleColor = (e) => {
    const value = e.target.value;
    setColor(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  // Toggle selected availability (fixed to handle booleans)
  const toggleAvailability = (value) => {
    // Convert string value to boolean
    const boolValue = value === 'true' ? true : value === 'false' ? false : value;
    setAvailability((prev) =>
      prev.includes(boolValue)
        ? prev.filter((item) => item !== boolValue)
        : [...prev, boolValue]
    );
  };

  // Filter and sort products when filters, sortOption, or search change
  useEffect(() => {
    if (!products || products.length === 0) return;

    let filtered = products.filter(product => product.category === 'Denim');

    // Apply search filter
    if (search.trim() !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply size filter
    if (size.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes?.some(s => size.includes(s))
      );
    }

    // Apply color filter
    if (color.length > 0) {
      filtered = filtered.filter(product =>
        product.colors?.some(c => color.includes(c))
      );
    }

    // Apply availability filter
    if (availability.length > 0) {
      filtered = filtered.filter(product =>
        availability.includes(product.availability)
      );
    }

    // Apply sorting
    if (sortOption === 'low-high') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-low') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    setFilterProducts(filtered);
  }, [size, color, availability, sortOption, search, products]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filters Sidebar */}
      <SubFilters
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        size={size}
        toggleSize={toggleSize}
        color={color}
        toggleColor={toggleColor}
        availability={availability}
        toggleAvailability={toggleAvailability}
      />

      {/* Right Side (Products Display Area) */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'DENIMS'} text2={'COLLECTION'} />

          {/* Product Sort */}
          <select
            className='border-2 border-gray-250 text-sm px-3 h-10 mt-10'
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Denim;