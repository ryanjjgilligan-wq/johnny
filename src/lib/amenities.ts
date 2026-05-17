import {
  Fence,
  Waves,
  TreePine,
  Mountain,
  Dog,
  Users,
  Droplet,
  Unlock,
  type LucideIcon,
} from "lucide-react";

export type AmenityKey =
  | "fully_fenced"
  | "pool"
  | "shade"
  | "agility"
  | "small_dogs"
  | "multiple_dogs"
  | "water_access"
  | "off_leash";

export const AMENITIES: Record<AmenityKey, { label: string; icon: LucideIcon; short: string }> = {
  fully_fenced: { label: "Fully Fenced", icon: Fence, short: "Fenced" },
  pool: { label: "Pool", icon: Waves, short: "Pool" },
  shade: { label: "Shade", icon: TreePine, short: "Shade" },
  agility: { label: "Agility Equipment", icon: Mountain, short: "Agility" },
  small_dogs: { label: "Small Dogs Only", icon: Dog, short: "Small dogs" },
  multiple_dogs: { label: "Multiple Dogs OK", icon: Users, short: "Multiple dogs" },
  water_access: { label: "Water Access", icon: Droplet, short: "Water" },
  off_leash: { label: "Off-Leash", icon: Unlock, short: "Off-leash" },
};

export const AMENITY_ORDER: AmenityKey[] = [
  "fully_fenced",
  "pool",
  "shade",
  "agility",
  "small_dogs",
  "multiple_dogs",
  "water_access",
  "off_leash",
];
