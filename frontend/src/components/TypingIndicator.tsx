import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm w-16 mb-2">
      <div className="flex space-x-1.5 items-center m-auto">
        <motion.div
          className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        />
        <motion.div
          className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
      </div>
    </div>
  );
}
