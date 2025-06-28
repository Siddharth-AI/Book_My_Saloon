/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { addToCart } from "../store/slices/cartSlice";
import Image from "next/image";
import LeftPanel from "../components/leftPanel/LeftPanel";
import BookingBottomBar from "./BookingBottomBar";
import { setSelectedSlot } from "../store/slices/uiSlice";

// --- Fly to Cart Animation Helper ---
function flyToCart({
  startRect,
  image,
  onComplete,
}: {
  startRect: DOMRect;
  image: string;
  onComplete?: () => void;
}) {
  const cartIcon = document.getElementById("cart-icon");
  if (!cartIcon) return;

  const endRect = cartIcon.getBoundingClientRect();

  const flyImg = document.createElement("img");
  flyImg.src = image;
  flyImg.style.position = "fixed";
  flyImg.style.zIndex = "9999";
  flyImg.style.left = `${startRect.left}px`;
  flyImg.style.top = `${startRect.top}px`;
  flyImg.style.width = `${startRect.width}px`;
  flyImg.style.height = `${startRect.height}px`;
  flyImg.style.borderRadius = "12px";
  flyImg.style.boxShadow = "0 4px 24px 0 #c59d5f99";
  flyImg.style.transition = "all 0.8s cubic-bezier(.68,-0.55,.27,1.55)";
  document.body.appendChild(flyImg);

  setTimeout(() => {
    flyImg.style.left = `${
      endRect.left + endRect.width / 80 - startRect.width / 80
    }px`;
    flyImg.style.top = `${
      endRect.top + endRect.height / 20 - startRect.height / 20
    }px`;
    flyImg.style.width = "20px";
    flyImg.style.height = "20px";
    flyImg.style.opacity = "0.5";
    flyImg.style.transform = "scale(0.5)";
  }, 10);

  setTimeout(() => {
    document.body.removeChild(flyImg);
    if (onComplete) onComplete();
  }, 850);
}

export default function Services() {
  const dispatch = useAppDispatch();
  const { allServices, loading, error, selectedLocationUuid } = useAppSelector(
    (state) => state.services
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 8;

  // Get unique categories from services
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(allServices.map((service: any) => service.subcategory)),
    ];
    return [
      { name: "All", slug: null },
      ...uniqueCategories.map((cat) => ({ name: cat, slug: cat })),
    ];
  }, [allServices]);

  // Get price range from services
  const { minPrice, maxPrice } = useMemo(() => {
    if (allServices.length === 0) return { minPrice: 0, maxPrice: 1000 };
    const prices = allServices.map((s: any) => s.price);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [allServices]);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  useEffect(() => {
    dispatch(setSelectedSlot(""));
  }, [dispatch]);

  const filteredProducts = allServices.filter((service: any) => {
    return (
      (!selectedCategory || service.subcategory === selectedCategory) &&
      (service.service.toLowerCase().includes(search.toLowerCase()) ||
        (service.subcategory || "")
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      service.price >= priceRange[0] &&
      service.price <= priceRange[1]
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / servicesPerPage);
  const showLoadMore =
    filteredProducts.length <= 20 && visibleProducts < filteredProducts.length;
  const showPagination = filteredProducts.length > 20;

  // Calculate displayed services based on pagination or load more
  const displayedServices = showPagination
    ? filteredProducts.slice(
        (currentPage - 1) * servicesPerPage,
        currentPage * servicesPerPage
      )
    : filteredProducts.slice(0, visibleProducts);

  // Update price range when services change
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setVisibleProducts(8);
    setCurrentPage(1);
  }, [selectedCategory, search, priceRange]);

  // (Removed redundant useEffect for setCurrentPage)

  const handleRange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = Number(e.target.value);
    setPriceRange((prev) =>
      idx === 0 ? [val, Math.max(val, prev[1])] : [Math.min(val, prev[0]), val]
    );
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Add to Cart with Animation ---
  const handleAdd = (service: any, e: React.MouseEvent<HTMLButtonElement>) => {
    // Find the closest card image or button for animation start
    const card = (e.target as HTMLElement).closest(".service-card-animate");
    if (card) {
      const img = card.querySelector("img") as HTMLImageElement;
      if (img) {
        const rect = img.getBoundingClientRect();
        flyToCart({
          startRect: rect,
          image: img.src || "/images/services1.jpg",
        });
      } else {
        // fallback: use button position
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        flyToCart({
          startRect: rect,
          image: "/images/services1.jpg",
        });
      }
    }

    // Add to cart logic (untouched)
    dispatch(
      addToCart({
        id: service.id,
        name: service.service,
        duration: Number.parseInt(service.service_time),
        price: service.price,
        category: service.subcategory,
        tags: [service.subcategory],
        vendor_location_uuid: selectedLocationUuid,
      })
    );
  };

  const handleLoadMore = () => {
    setVisibleProducts(filteredProducts.length); // Show all remaining services
  };

  return (
    <div className="min-h-screen bg-white/10 text-gray-200">
      {/* Header */}
      <div
        className="w-full bg-[#2d2d2d] py-28 pl-11 pt-32 relative"
        style={{
          backgroundImage: "url('/images/service/service.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom 90px",
          backgroundAttachment: "fixed",

          zIndex: 0,
        }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl pt-10 font-bold tracking-wide text-white drop-shadow-lg">
            SERVICES LIST
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedLocationUuid || loading ? (
          <div className="text-center py-12">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c59d5f]"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600">Error: {error}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 md:flex-row md:gap-14">
            {/* Sidebar */}
            <aside className="w-full md:w-[350px]">
              {/* Search */}
              <div className="pb-4 border-b-1 border-[#c59c5f4d]">
                <form
                  className="flex border border-white/20 rounded overflow-hidden bg-white/10"
                  onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="search"
                    className="flex-1 px-3 py-2 outline-none bg-transparent text-white placeholder:text-gray-400"
                    placeholder="Type to search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#c59d5f] text-black hover:bg-[#f4d03f] transition">
                    <span className="sr-only">Search</span>🔍
                  </button>
                </form>
              </div>
              {/* Categories */}
              <div className="my-4">
                <h2 className="font-bold mb-2 text-white">CATEGORIES</h2>
                <ul className="space-y-1 max-h-70 overflow-y-auto scrollbar-thin scrollbar-thumb-[#c59d5f] scrollbar-track-gray-100 pr-2 categories_scroll">
                  {categories.map((cat) => (
                    <li
                      key={
                        cat.slug !== null && cat.slug !== undefined
                          ? String(cat.slug)
                          : "all"
                      }>
                      <button
                        className={`text-left w-full px-2 py-1 rounded transition font-medium ${
                          selectedCategory === cat.slug
                            ? "bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black shadow"
                            : "bg-transparent text-gray-300 hover:bg-[#c59d5f]/10 hover:text-[#c59d5f]"
                        }`}
                        onClick={() =>
                          setSelectedCategory(cat.slug as string | null)
                        }>
                        {String(cat.name)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range Filter */}
              <div className="py-4 border-y-1 border-[#c59c5f4d]">
                <h2 className="font-bold mb-2 text-white">PRICE RANGE</h2>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) => handleRange(e, 0)}
                    className="w-full accent-[#c59d5f]"
                  />
                  <span className="text-xs text-[#c59d5f] font-bold">
                    ₹{priceRange[0]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => handleRange(e, 1)}
                    className="w-full accent-[#c59d5f]"
                  />
                  <span className="text-xs text-[#c59d5f] font-bold">
                    ₹{priceRange[1]}
                  </span>
                </div>
              </div>
              <div className="sticky top-0 hidden md:block mt-3">
                <LeftPanel content={"summary"} />
              </div>

              <div className="hidden md:block">
                {/* Promo */}
                <div className="bg-gradient-to-r from-[#c59d5f]/80 to-[#f4d03f]/80 rounded-lg p-4 text-center mt-6 shadow-lg">
                  <div className="text-lg font-bold mb-2 text-black">
                    Try it
                  </div>
                  <div className="text-2xl font-extrabold text-black">
                    20% OFF{" "}
                    <span className="text-xs font-normal">SERVICES</span>
                  </div>
                </div>
                {/* Follow */}
                <div className="mt-6">
                  <h2 className="font-bold mb-2 text-white">FOLLOW</h2>
                  <div className="flex gap-3 text-xl">
                    <a
                      href="#"
                      className="hover:text-[#c59d5f]/80 text-gray-400">
                      F
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex flex-col">
              {/* Service Cards */}
              <div className="bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 rounded-lg px-4 py-2 shadow font-semibold text-lg mb-2 text-white border border-white/10">
                We are providing a total of{" "}
                <span className="text-[#c59d5f] ml-1">
                  {filteredProducts.length}
                </span>{" "}
                services.
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayedServices.map((service: any) => (
                  <div
                    key={service.id}
                    className="service-card-animate flex flex-col justify-between border border-white/10 p-5 rounded-2xl shadow-xl hover:shadow-[#c59d5f]/40 transition bg-gradient-to-br from-[#232526]/80 via-[#414345]/90 to-[#c59d5f]/10 relative overflow-hidden"
                    style={{
                      backdropFilter: "blur(12px)",
                    }}>
                    <div className="flex gap-3 justify-between">
                      <Image
                        src={
                          service.image || "/images/service/servicesPic.webp"
                        }
                        alt={service.service}
                        width={152}
                        height={208}
                        className="w-38 h-52 object-cover rounded-2xl mb-3 shadow-md transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="mb-4">
                        <div>
                          <div className="font-semibold text-lg text-white mb-2 text-right">
                            {service.service.slice(0, 29)}
                          </div>
                          <div className="text-sm text-gray-400 mb-2 text-right">
                            {service.subcategory}
                          </div>
                          <div className="flex items-center justify-end text-gray-400 text-sm mb-2">
                            <span>🕒 {service.service_time} min</span>
                          </div>
                        </div>
                        <div className="font-semibold text-[#c59d5f] text-lg  text-right">
                          ₹ {service.price.toFixed(2)}
                        </div>
                        <div className="flex justify-end">
                          <button
                            className="w-[100px] py-2 mt-3 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black rounded-xl font-bold shadow hover:scale-105 hover:shadow-[#c59d5f]/40 transition-all duration-200"
                            onClick={(e) => handleAdd(service, e)}>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination or Load More */}
              {showPagination ? (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${
                      currentPage === 1
                        ? "bg-gray-300 text-gray-500"
                        : "bg-[#c59d5f] text-white hover:bg-[#f4d03f]"
                    }`}>
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded ${
                            currentPage === page
                              ? "bg-[#c59d5f] text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-[#c59d5f]/20"
                          }`}>
                          {page}
                        </button>
                      </React.Fragment>
                    ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${
                      currentPage === totalPages
                        ? "bg-gray-300 text-gray-500"
                        : "bg-[#c59d5f] text-white hover:bg-[#f4d03f]"
                    }`}>
                    Next
                  </button>
                </div>
              ) : showLoadMore ? (
                <div className="mt-8 flex justify-center mb-4 md:mb-0">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-3 rounded bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black font-bold shadow hover:scale-105 hover:shadow-[#c59d5f]/40 transition-all duration-200">
                    Load More
                  </button>
                </div>
              ) : null}

              <div className="md:hidden border-t-1 border-[#c59c5f4d] ">
                {/* Promo */}
                <div className="bg-gradient-to-r from-[#c59d5f]/80 to-[#f4d03f]/80 rounded-lg p-4 text-center mt-6 shadow-lg">
                  <div className="text-lg font-bold mb-2 text-black">
                    Try it
                  </div>
                  <div className="text-2xl font-extrabold text-black">
                    20% OFF{" "}
                    <span className="text-xs font-normal">SERVICES</span>
                  </div>
                </div>
                {/* Follow */}
                <div className="mt-6">
                  <h2 className="font-bold mb-2 text-white">FOLLOW</h2>
                  <div className="flex gap-3 text-xl">
                    <a
                      href="#"
                      className="hover:text-[#c59d5f]/80 text-gray-400">
                      F
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <BookingBottomBar />
    </div>
  );
}
