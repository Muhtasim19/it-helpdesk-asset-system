import api from "./api";

export async function loginUser({ email, password }) {
  const formData = new URLSearchParams();

  // Backend expects the email under the field name "username"
  formData.append("username", email.trim());
  formData.append("password", password);

  const response = await api.post("/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}

export function saveToken(token) {
  localStorage.setItem("access_token", token);
}