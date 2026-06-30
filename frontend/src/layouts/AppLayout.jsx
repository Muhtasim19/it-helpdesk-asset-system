import { NavLink, Outlet, useNavigate } from "react-router";

const navigationLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Assets", path: "/assets" },
  { name: "Tickets", path: "/tickets" },
];

function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const getLinkClasses = ({ isActive }) =>
    [
      "rounded-lg px-4 py-3 text-sm font-semibold transition-colors duration-200",
      isActive
        ? "bg-[#66CED6] text-black shadow-sm"
        : "text-white hover:bg-[#6D8A96]",
    ].join(" ");

  return (
    <div className="min-h-screen bg-[#F7F8FA] md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-[#6D8A96] bg-[#5D707F] p-5 text-white md:min-h-screen md:border-b-0 md:border-r">
        <div>
          <h1 className="text-xl font-bold text-white">
            IT Help Desk
          </h1>

          <p className="mt-1 text-sm text-white/75">
            Asset Management System
          </p>
        </div>

        <nav className="mt-6 flex gap-2 overflow-x-auto md:flex-col">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={getLinkClasses}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-[#8797B2]/40 bg-white px-6 py-4 shadow-sm">
          <div>
            <p className="text-sm font-medium text-[#6D8A96]">
              Frontend MVP
            </p>

            <h2 className="font-semibold text-black">
              Help Desk Portal
            </h2>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-[#66CED6] px-4 py-2 text-sm font-semibold text-black transition-colors duration-200 hover:bg-[#8797B2] hover:text-white"
          >
            Log out
          </button>
        </header>

        <div className="flex min-h-[calc(100vh-73px)] flex-col">
          <main className="flex-1">
            <Outlet />
          </main>

          <footer className="border-t border-[#8797B2]/30 bg-white px-6 py-4 text-center text-sm text-[#5D707F]">
            © 2026 IT Help Desk. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;