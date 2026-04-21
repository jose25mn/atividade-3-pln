import { useEffect, useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { Sidebar } from "./components/Sidebar";
import { StudentDashboard } from "./pages/StudentDashboard";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { api } from "./services/api";

const STORAGE_KEY = "avaliacao-discursiva-user";

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [view, setView] = useState("dashboard");
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    let active = true;

    async function loadQuestions() {
      try {
        const data = await api.getQuestions();
        if (active) {
          setQuestions(data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      }
    }

    loadQuestions();

    return () => {
      active = false;
    };
  }, [user]);

  async function handleLogin(credentials) {
    setLoading(true);
    setError("");
    try {
      const session = await api.login(credentials);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setUser(session);
      setView("dashboard");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateQuestion(payload) {
    setLoading(true);
    setError("");
    try {
      const question = await api.createQuestion(payload);
      setQuestions((current) => [...current, question]);
      setView("questions");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEvaluate(payload) {
    setLoading(true);
    setError("");
    try {
      const evaluation = await api.evaluate(payload);
      setResult(evaluation);
      setView("evaluation");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setQuestions([]);
    setResult(null);
    setError("");
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} loading={loading} />;
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="flex min-h-screen w-full flex-col gap-6 p-0 lg:flex-row lg:p-0">
        <Sidebar user={user} currentView={view} onNavigate={setView} onLogout={handleLogout} />

        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <section className="overflow-hidden rounded-[30px] bg-[#121214] p-6 shadow-panel backdrop-blur">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-cyan/40 to-transparent" />
              <span className="text-[11px] uppercase tracking-[0.45em] text-zinc-500">Control Room</span>
              <div className="h-px flex-1 bg-gradient-to-l from-accent/40 to-transparent" />
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Workspace</p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-50">
                  {user.profile === "teacher" ? "Gerenciamento de questoes" : "Avaliacao de respostas"}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
                  Ambiente de avaliacao automatizada com cadastro de questoes, analise textual e feedback imediato.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:min-w-[340px]">
                <div className="rounded-[22px] bg-[#18181b] px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Perguntas</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{questions.length}</p>
                </div>
                <div className="rounded-[22px] bg-[#18181b] px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Motor</p>
                  <p className="mt-2 text-lg font-semibold text-zinc-100">TF-IDF + Cosseno</p>
                </div>
              </div>
            </div>

            {error ? <p className="mt-4 text-sm font-medium text-rose-400">{error}</p> : null}
          </section>

          {user.profile === "teacher" ? (
            <TeacherDashboard
              questions={questions}
              onCreateQuestion={handleCreateQuestion}
              loading={loading}
              currentView={view}
            />
          ) : (
            <StudentDashboard
              questions={questions}
              onEvaluate={handleEvaluate}
              loading={loading}
              result={result}
              currentView={view}
            />
          )}
        </main>
      </div>
    </div>
  );
}
