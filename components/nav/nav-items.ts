import {
  LayoutDashboard, CalendarRange, Dumbbell, AlertTriangle,
  BookOpen, GraduationCap, BarChart3, Settings, Layers,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  primary?: boolean; // shown in the mobile bottom bar
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, primary: true },
  { href: "/plan", label: "Study", icon: CalendarRange, primary: true },
  { href: "/practice", label: "Practice", icon: Dumbbell, primary: true },
  { href: "/mistakes", label: "Mistakes", icon: AlertTriangle, primary: true },
  { href: "/notes", label: "Notes", icon: BookOpen, primary: true },
  { href: "/exam", label: "Exams", icon: GraduationCap },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const SECONDARY_ITEMS: NavItem[] = [
  { href: "/blueprint", label: "Blueprint", icon: Layers },
];
