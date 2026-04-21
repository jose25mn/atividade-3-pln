import { useEffect, useState } from "react";
import { ResultCard } from "../components/ResultCard";

export function StudentDashboard({ questions, onEvaluate, loading, result, currentView }) {
  const [questionId, setQuestionId] = useState(questions[0]?.id ?? "");
  const [studentAnswer, setStudentAnswer] = useState("");

  useEffect(() => {
    if (!questions.length) {
      setQuestionId("");
      return;
    }

    if (!questions.some((question) => question.id === Number(questionId))) {
      setQuestionId(questions[0].id);
    }
  }, [questions, questionId]);

  const selectedQuestion = questions.find((question) => question.id === Number(questionId));

  async function handleSubmit(event) {
    event.preventDefault();
    await onEvaluate({ question_id: Number(questionId), student_answer: studentAnswer });
  }

  return (
    <div className="space-y-6">
      {currentView !== "evaluation" ? (
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[30px] bg-[#121214] p-6 shadow-panel">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan">Aluno</p>
            <h2 className="mt-3 text-2xl font-semibold text-zinc-50 sm:text-3xl">Responder pergunta</h2>
            <p className="mt-3 text-base leading-7 text-zinc-300">
              Escolha uma pergunta, escreva sua resposta e envie para avaliacao automatica.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-300">Pergunta</span>
                <select
                  value={questionId}
                  onChange={(event) => setQuestionId(event.target.value)}
                  className="w-full rounded-[22px] bg-[#1a1a1d] px-4 py-3 text-zinc-100 outline-none transition focus:ring-2 focus:ring-cyan/20"
                  required
                >
                  {questions.map((question) => (
                    <option key={question.id} value={question.id}>
                      {question.prompt}
                    </option>
                  ))}
                </select>
              </label>

              {selectedQuestion ? (
                <div className="rounded-[24px] bg-[#18181b] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Enunciado selecionado</p>
                  <p className="mt-3 text-sm leading-7 text-zinc-200">{selectedQuestion.prompt}</p>
                </div>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-300">Sua resposta</span>
                <textarea
                  value={studentAnswer}
                  onChange={(event) => setStudentAnswer(event.target.value)}
                  rows={8}
                  className="w-full rounded-[22px] bg-[#1a1a1d] px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:ring-2 focus:ring-cyan/20"
                  placeholder="Digite sua resposta discursiva"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading || !questions.length}
                className="rounded-[22px] bg-emerald-500 px-5 py-3 text-sm font-semibold text-black shadow-[0_12px_30px_rgba(16,185,129,0.2)] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Avaliando..." : "Enviar para Avaliacao"}
              </button>
            </form>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[30px] bg-[#121214] p-6 shadow-panel">
              <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Criterios</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-[22px] bg-[#18181b] p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Entendeu</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">Nota maior ou igual a 80.</p>
                </div>
                <div className="rounded-[22px] bg-[#18181b] p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-amber-300">Parcial</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">Nota entre 50 e 79,99.</p>
                </div>
                <div className="rounded-[22px] bg-[#18181b] p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-rose-300">Nao entendeu</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">Nota abaixo de 50.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-[30px] bg-[#121214] p-6 shadow-panel">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan">Resultado da avaliacao</p>
          <h2 className="mt-3 text-3xl font-semibold text-zinc-50">Desempenho da resposta</h2>
          <p className="mt-3 text-base leading-7 text-zinc-300">
            O card abaixo mostra a nota calculada pela similaridade entre a sua resposta e a resposta esperada.
          </p>
        </section>
      )}

      <ResultCard result={result} />
    </div>
  );
}
