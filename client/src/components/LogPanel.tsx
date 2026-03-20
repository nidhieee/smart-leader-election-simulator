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
    if (log.includes('[ELECTION]')) return 'text-yellow-400';
    if (log.includes('[FAILURE]')) return 'text-red-400';
    if (log.includes('[NODE]')) return 'text-blue-400';
    if (log.includes('[SIM]')) return 'text-cyan-400';
    if (log.includes('[RECOVERY]')) return 'text-green-400';
    if (log.includes('[DEGRADATION]')) return 'text-orange-400';
    if (log.includes('[INIT]')) return 'text-purple-400';
    return 'text-gray-400';
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-white">Event Log</h3>
        <span className="text-xs text-gray-500">{logs.length} events</span>
      </div>

      <div className="flex-1 overflow-y-auto font-mono text-xs space-y-0.5 pr-2">
        {logs.length === 0 ? (
          <div className="text-gray-500 py-2">Waiting for events...</div>
        ) : (
          logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`${getLogColor(log)} break-words line-clamp-2`}
            >
              {log}
            </motion.div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};
