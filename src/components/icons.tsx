import {
  Recycle,
  GlassWater,
  Newspaper,
  Leaf,
  Trash2,
  Map,
  Users,
  LayoutDashboard,
  FileText,
  Trophy,
  Lightbulb,
  LogOut,
  User,
  Truck,
  Shield,
  type LucideProps,
  Check,
  X,
  Plus,
  Trash,
} from 'lucide-react';
import type { BinType } from '@/lib/types';

export const Icons = {
  plastic: Recycle,
  glass: GlassWater,
  paper: Newspaper,
  organic: Leaf,
  unknown: Trash2,
  map: Map,
  users: Users,
  dashboard: LayoutDashboard,
  reports: FileText,
  leaderboard: Trophy,
  tips: Lightbulb,
  logout: LogOut,
  citizen: User,
  collector: Truck,
  admin: Shield,
  check: Check,
  close: X,
  add: Plus,
  delete: Trash,
};

type BinIconProps = LucideProps & {
  type: BinType | 'unknown';
};

export const BinIcon = ({ type, ...props }: BinIconProps) => {
  const IconComponent = Icons[type] || Icons.unknown;
  return <IconComponent {...props} />;
};
