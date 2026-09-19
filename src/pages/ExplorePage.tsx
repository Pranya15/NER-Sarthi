import React, { useState } from 'react';
import destinationsData from '../data/destinations.json';
import { TourismDestination } from '../types';
import { ArrowDown, Compass, MapPin, Sparkles } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [destinations] = useState<TourismDestination[]>(destinationsData as TourismDestination[]);

  const scrollToDestinations = () => {
    document.getElementById('destinations-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-7 sm:space-y-8">
      <section className="explore-hero relative overflow-hidden rounded-3xl glass-panel border border-white/10 p-6 sm:p-8 lg:p-10 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-accent-bright)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--text-accent)]" />
            <span>Explore Northeast India</span>
          </div>
          <h1 className="text-2xl font-black leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Mountains, culture, and communities in one place.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Browse eight curated destinations across the North Eastern states. Each compact card keeps its destination story visible.
          </p>
          <button
            type="button"
            onClick={scrollToDestinations}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-[var(--text-on-action)] shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-blue-500"
          >
            <span>View destinations</span>
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 opacity-10 [background-image:radial-gradient(#06b6d4_2px,transparent_2px)] [background-size:20px_20px]" />
      </section>

      <section id="destinations-section" className="explore-destinations space-y-4">
        <div className="flex items-end justify-between gap-4 border-b border-[var(--border-default)] pb-3">
          <div>
            <h2 className="light-theme-heading flex items-center gap-2 text-lg font-extrabold text-[var(--text-primary)] sm:text-xl">
              <MapPin className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
              <span>Regional destinations</span>
            </h2>
            <p className="light-theme-copy mt-1 text-xs text-[var(--text-muted)]">
              Compact destination cards for all eight North Eastern states.
            </p>
          </div>
          <Compass className="hidden h-7 w-7 text-cyan-700/60 dark:text-cyan-300/60 sm:block" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <article
              key={destination.id}
              tabIndex={0}
              aria-label={`${destination.name}, ${destination.state}`}
              className="destination-card theme-dark-surface group relative h-[225px] overflow-hidden rounded-2xl border border-[var(--border-default)] bg-slate-900 shadow-md transition duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-xl focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 sm:h-[235px]"
            >
              <img
                src={destination.image}
                alt={`${destination.name}, ${destination.state}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="destination-card__shade absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent transition duration-300 group-hover:bg-slate-950/70" />

              <div className="destination-card__details absolute inset-x-0 bottom-0 p-4 opacity-100 translate-y-0 transition-all duration-300">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-200 dark:text-cyan-300">{destination.state}</p>
                  <span className="text-right text-[9px] font-bold uppercase tracking-wider text-amber-200 dark:text-amber-300">{destination.category}</span>
                </div>
                <h3 className="mt-1 text-base font-extrabold leading-tight text-[var(--text-on-dark)]">{destination.name}</h3>
                <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed text-slate-200">{destination.description}</p>
                <div className="mt-2 flex flex-wrap gap-1 border-t border-white/20 pt-2">
                  {destination.highlights.map((highlight) => (
                    <span key={highlight} className="rounded-full border border-white/15 bg-white/10 px-1.5 py-0.5 text-[9px] text-[var(--text-on-dark)]">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
