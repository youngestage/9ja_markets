import React, { useContext, useState } from "react";
import { Store, UserRound, Settings, Home, Package, Users, MessageSquare, LogOut, ChevronRight, X } from "lucide-react";
import { Link, Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "antd";
import { USER_PROFILE_CONTEXT, LOGOUT_MODAL_CONTEXT } from "@/contexts";

const Dashboard = () => {
  const { subpage } = useParams();
  const location = useLocation();
  const currentSubPage = subpage || "overview";
  const { userProfile } = useContext(USER_PROFILE_CONTEXT);
  const { setLogoutOpen } = useContext(LOGOUT_MODAL_CONTEXT);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!userProfile) {
    navigate("/");
    return null;
  }

  const name = userProfile.firstName || userProfile.brandName;

  const menuItems = [
    {
      path: "/dashboard/overview",
      icon: <Home className="w-5 h-5" />,
      label: "Overview"
    },
    {
      path: "/dashboard/products",
      icon: <Package className="w-5 h-5" />,
      label: "Products"
    },
    ...(userProfile.userType === "merchant" ? [{
      path: "/dashboard/customers",
      icon: <Users className="w-5 h-5" />,
      label: "Customers"
    }] : []),
    {
      path: "/dashboard/messages",
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Vendors"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 pt-10 px-4">
        <SidebarContent
          name={name}
          userProfile={userProfile}
          location={location}
          menuItems={menuItems}
          navigate={navigate}
          setLogoutOpen={setLogoutOpen}
        />
      </aside>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop with fade animation */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar with slide animation */}
          <aside 
            className={`fixed top-0 left-0 w-64 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-out ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="px-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent
                name={name}
                userProfile={userProfile}
                location={location}
                menuItems={menuItems}
                navigate={(path) => {
                  navigate(path);
                  setIsMobileMenuOpen(false);
                }}
                setLogoutOpen={setLogoutOpen}
              />
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="p-4">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Button with slide animation */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed left-0 top-1/3 bg-orange text-white p-2 py-5 rounded-r-xl shadow-lg flex items-center transform transition-transform duration-300 ease-in-out hover:translate-x-1"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// Sidebar content component
const SidebarContent = ({ 
  name, 
  userProfile, 
  location, 
  menuItems, 
  navigate, 
  setLogoutOpen 
}) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center mb-8 pt-8 rounded-lg transition-colors">
          <Avatar
            style={{ backgroundColor: "#F8912D", verticalAlign: "middle" }}
            size="large"
          >
            <span className="font-semibold">{name[0]}</span>
          </Avatar>
          <div className="ml-3 relative">
            <h2 className="font-semibold text-lg">{name}</h2>
            <button
              className="absolute -right-10 top-0 bg-Primary p-2 rounded-full transition-transform hover:scale-105"
              onClick={() => navigate("/dashboard/edit")}
            >
              <Settings className="w-4 h-4" color="white" />
            </button>
            <p className="text-sm">{userProfile.phoneNumbers[0].number}</p>
          </div>
        </div>

        <UserOptions />
        
        {/* Navigation Menu */}
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors hover:bg-Primary/20 ${
                    location.pathname === item.path ? 'bg-Primary text-white' : ''
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="py-4 border-t">
        <button
          onClick={() => setLogoutOpen(true)}
          className="flex w-full items-center space-x-3 p-2 pb-10 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

function UserOptions() {
  return (
    <div className="mb-6">
      <div className="space-y-2">
        <div className="flex flex-col space-y-2">
          <Link
            to="/dashboard/products"
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-Primary/20 "
          >
            <Store className="w-5 h-5" />
            <span>Sign in as Merchant</span>
          </Link>
          <Link
            to="/merchant-signup"
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-Primary/20 "
          >
            <UserRound className="w-5 h-5" />
            <span>Sign up as Merchant</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;