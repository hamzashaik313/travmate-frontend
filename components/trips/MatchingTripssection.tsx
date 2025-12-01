"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, MapPin, Calendar, User } from "lucide-react";
import UserProfileModal, {
  UserProfile,
} from "@/components/profile/UserProfileModal";

type Trip = {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  ownerName: string;
  ownerEmail: string;
};

type Props = {
  destination: string;
  startDate: string;
  endDate: string;
  token: string;
};

export default function MatchingTripsSection({
  destination,
  startDate,
  endDate,
  token,
}: Props) {
  const { toast } = useToast();
  const [matches, setMatches] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);

  // Profile modal state
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch matching trips
  useEffect(() => {
    const fetchMatches = async () => {
      if (!destination || !startDate || !endDate || !token) return;
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE}/api/trips/matching?destination=${encodeURIComponent(
            destination
          )}&startDate=${startDate}&endDate=${endDate}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid response");
        setMatches(data);
      } catch (e) {
        console.error(e);
        toast({
          title: "Error loading matching trips",
          description: "Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [destination, startDate, endDate, token, toast]);

  // Send join request
  const handleRequestJoin = async (tripId: number, host: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/trips/requests/${tripId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to send request");
      }
      toast({
        title: "Join request sent",
        description: `Requested to join ${host}'s trip.`,
      });
    } catch (e: any) {
      toast({
        title: "Could not send request",
        description: e.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Open profile modal
  const handleViewProfile = async (email: string) => {
    try {
      setProfileLoading(true);
      setOpen(true);
      const res = await fetch(
        `${API_BASE}/api/user/email?value=${encodeURIComponent(email)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Profile not found");
      const data = (await res.json()) as UserProfile;
      setProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        photoUrl: data.photoUrl,
        preferredCurrency: (data as any).preferredCurrency,
        preferredLanguage: (data as any).preferredLanguage,
      });
    } catch (e) {
      console.error(e);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );

  if (!matches.length)
    return (
      <p className="text-gray-500 text-sm text-center py-4">
        No matching trips yet for <strong>{destination}</strong>.
      </p>
    );

  return (
    <>
      <div className="space-y-3">
        {matches.map((trip) => (
          <Card
            key={trip.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-md transition-all duration-200 rounded-2xl"
          >
            <div className="space-y-1">
              <p className="font-semibold capitalize flex items-center gap-2">
                <User className="w-4 h-4" />
                {trip.title || "Untitled Trip"}
              </p>
              <p className="flex items-center text-sm text-gray-600 gap-1">
                <MapPin size={15} /> {trip.destination}
              </p>
              <p className="flex items-center text-xs text-gray-400 gap-1">
                <Calendar size={14} /> {trip.startDate} → {trip.endDate}
              </p>
              <p className="text-xs mt-1 text-gray-500">
                Organized by:{" "}
                <button
                  className="underline underline-offset-2 hover:text-gray-700"
                  onClick={() => handleViewProfile(trip.ownerEmail)}
                >
                  {trip.ownerName}
                </button>
              </p>
            </div>

            <div className="mt-3 sm:mt-0 flex gap-2">
              <Button
                onClick={() => handleRequestJoin(trip.id, trip.ownerName)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Request to Join
              </Button>
              <Button
                variant="outline"
                onClick={() => handleViewProfile(trip.ownerEmail)}
              >
                View Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Profile modal */}
      <UserProfileModal
        open={open}
        onOpenChange={setOpen}
        profile={profile}
        loading={profileLoading}
      />
    </>
  );
}
