import { useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { Store, ShoppingBag, MapPin, SlidersHorizontal, X, ShoppingCart, SearchX, Search } from "lucide-react";
import { STATES } from "../config";
import { MALLS_DATA_CONTEXT } from "@/contexts";

const MallPage = () => {
  const [selectedState, setSelectedState] = useState("Abuja");
  const [searchTerm, setSearchTerm] = useState("");
  const [bottomNavVisible, setBottomNavVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { mallsData } = useContext(MALLS_DATA_CONTEXT);

  const filteredMalls = useMemo(() => {
    if (!selectedState) return mallsData;
    if (searchTerm) {
      const malls = mallsData.filter((mall) => {
        if (!mall.state) return false;
        return (
          mall.state.toLowerCase().includes(selectedState.toLowerCase()) &&
          mall.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      return malls;
    }
    const malls = mallsData.filter((mall) => {
      if (!mall.state) return false;
      const includes = mall.state
        .toLowerCase()
        .includes(selectedState.toLowerCase());
      return includes;
    });
    return malls;
  }, [selectedState, mallsData, searchTerm]);

  return (
    <div className="relative z-0 flex flex-col bg-gray-50 min-h-screen">
      {/* Header Navigation - Updated positioning */}
      <div className="sticky top-[55px] z-20 bg-white shadow-sm">
        {/* Removed container class to allow full-width alignment */}
        <div className="flex items-center h-16">
          {/* Market/Mall Switch - Aligned exactly with sidebar */}
          <div className="hidden md:flex items-center space-x-6 w-72 lg:w-80 pl-6">
            <Link
              to="/markets"
              className="flex items-center gap-2 text-gray-600 text-lg hover:text-Primary transition-colors"
            >
              <Store className="w-5 h-5" />
              <span>Markets</span>
            </Link>
            <Link
              to="/malls"
              className="flex items-center gap-2 hover:opacity-90 font-bold text-lg text-Primary transition-opacity"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Malls</span>
            </Link>
          </div>

          {/* Mobile Market/Mall Switch */}
          <div className="flex md:hidden items-center space-x-4 px-4">
            <Link
              to="/markets"
              className="flex items-center gap-1 text-gray-600 hover:text-Primary transition-colors"
            >
              <Store className="w-5 h-5" />
            </Link>
            <Link
              to="/malls"
              className="flex items-center gap-1 hover:opacity-90 font-bold text-Primary transition-opacity"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>

          {/* Search Bar - Centered in remaining space */}
          <div className="flex-1 flex justify-center px-4">
            <div className="w-full max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search ${selectedState} malls...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-2 border-Primary px-4 py-2 pr-12 pl-5 rounded-full focus:ring-2 focus:ring-Primary/20 text-sm transition-all focus:outline-none"
                />
                <Search
                  size={20}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-Primary pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(true)}
            className="md:hidden flex items-center justify-center rounded-full w-10 h-10 text-Primary mr-4"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed inset-0 bg-black/50 z-[40] transition-opacity duration-300 md:hidden ${
          showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowFilters(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[41] transform transition-transform duration-300 ease-in-out md:hidden ${
          showFilters ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold text-lg">Select State</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="hover:bg-gray-100 p-2 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="gap-2 grid grid-cols-2 p-4">
              {STATES.map((state) => (
                <button
                  key={state}
                  onClick={() => {
                    setSelectedState(state);
                    setShowFilters(false);
                  }}
                  className={`p-3 text-left rounded-lg transition-all ${
                    selectedState === state
                      ? "bg-Primary text-white font-medium"
                      : "text-gray-700 hover:bg-Primary/10"
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside 
          className="md:block hidden bg-white p-6 w-72 lg:w-80 overflow-y-auto"
          style={{
            position: 'sticky',
            top: '119px', // 55px (Header2) + 64px (Market nav)
            height: 'calc(100vh - 119px)', // Viewport - (Header2 + Market nav)
          }}
        >
          <h3 className="mb-4 font-semibold text-lg">Select State</h3>
          <div className="gap-2 grid">
            {STATES.map((state) => (
              <button
                key={state}
                onClick={() => setSelectedState(state)}
                className={`p-3 text-left rounded-lg transition-all ${
                  selectedState === state
                    ? "bg-Primary text-white font-medium"
                    : "text-gray-700 hover:bg-Primary/10"
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </aside>

        {/* Malls Grid */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto container">
            <h2 className="mb-6 font-bold text-gray-800 text-xl md:text-2xl">
              {selectedState} State Malls
            </h2>

            <div className="gap-3 md:gap-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMalls.length > 0 ? (
                filteredMalls.map((mall, index) => (
                  <Link
                    to={`/malls/${mall.id}`}
                    key={index}
                    className="bg-white shadow-sm hover:shadow-md rounded-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="overflow-hidden aspect-video">
                      <img
                        src={mall.displayImage}
                        alt={mall.name}
                        loading="lazy"
                        className="group-hover:scale-105 w-full h-full transform transition-transform duration-300 object-cover"
                      />
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="group-hover:text-Primary line-clamp-1 font-semibold text-gray-800 text-sm md:text-lg transition-colors">
                        {mall.name}
                      </h3>
                      <div className="flex items-start gap-2 mt-2 text-gray-600">
                        <MapPin size={16} className="flex-shrink-0 mt-1" />
                        <p className="line-clamp-2 text-xs md:text-sm">
                          {mall.address}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
                  <div className="relative mb-6">
                    <ShoppingCart className="w-24 h-24 text-gray-200 animate-bounce" />
                    <SearchX className="w-12 h-12 text-orange absolute -bottom-2 -right-2 transform -rotate-12" />
                  </div>
                  <div className="text-center max-w-md mx-auto space-y-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Shopping Malls Not Found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm ? (
                        <>
                          We couldn't find any shopping malls matching "{searchTerm}" in {selectedState}.
                          Try a different search term or browse malls in another state.
                        </>
                      ) : (
                        <>
                          Looks like we haven't mapped any malls in {selectedState} yet.
                          Don't worry - we're constantly adding new locations!
                        </>
                      )}
                    </p>
                    <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => setSearchTerm("")}
                        className="w-full sm:w-auto px-4 py-2 text-Primary border-2 border-Primary rounded-full hover:bg-Primary/5 transition-colors text-sm"
                      >
                        Reset Search
                      </button>
                      <Link
                        to="/markets"
                        className="w-full sm:w-auto px-4 py-2 bg-Primary text-white rounded-full hover:bg-Primary/90 transition-colors text-sm whitespace-nowrap flex items-center justify-center gap-2"
                      >
                        <Store className="w-4 h-4" />
                        Try Markets Instead
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MallPage;
