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

function getPriorityBadgeClasses(priority) {
  switch (priority) {
    case "low":
      return "bg-[#66CED6] text-black";

    case "medium":
      return "bg-[#A7A5C6] text-black";

    case "high":
      return "bg-[#6D8A96] text-white";

    case "critical":
      return "bg-[#5D707F] text-white";

    default:
      return "bg-[#8797B2] text-white";
  }
}

function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [ticketUpdates, setTicketUpdates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTicketId, setUpdatingTicketId] =
    useState(null);
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
      assigned_to: "",
    },
  });

  const loadTickets = useCallback(async () => {
    try {
      setIsLoading(true);
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
        getErrorMessage(
          error,
          "Unable to load tickets from the backend.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

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

  const handleCreateTicket = async (data) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createTicket({
        title: data.title.trim(),
        description: data.description.trim(),
        priority: data.priority,
        assigned_to:
          data.assigned_to.trim() || null,
      });

      reset({
        title: "",
        description: "",
        priority: "medium",
        assigned_to: "",
      });

      setSuccessMessage("Ticket created successfully.");

      await loadTickets();
    } catch (error) {
      console.error("Unable to create ticket:", error);

      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to create the ticket.",
        ),
      );
    }
  };

  const changeTicketField = (
    ticketId,
    fieldName,
    value,
  ) => {
    setTicketUpdates((currentUpdates) => ({
      ...currentUpdates,
      [ticketId]: {
        ...currentUpdates[ticketId],
        [fieldName]: value,
      },
    }));
  };

  const handleUpdateTicket = async (ticketId) => {
    setErrorMessage("");
    setSuccessMessage("");
    setUpdatingTicketId(ticketId);

    try {
      const ticket = tickets.find(
        (currentTicket) =>
          currentTicket.id === ticketId,
      );

      if (!ticket) {
        setErrorMessage("Ticket could not be found.");
        return;
      }

      const updatedStatus =
        ticketUpdates[ticketId]?.status ||
        ticket.status ||
        "open";

      const updatedAssignedTo =
        ticketUpdates[ticketId]?.assigned_to?.trim() ||
        null;

      await updateTicket(ticketId, {
        title: ticket.title,
        description: ticket.description,
        status: updatedStatus,
        priority: ticket.priority || "medium",
        asset_id: ticket.asset_id ?? null,
        assigned_to: updatedAssignedTo,
      });

      setSuccessMessage(
        `Ticket #${ticketId} updated successfully.`,
      );

      await loadTickets();
    } catch (error) {
      console.error("Unable to update ticket:", error);

      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to update the ticket.",
        ),
      );
    } finally {
      setUpdatingTicketId(null);
    }
  };

  return (
    <section className="p-6">
      <div>
        <h1 className="text-3xl font-bold text-black">
          Tickets
        </h1>

        <p className="mt-2 text-[#5D707F]">
          Create, assign, and update help desk tickets.
        </p>
      </div>

      {errorMessage && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="mt-6 rounded-xl border border-[#66CED6]/40 bg-[#66CED6]/15 p-4 text-[#5D707F]">
          {successMessage}
        </p>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <form
          onSubmit={handleSubmit(handleCreateTicket)}
          className="rounded-2xl border border-[#8797B2]/30 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-black">
            Create ticket
          </h2>

          <p className="mt-1 text-sm text-[#6D8A96]">
            Add a new support request for the IT team.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-[#5D707F]"
              >
                Title
              </label>

              <input
                id="title"
                type="text"
                placeholder="Laptop cannot connect"
                className="w-full rounded-lg border border-[#8797B2]/50 px-3 py-2 outline-none focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
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
                className="mb-1 block text-sm font-medium text-[#5D707F]"
              >
                Description
              </label>

              <textarea
                id="description"
                rows="5"
                placeholder="Describe the issue"
                className="w-full resize-none rounded-lg border border-[#8797B2]/50 px-3 py-2 outline-none focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
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
                className="mb-1 block text-sm font-medium text-[#5D707F]"
              >
                Priority
              </label>

              <select
                id="priority"
                className="w-full rounded-lg border border-[#8797B2]/50 px-3 py-2 outline-none focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
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

            <div>
              <label
                htmlFor="assigned_to"
                className="mb-1 block text-sm font-medium text-[#5D707F]"
              >
                Assigned technician
              </label>

              <input
                id="assigned_to"
                type="email"
                placeholder="technician@example.com"
                className="w-full rounded-lg border border-[#8797B2]/50 px-3 py-2 outline-none focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
                {...register("assigned_to", {
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message:
                      "Enter a valid technician email",
                  },
                })}
              />

              {errors.assigned_to && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.assigned_to.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full rounded-lg bg-[#66CED6] px-4 py-3 font-semibold text-black transition-colors duration-200 hover:bg-[#8797B2] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Creating ticket..."
              : "Create ticket"}
          </button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-[#8797B2]/30 bg-white shadow-sm">
          <div className="border-b border-[#8797B2]/30 bg-[#5D707F] px-5 py-4">
            <h2 className="font-semibold text-white">
              Ticket list
            </h2>
          </div>

          {isLoading ? (
            <p className="p-6 text-[#5D707F]">
              Loading tickets...
            </p>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium text-black">
                No tickets found
              </p>

              <p className="mt-1 text-sm text-[#6D8A96]">
                Create the first ticket using the form.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#8797B2]/30">
              {tickets.map((ticket) => {
                const selectedStatus =
                  ticketUpdates[ticket.id]?.status ||
                  ticket.status ||
                  "open";

                const currentStatus =
                  ticket.status || "open";

                const statusChanged =
                  selectedStatus !== currentStatus;

                const selectedAssignedTo =
                  ticketUpdates[ticket.id]
                    ?.assigned_to || "";

                const currentAssignedTo =
                  ticket.assigned_to || "";

                const assignmentChanged =
                  selectedAssignedTo.trim() !==
                  currentAssignedTo.trim();

                const ticketChanged =
                  statusChanged || assignmentChanged;

                return (
                  <article
                    key={ticket.id}
                    className="p-5 transition-colors hover:bg-[#A7A5C6]/10"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-black">
                          #{ticket.id} — {ticket.title}
                        </h3>

                        <p className="mt-1 text-sm text-[#5D707F]">
                          {ticket.description}
                        </p>

                        {ticket.asset_id && (
                          <p className="mt-2 text-xs text-[#6D8A96]">
                            Asset ID: {ticket.asset_id}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-[#6D8A96]">
                          Assigned to:{" "}
                          {ticket.assigned_to ||
                            "Not assigned"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getPriorityBadgeClasses(
                          ticket.priority,
                        )}`}
                      >
                        {ticket.priority || "medium"}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-[180px_1fr_auto]">
                      <div>
                        <label
                          htmlFor={`status-${ticket.id}`}
                          className="mb-1 block text-xs font-medium text-[#5D707F]"
                        >
                          Status
                        </label>

                        <select
                          id={`status-${ticket.id}`}
                          value={selectedStatus}
                          onChange={(event) =>
                            changeTicketField(
                              ticket.id,
                              "status",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-[#8797B2]/50 px-3 py-2 outline-none focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
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
                          className="mb-1 block text-xs font-medium text-[#5D707F]"
                        >
                          Assigned technician
                        </label>

                        <input
                          id={`assigned-${ticket.id}`}
                          type="email"
                          placeholder="technician@example.com"
                          value={selectedAssignedTo}
                          onChange={(event) =>
                            changeTicketField(
                              ticket.id,
                              "assigned_to",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-[#8797B2]/50 px-3 py-2 outline-none focus:border-[#66CED6] focus:ring-2 focus:ring-[#66CED6]/30"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateTicket(ticket.id)
                        }
                        disabled={
                          updatingTicketId === ticket.id ||
                          !ticketChanged
                        }
                        className="self-end rounded-lg bg-[#5D707F] px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-[#66CED6] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {updatingTicketId === ticket.id
                          ? "Saving..."
                          : "Save"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TicketsPage;