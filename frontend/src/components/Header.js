import React, { useState, useEffect } from "react";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const displayName = user?.name || user?.username || "Dharshini";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <header className="bg-[#1e293b] px-6 py-3 flex justify-between items-center border-b border-white/10 flex-shrink-0">
      {/* Left: greeting + date */}
      <div className="flex flex-col">
        <h1 className="text-sm font-semibold text-slate-100 leading-tight">
          {greeting()}, <span className="text-amber-400">{displayName}!</span>
        </h1>
        <p className="text-[11px] text-slate-500 mt-0.5">{formattedDate}</p>
      </div>

      {/* Right: actions + avatar */}
      <div className="flex items-center gap-3">
        {/* Live indicator */}
        {/* <div className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-semibold text-slate-400">Live</span>
                </div> */}

        {/* Notification bell */}
        {/* <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors">
                    <i className="fa-regular fa-bell text-sm" />
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-400 rounded-full text-[8px] font-extrabold text-amber-900 flex items-center justify-center">
                        3
                    </span>
                </button> */}

        {/* Toggle theme */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="hidden sm:flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold py-1.5 px-3 rounded-lg text-xs hover:bg-amber-500/20 transition-colors"
        >
          <i
            className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"} text-xs`}
          />
          {darkMode ? "Light" : "Dark"}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* Avatar + name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-xs font-extrabold text-amber-400 flex-shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-200 leading-tight">
              {displayName}
            </p>
            <p className="text-[10px] text-slate-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
