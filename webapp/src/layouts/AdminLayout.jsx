import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminMobileNav from "../components/admin/AdminMobileNav";
import AdminHeader from "../components/admin/AdminHeader";
import PersonalSettings from "../components/settings/PersonalSettings";

import { X } from "lucide-react";

const AdminLayout = () => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("✅ [AdminLayout] Component mounted.");

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const currentScrollY = container.scrollTop;
      // Hide header on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-base-200">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div
          className={`absolute top-0 left-0 right-0 z-20 transition-transform duration-300 ${
            isHeaderVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <AdminHeader setIsModalOpen={setIsModalOpen} />
        </div>

        {/* The pt-16 here is key. It adds top padding equal to the header's height (4rem). */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-x-hidden overflow-y-auto p-3 pt-19 pb-19 md:p-3 md:pt-19 md:pb-19"
        >
          <Outlet />
        </div>

        {/* Bottom Navigation for Mobile */}
        <AdminMobileNav />
      </main>

      {/* User Settings Modal - Placed here to avoid stacking context issues */}
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <button
            onClick={() => setIsModalOpen(false)}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            <X />
          </button>
          <PersonalSettings />
        </div>
        <form
          method="dialog"
          className="modal-backdrop"
          onClick={() => setIsModalOpen(false)}
        >
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default AdminLayout;
