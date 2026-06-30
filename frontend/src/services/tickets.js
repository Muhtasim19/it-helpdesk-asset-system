import api from "./api";

export async function getTickets() {
  const response = await api.get("/tickets/");
  return response.data;
}

export async function createTicket(ticketData) {
  const response = await api.post("/tickets/", ticketData);
  return response.data;
}

export async function updateTicket(ticketId, ticketData) {
  const response = await api.put(
    `/tickets/${ticketId}`,
    ticketData,
  );

  return response.data;
}