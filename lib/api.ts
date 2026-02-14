"use client";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("vtu_token") : null;

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Request failed: ${response.status}`);
    }

    return response.json();
}

export const api = {
    get: (endpoint: string, options?: RequestInit) => apiRequest(endpoint, { ...options, method: "GET" }),
    post: (endpoint: string, data?: any, options?: RequestInit) =>
        apiRequest(endpoint, { ...options, method: "POST", body: JSON.stringify(data) }),
    put: (endpoint: string, data?: any, options?: RequestInit) =>
        apiRequest(endpoint, { ...options, method: "PUT", body: JSON.stringify(data) }),
    delete: (endpoint: string, options?: RequestInit) => apiRequest(endpoint, { ...options, method: "DELETE" }),
};
