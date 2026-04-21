export function QuestionTable({ questions }) {
  return (
    <div className="overflow-hidden rounded-[30px] bg-[#121214] shadow-panel">
      <div className="border-b border-white/6 px-6 py-5">
        <h3 className="text-lg font-semibold text-zinc-100">Perguntas cadastradas</h3>
        <p className="mt-1 text-sm text-zinc-400">
          Visualize a base de questoes e respostas esperadas.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#18181b]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Pergunta
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Resposta esperada
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Acoes
              </th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr
                key={question.id}
                className={`align-top transition hover:bg-white/[0.04] ${
                  index % 2 === 0 ? "bg-[#121214]" : "bg-[#17171a]"
                }`}
              >
                <td className="px-6 py-4 text-sm font-semibold text-zinc-100">{question.id}</td>
                <td className="px-6 py-4 text-sm text-zinc-300">{question.prompt}</td>
                <td className="px-6 py-4 text-sm text-zinc-500">{question.expected_answer}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    Ativa
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded-full bg-black/30 px-3 py-2 text-sm text-zinc-300 transition hover:bg-black/50 hover:text-white"
                      aria-label={`Editar pergunta ${question.id}`}
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-black/30 px-3 py-2 text-sm text-zinc-300 transition hover:bg-rose-500/20 hover:text-rose-200"
                      aria-label={`Excluir pergunta ${question.id}`}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
