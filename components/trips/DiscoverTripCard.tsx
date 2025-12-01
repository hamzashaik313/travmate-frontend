"use client";

import type { TripDetail } from "@/types";

export default function DiscoverTripCard({
  trip,
  onRequest,
  disabled,
  alreadyRequested,
}: {
  trip: TripDetail;
  onRequest: () => void;
  disabled?: boolean;
  alreadyRequested?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-white/60 backdrop-blur p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{trip.title}</h3>
        <span className="text-xs px-2 py-1 rounded-full border">
          {trip.visibility}
        </span>
      </div>

      <div className="text-sm opacity-80">
        {trip.destination} — {trip.startDate} → {trip.endDate}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          Max members: <b>{trip.maxMembers}</b>
        </div>
        {trip.budget != null && (
          <div>
            Budget: <b>{trip.budget}</b>
          </div>
        )}
      </div>

      <button
        onClick={onRequest}
        disabled={disabled || alreadyRequested}
        className={`mt-2 w-full px-3 py-2 rounded-xl border hover:shadow disabled:opacity-50`}
      >
        {alreadyRequested
          ? "Request Sent"
          : disabled
          ? "Sending..."
          : "Request to Join"}
      </button>
    </div>
  );
}
