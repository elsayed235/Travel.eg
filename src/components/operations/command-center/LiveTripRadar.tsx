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
  const { language, t } = useLanguage();
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
      case 'COMPLETED': return 'text-[var(--text-muted)] bg-[var(--btn-util-bg)] border-[var(--border-subtle)]';
      case 'CANCELLED': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-[var(--text-muted)] bg-[var(--btn-util-bg)] border-[var(--border-subtle)]';
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
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Plane className="w-4 h-4 text-[var(--accent-primary)]" />
            {t('cmd.trips.title')}
          </h3>
          {lastUpdated && (
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              Updated {Math.round((Date.now() - lastUpdated.getTime()) / 1000)}s ago
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => fetchTrips()}
          className="px-3 py-1.5 rounded-lg bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] text-xs font-medium flex items-center gap-1.5 transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Trip Cards */}
      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--text-muted)]">
          <span className="inline-block w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mr-2" />
          {t('cmd.trips.loading')}
        </div>
      ) : trips.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
          <Plane className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
          <div className="text-sm font-bold text-[var(--text-muted)]">{t('cmd.trips.noTrips')}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">{t('cmd.trips.noTripsDesc')}</div>
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
                className="p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 hover:bg-[var(--surface-container)]/80 transition-[background-color,border-color,color,box-shadow,transform,opacity] text-left cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-[11px] font-mono text-[var(--accent-primary)]">{trip.id}</div>
                    <div className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{trip.title}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getStatusColor(trip.status)} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {trip.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  {trip.startDate && (
                    <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                      <Calendar className="w-3 h-3" />
                      {trip.startDate}{trip.endDate ? ` → ${trip.endDate}` : ''}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <User className="w-3 h-3" />
                    {trip.travelersCount} traveler{trip.travelersCount !== 1 ? 's' : ''} · {trip.lengthDays} days
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <DollarSign className="w-3 h-3" />
                    <span className="text-[var(--accent-secondary)] font-bold">{trip.totalPaidEGP.toLocaleString()}</span>
                    <span>EGP paid</span>
                    <span className="text-[var(--text-muted)]">/ {trip.totalEstimatedEGP.toLocaleString()} est.</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">{trip.budget} · {trip.pace}</div>
                  <span className="text-[11px] text-[var(--accent-primary)] font-bold group-hover:text-[var(--accent-primary)] flex items-center gap-1 transition-colors">
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
  const { language, t } = useLanguage();
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
      <div className="py-12 text-center text-sm text-[var(--text-muted)]">
        <span className="inline-block w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mr-2" />
        {t('cmd.trips.loadingDetails')}
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="py-12 text-center">
        <div className="text-sm text-[var(--text-muted)]">{t('cmd.trips.notFound')}</div>
        <button type="button" onClick={onBack} className="mt-3 text-xs text-[var(--accent-primary)] hover:underline cursor-pointer">← {t('cmd.trips.backToRadar')}</button>
      </div>
    );
  }

  const tripData = trip.trip;
  const possibleTransitions: Record<string, string[]> = {
    DRAFT: ['PLANNED'],
    PLANNED: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['IN_DESTINATION', 'CANCELLED'],
    IN_DESTINATION: ['COMPLETED'],
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button type="button" onClick={onBack} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-muted)] flex items-center gap-1 cursor-pointer">
        ← {t('cmd.trips.backToRadar')}
      </button>

      {/* Trip Header */}
      <div className="p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[var(--accent-primary)]">{tripData.id}</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                tripData.status === 'IN_DESTINATION' ? 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' :
                tripData.status === 'CONFIRMED' ? 'text-sky-400 bg-sky-500/20 border-sky-500/30' :
                'text-[var(--text-muted)] bg-[var(--btn-util-bg)] border-[var(--border-subtle)]'
              }`}>{tripData.status}</span>
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mt-1">{tripData.title}</h2>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              {tripData.travelersCount} traveler{tripData.travelersCount !== 1 ? 's' : ''} · {tripData.lengthDays} days · {tripData.budget} · {tripData.pace}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(possibleTransitions[tripData.status] || []).map(status => (
              <button
                key={status}
                type="button"
                onClick={() => handleTransition(status)}
                disabled={transitioning}
                className="px-3 py-1.5 rounded-lg bg-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-xs font-bold border border-[var(--accent-primary)]/30 transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer disabled:opacity-50"
              >
                {status === 'CANCELLED' ? 'Cancel Trip' : `→ ${status.replace('_', ' ')}`}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[var(--border-subtle)]">
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--accent-primary)] font-mono">{tripData.totalPaidEGP.toLocaleString()}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{t('cmd.trips.paidLabel')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--text-muted)] font-mono">{tripData.totalEstimatedEGP.toLocaleString()}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{t('cmd.trips.estimatedLabel')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--accent-secondary)] font-mono">{trip.items.length}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{t('cmd.trips.itineraryItems')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-sky-400 font-mono">{trip.bookings.length}</div>
            <div className="text-[11px] text-[var(--text-muted)]">Bookings</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border-subtle)] pb-2">
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
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer ${
              activeTab === tab.id ? 'bg-[var(--accent-primary)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-muted)] hover:bg-[var(--btn-util-bg)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] text-xs space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-[var(--text-muted)]">{t('cmd.trips.startDate')}:</span> <span className="text-[var(--text-muted)] font-bold">{tripData.startDate || t('cmd.trips.notSet')}</span></div>
            <div><span className="text-[var(--text-muted)]">{t('cmd.trips.endDate')}:</span> <span className="text-[var(--text-muted)] font-bold">{tripData.endDate || t('cmd.trips.notSet')}</span></div>
            <div><span className="text-[var(--text-muted)]">Interests:</span> <span className="text-[var(--text-muted)]">{tripData.interests?.join(', ') || '—'}</span></div>
            <div><span className="text-[var(--text-muted)]">Created:</span> <span className="text-[var(--text-muted)]">{tripData.createdAt}</span></div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-2">
          {trip.bookings.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)]">
              <Package className="w-8 h-8 mx-auto mb-2 text-[var(--text-muted)]" />
              {t('cmd.trips.noBookings')}
            </div>
          ) : (
            trip.bookings.map(bk => (
              <div key={bk.id} className="p-4 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[var(--accent-primary)] font-mono">{bk.bookingRef}</div>
                  <div className="text-xs text-[var(--text-muted)]">{bk.serviceType} · {bk.supplierId}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{bk.scheduledDate} {bk.scheduledTime}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    bk.paymentState === 'CAPTURED' ? 'bg-emerald-500/20 text-emerald-300' :
                    bk.paymentState === 'PENDING' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-[var(--btn-util-bg)] text-[var(--text-muted)]'
                  }`}>{bk.paymentState}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    bk.supplierState === 'CONFIRMED' || bk.supplierState === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' :
                    bk.supplierState === 'PENDING_CONFIRMATION' ? 'bg-amber-500/20 text-amber-300' :
                    bk.supplierState === 'REJECTED' ? 'bg-red-500/20 text-red-300' :
                    'bg-[var(--btn-util-bg)] text-[var(--text-muted)]'
                  }`}>{bk.supplierState?.replace(/_/g, ' ')}</span>
                  <span className="text-[11px] text-[var(--accent-secondary)] font-bold font-mono">{bk.amountEGP.toLocaleString()} EGP</span>
                  <button type="button" onClick={async () => {
                    const msg = prompt(`Send SMS to supplier for booking ${bk.bookingRef}:`);
                    if (!msg) return;
                    try {
                      await api.sendOpsSmsDispatch({ to: '+201000000000', recipientName: bk.supplierId, message: msg, bookingRef: bk.bookingRef });
                      alert('SMS sent successfully');
                    } catch (err: any) { alert(`Failed: ${err.message}`); }
                  }} className="px-2 py-0.5 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[11px] font-bold cursor-pointer">
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
            <div className="p-8 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)]">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-[var(--text-muted)]" />
              {t('cmd.trips.noTimeline')}
            </div>
          ) : (
            trip.items.map(item => (
              <div key={item.id} className="p-4 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--btn-util-bg)] border border-[var(--border-subtle)] flex items-center justify-center text-[11px] font-mono font-bold text-[var(--text-muted)]">
                    D{item.dayNumber}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--text-primary)]">{item.title}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{item.timeSlot || '—'} · {item.serviceType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    item.status === 'CONFIRMED' || item.status === 'BOOKED' ? 'bg-emerald-500/20 text-emerald-300' :
                    item.status === 'HELD' ? 'bg-sky-500/20 text-sky-300' :
                    'bg-[var(--btn-util-bg)] text-[var(--text-muted)]'
                  }`}>{item.status}</span>
                  <span className="text-[11px] text-[var(--accent-secondary)] font-mono">{item.priceEGP.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'transfers' && (
        <div className="space-y-2">
          {trip.bookings.filter(b => b.serviceType === 'transfer').length === 0 ? (
            <div className="p-8 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)]">
              <Car className="w-8 h-8 mx-auto mb-2 text-[var(--text-muted)]" />
              {t('cmd.trips.noTransfers')}
            </div>
          ) : trip.bookings.filter(b => b.serviceType === 'transfer').map(bk => (
            <div key={bk.id} className="p-4 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-[var(--accent-primary)] font-mono">{bk.bookingRef}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{bk.scheduledDate} {bk.scheduledTime}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{bk.supplierState?.replace(/_/g, ' ')}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--accent-secondary)] font-bold font-mono">{bk.amountEGP.toLocaleString()} EGP</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'financial' && (
        <div className="p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-[var(--text-muted)]">{t('cmd.trips.estimatedLabel')}</span> <span className="text-[var(--text-muted)] font-bold">{tripData.totalEstimatedEGP.toLocaleString()} EGP</span></div>
            <div><span className="text-[var(--text-muted)]">{t('cmd.trips.paidLabel')}</span> <span className="text-emerald-400 font-bold">{tripData.totalPaidEGP.toLocaleString()} EGP</span></div>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">{t('cmd.trips.remaining')}</span> <span className="text-[var(--accent-secondary)] font-bold">
              {(tripData.totalEstimatedEGP - tripData.totalPaidEGP).toLocaleString()} EGP
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
