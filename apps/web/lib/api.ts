// Abstraction layer over the FastAPI backend.
// All HTTP details, auth header injection, and error normalisation live here.
// Callers only interact with typed async functions — they never touch fetch directly.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface CampaignCreatePayload {
  campaign_name: string;
  product_name: string;
  product_description: string;
  goal: string;
  lead_sources: string[];
  lead_limit: number;
}

export interface CampaignCreateResponse {
  message: string;
  campaign_id: string;
}

export async function createCampaign(
  payload: CampaignCreatePayload
): Promise<CampaignCreateResponse> {
  const res = await fetch(`${API_BASE}/campaign/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? "Failed to create campaign");
  }

  return res.json() as Promise<CampaignCreateResponse>;
}

export async function getCampaigns(): Promise<unknown[]> {
  const res = await fetch(`${API_BASE}/campaign/`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return res.json() as Promise<unknown[]>;
}
