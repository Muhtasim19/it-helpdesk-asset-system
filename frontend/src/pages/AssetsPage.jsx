import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { createAsset, getAssets } from "../services/assets";

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
      setErrorMessage("");

      const result = await getAssets();
      setAssets(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Unable to load assets:", error);

      setErrorMessage(
        error.response?.data?.detail ||
          "Unable to load assets from the backend.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

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
        error.response?.data?.detail ||
          "Unable to add the asset.",
      );
    }
  };

  return (
    <section className="p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Assets
        </h1>

        <p className="mt-2 text-slate-600">
          View and manage company equipment.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-slate-900">
            Add asset
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Asset name
              </label>

              <input
                id="name"
                type="text"
                placeholder="MacBook Pro"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Category
              </label>

              <input
                id="category"
                type="text"
                placeholder="Laptop"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Serial number
              </label>

              <input
                id="serial_number"
                type="text"
                placeholder="MBP-001"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Status
              </label>

              <select
                id="status"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                {...register("status")}
              >
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="assigned_to"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Assigned to
              </label>

              <input
                id="assigned_to"
                type="text"
                placeholder="Employee name or email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                {...register("assigned_to")}
              />
            </div>
          </div>

          {errorMessage && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? "Adding asset..." : "Add asset"}
          </button>
        </form>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Asset list
            </h2>
          </div>

          {isLoading ? (
            <p className="p-6 text-slate-600">
              Loading assets...
            </p>
          ) : assets.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium text-slate-900">
                No assets found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Add the first asset using the form.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Serial number</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Assigned to</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {assets.map((asset) => (
                    <tr key={asset.id ?? asset.serial_number}>
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {asset.name}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {asset.category}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {asset.serial_number}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {asset.status}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
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