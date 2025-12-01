// "use client";

// import { useEffect, useState } from "react";
// import { getJson, postJson } from "@/lib/api";
// import type { TripDetail } from "@/types";
// import DiscoverTripCard from "@/components/trips/DiscoverTripCard";
// import { useToast } from "@/components/ui/use-toast";

// export default function DiscoverPage() {
//   const [trips, setTrips] = useState<TripDetail[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState<number | null>(null);
//   const [sentIds, setSentIds] = useState<number[]>([]);
//   const { toast } = useToast();

//   // ✅ Fetch discoverable trips
//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await getJson<TripDetail[]>("/api/trips/discover/all");
//         setTrips(data || []);
//       } catch (err) {
//         console.error("Error loading trips:", err);
//         toast({
//           title: "Failed to load trips",
//           description: "Please check your internet or try again later.",
//         });
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [toast]);

//   // ✅ Send join request
//   const sendJoin = async (tripId: number) => {
//     try {
//       setSending(tripId);
//       await postJson(`/api/trips/requests/${tripId}`, {});
//       setSentIds((prev) => [...new Set([...prev, tripId])]);

//       toast({
//         title: "✅ Request Sent",
//         description: "Your join request has been sent successfully!",
//       });
//     } catch (err: any) {
//       console.error(err);
//       toast({
//         title: "❌ Failed to send request",
//         description: err.message || "Something went wrong. Please try again.",
//       });
//     } finally {
//       setSending(null);
//     }
//   };

//   // ✅ Loading / Empty states
//   if (loading)
//     return (
//       <div className="p-6 text-center text-gray-500">Loading trips...</div>
//     );

//   if (!trips.length)
//     return (
//       <div className="p-6 text-center text-gray-500">
//         No trips available for discovery.
//       </div>
//     );

//   // ✅ Main UI
//   return (
//     <div className="max-w-5xl mx-auto p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//       {trips.map((t) => (
//         <DiscoverTripCard
//           key={t.id}
//           trip={t}
//           onRequest={() => sendJoin(t.id)}
//           disabled={sending === t.id}
//           alreadyRequested={sentIds.includes(t.id)}
//         />
//       ))}
//     </div>
//   );
// }
