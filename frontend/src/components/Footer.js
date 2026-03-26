import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white">
      {/* Amber accent line matching the nav */}
      <div className="h-0.5 w-full bg-amber-400 opacity-60" />

      <div className="px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-slate-100">
            Stock<span className="text-amber-400">Flow</span>
          </span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-500 text-xs hidden sm:inline">
            Inventory & Logistics Management
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-1 flex-wrap justify-center">
          {["About Us", "Contact Us", "Terms of Service", "Privacy Policy"].map(
            (link, i, arr) => (
              <React.Fragment key={link}>
                <a
                  href="/"
                  className="text-slate-400 hover:text-amber-400 text-xs font-medium px-3 py-1 rounded-md hover:bg-white/5 transition-colors"
                >
                  {link}
                </a>
                {i < arr.length - 1 && (
                  <span className="text-slate-700 text-xs select-none">·</span>
                )}
              </React.Fragment>
            ),
          )}
        </nav>

        {/* Copyright */}
        <p className="text-slate-600 text-xs whitespace-nowrap">
          &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
