import { useEffect, useState } from "react";

import { getDashboardData } from "../services/dashboard";

const initialDashboardData = {
  total_assets: 0,
  available_assets: 0,
  assigned_assets: 0,
  total_tickets: 0,
  open_tickets: 0,
  closed_tickets: 0,
};

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(
    initialDashboardData,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setErrorMessage("");

        const result = await getDashboardData();

        setDashboardData({
          ...initialDashboardData,
          ...result,
        });
      } catch (error) {
        console.error("Unable to load dashboard:", error);

        setErrorMessage(
          error.response?.data?.detail ||
            "Unable to load dashboard information.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const dashboardCards = [
    {
      title: "Total assets",
      value: dashboardData.total_assets,
      description: "All registered assets",
    },
    {
      title: "Available assets",
      value: dashboardData.available_assets,
      description: "Assets ready for use",
    },
    {
      title: "Assigned assets",
      value: dashboardData.assigned_assets,
      description: "Assets currently assigned",
    },
    {
      title: "Total tickets",
      value: dashboardData.total_tickets,
      description: "All help desk tickets",
    },
    {
      title: "Open tickets",
      value: dashboardData.open_tickets,
      description: "Tickets requiring attention",
    },
    {
      title: "Closed tickets",
      value: dashboardData.closed_tickets,
      description: "Completed tickets",
    },
  ];

  return (
    <section className="p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Overview of assets and help desk tickets.
        </p>
      </div>

      {errorMessage && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          {errorMessage}
        </p>
      )}

      {isLoading ? (
        <p className="mt-6 text-slate-600">
          Loading dashboard...
        </p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardCards.map((card) => (
            <article
              key={card.title}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">
                {card.title}
              </p>

              <p className="mt-3 text-4xl font-bold text-slate-900">
                {card.value}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default DashboardPage;