import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import Cal from '@calcom/embed-react';
import Reveal from '../Reveal';

const CAL_LINK = 'herin-soni-scb9tt/let-s-talk';

export default function CTA() {
  const [showCal, setShowCal] = useState(false);

  return (
    <>
      <section className="relative border-t border-zinc-800 bg-black overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 text-center z-10">
          <Reveal>
            <h3 className="mx-auto max-w-2xl text-3xl md:text-5xl font-medium leading-tight text-white mb-6">
              Ready to make your repo look expensive?
            </h3>
          </Reveal>
          <Reveal delay={100}>
            <p className="mx-auto max-w-lg text-lg text-zinc-400 mb-10 leading-relaxed">
              Drop a link. See the magic. If you don't like it, you can always go back to manually typing out HTML tables in Markdown.
            </p>
          </Reveal>
          <Reveal delay={200} distance={12}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/signup"
                className="group flex items-center gap-2 h-12 px-8 rounded-full bg-emerald-400 text-black text-sm font-semibold hover:bg-emerald-500 transition-all shadow-[0_0_30px_rgba(52,211,153,0.25)]"
              >
                Generate Docs Now
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <button
                onClick={() => setShowCal(true)}
                className="flex items-center gap-2 h-12 px-8 rounded-full border border-zinc-700 bg-zinc-900/80 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
              >
                Request a Side Quest
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cal.com Popup Modal */}
      {showCal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setShowCal(false)}
        >
          <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-[fadeSlideUp_0.3s_ease-out]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <div>
                <h2 className="text-lg font-semibold text-white">Book a Meeting</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Schedule a time to connect and discuss opportunities</p>
              </div>
              <button
                onClick={() => setShowCal(false)}
                className="h-8 w-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} className="text-zinc-400" />
              </button>
            </div>

            {/* Cal Embed */}
            <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
              <Cal
                calLink={CAL_LINK}
                config={{
                  name: 'WhatDoc Visitor',
                  email: '',
                  notes: 'Booked from whatdoc.xyz',
                  theme: 'dark',
                }}
                className="h-[500px] w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
