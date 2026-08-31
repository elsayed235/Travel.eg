import React, { useState, useEffect, useCallback } from 'react';
import { Users, CheckCircle2, AlertTriangle, Shield, Eye, Phone, Star, MapPin, ExternalLink, RefreshCw, TrendingUp, Package } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function SupplierCommand() {
  const { language, t } = useLanguage();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [reliability, setReliability] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [view, setView] = useState<'list' | 'reliability'>('list');

  const fetchSuppliers = useCallback(async () => {
    try {
      const [suppData, relData] = await Promise.allSettled([
        api.getSuppliers(),
        api.getSupplierReliability(),
      ]);
      if (suppData.status === 'fulfilled') setSuppliers((suppData.value as any)?.suppliers || []);
      if (relData.status === 'fulfilled') setReliability((relData.value as any)?.suppliers || []);
    } catch { setSuppliers([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSuppliers(); const i = setInterval(fetchSuppliers, 30_000); return () => clearInterval(i); }, [fetchSuppliers]);

  const filtered = filter === 'all' ? suppliers : suppliers.filter(s => s.status?.toLowerCase().includes(filter.toLowerCase()));

  const statusColors: Record<string, string> = {
    Active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Pending_Verification: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Suspended: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  if (selectedSupplier) {
    return <SupplierDetail supplier={selectedSupplier} onBack={() => setSelectedSupplier(null)} reliability={reliability.find(r => r.supplierId === selectedSupplier.id)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-[#F7F3EA] flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-400" />
          {t('cmd.suppliers.title')}
        </h3>
        <div className="flex items-center gap-2">
          {['list', 'reliability'].map(v => (
            <button key={v} type="button" onClick={() => setView(v as any)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${view === v ? 'bg-[#20A89A] text-[#04171D]' : 'bg-white/5 text-white/50 hover:text-white/80'}`}>
              {v === 'list' ? t('cmd.suppliers.list') : t('cmd.suppliers.reliability')}
            </button>
          ))}
          {view === 'list' && ['all', 'Active', 'Pending', 'Suspended'].map(f => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${filter === f ? 'bg-[#20A89A] text-[#04171D]' : 'bg-white/5 text-white/50 hover:text-white/80'}`}>
              {f}
            </button>
          ))}
          <button type="button" onClick={() => fetchSuppliers()} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-white/40">
          <span className="inline-block w-5 h-5 border-2 border-[#20A89A] border-t-transparent rounded-full animate-spin mr-2" />
          {t('cmd.suppliers.loading')}
        </div>
      ) : view === 'reliability' ? (
        <div className="space-y-2">
          {reliability.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-[#062C35] border border-white/8">
              <TrendingUp className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <div className="text-sm font-bold text-white/50">No reliability data</div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#062C35] border border-white/8 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead className="bg-white/5 text-white/50 uppercase tracking-wider border-b border-white/8">
                    <tr>
                      <th className="py-2.5 px-3">Supplier</th>
                      <th className="py-2.5 px-3 text-center">Bookings</th>
                      <th className="py-2.5 px-3 text-center">Confirm %</th>
                      <th className="py-2.5 px-3 text-center">Reject %</th>
                      <th className="py-2.5 px-3 text-center">Pending</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reliability.map((r: any) => (
                      <tr key={r.supplierId} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => {
                        const sup = suppliers.find(s => s.id === r.supplierId);
                        if (sup) setSelectedSupplier(sup);
                      }}>
                        <td className="py-2.5 px-3">
                          <div className="text-[#52C4B7] font-bold">{r.businessName}</div>
                          <div className="text-white/30 text-[9px]">{r.supplierId}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">{r.totalBookings}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={r.confirmationRate >= 80 ? 'text-emerald-400' : r.confirmationRate >= 50 ? 'text-amber-400' : 'text-red-400'}>
                            {r.confirmationRate}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={r.rejectionRate <= 10 ? 'text-emerald-400' : r.rejectionRate <= 30 ? 'text-amber-400' : 'text-red-400'}>
                            {r.rejectionRate}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-400">{r.pendingCount}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${statusColors[r.status] || 'bg-white/5 text-white/40 border-white/10'}`}>
                            {r.status?.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-[#062C35] border border-white/8">
          <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <div className="text-sm font-bold text-white/50">{t('cmd.suppliers.noSuppliers')}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(supplier => {
            const rel = reliability.find(r => r.supplierId === supplier.id);
            return (
              <button key={supplier.id} type="button" onClick={() => setSelectedSupplier(supplier)}
                className="p-4 rounded-2xl bg-[#062C35] border border-white/8 hover:border-[#20A89A]/30 transition-all text-left cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-xs font-mono text-[#52C4B7]">{supplier.id}</div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${statusColors[supplier.status] || 'bg-white/5 text-white/40 border-white/10'}`}>
                    {supplier.status?.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#F7F3EA]">{supplier.businessName}</div>
                <div className="text-[11px] text-white/50 mt-0.5">{supplier.businessNameAr}</div>
                <div className="mt-3 space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-white/50">
                    <Shield className="w-3 h-3" /> {supplier.category} · {supplier.tier}
                  </div>
                  <div className="flex items-center gap-1.5 text-white/50">
                    <MapPin className="w-3 h-3" /> {supplier.area || '—'}
                  </div>
                  {supplier.rating && (
                    <div className="flex items-center gap-1.5 text-[#E7A83B]">
                      <Star className="w-3 h-3 fill-current" /> {supplier.rating} ({supplier.reviewCount || 0} reviews)
                    </div>
                  )}
                  {rel && (
                    <div className="flex items-center gap-1.5 text-white/40">
                      <Package className="w-3 h-3" /> {rel.totalBookings} bookings · {rel.confirmationRate}% confirm
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-[#52C4B7] font-bold group-hover:text-[#20A89A] flex items-center gap-1 transition-colors">
                  View Dashboard <ExternalLink className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SupplierDetail({ supplier, onBack, reliability }: { supplier: any; onBack: () => void; reliability?: any }) {
  const [dashboard, setDashboard] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings'>('overview');

  useEffect(() => {
    Promise.allSettled([
      api.getSupplierDashboard(supplier.id),
      api.getSupplierBookings(supplier.id),
    ]).then(([d, b]) => {
      if (d.status === 'fulfilled') setDashboard(d.value);
      if (b.status === 'fulfilled') setBookings((b.value as any)?.bookings || []);
    }).finally(() => setLoading(false));
  }, [supplier.id]);

  const handleBookingAction = async (bookingId: string, action: string) => {
    if (!confirm(` ${action} this booking?`)) return;
    try {
      await api.respondSupplierBooking(bookingId, { supplierId: supplier.id, action: action as any });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, supplierState: action === 'ACCEPT' ? 'CONFIRMED' : action === 'REJECT' ? 'REJECTED' : b.supplierState } : b));
    } catch (err: any) { alert(`Failed: ${err.message}`); }
  };

  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="text-xs text-white/50 hover:text-white/80 cursor-pointer">← Back to suppliers</button>
      <div className="p-5 rounded-2xl bg-[#062C35] border border-white/8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">{supplier.businessName}</h3>
            <div className="text-xs text-white/50 mt-1">{supplier.id} · {supplier.category} · {supplier.tier}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              supplier.verificationStatus === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-300' :
              supplier.verificationStatus === 'PENDING' ? 'bg-amber-500/20 text-amber-300' :
              'bg-white/10 text-white/40'
            }`}>{supplier.verificationStatus?.replace(/_/g, ' ') || 'UNVERIFIED'}</span>
            {supplier.status !== 'Suspended' && (
              <button type="button" onClick={() => alert('Supplier suspension requires admin approval')} className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold cursor-pointer">Suspend</button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/5">
          <div className="text-center">
            <div className="text-lg font-bold text-[#52C4B7] font-mono">{bookings.length}</div>
            <div className="text-[10px] text-white/40">Total Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400 font-mono">{reliability?.confirmationRate || dashboard?.metrics?.confirmationRate || '—'}{typeof reliability?.confirmationRate === 'number' ? '%' : ''}</div>
            <div className="text-[10px] text-white/40">Confirmation Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#E7A83B] font-mono">{supplier.rating || '—'}</div>
            <div className="text-[10px] text-white/40">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-sky-400 font-mono">{supplier.verificationStatus?.replace(/_/g, ' ') || '—'}</div>
            <div className="text-[10px] text-white/40">Verification</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-white/8 pb-2">
        {(['overview', 'bookings'] as const).map(tab => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === tab ? 'bg-[#20A89A] text-[#04171D]' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'bookings' ? `(${bookings.length})` : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-white/40">Loading…</div>
      ) : activeTab === 'bookings' ? (
        <div className="space-y-2">
          {bookings.length === 0 ? (
            <div className="py-8 text-center text-xs text-white/40 rounded-2xl bg-[#062C35] border border-white/8">No bookings</div>
          ) : bookings.map((bk: any) => (
            <div key={bk.id} className="p-3 rounded-xl bg-[#062C35] border border-white/8 flex items-center justify-between text-xs">
              <div>
                <span className="text-[#52C4B7] font-mono font-bold">{bk.bookingRef || bk.id}</span>
                <span className="text-white/50 ml-2">{bk.serviceType || bk.skuId}</span>
                <span className="text-white/30 ml-2">{bk.scheduledDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  bk.supplierState === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300' :
                  bk.supplierState === 'PENDING_CONFIRMATION' ? 'bg-amber-500/20 text-amber-300' :
                  bk.supplierState === 'REJECTED' ? 'bg-red-500/20 text-red-300' :
                  'bg-white/10 text-white/50'
                }`}>{bk.supplierState?.replace(/_/g, ' ')}</span>
                {bk.supplierState === 'PENDING_CONFIRMATION' && (
                  <div className="flex gap-1">
                    <button type="button" onClick={() => handleBookingAction(bk.id, 'ACCEPT')}
                      className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold cursor-pointer">Accept</button>
                    <button type="button" onClick={() => handleBookingAction(bk.id, 'REJECT')}
                      className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[9px] font-bold cursor-pointer">Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-[#062C35] border border-white/8 text-xs space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-white/40">Category:</span> <span className="text-white/80 font-bold">{supplier.category}</span></div>
            <div><span className="text-white/40">Area:</span> <span className="text-white/80 font-bold">{supplier.area || '—'}</span></div>
            <div><span className="text-white/40">Tier:</span> <span className="text-white/80 font-bold">{supplier.tier}</span></div>
            <div><span className="text-white/40">Phone:</span> <span className="text-white/80 font-bold">{supplier.phone || '—'}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
