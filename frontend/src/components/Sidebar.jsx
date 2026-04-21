const linksByProfile = {
  teacher: [
    { id: "dashboard", label: "Painel do Professor" },
    { id: "questions", label: "Perguntas" }
  ],
  student: [
    { id: "dashboard", label: "Painel do Aluno" },
    { id: "evaluation", label: "Avaliacao" }
  ]
};

export function Sidebar({ user, currentView, onNavigate, onLogout }) {
  const links = linksByProfile[user.profile] || [];
  const initials = user.username
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <aside className="flex w-full flex-col justify-between rounded-[30px] bg-[#121214] p-6 text-white shadow-panel lg:w-72">
      <div>
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan/70">PLN</p>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-50">Avaliacao IA</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Correcao automatica de respostas discursivas.
          </p>
        </div>

        <div className="rounded-[26px] bg-[#18181b] p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Sessao</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan/20 to-white/5 text-sm font-semibold text-cyan">
              {initials || "U"}
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-100">{user.username}</p>
              <p className="text-sm capitalize text-zinc-400">
                {user.profile === "teacher" ? "Professor" : "Aluno"}
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onNavigate(link.id)}
              className={`w-full rounded-[20px] px-4 py-3 text-left text-sm font-medium transition ${
                currentView === link.id
                  ? "bg-[#1a1f22] text-white shadow-glow ring-1 ring-cyan/20"
                  : "bg-[#18181b] text-zinc-400 hover:bg-[#1c1c20] hover:text-white"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8 rounded-[24px] bg-[#18181b] p-3">
        <p className="px-2 pb-2 text-[11px] uppercase tracking-[0.3em] text-zinc-500">Conta</p>
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-[18px] px-4 py-3 text-left text-sm font-medium text-zinc-200 transition hover:bg-rose-500/10 hover:text-white"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
