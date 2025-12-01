// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { getJson } from "@/lib/api";
// import { TripHero } from "@/components/trips/trip-hero";
// import { ItineraryPanel } from "@/components/trips/itinerary-panel";
// import { TripSummary } from "@/components/trips/trip-summary";

// import type { TripDetail } from "@/types/TripDetail";

// export default function TripDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [trip, setTrip] = useState<TripDetail | null>(null);
//   const [loading, setLoading] = useState(true);

//   const loadTrip = async () => {
//     try {
//       const data = await getJson<TripDetail>(`/api/trips/${id}`);
//       setTrip(data);
//     } catch (e) {
//       console.error(e);
//       router.push("/dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTrip();
//   }, [id]);

//   if (loading) return <div className="p-10 text-center">Loading…</div>;
//   if (!trip) return <div className="p-10 text-center">Trip not found</div>;

//   return (
//     <div className="max-w-5xl mx-auto p-4 space-y-6">
//       {/* HERO COMPONENT */}
//       <TripHero
//         destination={trip.destination}
//         title={trip.title}
//         startDate={trip.startDate}
//         endDate={trip.endDate}
//       />

//       {/* SUMMARY BAR */}
//       <TripSummary trip={trip} onChanged={loadTrip} />

//       {/* ITINERARY */}
//       <ItineraryPanel tripId={trip.id} />
//     </div>
//   );
// }

// //app/trips/[id]/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { getJson } from "@/lib/api";
// import { TripHero } from "@/components/trips/trip-hero";
// import { ItineraryPanel } from "@/components/trips/itinerary-panel";
// import { TripSummary } from "@/components/trips/trip-summary";
// import { GlassPanel } from "@/components/ui/glass-panel";

// import type { TripDetail } from "@/types/TripDetail";

// export default function TripDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [trip, setTrip] = useState<TripDetail | null>(null);
//   const [loading, setLoading] = useState(true);

//   const loadTrip = async () => {
//     try {
//       const data = await getJson<TripDetail>(`/api/trips/${id}`);
//       setTrip(data);
//     } catch {
//       router.push("/dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTrip();
//   }, [id]);

//   if (loading) return <div className="p-10 text-center">Loading…</div>;
//   if (!trip) return <div className="p-10 text-center">Trip not found</div>;

//   return (
//     <div className="max-w-5xl mx-auto p-4 space-y-10">
//       {/* HERO */}
//       <TripHero
//         destination={trip.destination}
//         title={trip.title}
//         startDate={trip.startDate}
//         endDate={trip.endDate}
//       />

//       {/* SUMMARY IN GLASS PANEL */}
//       <GlassPanel>
//         <TripSummary trip={trip} onChanged={loadTrip} />
//       </GlassPanel>

//       {/* ITINERARY IN GLASS PANEL */}
//       <GlassPanel>
//         <ItineraryPanel tripId={trip.id} />
//       </GlassPanel>
//     </div>
//   );
// }

// app/trips/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getJson } from "@/lib/api";
import { TripHero } from "@/components/trips/trip-hero";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ItineraryPanel } from "@/components/trips/itinerary-panel";
import { TripSummary } from "@/components/trips/trip-summary";
import JoinTripButton from "@/components/trips/JoinRequestsSection";
import { useAuth } from "@/components/auth/auth-context";
import type { TripDetail } from "@/types";

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTrip = async () => {
    try {
      const data = await getJson<TripDetail>(`/api/trips/${id}`);
      setTrip(data);
    } catch {
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading…</div>;
  if (!trip) return <div className="p-10 text-center">Trip not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-10">
      {/* HERO */}
      <TripHero
        destination={trip.destination}
        title={trip.title}
        startDate={trip.startDate}
        endDate={trip.endDate}
      />

      {/* OWNER */}
      <div className="text-center text-gray-600 text-sm">
        Organized by{" "}
        <span className="font-semibold text-gray-800">
          {trip.ownerName || "Unknown"}
        </span>
      </div>

      {/* SHOW JOIN BUTTON ONLY IF USER IS NOT OWNER */}
      {user?.name !== trip.ownerName && (
        <div className="flex justify-center">
          <JoinTripButton tripId={trip.id.toString()} />
        </div>
      )}

      {/* SUMMARY PANEL */}
      <GlassPanel>
        <TripSummary trip={trip} onChanged={loadTrip} />
      </GlassPanel>

      {/* ITINERARY PANEL */}
      <GlassPanel>
        <ItineraryPanel tripId={trip.id.toString()} />
      </GlassPanel>
    </div>
  );
}
