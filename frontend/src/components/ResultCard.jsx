const palette = {
  green: {
    accent: "bg-emerald-500",
    text: "text-emerald-300",
    surface: "from-emerald-500/10 via-black to-black",
    ring: "ring-emerald-500/20"
  },
  yellow: {
    accent: "bg-amber-400",
    text: "text-amber-300",
    surface: "from-amber-400/10 via-black to-black",
    ring: "ring-amber-400/20"
  },
  red: {
    accent: "bg-rose-500",
    text: "text-rose-300",
    surface: "from-rose-500/10 via-black to-black",
    ring: "ring-rose-500/20"
  }
};

export function ResultCard({ result }) {
  if (!result) {
    return null;
  }

  const colors = palette[result.color] || palette.green;

  return (
    <div className={`rounded-[30px] bg-gradient-to-br ${colors.surface} p-6 shadow-panel ring-1 ${colors.ring}`}>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Resultado</p>
          <h3 className={`mt-3 text-2xl font-semibold ${colors.text}`}>{result.feedback}</h3>
          <p className="mt-2 max-w-xl text-base leading-7 text-zinc-300">
            Similaridade calculada: {result.similarity}. A nota final foi convertida para a escala de 0 a 100.
          </p>
        </div>

        <div className="rounded-[26px] bg-white/5 px-6 py-4 text-center shadow-glow">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Nota</p>
          <p className="mt-2 text-4xl font-semibold text-zinc-50">{result.score}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm text-zinc-500">
          <span>Desempenho</span>
          <span>{result.score}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-white/8">
          <div
            className={`h-full rounded-full ${colors.accent} transition-all duration-700`}
            style={{ width: `${Math.max(4, result.score)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
