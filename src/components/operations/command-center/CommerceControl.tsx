import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, CheckCircle2, AlertTriangle, Shield, RefreshCw, ArrowRight, TrendingUp, Lock } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ConfirmDialog } from './ConfirmDialog';

export default function CommerceControl() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ledger' | 'verify' | 'payments' | 'anomalies'>('ledger');
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const fetchLedger = useCallback(async () => {
    try {
      const data = await api.getLedger();
      setLedgerEntries(data?.entries || data?.ledgerEntries || []);
    } catch {
      setLedgerEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLedger();
    // Fetch additional data
    api.getOperationsPayments().then(d => setPaymentData(d)).catch(() => {});
    api.getLedgerAnomalies().then(d => setAnomalies(d?.anomalies || d || [])).catch(() => {});
  }, [fetchLedger]);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const result = await api.verifyLedger();
      setVerifyResult(result);
    } catch (err: any) {
      setVerifyResult({ status: 'error', message: err.message });
    } finally {
      setVerifying(false);
    }
  };

  const totalCaptured = ledgerEntries
    .filter((e: any) => e.type === 'PAYMENT_CAPTURED')
    .reduce((acc: number, e: any) => acc + (e.amountEGP || 0), 0);

  const totalCommission = ledgerEntries
    .filter((e: any) => e.type === 'PLATFORM_COMMISSION')
    .reduce((acc: number, e: any) => acc + (e.amountEGP || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-[#F7F3EA] flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#E7A83B]" />
          {language === 'ar' ? 'التحكم المالي' : 'Commerce Control'}
        </h3>
        <div className="flex gap-2">
          {(['ledger', 'payments', 'verify', 'anomalies'] as const).map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeTab === tab ? 'bg-[#20A89A] text-[#04171D]' : 'bg-white/5 text-white/50 hover:text-white/80'
              }`}>
              {tab === 'ledger' ? 'Ledger' : tab === 'payments' ? 'Payments' : tab === 'anomalies' ? 'Anomalies' : 'Verify Integrity'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#062C35] border border-white/8">
          <div className="text-[11px] text-white/40">Escrow Captured</div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{totalCaptured.toLocaleString()} EGP</div>
          <div className="text-[10px] text-white/30 mt-0.5 flex items-center gap-1"><Lock className="w-3 h-3" /> Held until service delivery</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#062C35] border border-white/8">
          <div className="text-[11px] text-white/40">Platform Commissions</div>
          <div className="text-lg font-bold text-[#E7A83B] font-mono mt-1">{totalCommission.toLocaleString()} EGP</div>
          <div className="text-[10px] text-white/30 mt-0.5">Auto-settled against supplier payables</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#062C35] border border-white/8">
          <div className="text-[11px] text-white/40">Immutable Entries</div>
          <div className="text-lg font-bold text-[#52C4B7] font-mono mt-1">{ledgerEntries.length}</div>
          <div className="text-[10px] text-white/30 mt-0.5">SHA-256 chained integrity</div>
        </div>
      </div>

      {activeTab === 'payments' && paymentData && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#062C35] border border-white/8">
              <div className="text-[11px] text-white/40">Total Captured</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{paymentData.summary?.totalCapturedEGP?.toLocaleString() || 0} EGP</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#062C35] border border-white/8">
              <div className="text-[11px] text-white/40">Total Refunded</div>
              <div className="text-lg font-bold text-red-400 font-mono mt-1">{paymentData.summary?.totalRefundedEGP?.toLocaleString() || 0} EGP</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#062C35] border border-white/8">
              <div className="text-[11px] text-white/40">Platform Commission</div>
              <div className="text-lg font-bold text-[#E7A83B] font-mono mt-1">{paymentData.summary?.totalCommissionEGP?.toLocaleString() || 0} EGP</div>
            </div>
          </div>
          {paymentData.failedPayments?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-red-400">Failed Payments ({paymentData.failedPayments.length})</h4>
              {paymentData.failedPayments.map((fp: any) => (
                <div key={fp.id} className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-red-300">{fp.bookingRef}</span>
                    <span className="text-[10px] text-white/40 ml-2">{fp.amountEGP?.toLocaleString()} EGP</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300">{fp.paymentState}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'anomalies' && (
        <div className="space-y-2">
          {anomalies.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-[#062C35] border border-white/8">
              <CheckCircle2 className="w-10 h-10 text-emerald-400/50 mx-auto mb-3" />
              <div className="text-sm font-bold text-emerald-400/80">No ledger anomalies</div>
            </div>
          ) : anomalies.map((a: any, i: number) => (
            <div key={a.id || i} className="p-3 rounded-xl bg-[#062C35] border border-white/8">
              <div className="text-xs font-bold text-[#F7F3EA]">{a.type || a.description || 'Anomaly'}</div>
              <div className="text-[10px] text-white/50 mt-0.5">{a.details || a.message || ''}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'verify' && (
        <div className="p-5 rounded-2xl bg-[#062C35] border border-white/8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#F7F3EA]">Ledger Integrity Verification</h4>
              <p className="text-[11px] text-white/50 mt-0.5">Verifies SHA-256 hash chain across all ledger entries</p>
            </div>
            <button type="button" onClick={handleVerify} disabled={verifying}
              className="px-4 py-2 rounded-xl bg-[#20A89A] hover:bg-[#1B8F83] text-[#04171D] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
              <Shield className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
              {verifying ? 'Verifying…' : 'Run Verification'}
            </button>
          </div>
          {verifyResult && (
            <div className={`p-4 rounded-xl border ${
              verifyResult.valid || verifyResult.status === 'success'
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                : 'bg-red-950/20 border-red-500/30 text-red-300'
            }`}>
              <div className="flex items-center gap-2">
                {verifyResult.valid || verifyResult.status === 'success'
                  ? <CheckCircle2 className="w-5 h-5" />
                  : <AlertTriangle className="w-5 h-5" />
                }
                <span className="text-sm font-bold">
                  {verifyResult.valid || verifyResult.status === 'success'
                    ? 'Ledger integrity VERIFIED — zero discrepancies'
                    : `Verification issue: ${verifyResult.message || 'Integrity check failed'}`
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="rounded-2xl bg-[#062C35] border border-white/8 overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-sm text-white/40">
              <span className="inline-block w-5 h-5 border-2 border-[#20A89A] border-t-transparent rounded-full animate-spin mr-2" />
              Loading ledger…
            </div>
          ) : ledgerEntries.length === 0 ? (
            <div className="py-12 text-center">
              <DollarSign className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <div className="text-sm font-bold text-white/50">No ledger entries</div>
              <div className="text-[11px] text-white/30 mt-1">Financial records will appear here after bookings.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-white/5 text-white/50 uppercase tracking-wider border-b border-white/8">
                  <tr>
                    <th className="py-2.5 px-3">Entry</th>
                    <th className="py-2.5 px-3">Booking</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Debit → Credit</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ledgerEntries.map((entry: any) => (
                    <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="text-[#52C4B7] font-bold">{entry.id}</div>
                        <div className="text-white/30 text-[10px]">{entry.transactionId}</div>
                      </td>
                      <td className="py-2.5 px-3 text-[#E7A83B] font-bold">{entry.bookingRef}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          entry.type === 'PAYMENT_CAPTURED' ? 'bg-emerald-500/20 text-emerald-300' :
                          entry.type === 'PLATFORM_COMMISSION' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-sky-500/20 text-sky-300'
                        }`}>{entry.type}</span>
                      </td>
                      <td className="py-2.5 px-3 text-white/60">
                        {entry.debitAccount} → <span className="text-emerald-400">{entry.creditAccount}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#F7F3EA]">{entry.amountEGP?.toLocaleString()} EGP</td>
                      <td className="py-2.5 px-3">
                        <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
