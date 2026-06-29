```jsx
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
      "rounded-lg px-4 py-3 text-sm font-medium transition",
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    ].join(" ");

  return (
    <div className="min-h-screen bg-slate-100 md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-slate-200 bg-white p-5 md:min-h-screen md:border-b-0 md:border-r">
        <h1 className="text-xl font-bold text-slate-900">
          IT Help Desk
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Asset Management System
        </p>

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
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-sm text-slate-500">Frontend MVP</p>
            <h2 className="font-semibold text-slate-900">
              Help Desk Portal
            </h2>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Log out
          </button>
        </header>

        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
```
