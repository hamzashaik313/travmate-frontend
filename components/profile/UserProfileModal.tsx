"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  photoUrl?: string;
  preferredCurrency?: string;
  preferredLanguage?: string;
}

export default function UserProfileModal({
  open,
  onOpenChange,
  profile,
  loading = false,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  profile: UserProfile | null;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">
        <div className="bg-white">
          <DialogHeader className="p-6 border-b">
            <DialogTitle className="text-xl font-semibold">
              {profile?.name || "Traveler Profile"}
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : profile ? (
            <div className="p-6 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.photoUrl || "/default-avatar.png"}
                  alt="User"
                  className="w-28 h-28 rounded-full object-cover border"
                />
                <p className="mt-3 text-sm text-gray-500">{profile.email}</p>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-center text-gray-600 italic max-w-md mx-auto">
                  “{profile.bio}”
                </p>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {profile.phone && (
                  <div>
                    <p className="text-gray-400 uppercase text-xs font-medium">
                      Phone
                    </p>
                    <p className="text-gray-700">{profile.phone}</p>
                  </div>
                )}
                {profile.preferredCurrency && (
                  <div>
                    <p className="text-gray-400 uppercase text-xs font-medium">
                      Preferred Currency
                    </p>
                    <p className="text-gray-700">{profile.preferredCurrency}</p>
                  </div>
                )}
                {profile.preferredLanguage && (
                  <div>
                    <p className="text-gray-400 uppercase text-xs font-medium">
                      Preferred Language
                    </p>
                    <p className="text-gray-700">{profile.preferredLanguage}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-center">
                <Button variant="secondary" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No profile found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
