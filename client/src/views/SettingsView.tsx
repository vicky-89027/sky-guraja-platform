import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { AuthUser } from '../types';
import { Sliders, Building, ShieldCheck, CheckCircle2, Save, Sparkles, Layers } from 'lucide-react';

interface SettingsViewProps {
  user: AuthUser | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [thresholds, setThresholds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    setLoading(true);
    api.getSettings()
      .then((res) => {
        if (res.success) {
          setSettings(res.data.settings || {});
          setThresholds(res.data.thresholds || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await api.updateSettings(settings);
      await api.updateThresholds(thresholds);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSettingKey = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const updateThresholdRole = (index: number, role: string, checked: boolean) => {
    const next = [...thresholds];
    let roles = [...(next[index].required_roles || [])];
    if (checked && !roles.includes(role)) {
      roles.push(role);
    } else if (!checked) {
      roles = roles.filter((r) => r !== role);
    }
    next[index].required_roles = roles;
    setThresholds(next);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl lg:text-2xl font-black text-white font-display">
              System Settings & Dynamic Approval Tiers
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Configure organization metadata, receipt prefix, and multi-tier approval thresholds
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Organization settings and approval thresholds updated and audited successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Organization Details */}
        <div className="p-6 bg-[#0B1B36] border border-white/10 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2 border-b border-white/10 pb-3">
            <Building className="w-4 h-4 text-amber-400" />
            Organization Profile & Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Organization Official Name</label>
              <input
                type="text"
                value={settings.org_name || ''}
                onChange={(e) => updateSettingKey('org_name', e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Monogram / Abbreviation</label>
              <input
                type="text"
                value={settings.org_monogram || ''}
                onChange={(e) => updateSettingKey('org_monogram', e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Headquarters Address</label>
              <input
                type="text"
                value={settings.org_address || ''}
                onChange={(e) => updateSettingKey('org_address', e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={settings.org_phone || ''}
                onChange={(e) => updateSettingKey('org_phone', e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Email</label>
              <input
                type="text"
                value={settings.org_email || ''}
                onChange={(e) => updateSettingKey('org_email', e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Configurable Multi-Tier Approval Matrix */}
        <div className="p-6 bg-[#0B1B36] border border-white/10 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Configurable Multi-Tier Expense Approval Thresholds (Rule 13)
            </h3>
            <span className="text-[10px] text-amber-300 font-mono">Dynamic Resolution</span>
          </div>

          <div className="space-y-3">
            {thresholds.map((t, idx) => (
              <div key={t.id} className="p-4 bg-[#061224] border border-white/5 rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">{t.tier_name}</span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    ₹{t.min_amount} to {t.max_amount ? `₹${t.max_amount}` : 'Above'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 block">Required Approver Sign-offs for this Tier:</span>
                  <div className="flex flex-wrap gap-4 pt-1">
                    {['TREASURER', 'SECRETARY', 'PRESIDENT'].map((role) => {
                      const isChecked = t.required_roles?.includes(role);
                      return (
                        <label key={role} className="flex items-center gap-2 cursor-pointer text-slate-300">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => updateThresholdRole(idx, role, e.target.checked)}
                            className="w-4 h-4 rounded text-amber-500 accent-amber-500"
                          />
                          <span className="font-semibold text-xs">{role}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save System Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
