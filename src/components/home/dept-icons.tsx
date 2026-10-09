import {
  Activity,
  Crown,
  HeartPulse,
  Layers,
  Pill,
  Scan,
  Shield,
  Sparkles,
  Stethoscope,
  Syringe,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const DEPT_ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  crown: Crown,
  heartpulse: HeartPulse,
  layers: Layers,
  pill: Pill,
  scan: Scan,
  shield: Shield,
  sparkles: Sparkles,
  stethoscope: Stethoscope,
  syringe: Syringe,
  zap: Zap,
};

export function deptIcon(name: string): LucideIcon {
  return DEPT_ICONS[name] ?? Sparkles;
}
