"use client";

import { useEffect, useState } from "react";
import { getJson, apiFetch } from "@/lib/api";
import type { TripJoinRequestDTO } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast"; // ✅ assuming your toast is here
import Image from "next/image";
import { Check, X } from "lucide-react";

export default function JoinRequests() {
  const [requests, setRequests] = useState<TripJoinRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch incoming requests from backend
  const loadRequests = async () => {
    try {
      const data = await getJson<TripJoinRequestDTO[]>(
        "/api/trips/requests/incoming"
      );
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // ✅ Handle Accept/Reject
  const handleAction = async (id: number, action: "accept" | "reject") => {
    try {
      await apiFetch(`/api/trips/requests/${id}/${action}`, {
        method: "PUT",
      });
      toast({
        title: `Request ${action === "accept" ? "Accepted ✅" : "Rejected ❌"}`,
        description: `The trip join request has been ${
          action === "accept" ? "approved" : "declined"
        }.`,
      });

      // Instantly update UI (no need for double refresh)
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      toast({
        title: "Error ⚠️",
        description: `Failed to ${action} request.`,
      });
      console.error(err);
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-400">Loading join requests...</p>
    );

  if (!requests.length)
    return (
      <p className="text-center text-gray-400">
        No pending join requests right now.
      </p>
    );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Join Requests</h2>

      {requests.map((req) => (
        <Card
          key={req.id}
          className="p-4 flex items-center justify-between bg-white/5 hover:bg-white/10 transition rounded-xl"
        >
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10">
              <Image
                src={
                  req.sender.photoUrl
                    ? req.sender.photoUrl.startsWith("http")
                      ? req.sender.photoUrl
                      : `${process.env.NEXT_PUBLIC_API_BASE_URL}${req.sender.photoUrl}`
                    : "/default-avatar.png"
                }
                alt={req.sender.name || "User"}
                fill
                className="rounded-full object-cover border border-gray-600"
              />
            </div>
            <div>
              <p className="font-medium text-white">
                {req.sender.name || req.sender.email.split("@")[0]}
              </p>
              <p className="text-sm text-gray-400">
                requested to join{" "}
                <span className="font-semibold">{req.trip.title}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleAction(req.id, "accept")}
            >
              <Check className="w-4 h-4 mr-1" /> Accept
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => handleAction(req.id, "reject")}
            >
              <X className="w-4 h-4 mr-1" /> Reject
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
