//dashboard/page.tsx
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/components/auth/auth-context";
// import { AppHeader } from "@/components/header";
// import { TripCards } from "@/components/trips/TripCards";
// import { CreateTripDialog } from "@/components/trips/create-trip-dialog";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import { GlassPanel } from "@/components/ui/glass-panel";

// export default function DashboardPage() {
//   const { isAuthenticated, hydrated } = useAuth();
//   const router = useRouter();

//   // FIX: wait until hydration before redirecting
//   useEffect(() => {
//     if (!hydrated) return; // wait for localStorage
//     if (!isAuthenticated) router.replace("/");
//   }, [hydrated, isAuthenticated, router]);

//   // Prevent flicker + wrong redirects
//   if (!hydrated) return null;
//   if (!isAuthenticated) return null;

//   return (
//     <div className="min-h-dvh flex flex-col">
//       <AppHeader />

//       <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
//         <GlassPanel>
//           <div className="mb-6 flex items-center justify-between">
//             <h2 className="text-2xl font-semibold">Your Trips</h2>

//             <CreateTripDialog>
//               <Button className="gap-2 px-5 py-2 rounded-full">
//                 <Plus className="h-4 w-4" />
//                 Plan New Trip
//               </Button>
//             </CreateTripDialog>
//           </div>

//           <TripCards />
//         </GlassPanel>
//       </main>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/components/auth/auth-context";
// import { AppHeader } from "@/components/header";
// import { TripCards } from "@/components/trips/TripCards";
// import { CreateTripDialog } from "@/components/trips/create-trip-dialog";
// import { Button } from "@/components/ui/button";
// import { Plus, Bell } from "lucide-react";
// import { GlassPanel } from "@/components/ui/glass-panel";
// import { getJson, putJson } from "@/lib/api";
// import { Card } from "@/components/ui/card";
// import Link from "next/link";
// import { useToast } from "@/components/ui/use-toast";
// import type { TripJoinRequestDTO } from "@/types";

// export default function DashboardPage() {
//   const { isAuthenticated, hydrated, user } = useAuth();
//   const router = useRouter();
//   const { toast } = useToast();
//   const [incoming, setIncoming] = useState<TripJoinRequestDTO[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!hydrated) return;
//     if (!isAuthenticated) router.replace("/");
//   }, [hydrated, isAuthenticated, router]);

//   const loadRequests = async () => {
//     try {
//       setLoading(true);
//       const data = await getJson<TripJoinRequestDTO[]>(
//         "/api/trips/requests/incoming"
//       );
//       setIncoming(data);
//     } catch (err) {
//       console.error("❌ Failed to load join requests", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAction = async (id: number, action: "accept" | "reject") => {
//     try {
//       await putJson(`/api/trips/requests/${id}/${action}`, {});
//       toast({ title: `Request ${action}ed ✅` });
//       loadRequests();
//     } catch {
//       toast({ title: `Failed to ${action}`, variant: "destructive" });
//     }
//   };

//   useEffect(() => {
//     if (hydrated && isAuthenticated) loadRequests();
//   }, [hydrated, isAuthenticated]);

//   if (!hydrated || !isAuthenticated) return null;

//   return (
//     <div className="min-h-dvh flex flex-col">
//       <AppHeader />

//       <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 space-y-10">
//         {/* Your Trips Section */}
//         <GlassPanel>
//           <div className="mb-6 flex items-center justify-between">
//             <h2 className="text-2xl font-semibold">Your Trips</h2>
//             <CreateTripDialog>
//               <Button className="gap-2 px-5 py-2 rounded-full">
//                 <Plus className="h-4 w-4" />
//                 Plan New Trip
//               </Button>
//             </CreateTripDialog>
//           </div>
//           <TripCards />
//         </GlassPanel>

//         {/* Incoming Join Requests Section */}
//         <GlassPanel>
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-semibold flex items-center gap-2">
//               <Bell className="h-5 w-5 text-blue-600" />
//               Join Requests
//             </h2>

//             <Link href="/requests">
//               <Button variant="outline">View All</Button>
//             </Link>
//           </div>

//           {loading ? (
//             <p className="text-gray-500 text-center">Loading requests...</p>
//           ) : incoming.length === 0 ? (
//             <p className="text-gray-500 text-center">No new join requests.</p>
//           ) : (
//             <div className="space-y-3">
//               {incoming.slice(0, 3).map((req) => (
//                 <Card
//                   key={req.id}
//                   className="p-4 flex justify-between items-center shadow-sm"
//                 >
//                   <div>
//                     <p className="font-medium">
//                       <span className="text-blue-700">{req.sender.name}</span>{" "}
//                       wants to join{" "}
//                       <span className="text-gray-800 font-semibold">
//                         {req.trip.title}
//                       </span>
//                     </p>
//                     <p className="text-sm text-gray-500">{req.sender.email}</p>
//                   </div>

//                   <div className="space-x-2">
//                     <Button
//                       size="sm"
//                       onClick={() => handleAction(req.id, "accept")}
//                       className="bg-green-600 hover:bg-green-700 text-white"
//                     >
//                       Accept
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       onClick={() => handleAction(req.id, "reject")}
//                     >
//                       Reject
//                     </Button>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </GlassPanel>
//       </main>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/components/auth/auth-context";
// import { AppHeader } from "@/components/header";
// import { TripCards } from "@/components/trips/TripCards";
// import { CreateTripDialog } from "@/components/trips/create-trip-dialog";
// import { Button } from "@/components/ui/button";
// import { Plus, Bell } from "lucide-react";
// import { GlassPanel } from "@/components/ui/glass-panel";
// import { getJson, putJson } from "@/lib/api";
// import { Card } from "@/components/ui/card";
// import Link from "next/link";
// import { useToast } from "@/components/ui/use-toast";
// import type { TripJoinRequestDTO } from "@/types";
// import JoinRequestsSection from "@/components/trips/JoinRequestsSection";

// export default function DashboardPage() {
//   const { isAuthenticated, hydrated } = useAuth();
//   const router = useRouter();
//   const { toast } = useToast();

//   const [incoming, setIncoming] = useState<TripJoinRequestDTO[]>([]);
//   const [loading, setLoading] = useState(false);

//   // 🧭 Ensure user is logged in
//   useEffect(() => {
//     if (!hydrated) return;
//     if (!isAuthenticated) router.replace("/");
//   }, [hydrated, isAuthenticated, router]);

//   // 🔄 Load incoming join requests
//   const loadRequests = async () => {
//     try {
//       setLoading(true);
//       const data = await getJson<TripJoinRequestDTO[]>(
//         "/api/trips/requests/incoming"
//       );
//       setIncoming(data);
//     } catch (err) {
//       console.error("❌ Failed to load join requests", err);
//       toast({ title: "Failed to load join requests", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Handle Accept/Reject actions
//   const handleAction = async (id: number, action: "accept" | "reject") => {
//     try {
//       await putJson(`/api/trips/requests/${id}/${action}`, {});
//       toast({
//         title:
//           action === "accept"
//             ? "✅ Request accepted successfully"
//             : "❌ Request rejected",
//       });
//       loadRequests();
//     } catch (err: any) {
//       toast({
//         title: err.message || `Failed to ${action}`,
//         variant: "destructive",
//       });
//     }
//   };

//   useEffect(() => {
//     if (hydrated && isAuthenticated) loadRequests();
//   }, [hydrated, isAuthenticated]);

//   if (!hydrated || !isAuthenticated) return null;

//   return (
//     <div className="min-h-dvh flex flex-col">
//       {/* Header */}
//       <AppHeader />

//       <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 space-y-10">
//         {/* === Section 1: Your Trips === */}
//         <GlassPanel>
//           <div className="mb-6 flex items-center justify-between">
//             <h2 className="text-2xl font-semibold">Your Trips</h2>

//             <div className="flex items-center gap-3">
//               {/* 🔍 Find Matches Button */}
//               <Button
//                 variant="outline"
//                 onClick={() => router.push("/trips/matches")}
//               >
//                 🔍 Find Matches
//               </Button>

//               {/* ➕ Plan New Trip Button */}
//               <CreateTripDialog>
//                 <Button className="gap-2 px-5 py-2 rounded-full">
//                   <Plus className="h-4 w-4" />
//                   Plan New Trip
//                 </Button>
//               </CreateTripDialog>
//             </div>
//           </div>

//           {/* Render user's own trips */}
//           <TripCards />
//         </GlassPanel>

//         {/* === Section 2: Join Requests === */}
//         <GlassPanel>
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-semibold flex items-center gap-2">
//               <Bell className="h-5 w-5 text-blue-600" />
//               Join Requests
//             </h2>

//             <Link href="/requests">
//               <Button variant="outline">View All</Button>
//             </Link>
//           </div>

//           {/* Loading state */}
//           {loading ? (
//             <p className="text-gray-500 text-center">Loading requests...</p>
//           ) : incoming.length === 0 ? (
//             <p className="text-gray-500 text-center">No new join requests.</p>
//           ) : (
//             <div className="space-y-3">
//               {incoming.map((req) => (
//                 <Card
//                   key={req.id}
//                   className="p-4 flex justify-between items-center shadow-sm"
//                 >
//                   <div>
//                     <p className="font-medium">
//                       <Link
//                         href={`/profile/${req.sender.id}`}
//                         className="text-blue-600 hover:underline"
//                       >
//                         {req.sender.name || req.sender.email}
//                       </Link>{" "}
//                       wants to join{" "}
//                       <span className="text-gray-800 font-semibold">
//                         {req.trip.title}
//                       </span>
//                     </p>
//                     <p className="text-sm text-gray-500">{req.sender.email}</p>
//                   </div>

//                   <div className="space-x-2">
//                     {/* ✅ Accept */}
//                     <Button
//                       size="sm"
//                       className="bg-green-600 hover:bg-green-700 text-white"
//                       onClick={() => handleAction(req.id, "accept")}
//                     >
//                       Accept
//                     </Button>

//                     {/* ❌ Reject */}
//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       onClick={() => handleAction(req.id, "reject")}
//                     >
//                       Reject
//                     </Button>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </GlassPanel>
//       </main>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/components/auth/auth-context";
// import { AppHeader } from "@/components/header";
// import { TripCards } from "@/components/trips/TripCards";
// import { CreateTripDialog } from "@/components/trips/create-trip-dialog";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import { GlassPanel } from "@/components/ui/glass-panel";
// import JoinRequestsSection from "@/components/trips/JoinRequestsSection";
// import { getJson } from "@/lib/api";

// interface JoinRequest {
//   id: number;
//   senderName: string;
//   senderEmail: string;
//   tripName: string;
//   status: string;
// }

// export default function DashboardPage() {
//   const { isAuthenticated, hydrated } = useAuth();
//   const router = useRouter();

//   const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch Join Requests
//   const fetchRequests = useCallback(async () => {
//     try {
//       const data = await getJson<JoinRequest[]>("/api/trips/requests/incoming");
//       setJoinRequests(data || []);
//     } catch (err) {
//       console.error("Error loading join requests:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (hydrated && isAuthenticated) {
//       fetchRequests();
//     }
//   }, [hydrated, isAuthenticated, fetchRequests]);

//   // Redirect unauthenticated users
//   useEffect(() => {
//     if (!hydrated) return;
//     if (!isAuthenticated) router.replace("/");
//   }, [hydrated, isAuthenticated, router]);

//   if (!hydrated) return null;
//   if (!isAuthenticated) return null;

//   return (
//     <div className="min-h-dvh flex flex-col">
//       <AppHeader />

//       <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 space-y-10">
//         {/* My Trips Section */}
//         <GlassPanel>
//           <div className="mb-6 flex items-center justify-between">
//             <h2 className="text-2xl font-semibold">Your Trips</h2>

//             <CreateTripDialog>
//               <Button className="gap-2 px-5 py-2 rounded-full">
//                 <Plus className="h-4 w-4" />
//                 Plan New Trip
//               </Button>
//             </CreateTripDialog>
//           </div>

//           <TripCards />
//         </GlassPanel>

//         {/* Join Requests Section */}
//         <GlassPanel>
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-semibold">Join Requests</h2>
//             <Button variant="outline" onClick={fetchRequests}>
//               Refresh
//             </Button>
//           </div>

//           {loading ? (
//             <p className="text-gray-500 text-center">Loading requests...</p>
//           ) : joinRequests.length > 0 ? (
//             <JoinRequestsSection
//               requests={joinRequests}
//               reload={fetchRequests}
//             />
//           ) : (
//             <p className="text-gray-500 text-center">No join requests yet.</p>
//           )}
//         </GlassPanel>
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { AppHeader } from "@/components/header";
import { TripCards } from "@/components/trips/TripCards";
import { CreateTripDialog } from "@/components/trips/create-trip-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import JoinRequests from "@/components/trips/JoinRequestsSection"; // ✅ Import here

export default function DashboardPage() {
  const { isAuthenticated, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.replace("/");
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-dvh flex flex-col">
      <AppHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <GlassPanel>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Trips</h2>

            <CreateTripDialog>
              <Button className="gap-2 px-5 py-2 rounded-full">
                <Plus className="h-4 w-4" />
                Plan New Trip
              </Button>
            </CreateTripDialog>
          </div>

          <TripCards />

          {/* ✅ Add Join Requests Below Trips */}
          <div className="mt-10">
            <JoinRequests />
          </div>
        </GlassPanel>
      </main>
    </div>
  );
}
