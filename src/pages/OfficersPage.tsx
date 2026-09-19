import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { FieldOfficer, StoredUser } from '../types';
import { getTelHref } from '../utils/contact';
import { formatTimeFriendly, normalizeTimestamp } from '../utils/timeUtils';
import {
  Building2,
  Clock3,
  FileText,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
  X,
  UserCheck,
} from 'lucide-react';

const normalizeSearchValue = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

const resolveLoggedInOfficer = (
  officers: FieldOfficer[],
  session: StoredUser | null,
): FieldOfficer | null => {
  if (!session) return null;

  const identifiers = [session.officerId, session.username, session.name]
    .filter((value): value is string => Boolean(value))
    .map(normalizeSearchValue);

  const matchingOfficer = officers.find((officer) => {
    const officerIdentifiers = [officer.id, officer.name].map(normalizeSearchValue);
    return identifiers.some((identifier) => officerIdentifiers.includes(identifier));
  });

  if (matchingOfficer) return matchingOfficer;

  return {
    id: session.officerId || session.username || 'AUTH-OFFICER',
    name: session.name || 'Field Operations Officer',
    department: session.department || 'DoNER Field Operations',
    rank: session.designation || 'Field Operations Officer',
    controlRoom: 'Control Desk Direct',
    status: 'Active',
    location: 'Regional Command Center',
    lat: 25.5788,
    lng: 91.8933,
    lastUpdate: normalizeTimestamp(session.loginTime || new Date().toISOString()),
    lastReportAt: normalizeTimestamp(session.loginTime || new Date().toISOString()),
    lastReport: 'Authenticated officer session active on NER-Saarthi control network.',
    sector: 'North East Logistics Network',
  };
};

export const OfficersPage: React.FC = () => {
  const { currentUser, officers, routes, setSelectedOfficer, submitFieldReport, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [detailOfficerId, setDetailOfficerId] = useState<string | null | undefined>(undefined);
  const [reportOfficerId, setReportOfficerId] = useState(officers[0]?.id || '');
  const [reportRouteId, setReportRouteId] = useState('');
  const [reportType, setReportType] = useState<'Field Officer' | 'Route Incident' | 'Road Condition'>('Field Officer');
  const [reportSeverity, setReportSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [reportObservation, setReportObservation] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const loggedInOfficer = useMemo(
    () => resolveLoggedInOfficer(officers, currentUser),
    [officers, currentUser],
  );


  const detailOfficer = useMemo(() => {
    if (detailOfficerId === null) return null;
    if (detailOfficerId === undefined) return loggedInOfficer;
    return officers.find((officer) => officer.id === detailOfficerId) || null;
  }, [detailOfficerId, loggedInOfficer, officers]);

  const filteredOfficers = useMemo(() => {
    const query = normalizeSearchValue(search);
    if (!query) return officers;

    return officers.filter((officer) => {
      const searchableOfficerData = [
        officer.id,
        officer.name,
        officer.department,
        officer.rank,
        officer.status,
        officer.location,
        officer.controlRoom,
        officer.sector,
        formatTimeFriendly(officer.lastUpdate),
        officer.lastReport,
      ]
        .join(' ')
        .toLowerCase();

      return normalizeSearchValue(searchableOfficerData).includes(query);
    });
  }, [officers, search]);

  useEffect(() => {
    if (detailOfficerId === undefined || detailOfficerId === null) return;

    window.requestAnimationFrame(() => {
      document.getElementById('officer-details')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, [detailOfficerId]);

  const openOfficerDetails = (officer: FieldOfficer) => {
    setDetailOfficerId(officer.id);
    setSelectedOfficer(officer);
  };

  const closeOfficerDetails = () => {
    setDetailOfficerId(null);
    setSelectedOfficer(null);
  };

  useEffect(() => {
    if (!officers.some((officer) => officer.id === reportOfficerId)) {
      setReportOfficerId(officers[0]?.id || '');
    }
  }, [officers, reportOfficerId]);

  const handleReportSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!reportOfficerId || !reportObservation.trim()) return;

    setIsSubmittingReport(true);
    try {
      const report = await submitFieldReport({
        officerId: reportOfficerId,
        routeId: reportRouteId || undefined,
        type: reportType,
        severity: reportSeverity,
        observation: reportObservation,
      });
      setReportObservation('');
      showToast(`Field report submitted ${formatTimeFriendly(report.createdAt)}.`);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl glass-panel border border-white/10 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center space-x-2 text-2xl font-extrabold text-[var(--text-primary)] dark:text-white">
            <ShieldCheck className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
            <span>Field Officer Network</span>
          </h1>
          <p className="mt-1 text-xs text-[var(--text-muted)] dark:text-slate-400">
            Ground operations personnel deployed across critical North Eastern corridors & mountain passes.
          </p>
          <p className="mt-2 text-[11px] font-semibold text-[var(--text-accent)] dark:text-emerald-300">
            Showing {filteredOfficers.length} of {officers.length} officer records
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)] dark:text-slate-400" />
          <input
            type="search"
            aria-label="Search field officers"
            placeholder="Search name, ID, rank, sector, phone..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] py-2.5 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-white/15 dark:bg-slate-900/90 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <section className="rounded-2xl glass-panel border border-cyan-500/20 p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">Submit field report</h2>
          <p className="mt-1 text-xs text-[var(--text-muted)] dark:text-slate-400">The submission time is captured automatically using the current system clock.</p>
        </div>
        <form onSubmit={handleReportSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <label className="text-xs font-semibold text-[var(--text-secondary)]">
            Officer
            <select value={reportOfficerId} onChange={(event) => setReportOfficerId(event.target.value)} className="mt-1 w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3 py-2.5 text-xs text-[var(--text-primary)]">
              {officers.map((officer) => <option key={officer.id} value={officer.id}>{officer.name} ({officer.id})</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-[var(--text-secondary)]">
            Route
            <select value={reportRouteId} onChange={(event) => setReportRouteId(event.target.value)} className="mt-1 w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3 py-2.5 text-xs text-[var(--text-primary)]">
              <option value="">General field report</option>
              {routes.map((route) => <option key={route.id} value={route.id}>{route.id} · {route.name}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-[var(--text-secondary)]">
            Report type
            <select value={reportType} onChange={(event) => setReportType(event.target.value as typeof reportType)} className="mt-1 w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3 py-2.5 text-xs text-[var(--text-primary)]">
              <option>Field Officer</option>
              <option>Route Incident</option>
              <option>Road Condition</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-[var(--text-secondary)]">
            Severity
            <select value={reportSeverity} onChange={(event) => setReportSeverity(event.target.value as typeof reportSeverity)} className="mt-1 w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3 py-2.5 text-xs text-[var(--text-primary)]">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-[var(--text-secondary)] md:col-span-3">
            Observation
            <textarea required minLength={3} value={reportObservation} onChange={(event) => setReportObservation(event.target.value)} placeholder="Describe the current road or route condition..." className="mt-1 min-h-20 w-full resize-y rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-dim)]" />
          </label>
          <div className="flex items-end">
            <button type="submit" disabled={isSubmittingReport || !reportOfficerId || !reportObservation.trim()} className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-[var(--text-on-action)] shadow-md transition hover:from-cyan-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
              {isSubmittingReport ? 'Submitting…' : 'Submit report'}
            </button>
          </div>
        </form>
      </section>

      {/* In-section officer profile */}
      {detailOfficer && (
        <section
          id="officer-details"
          aria-labelledby="officer-details-title"
          className="scroll-mt-24 space-y-5 rounded-2xl glass-panel border border-emerald-500/30 p-5 shadow-lg sm:p-6"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[var(--border-default)] pb-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                <UserRound className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    {loggedInOfficer?.id === detailOfficer.id ? 'Signed-in Field Officer' : 'Field Officer Profile'}
                  </span>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    {detailOfficer.status}
                  </span>
                </div>
                <h2 id="officer-details-title" className="mt-1 truncate text-xl font-extrabold text-[var(--text-primary)] dark:text-white">
                  {detailOfficer.name}
                </h2>
                <p className="truncate text-xs text-[var(--text-secondary)] dark:text-slate-300">
                  {detailOfficer.rank} · {detailOfficer.department}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeOfficerDetails}
              className="rounded-xl border border-[var(--border-default)] p-2 text-[var(--text-muted)] transition hover:border-emerald-400 hover:text-emerald-700 dark:border-white/10 dark:text-slate-300 dark:hover:text-white"
              aria-label="Close officer details"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-[var(--bg-card-subtle)] p-3 dark:bg-slate-900/60">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] dark:text-slate-400">
                <Building2 className="h-3.5 w-3.5" /> Department
              </span>
              <p className="mt-1 font-bold text-[var(--text-primary)] dark:text-slate-100">{detailOfficer.department}</p>
            </div>
            <div className="rounded-xl bg-[var(--bg-card-subtle)] p-3 dark:bg-slate-900/60">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] dark:text-slate-400">
                <MapPin className="h-3.5 w-3.5" /> Location
              </span>
              <p className="mt-1 font-bold text-[var(--text-primary)] dark:text-slate-100">{detailOfficer.location}</p>
              <p className="text-[11px] text-[var(--text-muted)] dark:text-slate-400">{detailOfficer.sector}</p>
            </div>
            <div className="rounded-xl bg-[var(--bg-card-subtle)] p-3 dark:bg-slate-900/60">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] dark:text-slate-400">
                <Phone className="h-3.5 w-3.5" /> Control Room
              </span>
              {getTelHref(detailOfficer.controlRoom) ? (
                <a
                  href={getTelHref(detailOfficer.controlRoom) || undefined}
                  className="mt-1 inline-flex font-mono font-bold text-emerald-700 underline decoration-emerald-500/40 underline-offset-2 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
                  aria-label={`Call ${detailOfficer.name}`}
                >
                  {detailOfficer.controlRoom}
                </a>
              ) : (
                <p className="mt-1 font-mono font-bold text-[var(--text-muted)] dark:text-slate-400">Not available</p>
              )}
            </div>
            <div className="rounded-xl bg-[var(--bg-card-subtle)] p-3 dark:bg-slate-900/60">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] dark:text-slate-400">
                <Clock3 className="h-3.5 w-3.5" /> Last update
              </span>
              <p className="mt-1 font-bold text-[var(--text-primary)] dark:text-slate-100">{formatTimeFriendly(detailOfficer.lastUpdate)}</p>
              <p className="text-[11px] text-[var(--text-muted)] dark:text-slate-400">ID: {detailOfficer.id}</p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 dark:border-white/10 dark:bg-slate-900/60">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] dark:text-slate-200">
              <FileText className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span>Latest Field Report</span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)] dark:text-slate-300">
              “{detailOfficer.lastReport}”
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {getTelHref(detailOfficer.controlRoom) && (
              <a
                href={getTelHref(detailOfficer.controlRoom) || undefined}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-[var(--text-on-action)] transition hover:bg-emerald-500"
              >
                <Phone className="h-3.5 w-3.5" /> Call Officer Desk
              </a>
            )}
            <button
              type="button"
              onClick={closeOfficerDetails}
              className="rounded-xl border border-[var(--border-default)] px-4 py-2 text-xs font-bold text-[var(--text-secondary)] transition hover:border-emerald-400 hover:text-emerald-700 dark:border-white/15 dark:text-slate-300 dark:hover:text-white"
            >
              Close Details
            </button>
          </div>
        </section>
      )}

      {/* Officers Grid */}
      {filteredOfficers.length > 0 ? (
        <div className="space-y-8">
          {/* Section 1: Currently Logged-in Officer */}
          {loggedInOfficer && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-slate-900">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </span>
                <h2 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Currently Logged-in Officer Profile
                </h2>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300">
                  Authenticated Session
                </span>
              </div>

              <article
                onClick={() => openOfficerDetails(loggedInOfficer)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl glass-panel border-2 border-emerald-500/60 bg-gradient-to-r from-emerald-500/15 via-teal-500/5 to-transparent p-6 shadow-xl transition-all hover:border-emerald-400"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        Official ID: {loggedInOfficer.id}
                      </span>
                      <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-black uppercase text-white shadow-sm flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        Logged In User
                      </span>
                      <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                        🟢 {loggedInOfficer.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                        {loggedInOfficer.name}
                      </h3>
                      <p className="text-xs font-bold text-cyan-700 dark:text-cyan-300 mt-0.5">
                        {loggedInOfficer.rank}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {loggedInOfficer.department}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-700 dark:text-slate-300 pt-1">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <MapPin className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        {loggedInOfficer.location} ({loggedInOfficer.sector})
                      </span>
                      <span className="flex items-center gap-1.5 font-mono font-semibold">
                        <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Control Desk: {loggedInOfficer.controlRoom}
                      </span>
                    </div>

                    <div className="mt-2 rounded-xl border border-emerald-500/20 bg-slate-900/80 p-3 text-xs italic text-slate-200">
                      <span className="not-italic font-bold text-slate-400 text-[10px] uppercase block mb-0.5">Latest Field Report:</span>
                      "{loggedInOfficer.lastReport}"
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 shrink-0 lg:w-auto w-full">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openOfficerDetails(loggedInOfficer);
                      }}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-xs font-extrabold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition active:scale-95"
                    >
                      View Full Officer Details
                    </button>
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* Section 2: Other Registered Field Officers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-2 dark:border-white/10">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Other Registered Field Officers ({filteredOfficers.filter(o => o.id !== loggedInOfficer?.id).length})
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredOfficers
                .filter((officer) => officer.id !== loggedInOfficer?.id)
                .map((officer) => {
                  const phoneHref = getTelHref(officer.controlRoom);

                  return (
                    <article
                      key={officer.id}
                      onClick={() => openOfficerDetails(officer)}
                      className="group flex cursor-pointer flex-col justify-between space-y-4 rounded-2xl glass-card border p-5 transition-all hover:border-emerald-400/50"
                    >
                      <div className="space-y-3">
                        {/* Badge & Name */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">{officer.id}</span>
                          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                            🟢 {officer.status}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-[var(--text-primary)] transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300">
                            {officer.name}
                          </h3>
                          <p className="text-xs font-medium text-[var(--text-secondary)] dark:text-slate-300">{officer.rank}</p>
                          <p className="text-xs text-[var(--text-muted)] dark:text-slate-400">{officer.department}</p>
                        </div>

                        {/* Location & Contact */}
                        <div className="space-y-1.5 border-t border-[var(--border-default)] pt-2 text-xs dark:border-white/10">
                          <div className="flex items-center space-x-1.5 text-[var(--text-secondary)] dark:text-slate-300">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                            <span className="truncate">{officer.location} ({officer.sector})</span>
                          </div>
                          {phoneHref ? (
                            <a
                              href={phoneHref}
                              onClick={(event) => event.stopPropagation()}
                              className="flex items-center space-x-1.5 font-mono text-[var(--text-muted)] underline decoration-emerald-500/40 underline-offset-2 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-300"
                              aria-label={`Call ${officer.name}`}
                            >
                              <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                              <span>Control Desk: {officer.controlRoom}</span>
                            </a>
                          ) : (
                            <div className="flex items-center space-x-1.5 font-mono text-[var(--text-muted)] dark:text-slate-400">
                              <Phone className="h-3.5 w-3.5 shrink-0 text-[var(--text-dim)]" />
                              <span>Control Desk: Not available</span>
                            </div>
                          )}
                        </div>

                        {/* Last Report */}
                        <div className="space-y-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] p-3 text-xs dark:border-white/5 dark:bg-slate-900/70">
                          <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] dark:text-slate-400">Latest Field Report:</span>
                          <p className="line-clamp-2 italic text-[var(--text-secondary)] dark:text-slate-300">
                            “{officer.lastReport}”
                          </p>
                          <p className="text-right text-[10px] text-[var(--text-muted)] dark:text-slate-400">Reported {formatTimeFriendly(officer.lastReportAt || officer.lastUpdate)}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openOfficerDetails(officer);
                        }}
                        className="w-full rounded-xl border border-emerald-500/30 bg-[var(--bg-card-subtle)] py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-[var(--bg-card-hover)] dark:bg-slate-800 dark:text-emerald-300 dark:hover:bg-slate-700"
                      >
                        View Full Officer Details
                      </button>
                    </article>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl glass-panel p-10 text-center">
          <Search className="mx-auto h-8 w-8 text-[var(--text-muted)] dark:text-slate-400" />
          <h2 className="mt-3 text-base font-bold text-[var(--text-primary)] dark:text-white">No officers found</h2>
          <p className="mt-1 text-xs text-[var(--text-muted)] dark:text-slate-400">
            Try searching by name, ID, rank, department, location, sector, status, phone, or report.
          </p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="mt-4 rounded-xl border border-emerald-500/40 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
          >
            Clear search
          </button>
        </div>
      )}

    </div>
  );
};
