import { useState, useContext, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useErrorLogger } from "@/hooks";
import { getMarketProducts } from "@/lib/api/marketApi";
import { MARKETS_DATA_CONTEXT, MESSAGE_API_CONTEXT, USER_PROFILE_CONTEXT, BOOKMARK_CONTEXT, MALLS_DATA_CONTEXT } from "@/contexts";
import LoadingPage from "@/componets-utils/LoadingPage";
import NotFoundPage from "@/components/NotFoundPage";
import { Search, SearchX, HelpCircle, MapPin, Info, Building2, MapPinned, Star, Crown, Award } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/config";
import { addToBookmarks, removeFromBookmarks, getBookmarks } from "@/lib/api/bookmarkApi";
import { replaceUnderscoresWithSpaces } from "@/lib/util";
import { getProductsWithAdsStatus, sortProductsByAdPriority } from "@/lib/api/adApi";
import { useTrackProductClick, useTrackAdClick } from "@/hooks/useTracking";
import MarketProductCard from "./MarketProductCard";
import { Skeleton } from "@/components/ui/skeleton";

// Function to get ad level label and style
const getAdBadge = (level) => {
  switch (level) {
    case 3:
      return {
        icon: <Crown className="w-3 h-3" />,
        label: "Premium",
        classes: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white",
      };
    case 2:
      return {
        icon: <Star className="w-3 h-3" />,
        label: "Featured",
        classes: "bg-gradient-to-r from-orange-400 to-amber-500 text-white",
      };
    case 1:
      return {
        icon: <Award className="w-3 h-3" />,
        label: "Standard",
        classes: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
      };
    default:
      return null;
  }
};

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="relative">
      <Skeleton className="w-full aspect-square" />
      {/* Ad badge skeleton */}
      <Skeleton className="absolute top-2 right-2 h-6 w-20 rounded-full" />
    </div>
    <div className="p-3 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  </div>
);

const Marketplace = () => {
  const { id } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const { marketsData } = useContext(MARKETS_DATA_CONTEXT);
  const { mallsData } = useContext(MALLS_DATA_CONTEXT);
  
  // Determine if we're viewing a market or mall
  const isMall = location.pathname.includes('/malls/');
  const venue = isMall 
    ? mallsData.find((mall) => mall.id === id)
    : marketsData.find((market) => market.id === id);

  const { userProfile } = useContext(USER_PROFILE_CONTEXT);
  const [bookmarkedProducts, setBookmarkedProducts] = useState(new Set());
  const [showDescription, setShowDescription] = useState(false);
  const messageApi = useContext(MESSAGE_API_CONTEXT);
  const { updateBookmarkCount } = useContext(BOOKMARK_CONTEXT);
  // Hook for product click tracking
  const handleProductClick = useTrackProductClick();
  const handleAdClick = useTrackAdClick();
  const adViewRefs = useRef({});
  const errorLogger = useErrorLogger();
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const products = await getMarketProducts(id, errorLogger);
      if (!products) {
        setIsLoading(false);
        return;
      }

      // Enhance products with ad status
      const productsWithAdStatus = await getProductsWithAdsStatus(
        products,
        { [isMall ? 'mall' : 'market']: id },
        errorLogger
      );

      // Sort products so ads appear first
      const sortedProducts = sortProductsByAdPriority(productsWithAdStatus);
      setProducts(sortedProducts);
    } catch (error) {
      errorLogger(error);
    } finally {
      setIsLoading(false);
    }
  };

  const MARKET_CATEGORIES = ["All", ...PRODUCT_CATEGORIES];
  const [selectedCategory, setSelectedCategory] = useState(
    MARKET_CATEGORIES[0]
  );

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered =
      selectedCategory === MARKET_CATEGORIES[0]
        ? products
        : products.filter(
            (product) =>
              replaceUnderscoresWithSpaces(product.category) ===
              selectedCategory
          );

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const handleBookmarkToggle = async (productId) => {
    if (!userProfile) {
      messageApi.error("Please login to bookmark products");
      return;
    }

    try {
      if (bookmarkedProducts.has(productId)) {
        const result = await removeFromBookmarks(productId, messageApi.error);
        if (result) {
          setBookmarkedProducts((prev) => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
          messageApi.success("Product removed from bookmarks");
          updateBookmarkCount();
        }
      } else {
        const result = await addToBookmarks(productId, messageApi.error);
        if (result) {
          setBookmarkedProducts((prev) => new Set(prev).add(productId));
          messageApi.success("Product added to bookmarks");
          updateBookmarkCount();
        }
      }
    } catch (err) {
      messageApi.error("Failed to update bookmark");
    }
  };

  useEffect(() => {
    const loadBookmarks = async () => {
      if (!userProfile) return;
      try {
        const bookmarks = await getBookmarks(userProfile.id, messageApi.error);
        if (bookmarks) {
          setBookmarkedProducts(new Set(bookmarks.map((b) => b.productId)));
        }
      } catch (err) {
        console.error("Failed to load bookmarks:", err);
      }
    };

    fetchProducts();
    loadBookmarks();
  }, [id, userProfile]);

  if (!venue && (isMall ? mallsData.length > 0 : marketsData.length > 0)) return <NotFoundPage />;
  if (!venue) return <LoadingPage message={"Could not be found"} />;

  return (
    <div className="bg-gray-50 pt-16 min-h-screen">
      {/* Fixed Search Bar */}
      <div className="top-14 right-0 left-0 z-20 fixed bg-white shadow-md py-3">
        <div className="mx-auto px-4 container">
          <div className="relative mx-auto w-full max-w-lg">
            <input
              type="text"
              placeholder="Search a product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 pr-4 pl-10 border border-Primary rounded-full focus:outline-none focus:ring-2 focus:ring-Primary w-full text-sm placeholder-gray-400"
            />
            <Search className="top-1/2 left-3 absolute w-5 h-5 text-Primary -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Hero Section with "Not your market?" link */}
      <div className="relative w-full h-[200px] md:h-[200px]">
        <img
          src={venue.displayImage}
          alt={venue.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative flex flex-col justify-center items-center px-4 h-full text-white text-center">
          <h1 className="font-[400] text-3xl sm:text-4xl md:text-6xl lg:text-7xl uppercase leading-tight otto">
            {venue.name}
          </h1>
        </div>
        <Link
          to="/include-market"
          className="right-2 bottom-2 absolute flex items-center gap-1 text-white hover:text-orange text-xs underline transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          Not your {isMall ? "mall's" : "market's"} picture?
        </Link>
      </div>

      {/* Market Details */}
      <div className="bg-white shadow-md">
        <div className="mx-auto container">
          {/* Desktop View */}
          <div className="hidden md:block px-4 py-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-Primary" />
                <span className="text-gray-600">
                  {venue.address}, {venue.city}, {venue.state} State
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowDescription((prev) => !prev)}
                  className="flex items-center gap-2 hover:text-Primary underline transition-colors"
                >
                  <Info className="w-5 h-5 text-Primary" />
                  <span className="text-gray-600">About {venue.name}</span>
                </button>
                {showDescription && (
                  <div className="top-full right-0 z-30 absolute bg-white shadow-lg mt-2 p-4 rounded-lg w-80">
                    <p className="text-gray-600 text-sm">
                      {venue.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-Primary" />
                <span className="text-gray-600">
                  {isMall ? "Shopping Mall" : "Traditional Market"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPinned className="w-5 h-5 text-Primary" />
                <span className="text-gray-600">{venue.state}</span>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-Primary" />
                <span className="text-gray-600 text-sm">
                  {venue.city}, {venue.state}
                </span>
              </div>
              <span className="font-medium text-Primary text-sm">
                {isMall ? "Shopping Mall" : "Traditional Market"}
              </span>
            </div>

            {/* Collapsible Details */}
            <details className="group">
              <summary className="flex justify-between items-center px-4 py-3 cursor-pointer list-none">
                <span className="font-medium text-gray-700">
                  View Market Details
                </span>
                <div className="flex justify-center items-center border-[1.5px] border-gray-500 rounded-full w-4 h-4 group-open:rotate-180 transition-transform">
                  <div className="border-gray-500 border-r-[1.5px] border-b-[1.5px] w-1.5 h-1.5 rotate-45 translate-y-[-2px]"></div>
                </div>
              </summary>
              <div className="space-y-4 px-4 pb-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-700 text-sm">
                    Address
                  </h3>
                  <p className="text-gray-600 text-sm">{venue.address}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-700 text-sm">About</h3>
                  <p className="text-gray-600 text-sm">{venue.description}</p>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 py-8 container">
        <div className="flex lg:flex-row flex-col gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-[280px] shrink-0">
            <div className="top-[72px] sticky bg-white shadow-md p-4 rounded-lg max-h-[calc(100vh-120px)] overflow-y-auto">
              <h2 className="mb-4 font-semibold text-lg">Categories</h2>
              <ul className="space-y-2">
                {MARKET_CATEGORIES.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-gray-700 ${
                        selectedCategory === category
                          ? "bg-Primary text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {category.replace(" AND ", " & ")}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile Categories - Horizontal Scroll */}
          <div className="lg:hidden w-full">
            <div className="relative">
              <div className="overflow-x-auto scrollbar-thin">
                <div className="flex gap-2 pb-4 min-w-max">
                  {MARKET_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                      ${
                        selectedCategory === category
                          ? "bg-Primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {[...Array(8)].map((_, index) => (
                  <ProductCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <MarketProductCard
                    key={product.id}
                    product={product}
                    isBookmarked={bookmarkedProducts.has(product.id)}
                    onBookmarkToggle={handleBookmarkToggle}
                    getAdBadge={getAdBadge}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center px-4 py-12 text-center">
                <div className="relative mb-4">
                  <SearchX className="w-16 h-16 text-orange/55 animate-bounce" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-800 text-xl">
                  No Products Found
                </h3>
                <p className="max-w-md text-gray-600">
                  {searchQuery ? (
                    <>
                      We couldn't find any products matching "{searchQuery}" in
                      the {selectedCategory.toLowerCase()} category. Try
                      adjusting your search or selecting a different category.
                    </>
                  ) : (
                    <>
                      No products available in the{" "}
                      {selectedCategory.toLowerCase()} category. Try selecting a
                      different category.
                    </>
                  )}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:bg-Primary/5 mt-4 px-4 py-2 border-2 border-Primary rounded-full text-Primary text-sm transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
