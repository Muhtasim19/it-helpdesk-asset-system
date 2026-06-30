import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { createAsset, getAssets } from "../services/assets";

const statusOptions = [
  "Available",
  "Assigned",
  "Maintenance",
  "Retired",
];

function getErrorMessage(error, fallbackMessage) {
  const detail = error.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item.msg || "Validation error")
      .join(", ");
  }

  return fallbackMessage;
}

function getStatusBadgeClasses(status) {
  switch (status) {
    case "Available":
      return "bg-[#66CED6] text-black";
    case "Assigned":
      return "bg-[#5D707F] text-white";
    case "Maintenance":
      return "bg-[#A7A5C6] text-black";
    case "Retired":
      return "bg-[#8797B2] text-white";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      category: "",
      serial_number: "",
      status: "Available",
      assigned_to: "",
    },
  });

  const loadAssets = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const result = await getAssets();
      setAssets(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Unable to load assets:", error);

      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to load assets from the backend.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    if (!errorMessage && !successMessage) {
      return undefined;
    }

    const messageTimer = window.setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 4000);

    return () => {
      window.clearTimeout(messageTimer);
    };
  }, [errorMessage, successMessage]);

  const onSubmit = async (data) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const newAsset = await createAsset({
        name: data.name.trim(),
        category: data.category.trim(),
        serial_number: data.serial_number.trim(),
        status: data.status,
        assigned_to: data.assigned_to.trim(),
      });

      setAssets((currentAssets) => [...currentAssets, newAsset]);
      setSuccessMessage("Asset added successfully.");

      reset({
        name: "",
        category: "",
        serial_number: "",
        status: "Available",
        assigned_to: "",
      });
    } catch (error) {
      console.error("Unable to create asset:", error);

      setErrorMessage(
        getErrorMessage(error, "Unable to add the asset."),
      );
    }
  };

  return (
    <section className="p-6">
      <div>
        <h1 className="text-3xl font-bold text-black">
          Assets
        </h1>

        <p className="mt-2 text-[#5D707F]">
          View and manage company equipment.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-[#8797B2]/30 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-black">
            Add asset
          </h2>

          <p className="mt-1 text-sm text-[#6D8A96]">
            Register a new company device or equipment item.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-[#5D707F]"
              >
                Asset name
              </label>

              <input
                id="name"
                type="text"
                placeholder="MacBook Pro"
                className="w-full rounded-lg border border-[#8797B2]/50 px-3 py-2 outline-none focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
                {...register("name", {
                  required: "Asset name is required",
                })}
              />

              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-1 block text-sm font-medium text-[#5D707F]"
              >
                Category
              </label>

              <input
                id="category"
                type="text"
                placeholder="Laptop"
                className="w-full rounded-lg border border-[#8797B2]/50 px-3 py-2 outline-none focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
                {...register("category", {
                  required: "Category is required",
                })}
              />

              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="serial_number"
                className="mb-1 block text-sm font-medium text-[#5D707F]"
              >
                Serial number
              </label>

              <input
                id="serial_number"
                type="text"
                placeholder="MBP-001"
                className="w-full rounded-lg border border-[#8797B2]/50 px-3 py-2 outline-none focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
                {...register("serial_number", {
                  required: "Serial number is required",
                })}
              />

              {errors.serial_number && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.serial_number.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-1 block text-sm font-medium text-[#5D707F]"
              >
                Status
              </label>

              <select
                id="status"
                className="w-full rounded-lg border border-[#8797B2]/50 px-3 py-2 outline-none focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
                {...register("status")}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="assigned_to"
                className="mb-1 block text-sm font-medium text-[#5D707F]"
              >
                Assigned to
              </label>

              <input
                id="assigned_to"
                type="text"
                placeholder="Employee name or email"
                className="w-full rounded-lg border border-[#8797B2]/50 px-3 py-2 outline-none focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
                {...register("assigned_to")}
              />
            </div>
          </div>

          {errorMessage && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="mt-4 rounded-lg border border-[#66CED6]/40 bg-[#66CED6]/15 p-3 text-sm text-[#5D707F]">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full rounded-lg bg-[#66CED6] px-4 py-3 font-semibold text-black transition-colors duration-200 hover:bg-[#8797B2] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Adding asset..." : "Add asset"}
          </button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-[#8797B2]/30 bg-white shadow-sm">
          <div className="border-b border-[#8797B2]/30 bg-[#5D707F] px-5 py-4">
            <h2 className="font-semibold text-white">
              Asset list
            </h2>
          </div>

          {isLoading ? (
            <p className="p-6 text-[#5D707F]">
              Loading assets...
            </p>
          ) : assets.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium text-black">
                No assets found
              </p>

              <p className="mt-1 text-sm text-[#6D8A96]">
                Add the first asset using the form.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#A7A5C6]/25 text-[#5D707F]">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Serial number</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Assigned to</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#8797B2]/30">
                  {assets.map((asset) => (
                    <tr
                      key={asset.id ?? asset.serial_number}
                      className="transition-colors hover:bg-[#A7A5C6]/10"
                    >
                      <td className="px-5 py-4 font-semibold text-black">
                        {asset.name}
                      </td>

                      <td className="px-5 py-4 text-[#5D707F]">
                        {asset.category}
                      </td>

                      <td className="px-5 py-4 text-[#5D707F]">
                        {asset.serial_number}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(
                            asset.status,
                          )}`}
                        >
                          {asset.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[#5D707F]">
                        {asset.assigned_to || "Not assigned"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AssetsPage;