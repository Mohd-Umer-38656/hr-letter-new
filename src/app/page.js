"use client"; // Enables client-side rendering in Next.js

import { useState } from "react"; // Importing useState hook for state management
import Sidebar from "./components/sidebar/Sidebar"; // Importing Sidebar component

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importing FontAwesomeIcon for icons
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons"; // Importing specific icons (hamburger menu and close icon)
import Template from "./template/page";




export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to toggle sidebar visibility

  return (
    <div className="flex h-auto"> {/* Main container with full-screen height */}

      {/* Mobile Sidebar Toggle Button */}
      <button
        className="absolute top-18 left-4 md:hidden p-2 bg-gray-800 text-white rounded-md z-50"
        onClick={() => setSidebarOpen(true)} // Opens sidebar when clicked
      >
        <FontAwesomeIcon icon={faBars} size="lg" /> {/* Hamburger icon for opening sidebar */}
      </button>

      {/* Sidebar - Shows as a drawer in mobile */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-100 border-r border-gray-300 p-4 z-40 transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:w-1/5`}
      >
        {/* Close Button for Mobile */}
        <button
          className="absolute top-4 right-4 md:hidden text-black"
          onClick={() => setSidebarOpen(false)} // Closes sidebar when clicked
        >
          <FontAwesomeIcon icon={faTimes} size="lg" /> {/* Close icon */}
        </button>
        <Sidebar /> {/* Rendering Sidebar component */}
      </div>

      {/* Overlay when sidebar opens on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)} // Clicking outside closes the sidebar
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4">
       <Template /> {/* Rendering Template component */}
       {/* Rendering Dashboard component */}
      </div>
      {/* Toast notifications container */}
    </div>
  );
}
