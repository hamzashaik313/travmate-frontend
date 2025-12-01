// app/requests/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getJson, putJson } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { TripJoinRequestDTO } from "@/types";

export default function RequestsPage() {
  const { toast } = useToast();
  const [incoming, setIncoming] = useState<TripJoinRequestDTO[]>([]);
  const [sent, setSent] = useState<TripJoinRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const [inc, snt] = await Promise.all([
        getJson<TripJoinRequestDTO[]>("/api/trips/requests/incoming"),
        getJson<TripJoinRequestDTO[]>("/api/trips/requests/sent"),
      ]);
      setIncoming(inc);
      setSent(snt);
    } catch (e) {
      toast({ title: "Failed to load requests", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id: number, action: "accept" | "reject") => {
    try {
      await putJson(`/api/trips/requests/${id}/${action}`, {});
      toast({ title: `Request ${action}ed ✅` });
      loadRequests();
    } catch {
      toast({ title: `Failed to ${action}`, variant: "destructive" });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold text-center">Join Requests</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">Incoming Requests</h2>
        {incoming.length === 0 ? (
          <p className="text-gray-500">No incoming requests</p>
        ) : (
          incoming.map((req) => (
            <Card key={req.id} className="p-4 mb-3 flex justify-between">
              <div>
                <p>
                  <b>{req.sender.name}</b> wants to join <b>{req.trip.title}</b>
                </p>
                <p className="text-sm text-gray-500">{req.sender.email}</p>
              </div>
              <div className="space-x-2">
                <Button onClick={() => handleAction(req.id, "accept")}>
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleAction(req.id, "reject")}
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Sent Requests</h2>
        {sent.length === 0 ? (
          <p className="text-gray-500">No sent requests</p>
        ) : (
          sent.map((req) => (
            <Card key={req.id} className="p-4 mb-3">
              <div className="flex justify-between">
                <div>
                  <p>
                    You requested to join <b>{req.trip.title}</b>
                  </p>
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    <span
                      className={
                        req.status === "ACCEPTED"
                          ? "text-green-600"
                          : req.status === "REJECTED"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }
                    >
                      {req.status}
                    </span>
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
