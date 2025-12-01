// "use client";

// import { useEffect, useState } from "react";
// import { getJson, postJson } from "@/lib/api";
// import type { TripDetail } from "@/types";
// import { useToast } from "@/components/ui/use-toast";
// import Link from "next/link";

// export default function MatchesPage() {
//   const [trips, setTrips] = useState<TripDetail[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState<number | null>(null);
//   const [sentIds, setSentIds] = useState<number[]>([]);
//   const { toast } = useToast();

//   // ✅ Load matching trips
//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await getJson<TripDetail[]>("/api/trips/matches/auto");
//         setTrips(data || []);
//       } catch (err) {
//         console.error("Error fetching matches:", err);
//         toast({
//           title: "⚠️ Failed to load matches",
//           description: "Please try again later.",
//         });
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [toast]);

//   // ✅ Send join request with toast feedback
//   const sendJoinRequest = async (tripId: number) => {
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
//         description:
//           err.message || "Something went wrong while sending the request.",
//       });
//     } finally {
//       setSending(null);
//     }
//   };

//   // ✅ Loading and empty states
//   if (loading)
//     return (
//       <div className="p-6 text-center text-gray-500">
//         Finding matching trips...
//       </div>
//     );

//   if (!trips.length)
//     return (
//       <div className="p-6 text-center text-gray-500">
//         No overlapping trips found yet.
//       </div>
//     );

//   // ✅ Main UI
//   return (
//     <div className="max-w-5xl mx-auto px-4 py-10">
//       <h1 className="text-2xl font-semibold mb-6 text-center">
//         🔍 Matching Trips
//       </h1>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {trips.map((trip) => (
//           <div
//             key={trip.id}
//             className="border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm bg-white/5 backdrop-blur-sm"
//           >
//             <div className="flex flex-col gap-2 mb-3">
//               <p className="text-sm text-gray-500">
//                 <Link
//                   href={`/profile/${trip.ownerId ?? "unknown"}`}
//                   className="text-blue-500 hover:underline"
//                 >
//                   View Profile →
//                 </Link>
//               </p>

//               <h2 className="text-lg font-semibold capitalize">
//                 {trip.destination}
//               </h2>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 {trip.startDate} → {trip.endDate}
//               </p>
//               <p className="text-sm">
//                 Organized by{" "}
//                 <span className="font-medium">
//                   {trip.ownerName || "Unknown"}
//                 </span>
//               </p>
//             </div>

//             {/* ✅ Join button */}
//             <button
//               onClick={() => sendJoinRequest(trip.id)}
//               disabled={sending === trip.id || sentIds.includes(trip.id)}
//               className={`w-full py-2 rounded-lg font-medium transition ${
//                 sentIds.includes(trip.id)
//                   ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700 text-white"
//               }`}
//             >
//               {sentIds.includes(trip.id)
//                 ? "Request Sent"
//                 : sending === trip.id
//                 ? "Sending..."
//                 : "Request to Join"}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { getJson, postJson } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import type { TripDetail } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MatchesPage() {
  const [matches, setMatches] = useState<TripDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<number | null>(null);
  const [sentIds, setSentIds] = useState<number[]>([]);

  // ✅ Fetch auto-matched trips
  useEffect(() => {
    (async () => {
      try {
        const data = await getJson<TripDetail[]>("/api/trips/matches/auto");
        setMatches(data || []);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error loading matches",
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Send Join Request
  const handleJoin = async (tripId: number) => {
    try {
      setSending(tripId);
      await postJson(`/api/trips/requests/${tripId}`, {});
      setSentIds((prev) => [...new Set([...prev, tripId])]);
      toast({
        title: "Request Sent",
        description: "Your join request has been sent successfully!",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to Send Request",
        description: err.message || "Something went wrong.",
      });
    } finally {
      setSending(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading your matches...</p>
      </div>
    );

  if (!matches.length)
    return (
      <div className="text-center py-20 text-gray-500">
        <p>No matching trips found yet.</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Matching Trips</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((trip) => (
          <div
            key={trip.id}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            {/* Trip Image */}
            {trip.heroImageUrl && (
              <div className="relative h-44 w-full">
                <Image
                  src={trip.heroImageUrl}
                  alt={trip.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Trip Info */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold">{trip.title}</h3>
                <p className="text-gray-600 text-sm">📍 {trip.destination}</p>
                <p className="text-gray-500 text-sm mt-1">
                  📅 {trip.startDate} → {trip.endDate}
                </p>
              </div>

              {/* Owner Info */}
              <div className="flex items-center gap-3 mt-4">
                {trip.ownerPhotoUrl ? (
                  <Image
                    src={`http://localhost:8080${trip.ownerPhotoUrl}`}
                    alt={trip.ownerName || "Owner"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover border border-gray-300 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                    {trip.ownerName
                      ? trip.ownerName.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{trip.ownerName}</p>
                  <p className="text-xs text-gray-500">{trip.ownerEmail}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={() => handleJoin(trip.id)}
                  disabled={sending === trip.id || sentIds.includes(trip.id)}
                  className="flex-1 rounded-full"
                >
                  {sentIds.includes(trip.id)
                    ? "Request Sent"
                    : sending === trip.id
                    ? "Sending..."
                    : "Request to Join"}
                </Button>

                {/* ✅ Dynamic View Profile Link */}
                <Link
                  href={`/profile/${trip.ownerId}`}
                  className="flex-1 rounded-full text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300 px-4 py-2 transition font-medium"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
