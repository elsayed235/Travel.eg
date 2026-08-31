import React, { useState, useEffect, useCallback } from 'react';
import {
  Plane, CheckCircle2, AlertTriangle, Clock, RefreshCw, MapPin,
  DollarSign, User, Phone, MessageSquare, ArrowRight, ChevronRight,
  Shield, Activity, Package, Car, Zap, Calendar, ExternalLink,
} from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { TripEntity, TripItemWithSupplier, TripBookingRecord } from '../../../shared';

// ─── Trip with enriched context ─────────────────────────────────────────────
interface EnrichedTrip {
  trip: TripEntity;
  items: TripItemWithSupplier[];
  bookings: TripBookingRecord[];
}

// ─── List View ──────────────────────────────────────────────────────────────
export default function LiveTripRadar() {
  const { language } = useLanguage();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [trips, setTrips] = useState<TripEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTrips = useCallback(async () => {
    try {
      // Get all trips (the backend scopes by session for travelers,
      // but operations/admin can see all via /api/operations/overview)
      const overview = await api.getOperationsOverview();
      const ov = overview as any;
      // The overview may contain trip summaries; if not, we'll use what we have
      const tripList = ov?.trips?.list || ov?.trips || [];
      if (Array.isArray(tripList) && tripList.length > 0) {
        setTrips(tripList);
      }
      setLastUpdated(new Date());
    } catch {
      // Fallback: try getting trips for the current user's session
      try {
        const me = await api.getMe();
        if (me?.id) {
          const { trips: userTrips } = await api.getTripsForUser(me.id);
          setTrips(userTrips);
        }
      } catch {
        setTrips([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
    const interval = setInterval(fetchTrips, 30_000);
    return () => clearInterval(interval);
  }, [fetchTrips]);

  if (selectedTripId) {
    return (
      <TripCommandView
        tripId={selectedTripId}
        onBack={() => setSelectedTripId(null)}
      />
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_DESTINATION': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'CONFIRMED': return 'text-sky-400 bg-sky-500/20 border-sky-500/30';
      case 'PLANNED': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'COMPLETED': return 'text-white/40 bg-white/5 border-white/10';
      case 'CANCELLED': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_DESTINATION': return Activity;
      case 'CONFIRMED': return CheckCircle2;
      case 'PLANNED': return Clock;
      case 'COMPLETED': return CheckCircle2;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-[#F7F3EA] flex items-center gap-2">
            <Plane className="w-4 h-4 text-[#52C4B7]" />
            {language === 'ar' ? 'الرحلات الحية' : 'Live Trip Radar'}
          </h3>
          {lastUpdated && (
            <span className="text-[10px] text-white/40 font-mono">
              Updated {Math.round((Date.now() - lastUpdated.getTime()) / 1000)}s ago
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => fetchTrips()}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Trip Cards */}
      {loading ? (
        <div className="py-12 text-center text-sm text-white/40">
          <span className="inline-block w-5 h-5 border-2 border-[#20A89A] border-t-transparent rounded-full animate-spin mr-2" />
          Loading trips…
        </div>
      ) : trips.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-[#062C35] border border-white/8">
          <Plane className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <div className="text-sm font-bold text-white/50">No active trips</div>
          <div className="text-[11px] text-white/30 mt-1">Trips will appear here when travelers are in the destination.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map(trip => {
            const StatusIcon = getStatusIcon(trip.status);
            const daysActive = trip.startDate
              ? Math.ceil((Date.now() - new Date(trip.startDate).getTime()) / 86400000)
              : 0;
            return (
              <button
                key={trip.id}
                type="button"
                onClick={() => setSelectedTripId(trip.id)}
                className="p-5 rounded-2xl bg-[#062C35] border border-white/8 hover:border-[#20A89A]/30 hover:bg-[#062C35]/80 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-[11px] font-mono text-[#52C4B7]">{trip.id}</div>
                    <div className="text-sm font-bold text-[#F7F3EA] mt-0.5">{trip.title}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(trip.status)} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {trip.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  {trip.startDate && (
                    <div className="flex items-center gap-1.5 text-white/50">
                      <Calendar className="w-3 h-3" />
                      {trip.startDate}{trip.endDate ? ` → ${trip.endDate}` : ''}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-white/50">
                    <User className="w-3 h-3" />
                    {trip.travelersCount} traveler{trip.travelersCount !== 1 ? 's' : ''} · {trip.lengthDays} days
                  </div>
                  <div className="flex items-center gap-1.5 text-white/50">
                    <DollarSign className="w-3 h-3" />
                    <span className="text-[#E7A83B] font-bold">{trip.totalPaidEGP.toLocaleString()}</span>
                    <span>EGP paid</span>
                    <span className="text-white/30">/ {trip.totalEstimatedEGP.toLocaleString()} est.</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[10px] text-white/30 font-mono">{trip.budget} · {trip.pace}</div>
                  <span className="text-[10px] text-[#52C4B7] font-bold group-hover:text-[#20A89A] flex items-center gap-1 transition-colors">
                    Open Trip <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Trip Command View ──────────────────────────────────────────────────────
function TripCommandView({ tripId, onBack }: { tripId: string; onBack: () => void }) {
  const { language } = useLanguage();
  const [trip, setTrip] = useState<EnrichedTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'timeline' | 'financial' | 'transfers'>('overview');
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [tripDetail, bookingsData] = await Promise.all([
          api.getTrip(tripId),
          api.getTripBookings(tripId),
        ]);
        setTrip({
          trip: tripDetail.trip,
          items: tripDetail.items as TripItemWithSupplier[],
          bookings: bookingsData.bookings,
        });
      } catch (err) {
        console.error('Failed to load trip', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tripId]);

  const handleTransition = async (newStatus: string) => {
    if (!trip || transitioning) return;
    if (!confirm(`Transition trip to ${newStatus}?`)) return;
    setTransitioning(true);
    try {
      await api.transitionTripStatus(tripId, newStatus);
      setTrip(prev => prev ? { ...prev, trip: { ...prev.trip, status: newStatus as any } } : prev);
    } catch (err: any) {
      alert(`Failed: ${err.message}`);
    } finally {
      setTransitioning(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-white/40">
        <span className="inline-block w-5 h-5 border-2 border-[#20A89A] border-t-transparent rounded-full animate-spin mr-2" />
        Loading trip details…
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="py-12 text-center">
        <div className="text-sm text-white/50">Trip not found or access denied.</div>
        <button type="button" onClick={onBack} className="mt-3 text-xs text-[#52C4B7] hover:underline cursor-pointer">← Back to radar</button>
      </div>
    );
  }

  const t = trip.trip;
  const possibleTransitions: Record<string, string[]> = {
    DRAFT: ['PLANNED'],
    PLANNED: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['IN_DESTINATION', 'CANCELLED'],
    IN_DESTINATION: ['COMPLETED'],
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button type="button" onClick={onBack} className="text-xs text-white/50 hover:text-white/80 flex items-center gap-1 cursor-pointer">
        ← {language === 'ar' ? 'العودة للرادار' : 'Back to Trip Radar'}
      </button>

      {/* Trip Header */}
      <div className="p-5 rounded-2xl bg-[#062C35] border border-white/8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#52C4B7]">{t.id}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                t.status === 'IN_DESTINATION' ? 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' :
                t.status === 'CONFIRMED' ? 'text-sky-400 bg-sky-500/20 border-sky-500/30' :
                'text-white/40 bg-white/5 border-white/10'
              }`}>{t.status}</span>
            </div>
            <h2 className="text-lg font-bold text-[#F7F3EA] mt-1 font-['Outfit',sans-serif]">{t.title}</h2>
            <div className="text-xs text-white/50 mt-1">
              {t.travelersCount} traveler{t.travelersCount !== 1 ? 's' : ''} · {t.lengthDays} days · {t.budget} · {t.pace}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(possibleTransitions[t.status] || []).map(status => (
              <button
                key={status}
                type="button"
                onClick={() => handleTransition(status)}
                disabled={transitioning}
                className="px-3 py-1.5 rounded-lg bg-[#20A89A]/20 hover:bg-[#20A89A]/30 text-[#52C4B7] text-xs font-bold border border-[#20A89A]/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {status === 'CANCELLED' ? 'Cancel Trip' : `→ ${status.replace('_', ' ')}`}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/5">
          <div className="text-center">
            <div className="text-lg font-bold text-[#52C4B7] font-mono">{t.totalPaidEGP.toLocaleString()}</div>
            <div className="text-[10px] text-white/40">Paid (EGP)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white/60 font-mono">{t.totalEstimatedEGP.toLocaleString()}</div>
            <div className="text-[10px] text-white/40">Estimated (EGP)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#E7A83B] font-mono">{trip.items.length}</div>
            <div className="text-[10px] text-white/40">Itinerary Items</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-sky-400 font-mono">{trip.bookings.length}</div>
            <div className="text-[10px] text-white/40">Bookings</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/8 pb-2">
        {([
          { id: 'overview' as const, label: 'Overview' },
          { id: 'bookings' as const, label: `Bookings (${trip.bookings.length})` },
          { id: 'timeline' as const, label: `Timeline (${trip.items.length})` },
          { id: 'transfers' as const, label: `Transfers` },
          { id: 'financial' as const, label: 'Financial' },
        ]).map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id ? 'bg-[#20A89A] text-[#04171D]' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="p-5 rounded-2xl bg-[#062C35] border border-white/8 text-xs space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-white/40">Start Date:</span> <span className="text-white/80 font-bold">{t.startDate || 'Not set'}</span></div>
            <div><span className="text-white/40">End Date:</span> <span className="text-white/80 font-bold">{t.endDate || 'Not set'}</span></div>
            <div><span className="text-white/40">Interests:</span> <span className="text-white/80">{t.interests?.join(', ') || '—'}</span></div>
            <div><span className="text-white/40">Created:</span> <span className="text-white/80">{t.createdAt}</span></div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-2">
          {trip.bookings.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#062C35] border border-white/8 text-center text-xs text-white/40">
              <Package className="w-8 h-8 mx-auto mb-2 text-white/20" />
              No bookings yet
            </div>
          ) : (
            trip.bookings.map(bk => (
              <div key={bk.id} className="p-4 rounded-xl bg-[#062C35] border border-white/8 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[#52C4B7] font-mono">{bk.bookingRef}</div>
                  <div className="text-xs text-white/70">{bk.serviceType} · {bk.supplierId}</div>
                  <div className="text-[11px] text-white/40">{bk.scheduledDate} {bk.scheduledTime}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    bk.paymentState === 'CAPTURED' ? 'bg-emerald-500/20 text-emerald-300' :
                    bk.paymentState === 'PENDING' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-white/10 text-white/50'
                  }`}>{bk.paymentState}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    bk.supplierState === 'CONFIRMED' || bk.supplierState === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' :
                    bk.supplierState === 'PENDING_CONFIRMATION' ? 'bg-amber-500/20 text-amber-300' :
                    bk.supplierState === 'REJECTED' ? 'bg-red-500/20 text-red-300' :
                    'bg-white/10 text-white/50'
                  }`}>{bk.supplierState?.replace(/_/g, ' ')}</span>
                  <span className="text-[11px] text-[#E7A83B] font-bold font-mono">{bk.amountEGP.toLocaleString()} EGP</span>
                  <button type="button" onClick={async () => {
                    const msg = prompt(`Send SMS to supplier for booking ${bk.bookingRef}:`);
                    if (!msg) return;
                    try {
                      await api.sendOpsSmsDispatch({ to: '+201000000000', recipientName: bk.supplierId, message: msg, bookingRef: bk.bookingRef });
                      alert('SMS sent successfully');
                    } catch (err: any) { alert(`Failed: ${err.message}`); }
                  }} className="px-2 py-0.5 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[10px] font-bold cursor-pointer">
                    <MessageSquare className="w-3 h-3 inline mr-0.5" />SMS
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-2">
          {trip.items.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#062C35] border border-white/8 text-center text-xs text-white/40">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-white/20" />
              No itinerary items
            </div>
          ) : (
            trip.items.map(item => (
              <div key={item.id} className="p-4 rounded-xl bg-[#062C35] border border-white/8 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono font-bold text-white/50">
                    D{item.dayNumber}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#F7F3EA]">{item.title}</div>
                    <div className="text-[11px] text-white/40">{item.timeSlot || '—'} · {item.serviceType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'CONFIRMED' || item.status === 'BOOKED' ? 'bg-emerald-500/20 text-emerald-300' :
                    item.status === 'HELD' ? 'bg-sky-500/20 text-sky-300' :
                    'bg-white/10 text-white/50'
                  }`}>{item.status}</span>
                  <span className="text-[11px] text-[#E7A83B] font-mono">{item.priceEGP.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'transfers' && (
        <div className="space-y-2">
          {trip.bookings.filter(b => b.serviceType === 'transfer').length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#062C35] border border-white/8 text-center text-xs text-white/40">
              <Car className="w-8 h-8 mx-auto mb-2 text-white/20" />
              No transfers for this trip
            </div>
          ) : trip.bookings.filter(b => b.serviceType === 'transfer').map(bk => (
            <div key={bk.id} className="p-4 rounded-xl bg-[#062C35] border border-white/8 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-[#52C4B7] font-mono">{bk.bookingRef}</div>
                <div className="text-[11px] text-white/50">{bk.scheduledDate} {bk.scheduledTime}</div>
                <div className="text-[10px] text-white/40">{bk.supplierState?.replace(/_/g, ' ')}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#E7A83B] font-bold font-mono">{bk.amountEGP.toLocaleString()} EGP</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'financial' && (
        <div className="p-5 rounded-2xl bg-[#062C35] border border-white/8 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-white/40">Total Estimated:</span> <span className="text-white/80 font-bold">{t.totalEstimatedEGP.toLocaleString()} EGP</span></div>
            <div><span className="text-white/40">Total Paid:</span> <span className="text-emerald-400 font-bold">{t.totalPaidEGP.toLocaleString()} EGP</span></div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5">
            <span className="text-white/40">Remaining:</span> <span className="text-[#E7A83B] font-bold">
              {(t.totalEstimatedEGP - t.totalPaidEGP).toLocaleString()} EGP
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
