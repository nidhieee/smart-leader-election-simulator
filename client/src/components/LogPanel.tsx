import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../hooks/useSimulation';

export const LogPanel: React.FC = () => {
  const { logs } = useSimulation();
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-xl"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Event Log</h2>

      <div className="bg-black/50 rounded-lg p-4 h-48 overflow-y-auto border border-gray-700">
        <div className="font-mono text-sm space-y-1">
          {logs.length === 0 ? (
            <div className="text-gray-500">Waiting for events...</div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`${
                  log.includes('ELECTION')
                    ? 'text-yellow-400'
                    : log.includes('FAILURE')
                      ? 'text-red-400'
                      : log.includes('NODE')
                        ? 'text-blue-400'
                        : log.includes('SIM')
                          ? 'text-cyan-400'
                          : log.includes('RECOVERY')
                            ? 'text-green-400'
                            : log.includes('DEGRADATION')
                              ? 'text-orange-400'
                              : 'text-gray-400'
                } break-words`}
              >
                {log}
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Total events: {logs.length}
      </div>
    </motion.div>
  );
};
