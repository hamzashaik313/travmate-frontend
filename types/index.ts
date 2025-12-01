// // ✅ Basic user type
// // ✅ Basic user type
// export interface UserDTO {
//   id: number;
//   email: string;
//   name?: string | null;
//   phone?: string | null;
//   bio?: string | null;
//   photoUrl?: string | null;
//   preferredCurrency?: string | null;
//   preferredLanguage?: string | null;
//   role?: string | null;
//   emailNotifications?: boolean;
//   tripReminders?: boolean;
//   tripJoinRequests?: boolean;
//   publicProfile?: boolean;
//   allowTripRequests?: boolean;
// }

// // ✅ Minimal trip structure (used for match/discover cards)
// export interface TripLite {
//   id: number;
//   title: string;
//   destination: string;
//   startDate: string;
//   endDate: string;
//   heroImageUrl?: string | null;
//   visibility: "PUBLIC" | "PRIVATE";
//   maxMembers: number;
//   budget?: number | null;
//   ownerName?: string | null;
// }

// // ✅ Full detail (used for Trip Detail & Matches page)
// export interface TripDetail {
//   id: number;
//   title: string;
//   destination: string;
//   startDate: string;
//   endDate: string;
//   heroImageUrl?: string | null;
//   visibility?: "PUBLIC" | "PRIVATE";
//   maxMembers?: number;
//   budget?: number | null;

//   // 🧍 Owner info (matches backend TripDTO)
//   ownerId?: number | null;
//   ownerName?: string | null;
//   ownerEmail?: string | null;
//   ownerPhotoUrl?: string | null;

//   createdBy?: {
//     id: number;
//     email: string;
//     name?: string;
//   };

//   itineraries: {
//     dayNumber: number;
//     activity: string;
//   }[];
// }

// // ✅ Join Request structure
// export interface TripJoinRequestDTO {
//   id: number;
//   trip: TripLite;
//   sender: UserDTO;
//   receiver: UserDTO;
//   status: "PENDING" | "ACCEPTED" | "REJECTED";
//   createdAt: string;
// }

export interface UserDTO {
  id: number;
  email: string;
  name?: string | null;
  phone?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  preferredCurrency?: string | null;
  preferredLanguage?: string | null;
  role?: string | null;
  emailNotifications?: boolean;
  tripReminders?: boolean;
  tripJoinRequests?: boolean;
  publicProfile?: boolean;
  allowTripRequests?: boolean;
}

// ✅ Minimal trip structure (listing cards)
export interface TripLite {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  heroImageUrl?: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  maxMembers: number;
  budget?: number | null;
  ownerName?: string | null;
}

// ✅ Full detail (used in matches & detail page)
export interface TripDetail {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  heroImageUrl?: string | null;
  visibility?: "PUBLIC" | "PRIVATE";
  maxMembers?: number;
  budget?: number | null;

  ownerId?: number | null; // 👈 added
  ownerName?: string | null;
  ownerEmail?: string | null;
  ownerPhotoUrl?: string | null;

  itineraries: {
    dayNumber: number;
    activity: string;
  }[];
}

// ✅ Join Request
export interface TripJoinRequestDTO {
  id: number;
  trip: TripLite;
  sender: UserDTO;
  receiver: UserDTO;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}
