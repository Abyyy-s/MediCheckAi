import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RiskLevel = 'low' | 'medium' | 'high';

interface RiskBadgeProps {
  level: RiskLevel;
  reasons: string[];
}

export default function RiskBadge({ level, reasons }: RiskBadgeProps) {
  const config = {
    low: {
      icon: Info,
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      border: 'border-emerald-200 dark:border-emerald-500/20',
      label: 'Safe Guidance',
    },
    medium: {
      icon: AlertCircle,
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      border: 'border-amber-200 dark:border-amber-500/20',
      label: 'Caution Advised',
    },
    high: {
      icon: ShieldAlert,
      color: 'text-rose-500 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      border: 'border-rose-200 dark:border-rose-500/20',
      label: 'Escalation Triggered',
    },
  };

  const { icon: Icon, color, bg, border, label } = config[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
      className={cn(
        'mt-3 mb-2 flex flex-col gap-2 rounded-xl p-3 border',
        bg,
        border
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn('w-4 h-4', color)} />
        <span className={cn('text-xs font-bold uppercase tracking-wider', color)}>
          {label}
        </span>
      </div>
      
      {reasons.length > 0 && (
        <ul className="space-y-1 mb-1">
          {reasons.map((r, i) => (
            <motion.li
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              key={i}
              className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5"
            >
              <span className={cn("mt-1.5 w-1 h-1 rounded-full shrink-0", level === 'high' ? 'bg-rose-500' : level === 'medium' ? 'bg-amber-500' : 'bg-emerald-500')} />
              {r}
            </motion.li>
          ))}
        </ul>
      )}
      
      {level === 'high' && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 w-fit px-2 py-1 rounded"
        >
          <AlertTriangle className="w-3 h-3" />
          CAREGIVER ALERT SENT VIA SMS
        </motion.div>
      )}
    </motion.div>
  );
}
