interface BoneyardProps {
  lines?: number;
  cards?: number;
  className?: string;
}

export default function Boneyard({ lines = 3, cards = 3, className = "" }: BoneyardProps) {
  return (
    <div className={`rounded-2xl bg-[#111] border border-white/[0.06] p-5 ${className}`}>
      <div className="space-y-3 animate-pulse">
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="h-3 w-56 rounded bg-white/8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {Array.from({ length: cards }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 space-y-3">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-7 w-16 rounded bg-white/12" />
              <div className="h-2 w-full rounded bg-white/8" />
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="h-3 rounded bg-white/8" style={{ width: `${95 - i * 8}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
