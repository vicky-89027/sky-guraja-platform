import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { AuditLogItem, AuthUser } from '../types';
import { History, Search, ShieldCheck, Lock, ChevronRight, Filter, Eye } from 'lucide-react';

interface AuditLogsViewProps {
  user: AuthUser | null;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ user }) => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  useEffect(() => {
    loadLogs();
  }, [search, entityFilter]);

  const loadLogs = () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (entityFilter) query.append('entityType', entityFilter);

    api.getAuditLogs(query.toString())
      .then((res) => {
        if (res.success) setLogs(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const entities = ['ORGANIZATION', 'CONTRIBUTION', 'EXPENSE', 'CAMPAIGN', 'MEMBER', 'EVENT', 'MEETING', 'DOCUMENT', 'LEDGER_ENTRY', 'SETTINGS', 'USER'];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl lg:text-2xl font-black text-white font-display">
              Immutable Audit Trail
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Cryptographic change logs • Every action, state modification, and IP recorded permanently
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono">
          <Lock className="w-3.5 h-3.5" />
          <span>Append-Only Immutable Logs</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="p-4 bg-[#0B1B36] border border-white/10 rounded-2xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, action, entity ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#061224] border border-white/10 focus:border-amber-400 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white outline-none"
            />
          </div>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="w-full bg-[#061224] border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
          >
            <option value="">All Entity Types</option>
            {entities.map((ent) => (
              <option key={ent} value={ent}>{ent}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-[#0B1B36] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E2447] text-slate-300 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="px-4 py-3.5 font-bold">Timestamp</th>
                <th className="px-4 py-3.5 font-bold">User / Actor</th>
                <th className="px-4 py-3.5 font-bold">Action Taken</th>
                <th className="px-4 py-3.5 font-bold">Entity Type & ID</th>
                <th className="px-4 py-3.5 font-bold">IP Address</th>
                <th className="px-4 py-3.5 font-bold text-right">Inspect Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">Loading audit trail records...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">No audit logs matching query.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Timestamp */}
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                      {log.created_at}
                    </td>

                    {/* Actor */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{log.user_name}</div>
                      <span className="text-[9px] font-mono text-amber-400 uppercase font-semibold">
                        {log.user_role}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-xs text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {log.action}
                      </span>
                    </td>

                    {/* Entity */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-200">{log.entity_type}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.entity_id}</div>
                    </td>

                    {/* IP */}
                    <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                      {log.ip_address || '127.0.0.1'}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 bg-[#16335F] hover:bg-[#1E437C] text-amber-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diff Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0B1B36] border border-amber-500/40 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Audit Record Details • {selectedLog.action}
                </h3>
                <p className="text-xs text-slate-400">
                  Logged at {selectedLog.created_at} by {selectedLog.user_name} ({selectedLog.user_role})
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Previous Value */}
              <div className="p-3.5 bg-[#061224] rounded-xl border border-white/10 space-y-2">
                <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider block">
                  Previous State
                </span>
                <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto p-2 bg-black/40 rounded-lg whitespace-pre-wrap">
                  {selectedLog.previous_value_json
                    ? JSON.stringify(JSON.parse(selectedLog.previous_value_json), null, 2)
                    : 'None / Initial Creation'}
                </pre>
              </div>

              {/* New Value */}
              <div className="p-3.5 bg-[#061224] rounded-xl border border-white/10 space-y-2">
                <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                  Modified New State
                </span>
                <pre className="font-mono text-[11px] text-emerald-300 overflow-x-auto p-2 bg-black/40 rounded-lg whitespace-pre-wrap">
                  {selectedLog.new_value_json
                    ? JSON.stringify(JSON.parse(selectedLog.new_value_json), null, 2)
                    : 'N/A'}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 bg-[#16335F] text-white text-xs font-bold rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
