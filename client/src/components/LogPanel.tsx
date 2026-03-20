import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../hooks/useSimulation';

export const LogPanel: React.FC = () => {
  const { logs } = useSimulation();
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (log: string): string => {
    if (log.includes('[ELECTION]')) return 'text-amber-400';
    if (log.includes('[FAILURE]')) return 'text-red-400';
    if (log.includes('[NODE]')) return 'text-blue-300';
    if (log.includes('[SIM]')) return 'text-cyan-400';
    if (log.includes('[RECOVERY]')) return 'text-emerald-400';
    if (log.includes('[DEGRADATION]')) return 'text-amber-300';
    if (log.includes('[INIT]')) return 'text-slate-400';
    if (log.includes('[HEARTBEAT]')) return 'text-slate-400';
    return 'text-slate-300';
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700/50 p-3">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-600/50">
        <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
          Event Stream
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto font-mono text-xs space-y-0.5 pr-2">
        {logs.length === 0 ? (
          <div className="text-slate-500 py-2 italic">Waiting for events...</div>
        ) : (
          logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={`${getLogColor(log)} break-words leading-relaxed`}
            >
              <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> {log}
            </motion.div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};
