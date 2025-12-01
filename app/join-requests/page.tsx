"use client";

import useSWR from "swr";
import { swrFetcher, API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";

export default function JoinRequestsPage() {
  const { token } = useAuth();
  const { data, mutate } = useSWR(
    `${API_BASE}/api/join-requests/received`,
    swrFetcher
  );

  async function handleAction(id: number, action: "accept" | "reject") {
    await fetch(`${API_BASE}/api/join-requests/${id}/${action}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    mutate(); // Refresh after action
  }

  if (!data)
    return <p className="text-center text-gray-500 mt-6">Loading...</p>;
  if (data.length === 0)
    return (
      <p className="text-center text-gray-500 mt-6">No join requests yet.</p>
    );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Join Requests</h1>
      <div className="space-y-4">
        {data.map((req: any) => (
          <div
            key={req.id}
            className="bg-white/30 backdrop-blur-lg border border-white/40 shadow-lg rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-900">
                {req.sender?.name || "Unknown User"} wants to join{" "}
                <span className="text-blue-700 font-semibold">
                  {req.trip?.title}
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-1">Status: {req.status}</p>
            </div>

            {req.status === "PENDING" && (
              <div className="flex gap-3">
                <Button
                  onClick={() => handleAction(req.id, "accept")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => handleAction(req.id, "reject")}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
