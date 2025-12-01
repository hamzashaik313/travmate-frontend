// //TripDetail.ts
// export interface TripDetail {
//   id: number;
//   title: string;
//   destination: string;
//   startDate: string;
//   endDate: string;
//   heroImageUrl?: string;
//   createdBy?: {
//     id: number;
//     email: string;
//     name?: string;
//   };
// }

// import type { UserDTO } from "./index"; // ✅ reuse your existing UserDTO

// export interface TripDetail {
//   id: number;
//   title: string;
//   destination: string;
//   startDate: string;
//   endDate: string;
//   heroImageUrl?: string;
//   budget?: number;
//   visibility?: string;
//   maxMembers?: number;

//   // ✅ unify both naming possibilities
//   createdBy?: UserDTO;
//   owner?: UserDTO; // for backend compatibility (Trip.owner)
//   members?: UserDTO[];
// }

// types/TripDetail.ts

// ✅ Updated TripDetail
// ✅ Unified TripDetail Type
// export interface TripDetail {
//   id: number;
//   title: string;
//   destination: string;
//   startDate: string;
//   endDate: string;
//   budget?: number | null;
//   heroImageUrl?: string | null;
//   ownerId?: number | null; // ✅ new
//   ownerName?: string | null;
//   ownerEmail?: string | null;
//   ownerPhotoUrl?: string | null;
//   itineraries: { dayNumber: number; activity: string }[];
// }
