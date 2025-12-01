// app/trips/[id]/members/page.tsx
// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { getJson } from "@/lib/api";
// import type { TripMember } from "@/types";

// export default function TripMembersPage() {
//   const { id } = useParams<{ id: string }>();
//   const [members, setMembers] = useState<TripMember[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;
//     (async () => {
//       try {
//         const data = await getJson<TripMember[]>(`/api/trips/${id}/members`);
//         setMembers(data || []);
//       } catch (e) {
//         console.error("Failed to load members", e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   if (loading) return <div className="p-6 text-center">Loading...</div>;

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-semibold mb-4">Trip Members</h1>
//       {members.length === 0 ? (
//         <div>No members yet.</div>
//       ) : (
//         <div className="grid gap-3 sm:grid-cols-2">
//           {members.map((m) => (
//             <div
//               key={m.id}
//               className="flex items-center gap-3 p-3 rounded-xl border bg-white/50"
//             >
//               <img
//                 src={m.photoUrl || "/avatar.png"}
//                 alt={m.name}
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//               <div>
//                 <div className="font-medium">{m.name}</div>
//                 <div className="text-sm opacity-70">{m.email}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import { getJson, putJson } from "@/lib/api";
// import { useToast } from "@/components/ui/use-toast";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import type { TripJoinRequestDTO, TripMember } from "@/types";
// import { Loader2 } from "lucide-react";
// import MatchingTripsSection from "@/components/trips/MatchingTripsSection";

// export default function MembersPage() {
//   const { toast } = useToast();
//   const [incoming, setIncoming] = useState<TripJoinRequestDTO[]>([]);
//   const [members, setMembers] = useState<TripMember[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadRequests = async () => {
//     try {
//       setLoading(true);
//       const data = await getJson<TripJoinRequestDTO[]>(
//         "/api/trips/requests/incoming"
//       );
//       setIncoming(data);
//     } catch (err) {
//       toast({ title: "Error loading requests", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAction = async (id: number, action: "accept" | "reject") => {
//     try {
//       await putJson(`/api/trips/requests/${id}/${action}`, {});
//       toast({
//         title: `Request ${action === "accept" ? "Accepted" : "Rejected"}`,
//       });
//       loadRequests();
//     } catch {
//       toast({
//         title: "Action failed",
//         variant: "destructive",
//       });
//     }
//   };

//   useEffect(() => {
//     loadRequests();
//   }, []);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="animate-spin text-gray-500 w-6 h-6" />
//       </div>
//     );

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-8">
//       <h1 className="text-2xl font-bold text-center mb-6">
//         Incoming Join Requests
//       </h1>

//       {incoming.length === 0 && (
//         <p className="text-center text-gray-500">
//           No new join requests at the moment.
//         </p>
//       )}

//       {incoming.map((req) => (
//         <Card key={req.id} className="p-4 flex justify-between items-center">
//           <div>
//             <p className="font-semibold">{req.sender.name}</p>
//             <p className="text-sm text-gray-500">{req.sender.email}</p>
//             <p className="text-xs text-gray-400 mt-1">
//               Requested to join: {req.trip.title} ({req.trip.destination})
//             </p>
//           </div>

//           <div className="flex gap-2">
//             {req.status === "PENDING" ? (
//               <>
//                 <Button
//                   onClick={() => handleAction(req.id, "accept")}
//                   className="bg-green-600 hover:bg-green-700"
//                 >
//                   Accept
//                 </Button>
//                 <Button
//                   onClick={() => handleAction(req.id, "reject")}
//                   className="bg-red-600 hover:bg-red-700"
//                 >
//                   Reject
//                 </Button>
//               </>
//             ) : (
//               <span
//                 className={`text-sm font-medium ${
//                   req.status === "ACCEPTED" ? "text-green-600" : "text-red-500"
//                 }`}
//               >
//                 {req.status}
//               </span>
//             )}
//           </div>
//         </Card>
//       ))}

//       <h2 className="text-2xl font-bold text-center mt-12 mb-4">
//         Current Trip Members
//       </h2>

//       {members.length === 0 ? (
//         <p className="text-center text-gray-500">No members yet.</p>
//       ) : (
//         <div className="space-y-3">
//           {members.map((m) => (
//             <Card key={m.id} className="p-4 flex justify-between items-center">
//               <div>
//                 <p className="font-semibold">{m.name}</p>
//                 <p className="text-sm text-gray-500">{m.email}</p>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import useSWR from "swr";
import { swrFetcher, putJson } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TripDetail } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function MembersRequestsPage() {
  const { data, mutate, isLoading } = useSWR<TripDetail[]>(
    "/api/trips/requests/incoming",
    swrFetcher
  );
  const { toast } = useToast();

  const act = async (id: number, action: "accept" | "reject") => {
    try {
      await putJson(`/api/trips/requests/${id}/${action}`, {});
      await mutate();
      toast({ title: `Request ${action}ed` });
    } catch (e: any) {
      toast({
        title: "Action failed",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Incoming Join Requests</h1>
      {!data || data.length === 0 ? (
        <p className="text-center text-muted-foreground">No requests yet.</p>
      ) : (
        data.map((req) => (
          <Card key={req.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">
                {req.sender.name || req.sender.email}
              </div>
              <div className="text-sm text-muted-foreground">
                wants to join{" "}
                <span className="font-medium">{req.trip.title}</span> •{" "}
                {req.trip.destination}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => act(req.id, "accept")}>Accept</Button>
              <Button
                variant="destructive"
                onClick={() => act(req.id, "reject")}
              >
                Reject
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
