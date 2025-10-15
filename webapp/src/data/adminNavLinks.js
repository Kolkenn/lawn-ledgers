import {
  Home,
  Calendar,
  Users,
  FileText,
  Settings,
  ScrollText,
  Clock,
} from "lucide-react";

export const adminNavLinks = [
  { name: "nav.dashboard", path: "/dashboard", icon: Home },
  { name: "nav.schedule", path: "/schedule", icon: Calendar },
  { name: "nav.clients", path: "/clients", icon: Users },
  { name: "nav.invoices", path: "/invoices", icon: FileText },
  { name: "nav.settings", path: "/settings", icon: Settings },
  { name: "nav.jobs", path: "/jobs", icon: ScrollText },
  { name: "nav.timeclock", path: "/timeclock", icon: Clock },
];
