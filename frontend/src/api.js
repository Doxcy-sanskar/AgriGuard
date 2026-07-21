const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("agriguard_token");
}

async function request(path, { method = "GET", body, isForm = false, auth = true } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  sendOtp: (payload) => request("/auth/send-otp", { method: "POST", body: payload, auth: false }),
  verifyOtp: (payload) => request("/auth/verify-otp", { method: "POST", body: payload, auth: false }),

  uploadScan: (formData) => request("/scans", { method: "POST", body: formData, isForm: true }),
  getScans: () => request("/scans"),

  getAdvisory: (status) => request(`/advisory?status=${encodeURIComponent(status)}`),
  getAlerts: () => request("/alerts"),

  getSuppliers: () => request("/market/suppliers"),
  getExperts: () => request("/market/experts"),
};

export function saveSession(token, user) {
  localStorage.setItem("agriguard_token", token);
  localStorage.setItem("agriguard_user", JSON.stringify(user));
}

export function loadSession() {
  const token = getToken();
  const userRaw = localStorage.getItem("agriguard_user");
  if (!token || !userRaw) return null;
  try {
    return { token, user: JSON.parse(userRaw) };
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("agriguard_token");
  localStorage.removeItem("agriguard_user");
}
