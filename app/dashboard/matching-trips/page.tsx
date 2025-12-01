// "use client";

// import { useState, useEffect } from "react";
// import { getJson, postJson } from "@/lib/api";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import { useAuth } from "@/components/auth/auth-context";

// interface Trip {
//   id: number;
//   title: string;
//   destination: string;
//   startDate: string;
//   endDate: string;
//   owner: { name: string; email: string };
// }

// export default function MatchingTripsPage() {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [matches, setMatches] = useState<Trip[]>([]);

//   useEffect(() => {
//     const loadMatches = async () => {
//       try {
//         const trips = await getJson<Trip[]>("/api/trips"); // get current user trips
//         if (trips.length === 0) return;

//         const { destination, startDate, endDate } = trips[0]; // or loop later
//         const data = await getJson<Trip[]>(
//           `/api/trips/match?destination=${destination}&startDate=${startDate}&endDate=${endDate}`
//         );
//         setMatches(data);
//       } catch (err) {
//         toast({ title: "Failed to load matches", variant: "destructive" });
//       }
//     };
//     loadMatches();
//   }, []);

//   const handleRequest = async (tripId: number) => {
//     try {
//       await postJson(`/api/trips/requests/${tripId}`, {});
//       toast({
//         title: "Request sent ✅",
//         description: "Trip owner has been notified.",
//       });
//     } catch {
//       toast({
//         title: "Error",
//         description: "Could not send request.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold text-center mb-8">Matching Trips</h1>

//       {matches.length === 0 ? (
//         <p className="text-center text-gray-500">
//           No overlapping trips found yet.
//         </p>
//       ) : (
//         <div className="space-y-4">
//           {matches.map((trip) => (
//             <Card
//               key={trip.id}
//               className="p-4 flex justify-between items-center"
//             >
//               <div>
//                 <h2 className="text-lg font-semibold">{trip.title}</h2>
//                 <p className="text-gray-600">{trip.destination}</p>
//                 <p className="text-sm text-gray-400">
//                   {trip.startDate} → {trip.endDate}
//                 </p>
//                 <p className="text-sm mt-2">
//                   Organized by{" "}
//                   <span className="font-semibold text-gray-800">
//                     {trip.owner?.name || "Unknown"}
//                   </span>
//                 </p>
//               </div>
//               <Button
//                 onClick={() => handleRequest(trip.id)}
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 Request to Join
//               </Button>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { getJson, postJson } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TripDetail } from "@/types";

export default function MatchingTripsPage() {
  const { toast } = useToast();
  const [matches, setMatches] = useState<TripDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        // 🧭 Step 1: Fetch current user's trips
        const myTrips = await getJson<TripDetail[]>("/api/trips");
        console.log("My trips:", myTrips);

        if (!myTrips || myTrips.length === 0) {
          setMatches([]);
          setLoading(false);
          return;
        }

        // 🧭 Step 2: Take first trip to find overlapping matches
        const { destination, startDate, endDate } = myTrips[0];

        // Format dates safely (ISO only)
        const formattedStart = startDate.split("T")[0];
        const formattedEnd = endDate.split("T")[0];

        console.log("Params being sent:", {
          destination,
          formattedStart,
          formattedEnd,
        });

        // 🧭 Step 3: Fetch matching trips
        const data = await getJson<TripDetail[]>(
          `/api/trips/match?destination=${encodeURIComponent(
            destination
          )}&startDate=${formattedStart}&endDate=${formattedEnd}`
        );

        console.log("Fetched matches:", data);
        setMatches(data);
      } catch (error) {
        console.error("❌ Failed to load matches", error);
        toast({ title: "Failed to load matches", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  // 🧭 Step 4: Send join request
  const handleJoin = async (tripId: number) => {
    try {
      await postJson(`/api/trips/requests/${tripId}`, {});
      toast({
        title: "Request Sent ✅",
        description: "Trip owner will review your request.",
      });
    } catch (error) {
      console.error("❌ Failed to send request", error);
      toast({ title: "Failed to send request", variant: "destructive" });
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600">
        Loading matching trips…
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Matching Trips</h1>

      {matches.length === 0 ? (
        <p className="text-center text-gray-500">
          No overlapping trips found yet.
        </p>
      ) : (
        matches.map((trip) => (
          <Card
            key={trip.id}
            className="p-4 flex justify-between items-center shadow-md"
          >
            <div>
              <h2 className="text-lg font-semibold capitalize">
                {trip.title || "Untitled Trip"}
              </h2>
              <p className="text-gray-600">{trip.destination}</p>
              <p className="text-sm text-gray-500">
                {trip.startDate} → {trip.endDate}
              </p>
              <p className="text-sm mt-2">
                Organized by{" "}
                <span className="font-semibold text-gray-800">
                  {trip.ownerName || "Unknown"}
                </span>
              </p>
            </div>
            <Button
              onClick={() => handleJoin(trip.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Request to Join
            </Button>
          </Card>
        ))
      )}
    </div>
  );
}
