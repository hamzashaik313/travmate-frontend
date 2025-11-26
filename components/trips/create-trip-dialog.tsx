// "use client";

// import type React from "react";

// import { useState } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { postJson } from "@/lib/api";
// import { mutate } from "swr";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export function CreateTripDialog({ children }: { children: React.ReactNode }) {
//   const [open, setOpen] = useState(false);
//   const { toast } = useToast();

//   const [form, setForm] = useState({
//     title: "",
//     destination: "",
//     startDate: "",
//     endDate: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const submit = async () => {
//     setLoading(true);
//     try {
//       await postJson("/api/trips", {
//         title: form.title,
//         destination: form.destination,
//         startDate: form.startDate,
//         endDate: form.endDate,
//       });

//       toast({ title: "Trip created" });
//       setOpen(false);

//       setForm({
//         title: "",
//         destination: "",
//         startDate: "",
//         endDate: "",
//       });

//       mutate("/api/trips");
//     } catch (e: any) {
//       toast({
//         title: "Failed to create trip",
//         description: e.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>{children}</DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Plan New Trip</DialogTitle>
//           <DialogDescription>
//             Enter trip details and create your new adventure.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="grid gap-4 py-2">
//           <div className="grid gap-2">
//             <Label htmlFor="title">Title</Label>
//             <Input
//               id="title"
//               value={form.title}
//               onChange={(e) => setForm({ ...form, title: e.target.value })}
//             />
//           </div>

//           <div className="grid gap-2">
//             <Label htmlFor="destination">Destination</Label>
//             <Input
//               id="destination"
//               value={form.destination}
//               onChange={(e) =>
//                 setForm({ ...form, destination: e.target.value })
//               }
//             />
//           </div>

//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <div className="grid gap-2">
//               <Label htmlFor="startDate">Start Date</Label>
//               <Input
//                 id="startDate"
//                 type="date"
//                 value={form.startDate}
//                 onChange={(e) =>
//                   setForm({ ...form, startDate: e.target.value })
//                 }
//               />
//             </div>

//             <div className="grid gap-2">
//               <Label htmlFor="endDate">End Date</Label>
//               <Input
//                 id="endDate"
//                 type="date"
//                 value={form.endDate}
//                 onChange={(e) => setForm({ ...form, endDate: e.target.value })}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end gap-2">
//           <Button variant="outline" onClick={() => setOpen(false)}>
//             Cancel
//           </Button>
//           <Button onClick={submit} disabled={loading}>
//             {loading ? "Creating..." : "Create Trip"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import type React from "react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { postJson } from "@/lib/api";
import { mutate } from "swr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateTripDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const addDays = (dateString: string, days: number) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  const submit = async () => {
    if (new Date(form.startDate) < new Date(today)) {
      toast({
        title: "Invalid start date",
        description: "Start date cannot be in the past.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast({
        title: "Invalid date range",
        description: "End date cannot be before start date.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await postJson("/api/trips", {
        title: form.title,
        destination: form.destination,
        startDate: form.startDate,
        endDate: form.endDate,
      });

      toast({ title: "Trip created" });
      setOpen(false);

      setForm({
        title: "",
        destination: "",
        startDate: "",
        endDate: "",
      });

      mutate("/api/trips");
    } catch (e: any) {
      toast({
        title: "Failed to create trip",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plan New Trip</DialogTitle>
          <DialogDescription>
            Enter trip details and create your new adventure.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={form.destination}
              onChange={(e) =>
                setForm({ ...form, destination: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                min={today}
                onChange={(e) => {
                  const newStartDate = e.target.value;
                  const defaultEnd = addDays(newStartDate, 2);
                  setForm({
                    ...form,
                    startDate: newStartDate,

                    endDate:
                      !form.endDate || form.endDate < newStartDate
                        ? defaultEnd
                        : form.endDate,
                  });
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={form.endDate}
                min={form.startDate || today}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading}>
            {loading ? "Creating..." : "Create Trip"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
