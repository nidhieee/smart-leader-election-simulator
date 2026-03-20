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
    if (log.includes('[ELECTION]')) return 'text-orange-600';
    if (log.includes('[FAILURE]')) return 'text-red-600';
    if (log.includes('[NODE]')) return 'text-blue-700';
    if (log.includes('[SIM]')) return 'text-blue-600';
    if (log.includes('[RECOVERY]')) return 'text-green-700';
    if (log.includes('[DEGRADATION]')) return 'text-orange-500';
    if (log.includes('[INIT]')) return 'text-gray-600';
    if (log.includes('[HEARTBEAT]')) return 'text-gray-500';
    return 'text-gray-700';
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Network Events
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto font-mono text-xs space-y-0.5 px-4 py-3">
        {logs.length === 0 ? (
          <div className="text-gray-500 py-4 italic text-center">Waiting for events...</div>
        ) : (
          logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={`${getLogColor(log)} break-words leading-relaxed text-xs`}
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
