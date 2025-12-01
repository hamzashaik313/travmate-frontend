// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { getJson } from "@/lib/api";
// import type { TripDetail } from "@/types";
// import Image from "next/image";
// import Link from "next/link";

// interface UserProfile {
//   id: number;
//   name?: string;
//   email?: string;
//   bio?: string;
//   photoUrl?: string;
//   preferredLanguage?: string;
//   preferredCurrency?: string;
// }

// export default function ProfilePage() {
//   const { id } = useParams();
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [trips, setTrips] = useState<TripDetail[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!id) return;

//     const fetchProfileAndTrips = async () => {
//       try {
//         setLoading(true);
//         const [profileRes, tripsRes] = await Promise.all([
//           getJson<UserProfile>(`/api/user/${id}/profile`),
//           getJson<TripDetail[]>(`/api/user/${id}/trips`),
//         ]);

//         setProfile(profileRes);
//         setTrips(tripsRes || []);
//       } catch (err: any) {
//         console.error(err);
//         setError("Profile not found or failed to load.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileAndTrips();
//   }, [id]);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p>Loading profile...</p>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="flex justify-center items-center min-h-screen text-red-500">
//         <p>{error}</p>
//       </div>
//     );

//   if (!profile)
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p>Profile not found.</p>
//       </div>
//     );

//   return (
//     <div className="max-w-4xl mx-auto px-6 py-12">
//       {/* Profile Header */}
//       <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
//         {profile.photoUrl ? (
//           <Image
//             src={`http://localhost:8080${profile.photoUrl}`}
//             alt={`${profile.name}'s profile photo`}
//             width={120}
//             height={120}
//             className="rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
//           />
//         ) : (
//           <div className="w-[120px] h-[120px] rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-2xl font-bold">
//             {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
//           </div>
//         )}

//         <div>
//           <h1 className="text-3xl font-bold">
//             {profile.name || "Unknown User"}
//           </h1>
//           <p className="text-gray-500">{profile.email}</p>
//           {profile.bio && <p className="mt-2 text-gray-700">{profile.bio}</p>}
//           <div className="mt-3 text-sm text-gray-600">
//             {profile.preferredLanguage && (
//               <p>🌐 Language: {profile.preferredLanguage}</p>
//             )}
//             {profile.preferredCurrency && (
//               <p>💰 Currency: {profile.preferredCurrency}</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* User Trips */}
//       <div>
//         <h2 className="text-2xl font-semibold mb-4">
//           Trips by {profile.name || "this user"}
//         </h2>

//         {trips.length === 0 ? (
//           <p className="text-gray-500">No trips found.</p>
//         ) : (
//           <div className="grid gap-5 md:grid-cols-2">
//             {trips.map((trip) => (
//               <Link
//                 key={trip.id}
//                 href={`/trips/${trip.id}`}
//                 className="block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 shadow-md hover:shadow-lg transition"
//               >
//                 {trip.heroImageUrl && (
//                   <div className="relative h-48 w-full">
//                     <Image
//                       src={trip.heroImageUrl}
//                       alt={trip.title}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                 )}
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold mb-1">{trip.title}</h3>
//                   <p className="text-gray-600 text-sm">📍 {trip.destination}</p>
//                   <p className="text-gray-500 text-sm">
//                     📅 {trip.startDate} → {trip.endDate}
//                   </p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getJson } from "@/lib/api";
import type { UserDTO } from "@/types";

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    if (!id) return;
    getJson(`/api/user/${id}`).then(setUser).catch(console.error);
  }, [id]);

  if (!user) return <div className="text-center p-8">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="flex items-center gap-4">
        {user.photoUrl ? (
          <img
            src={`http://localhost:8080${user.photoUrl}`}
            alt={user.name || "User"}
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-2xl">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          {user.bio && <p className="text-gray-600 mt-2">{user.bio}</p>}
        </div>
      </div>
    </div>
  );
}
