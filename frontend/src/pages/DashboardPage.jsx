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

const dashboardCards = [
  {
    key: "total_assets",
    title: "Total assets",
    description: "All registered assets",
    background: "bg-[#5D707F]",
    text: "text-white",
  },
  {
    key: "available_assets",
    title: "Available assets",
    description: "Assets ready for use",
    background: "bg-[#66CED6]",
    text: "text-black",
  },
  {
    key: "assigned_assets",
    title: "Assigned assets",
    description: "Assets currently assigned",
    background: "bg-[#6D8A96]",
    text: "text-white",
  },
  {
    key: "total_tickets",
    title: "Total tickets",
    description: "All help desk tickets",
    background: "bg-[#8797B2]",
    text: "text-white",
  },
  {
    key: "open_tickets",
    title: "Open tickets",
    description: "Tickets requiring attention",
    background: "bg-[#A7A5C6]",
    text: "text-black",
  },
  {
    key: "closed_tickets",
    title: "Closed tickets",
    description: "Completed tickets",
    background: "bg-white",
    text: "text-black",
  },
];

function getErrorMessage(error) {
  const detail = error.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  return "Unable to load dashboard information.";
}

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(
    initialDashboardData,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const result = await getDashboardData();

        setDashboardData({
          ...initialDashboardData,
          ...result,
        });
      } catch (error) {
        console.error("Unable to load dashboard:", error);
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <section className="p-6">
      <div>
        <h1 className="text-3xl font-bold text-black">
          Dashboard
        </h1>

        <p className="mt-2 text-[#5D707F]">
          Overview of assets and help desk tickets.
        </p>
      </div>

      {errorMessage && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </p>
      )}

      {isLoading ? (
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <p className="text-[#5D707F]">
            Loading dashboard...
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardCards.map((card) => (
            <article
              key={card.key}
              className={`${card.background} ${card.text} rounded-2xl border border-black/5 p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md`}
            >
              <p className="text-sm font-semibold opacity-80">
                {card.title}
              </p>

              <p className="mt-3 text-4xl font-bold">
                {dashboardData[card.key]}
              </p>

              <p className="mt-2 text-sm opacity-75">
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