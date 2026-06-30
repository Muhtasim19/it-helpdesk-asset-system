import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  createTicket,
  getTickets,
  updateTicket,
} from "../services/tickets";

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [ticketUpdates, setTicketUpdates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTicketId, setUpdatingTicketId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  const loadTickets = useCallback(async () => {
    try {
      setErrorMessage("");

      const result = await getTickets();
      const ticketList = Array.isArray(result) ? result : [];

      setTickets(ticketList);

      const initialUpdates = {};

      ticketList.forEach((ticket) => {
        initialUpdates[ticket.id] = {
          status: ticket.status || "open",
          assigned_to: ticket.assigned_to || "",
        };
      });

      setTicketUpdates(initialUpdates);
    } catch (error) {
      console.error("Unable to load tickets:", error);

      setErrorMessage(
        error.response?.data?.detail ||
          "Unable to load tickets from the backend.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleCreateTicket = async (data) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createTicket({
        title: data.title.trim(),
        description: data.description.trim(),
        priority: data.priority,
      });

      reset({
        title: "",
        description: "",
        priority: "medium",
      });

      setSuccessMessage("Ticket created successfully.");
      await loadTickets();
    } catch (error) {
      console.error("Unable to create ticket:", error);

      setErrorMessage(
        error.response?.data?.detail ||
          "Unable to create the ticket.",
      );
    }
  };

  const changeUpdateField = (ticketId, field, value) => {
    setTicketUpdates((currentUpdates) => ({
      ...currentUpdates,
      [ticketId]: {
        ...currentUpdates[ticketId],
        [field]: value,
      },
    }));
  };

  const handleUpdateTicket = async (ticketId) => {
    setErrorMessage("");
    setSuccessMessage("");
    setUpdatingTicketId(ticketId);

    try {
      const updateData = ticketUpdates[ticketId];

      await updateTicket(ticketId, {
        status: updateData.status,
        assigned_to: updateData.assigned_to.trim(),
      });

      setSuccessMessage(`Ticket #${ticketId} updated successfully.`);
      await loadTickets();
    } catch (error) {
      console.error("Unable to update ticket:", error);

      setErrorMessage(
        error.response?.data?.detail ||
          "Unable to update the ticket.",
      );
    } finally {
      setUpdatingTicketId(null);
    }
  };

  return (
    <section className="p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Tickets
        </h1>

        <p className="mt-2 text-slate-600">
          Create, assign, and update help desk tickets.
        </p>
      </div>

      {errorMessage && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="mt-6 rounded-lg bg-green-50 p-4 text-green-700">
          {successMessage}
        </p>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <form
          onSubmit={handleSubmit(handleCreateTicket)}
          className="rounded-xl bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-slate-900">
            Create ticket
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Title
              </label>

              <input
                id="title"
                type="text"
                placeholder="Laptop cannot connect"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                {...register("title", {
                  required: "Ticket title is required",
                })}
              />

              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                rows="5"
                placeholder="Describe the issue"
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2"
                {...register("description", {
                  required: "Description is required",
                })}
              />

              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="priority"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Priority
              </label>

              <select
                id="priority"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                {...register("priority")}
              >
                {priorityOptions.map((priority) => (
                  <option
                    key={priority.value}
                    value={priority.value}
                  >
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? "Creating ticket..." : "Create ticket"}
          </button>
        </form>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Ticket list
            </h2>
          </div>

          {isLoading ? (
            <p className="p-6 text-slate-600">
              Loading tickets...
            </p>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium text-slate-900">
                No tickets found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create the first ticket using the form.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {tickets.map((ticket) => (
                <article key={ticket.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        #{ticket.id} — {ticket.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        {ticket.description}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                      {ticket.priority || "medium"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-[180px_1fr_auto]">
                    <div>
                      <label
                        htmlFor={`status-${ticket.id}`}
                        className="mb-1 block text-xs font-medium text-slate-600"
                      >
                        Status
                      </label>

                      <select
                        id={`status-${ticket.id}`}
                        value={
                          ticketUpdates[ticket.id]?.status ||
                          ticket.status ||
                          "open"
                        }
                        onChange={(event) =>
                          changeUpdateField(
                            ticket.id,
                            "status",
                            event.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      >
                        {statusOptions.map((status) => (
                          <option
                            key={status.value}
                            value={status.value}
                          >
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor={`assigned-${ticket.id}`}
                        className="mb-1 block text-xs font-medium text-slate-600"
                      >
                        Assigned technician
                      </label>

                      <input
                        id={`assigned-${ticket.id}`}
                        type="text"
                        placeholder="technician@example.com"
                        value={
                          ticketUpdates[ticket.id]?.assigned_to || ""
                        }
                        onChange={(event) =>
                          changeUpdateField(
                            ticket.id,
                            "assigned_to",
                            event.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUpdateTicket(ticket.id)}
                      disabled={updatingTicketId === ticket.id}
                      className="self-end rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                      {updatingTicketId === ticket.id
                        ? "Saving..."
                        : "Save"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TicketsPage;