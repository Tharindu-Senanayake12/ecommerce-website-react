import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList, // Changed from ListOrdered for better clarity
  Truck,          // Changed from ShoppingBag to match the Orders page theme
  ShieldCheck,    // Added for the header
} from "lucide-react";

const Sidebar = () => {
  // Updated navItems with more thematic icons
  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/add", label: "Add Products", icon: <PlusCircle size={20} /> },
    { path: "/list", label: "Product List", icon: <ClipboardList size={20} /> },
    { path: "/orders", label: "Orders", icon: <Truck size={20} /> },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Sidebar Header/Logo */}
      <div className="p-6 flex items-center gap-3">
        <ShieldCheck size={28} className="text-indigo-600" />
        <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            // Using a function in className to handle active/inactive states cleanly
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors duration-200 ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-semibold" // Active state styles
                  : "text-slate-600 hover:bg-slate-100 font-medium" // Inactive state styles
              }`
            }
          >
            {/* The icon is a direct child to inherit the text color */}
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;