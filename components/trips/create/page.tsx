"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postJson } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CalendarDays, MapPin, Users } from "lucide-react";

export default function CreateTripPage() {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxMembers, setMaxMembers] = useState(5);
  const [visibility, setVisibility] = useState("PUBLIC");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const createTrip = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !destination || !startDate || !endDate) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("⏳ Creating trip…");

      await postJson("/api/trips", {
        title,
        destination,
        startDate,
        endDate,
        visibility,
        maxMembers,
      });

      console.log("✅ Trip created successfully — redirecting now…");

      toast({
        title: "🎉 Trip Created Successfully!",
        description: "Finding matching trips for you...",
      });

      // ⏱️ Wait briefly before redirect to make toast visible
      setTimeout(() => router.push("/trips/matches"), 1200);
    } catch (e: any) {
      console.error("❌ Trip creation failed", e);
      toast({
        title: "Failed to Create Trip",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card className="p-6 space-y-4 shadow-md backdrop-blur bg-white/70">
        <h1 className="text-2xl font-bold text-center">Create a New Trip</h1>
        <p className="text-sm text-gray-500 text-center mb-2">
          Plan your next adventure and meet travelers heading your way.
        </p>

        <form onSubmit={createTrip} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin size={16} /> Trip Title
            </label>
            <Input
              placeholder="Trip Title (e.g., Goa Getaway)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin size={16} /> Destination
            </label>
            <Input
              placeholder="Destination (e.g., Mumbai)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarDays size={16} /> Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarDays size={16} /> End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users size={16} /> Max Members
              </label>
              <Input
                type="number"
                min="1"
                value={maxMembers}
                onChange={(e) => setMaxMembers(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full border rounded-md p-2"
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-3 rounded-xl"
          >
            {loading ? "Creating Trip…" : "Create Trip"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
