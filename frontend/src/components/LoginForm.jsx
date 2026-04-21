import { useState } from "react";

export function LoginForm({ onLogin, loading }) {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState("teacher");

  function handleSubmit(event) {
    event.preventDefault();
    onLogin({ username, profile });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(34,211,238,0.10),transparent_24%),radial-gradient(circle_at_68%_58%,rgba(34,197,94,0.08),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.015),transparent_35%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:44px_44px]" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1500px] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex items-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-2xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-cyan" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.38em] text-zinc-300">
                Sistema de Correcao
              </span>
            </div>

            <h1 className="mt-8 max-w-xl text-4xl font-semibold leading-[1] text-white sm:text-5xl xl:text-6xl">
              Avaliacao automatica de respostas discursivas.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400">
              Um ambiente simples para cadastrar questoes, responder enunciados e receber
              feedback imediato com base em similaridade textual.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <article className="rounded-[28px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
                  Motor
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">TF-IDF + Similaridade</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  Processamento textual, comparacao vetorial e calculo de nota em tempo real.
                </p>
              </article>

              <article className="rounded-[28px] border border-white/8 bg-[linear-gradient(135deg,rgba(34,197,94,0.08),rgba(255,255,255,0.03))] p-6 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
                  Fluxo
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">Professor e aluno</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  Cadastro de perguntas, envio de resposta e leitura clara do desempenho.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="relative flex items-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
          <div className="absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-white/12 to-transparent lg:block" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.025),transparent_62%)]" />

          <div className="relative mx-auto w-full max-w-[520px] rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,26,0.96),rgba(10,10,12,0.98))] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur sm:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-zinc-500">
                Acesso
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-[2rem]">
                Entrar na plataforma
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">
                Selecione o perfil e acesse o painel correspondente.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2.5 block text-sm font-medium text-zinc-300">Usuario</span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full rounded-[20px] border border-white/10 bg-black/40 px-5 py-4 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan/50 focus:bg-black/60 focus:ring-2 focus:ring-cyan/10"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2.5 block text-sm font-medium text-zinc-300">Perfil</span>
                <select
                  value={profile}
                  onChange={(event) => setProfile(event.target.value)}
                  className="w-full rounded-[20px] border border-white/10 bg-black/40 px-5 py-4 text-zinc-100 outline-none transition focus:border-cyan/50 focus:bg-black/60 focus:ring-2 focus:ring-cyan/10"
                >
                  <option value="teacher">Professor</option>
                  <option value="student">Aluno</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[20px] border border-white/10 bg-[#0b0b0d] px-4 py-4 text-base font-semibold text-white transition duration-150 hover:bg-[#141418] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.04)] active:scale-[0.985] active:bg-[#08080a] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              <p className="pt-1 text-center text-xs text-zinc-500">
                {profile === "teacher"
                  ? "Acesso ao painel de professor."
                  : "Acesso ao painel de respostas do aluno."}
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
