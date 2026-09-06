import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, CheckCircle2, AlertTriangle, Shield, RefreshCw, ArrowRight, TrendingUp, Lock, Download } from 'lucide-react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ConfirmDialog } from './ConfirmDialog';
import { Pagination, usePagination } from './Pagination';

export default function CommerceControl() {
  const { language, t } = useLanguage();
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

  const { page: ledgerPage, setPage: setLedgerPage, totalPages: ledgerTotalPages, paginatedItems: ledgerPaginated, totalItems: ledgerTotalItems, pageSize: ledgerPageSize } = usePagination(ledgerEntries, 20);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[var(--accent-secondary)]" />
          {t('cmd.commerce.title')}
        </h3>
        <div className="flex gap-2 items-center">
          {activeTab === 'ledger' && ledgerEntries.length > 0 && (
            <button type="button" onClick={() => {
              const headers = ['ID','Booking','Type','Debit','Credit','Amount','Status','Timestamp'];
              const rows = ledgerEntries.map((e: any) => [e.id, e.bookingRef, e.type, e.debitAccount, e.creditAccount, e.amountEGP, e.status, e.timestamp]);
              const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c||'').replace(/"/g,'""')}"`).join(','))].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = `ledger-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
            }} className="px-2 py-1 rounded bg-[var(--btn-util-bg)] hover:bg-[var(--btn-util-bg)] text-[var(--text-muted)] text-[11px] font-bold flex items-center gap-1 cursor-pointer">
              <Download className="w-3 h-3" />Export
            </button>
          )}
          {(['ledger', 'payments', 'verify', 'anomalies'] as const).map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeTab === tab ? 'bg-[var(--accent-primary)] text-[var(--text-primary)]' : 'bg-[var(--btn-util-bg)] text-[var(--text-muted)] hover:text-[var(--text-muted)]'
              }`}>
              {tab === 'ledger' ? 'Ledger' : tab === 'payments' ? 'Payments' : tab === 'anomalies' ? 'Anomalies' : 'Verify Integrity'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
          <div className="text-[11px] text-[var(--text-muted)]">{t('cmd.commerce.escrowCaptured')}</div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{totalCaptured.toLocaleString()} EGP</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5 flex items-center gap-1"><Lock className="w-3 h-3" /> Held until service delivery</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
          <div className="text-[11px] text-[var(--text-muted)]">{t('cmd.commerce.platformCommissions')}</div>
          <div className="text-lg font-bold text-[var(--accent-secondary)] font-mono mt-1">{totalCommission.toLocaleString()} EGP</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Auto-settled against supplier payables</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
          <div className="text-[11px] text-[var(--text-muted)]">{t('cmd.commerce.immutableEntries')}</div>
          <div className="text-lg font-bold text-[var(--accent-primary)] font-mono mt-1">{ledgerEntries.length}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">SHA-256 chained integrity</div>
        </div>
      </div>

      {activeTab === 'payments' && paymentData && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <div className="text-[11px] text-[var(--text-muted)]">Total Captured</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{paymentData.summary?.totalCapturedEGP?.toLocaleString() || 0} EGP</div>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <div className="text-[11px] text-[var(--text-muted)]">Total Refunded</div>
              <div className="text-lg font-bold text-red-400 font-mono mt-1">{paymentData.summary?.totalRefundedEGP?.toLocaleString() || 0} EGP</div>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <div className="text-[11px] text-[var(--text-muted)]">Platform Commission</div>
              <div className="text-lg font-bold text-[var(--accent-secondary)] font-mono mt-1">{paymentData.summary?.totalCommissionEGP?.toLocaleString() || 0} EGP</div>
            </div>
          </div>
          {paymentData.failedPayments?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-red-400">Failed Payments ({paymentData.failedPayments.length})</h4>
              {paymentData.failedPayments.map((fp: any) => (
                <div key={fp.id} className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-red-300">{fp.bookingRef}</span>
                    <span className="text-[11px] text-[var(--text-muted)] ml-2">{fp.amountEGP?.toLocaleString()} EGP</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-300">{fp.paymentState}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'anomalies' && (
        <div className="space-y-2">
          {anomalies.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400/50 mx-auto mb-3" />
              <div className="text-sm font-bold text-emerald-400/80">{t('cmd.commerce.noAnomalies')}</div>
            </div>
          ) : anomalies.map((a: any, i: number) => (
            <div key={a.id || i} className="p-3 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <div className="text-xs font-bold text-[var(--text-primary)]">{a.type || a.description || 'Anomaly'}</div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{a.details || a.message || ''}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'verify' && (
        <div className="p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">{t('cmd.commerce.verifyIntegrity')}</h4>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{t('cmd.commerce.verifyDesc')}</p>
            </div>
            <button type="button" onClick={handleVerify} disabled={verifying}
              className="px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)] text-[var(--text-primary)] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
              <Shield className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
              {verifying ? t('cmd.commerce.verifying') : t('cmd.commerce.runVerification')}
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
        <div className="rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-sm text-[var(--text-muted)]">
              <span className="inline-block w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mr-2" />
              {t('cmd.commerce.loadingLedger')}
            </div>
          ) : ledgerEntries.length === 0 ? (
            <div className="py-12 text-center">
              <DollarSign className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <div className="text-sm font-bold text-[var(--text-muted)]">{t('cmd.commerce.noEntries')}</div>
              <div className="text-[11px] text-[var(--text-muted)] mt-1">{t('cmd.commerce.noEntriesDesc')}</div>
            </div>
          ) : (
            <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-[var(--btn-util-bg)] text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-subtle)]">
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
                  {ledgerPaginated.map((entry: any) => (
                    <tr key={entry.id} className="hover:bg-[var(--btn-util-bg)] transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="text-[var(--accent-primary)] font-bold">{entry.id}</div>
                        <div className="text-[var(--text-muted)] text-[11px]">{entry.transactionId}</div>
                      </td>
                      <td className="py-2.5 px-3 text-[var(--accent-secondary)] font-bold">{entry.bookingRef}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          entry.type === 'PAYMENT_CAPTURED' ? 'bg-emerald-500/20 text-emerald-300' :
                          entry.type === 'PLATFORM_COMMISSION' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-sky-500/20 text-sky-300'
                        }`}>{entry.type}</span>
                      </td>
                      <td className="py-2.5 px-3 text-[var(--text-muted)]">
                        {entry.debitAccount} → <span className="text-emerald-400">{entry.creditAccount}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[var(--text-primary)]">{entry.amountEGP?.toLocaleString()} EGP</td>
                      <td className="py-2.5 px-3">
                        <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {ledgerTotalPages > 1 && (
              <div className="px-3 py-2 border-t border-[var(--border-subtle)]">
                <Pagination page={ledgerPage} totalPages={ledgerTotalPages} totalItems={ledgerTotalItems} pageSize={ledgerPageSize} onPageChange={setLedgerPage} />
              </div>
            )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
