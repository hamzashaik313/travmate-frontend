// //settings/page.tsx:
// "use client";

// import { useState } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { putJson } from "@/lib/api";

// export default function SettingsPage() {
//   const { toast } = useToast();
//   const [notifications, setNotifications] = useState({
//     email: true,
//     tripReminders: true,
//     joinRequests: true,
//   });

//   const [privacy, setPrivacy] = useState({
//     showProfile: true,
//     allowRequests: false,
//   });

//   const [newPassword, setNewPassword] = useState("");

//   const handleSave = async () => {
//     toast({
//       title: "Settings saved successfully!",
//       description: "Your preferences were updated.",
//     });
//   };

//   const handlePasswordChange = async () => {
//     try {
//       await putJson("/api/user/me/password", { newPassword });
//       setNewPassword("");
//       toast({
//         title: "Password updated successfully!",
//         description: "Your password has been changed.",
//       });
//     } catch {
//       toast({
//         title: "Failed to change password",
//         description: "Something went wrong.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="container max-w-3xl mx-auto py-12 px-4 mt-16">
//       <h2 className="text-3xl font-bold mb-6">Settings</h2>
//       <p className="text-muted-foreground mb-8">
//         Manage your notifications, privacy, and account settings.
//       </p>

//       {/* Notifications */}
//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>Notification Preferences</CardTitle>
//           <CardDescription>Control how you get updates.</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {Object.entries({
//             email: "Email Notifications",
//             tripReminders: "Trip Reminders",
//             joinRequests: "Trip Join Requests",
//           }).map(([id, label]) => (
//             <div key={id} className="flex justify-between items-center">
//               <Label>{label}</Label>
//               <Switch
//                 checked={(notifications as any)[id]}
//                 onCheckedChange={(checked) =>
//                   setNotifications({ ...notifications, [id]: checked })
//                 }
//               />
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       {/* Privacy */}
//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>Privacy Settings</CardTitle>
//           <CardDescription>Control who can see your profile.</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {Object.entries({
//             showProfile: "Show my profile publicly",
//             allowRequests: "Allow trip requests from anyone",
//           }).map(([id, label]) => (
//             <div key={id} className="flex justify-between items-center">
//               <Label>{label}</Label>
//               <Switch
//                 checked={(privacy as any)[id]}
//                 onCheckedChange={(checked) =>
//                   setPrivacy({ ...privacy, [id]: checked })
//                 }
//               />
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       {/* Change Password */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Change Password</CardTitle>
//           <CardDescription>
//             Update your account password securely.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <Label htmlFor="newPassword">New Password</Label>
//           <Input
//             id="newPassword"
//             type="password"
//             placeholder="Enter new password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//           />
//           <Button onClick={handlePasswordChange}>Change Password</Button>
//         </CardContent>
//       </Card>

//       <Button className="mt-6" onClick={handleSave}>
//         Save All Changes
//       </Button>
//     </div>
//   );
// }

//after deployment
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  const [notifications, setNotifications] = useState({
    email: true,
    tripReminders: true,
    joinRequests: true,
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    allowRequests: true,
  });

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/users/settings`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setNotifications({
            email: data.emailNotifications,
            tripReminders: data.tripReminders,
            joinRequests: data.tripJoinRequests,
          });
          setPrivacy({
            showProfile: data.publicProfile,
            allowRequests: data.allowTripRequests,
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  // ✅ Save settings to backend
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/users/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            emailNotifications: notifications.email,
            tripReminders: notifications.tripReminders,
            tripJoinRequests: notifications.joinRequests,
            publicProfile: privacy.showProfile,
            allowTripRequests: privacy.allowRequests,
          }),
        }
      );

      if (res.ok) {
        toast({
          title: "Settings saved successfully!",
          description: "Your preferences were updated.",
        });
      } else {
        toast({
          title: "Failed to save settings",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Could not update settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle password change (already working)
  const handlePasswordChange = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/user/me/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      if (res.ok) {
        setNewPassword("");
        toast({
          title: "Password updated successfully!",
          description: "Your password has been changed.",
        });
      } else {
        toast({
          title: "Failed to change password",
          description: "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast({
        title: "Error changing password",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4 mt-16">
      <h2 className="text-3xl font-bold mb-6">Settings</h2>
      <p className="text-muted-foreground mb-8">
        Manage your notifications, privacy, and account settings.
      </p>

      {/* Notification Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Control how you get updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries({
            email: "Email Notifications",
            tripReminders: "Trip Reminders",
            joinRequests: "Trip Join Requests",
          }).map(([id, label]) => (
            <div key={id} className="flex justify-between items-center">
              <Label>{label}</Label>
              <Switch
                checked={(notifications as any)[id]}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, [id]: checked })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control who can see your profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries({
            showProfile: "Show my profile publicly",
            allowRequests: "Allow trip requests from anyone",
          }).map(([id, label]) => (
            <div key={id} className="flex justify-between items-center">
              <Label>{label}</Label>
              <Switch
                checked={(privacy as any)[id]}
                onCheckedChange={(checked) =>
                  setPrivacy({ ...privacy, [id]: checked })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your account password securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={handlePasswordChange}>Change Password</Button>
        </CardContent>
      </Card>

      <Button className="mt-6" onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save All Changes"}
      </Button>
    </div>
  );
}
