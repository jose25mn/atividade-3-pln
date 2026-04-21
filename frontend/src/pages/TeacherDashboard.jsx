import { useState } from "react";
import { QuestionTable } from "../components/QuestionTable";

export function TeacherDashboard({ questions, onCreateQuestion, loading, currentView }) {
  const [prompt, setPrompt] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    await onCreateQuestion({ prompt, expected_answer: expectedAnswer });
    setPrompt("");
    setExpectedAnswer("");
  }

  return (
    <div className="space-y-6">
      {currentView !== "questions" ? (
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[30px] bg-[#121214] p-6 shadow-panel">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan">Professor</p>
            <h2 className="mt-3 text-2xl font-semibold text-zinc-50 sm:text-3xl">Cadastrar nova pergunta</h2>
            <p className="mt-3 text-base leading-7 text-zinc-300">
              Defina o enunciado e a resposta de referencia que sera usada pelo motor de avaliacao.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-300">Pergunta</span>
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  rows={4}
                  className="w-full rounded-[22px] bg-[#1a1a1d] px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:ring-2 focus:ring-cyan/20"
                  placeholder="Digite a pergunta discursiva"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-300">Resposta esperada</span>
                <textarea
                  value={expectedAnswer}
                  onChange={(event) => setExpectedAnswer(event.target.value)}
                  rows={5}
                  className="w-full rounded-[22px] bg-[#1a1a1d] px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:ring-2 focus:ring-cyan/20"
                  placeholder="Digite a resposta de referencia"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="rounded-[22px] bg-emerald-500 px-5 py-3 text-sm font-semibold text-black shadow-[0_12px_30px_rgba(16,185,129,0.2)] transition hover:bg-emerald-400 disabled:opacity-70"
              >
                {loading ? "Salvando..." : "Salvar pergunta"}
              </button>
            </form>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[30px] bg-[#121214] p-6 shadow-panel">
              <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Resumo</p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[22px] bg-[#18181b] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Total de perguntas</p>
                  <p className="mt-3 text-4xl font-semibold text-zinc-50">{questions.length}</p>
                </div>

                <div className="rounded-[22px] bg-[#18181b] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Modelo de nota</p>
                  <p className="mt-3 text-lg font-semibold text-zinc-50">TF-IDF + Cosseno</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Similaridade vetorial para classificar o entendimento da resposta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {(currentView === "questions" || currentView === "dashboard") ? (
        <QuestionTable questions={questions} />
      ) : null}
    </div>
  );
}
