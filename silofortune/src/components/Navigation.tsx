import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Warehouse, Truck, Package } from "lucide-react";

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/warehouse", label: "Warehouse", icon: Warehouse },
    { path: "/driver", label: "Driver", icon: Truck },
  ];

  return (
    <nav className="bg-[#1E1E1E] border-b border-gray-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-[#BB86FC]" />
          <h1 className="text-2xl font-bold text-white">SiloDispatch</h1>
        </div>

        <div className="flex space-x-6">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === path
                  ? "bg-[#BB86FC] text-white"
                  : "text-gray-300 hover:bg-[#2A2A2A] hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
