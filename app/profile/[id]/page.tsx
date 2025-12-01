// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { getJson } from "@/lib/api";
// import { Card } from "@/components/ui/card";
// import Image from "next/image";
// import { Loader2 } from "lucide-react";

// interface UserProfile {
//   id: number;
//   name: string;
//   email: string;
//   bio?: string;
//   phone?: string;
//   photoUrl?: string | null;
//   preferredLanguage?: string;
//   preferredCurrency?: string;
//   publicProfile?: boolean;
// }

// export default function ProfilePage() {
//   const { id } = useParams();
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const data = await getJson<UserProfile>(`/api/user/${id}`);
//         setUser(data);
//       } catch (error) {
//         console.error("❌ Failed to load profile", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProfile();
//   }, [id]);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="animate-spin text-gray-500 w-6 h-6" />
//       </div>
//     );

//   if (!user)
//     return (
//       <div className="text-center text-gray-500 mt-20">
//         Profile not found 😢
//       </div>
//     );

//   return (
//     <div className="max-w-2xl mx-auto p-6 space-y-6">
//       <Card className="p-6 flex flex-col items-center space-y-4 shadow-md">
//         <Image
//           src={user.photoUrl ?? "/default-avatar.png"}
//           alt={user.name}
//           width={120}
//           height={120}
//           className="rounded-full border shadow-sm object-cover"
//         />
//         <h1 className="text-2xl font-bold">{user.name}</h1>
//         <p className="text-gray-600">{user.email}</p>

//         {user.bio && <p className="text-center text-gray-700">{user.bio}</p>}

//         <div className="w-full border-t border-gray-200 my-3"></div>

//         <div className="text-sm text-gray-500 space-y-1">
//           {user.phone && <p>📞 {user.phone}</p>}
//           {user.preferredLanguage && <p>🌐 {user.preferredLanguage}</p>}
//           {user.preferredCurrency && <p>💰 {user.preferredCurrency}</p>}
//         </div>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getJson } from "@/lib/api";
import type { UserDTO, TripLite } from "@/types";
import { Card } from "@/components/ui/card";
import { MapPin, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [trips, setTrips] = useState<TripLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadProfile = async () => {
      try {
        const data = await getJson<UserDTO>(`/api/user/${id}`);
        setUser(data);

        // Optionally: Load user’s trips (if available)
        try {
          const tripsData = await getJson<TripLite[]>(`/api/user/${id}/trips`);
          setTrips(tripsData);
        } catch {
          console.warn("No trips found for this user.");
        }
      } catch (err: any) {
        console.error("Error loading profile:", err);
        setError("Profile not found.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  if (loading)
    return <div className="text-center py-10 text-gray-500">Loading...</div>;

  if (error)
    return (
      <div className="text-center py-10 text-red-500 font-medium">{error}</div>
    );

  if (!user)
    return (
      <div className="text-center py-10 text-gray-400">User not found.</div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Card className="p-6 bg-white/10 dark:bg-black/20 shadow-xl rounded-2xl backdrop-blur-lg">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-32 h-32">
            <Image
              src={
                user.photoUrl
                  ? user.photoUrl.startsWith("http")
                    ? user.photoUrl
                    : `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.photoUrl}`
                  : "/default-avatar.png"
              }
              alt={user.name || "User Photo"}
              fill
              className="rounded-full object-cover border border-white/20"
            />
          </div>

          <h1 className="text-2xl font-semibold">
            {user.name || "Unnamed User"}
          </h1>
          <p className="text-gray-400 text-sm">{user.bio || "No bio yet."}</p>

          <div className="space-y-1 text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center justify-center gap-2">
                <Phone size={16} />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* User’s trips */}
      <div className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold">
          Trips by {user.name || "this user"}
        </h2>
        {trips.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {trips.map((trip) => (
              <Card
                key={trip.id}
                className="p-4 bg-white/5 hover:bg-white/10 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{trip.title}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <MapPin size={14} /> {trip.destination}
                    </p>
                  </div>
                  <Link
                    href={`/trip/${trip.id}`}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    View Trip →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No trips found.</p>
        )}
      </div>
    </div>
  );
}
