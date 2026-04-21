from __future__ import annotations

import re
import unicodedata
from typing import List, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS, TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


app = FastAPI(title="Avaliacao Discursiva API", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1)
    profile: Literal["teacher", "student"]


class QuestionCreate(BaseModel):
    prompt: str = Field(..., min_length=5)
    expected_answer: str = Field(..., min_length=5)


class Question(BaseModel):
    id: int
    prompt: str
    expected_answer: str


class EvaluationRequest(BaseModel):
    question_id: int
    student_answer: str = Field(..., min_length=3)


class EvaluationResponse(BaseModel):
    score: float
    similarity: float
    feedback: str
    color: str
    normalized_student_answer: str
    normalized_expected_answer: str


questions_db: List[Question] = [
    Question(
        id=1,
        prompt="Explique o conceito de aprendizado supervisionado.",
        expected_answer=(
            "Aprendizado supervisionado e uma tecnica de machine learning em que o modelo "
            "aprende a partir de exemplos rotulados para prever saidas futuras."
        ),
    ),
    Question(
        id=2,
        prompt="Descreva a finalidade do processamento de linguagem natural.",
        expected_answer=(
            "Processamento de linguagem natural permite que computadores analisem, "
            "interpretem e gerem linguagem humana em tarefas como classificacao, resumo e traducao."
        ),
    ),
]


PORTUGUESE_STOPWORDS = {
    "a",
    "ao",
    "aos",
    "as",
    "com",
    "como",
    "da",
    "das",
    "de",
    "dela",
    "dele",
    "deles",
    "demais",
    "depois",
    "do",
    "dos",
    "e",
    "ela",
    "elas",
    "ele",
    "eles",
    "em",
    "entre",
    "era",
    "eram",
    "essa",
    "esse",
    "esta",
    "estao",
    "este",
    "eu",
    "foi",
    "ha",
    "isso",
    "isto",
    "ja",
    "la",
    "mais",
    "mas",
    "me",
    "mesmo",
    "meu",
    "minha",
    "muito",
    "na",
    "nao",
    "nas",
    "nem",
    "no",
    "nos",
    "nossa",
    "o",
    "os",
    "ou",
    "para",
    "pela",
    "pelas",
    "pelo",
    "pelos",
    "por",
    "qual",
    "que",
    "quem",
    "se",
    "sem",
    "ser",
    "seu",
    "sua",
    "tambem",
    "te",
    "tem",
    "ter",
    "um",
    "uma",
    "voce",
    "voces",
}

STOPWORDS = set(ENGLISH_STOP_WORDS).union(PORTUGUESE_STOPWORDS)
WEAK_CONCEPT_TOKENS = {
    "machine",
    "learning",
    "partir",
    "base",
    "anterio",
    "futur",
}

SYNONYM_GROUPS = [
    {"metodo", "abordagem", "tecnica", "processo"},
    {"modelo", "sistema", "algoritmo"},
    {"rotulado", "rotulados", "rotulada", "rotuladas", "classificado", "classificados", "classificada", "classificadas"},
    {"prever", "previsao", "previsoes", "predizer", "predicao", "predicoes"},
    {"saida", "saidas", "resultado", "resultados"},
    {"aprender", "aprende", "aprendizado", "aprendizagem"},
    {"computador", "computadores", "maquina", "maquinas"},
    {"texto", "textos", "linguagem", "linguagens"},
]

SYNONYM_MAP = {
    term: sorted(group)[0]
    for group in SYNONYM_GROUPS
    for term in group
}

COMMON_SUFFIXES = (
    "coes",
    "cao",
    "soes",
    "mente",
    "mento",
    "mentos",
    "idades",
    "idade",
    "ismos",
    "ismo",
    "istas",
    "ista",
    "amento",
    "amentos",
    "imento",
    "imentos",
    "adoras",
    "adores",
    "adora",
    "ador",
    "acoes",
    "acao",
    "ivel",
    "iveis",
    "icos",
    "icas",
    "ico",
    "ica",
    "ados",
    "adas",
    "ado",
    "ada",
    "idos",
    "idas",
    "ido",
    "ida",
    "ando",
    "endo",
    "indo",
    "oes",
    "res",
    "is",
    "es",
    "os",
    "as",
    "s",
)


def strip_accents(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    return "".join(char for char in normalized if not unicodedata.combining(char))


def simple_stem(token: str) -> str:
    for suffix in COMMON_SUFFIXES:
        if len(token) > len(suffix) + 2 and token.endswith(suffix):
            return token[: -len(suffix)]
    return token


def canonicalize_token(token: str) -> str:
    synonym = SYNONYM_MAP.get(token, token)
    return simple_stem(synonym)


def tokenize_text(text: str) -> list[str]:
    lowered = strip_accents(text.lower().strip())
    raw_tokens = re.findall(r"[a-z0-9]+", lowered)
    cleaned_tokens = [
        canonicalize_token(token)
        for token in raw_tokens
        if token and token not in STOPWORDS
    ]
    return [token for token in cleaned_tokens if token and token not in WEAK_CONCEPT_TOKENS]


def normalize_text(text: str) -> str:
    return " ".join(tokenize_text(text))


def keyword_overlap_similarity(expected_tokens: list[str], student_tokens: list[str]) -> float:
    if not expected_tokens or not student_tokens:
        return 0.0

    expected_set = set(expected_tokens)
    student_set = set(student_tokens)
    intersection = expected_set.intersection(student_set)
    union = expected_set.union(student_set)
    return len(intersection) / len(union) if union else 0.0


def expected_concept_coverage(expected_tokens: list[str], student_tokens: list[str]) -> float:
    if not expected_tokens or not student_tokens:
        return 0.0

    expected_set = set(expected_tokens)
    student_set = set(student_tokens)
    intersection = expected_set.intersection(student_set)
    return len(intersection) / len(expected_set) if expected_set else 0.0


def vector_cosine_similarity(text_a: str, text_b: str, **vectorizer_kwargs: object) -> float:
    if not text_a.strip() or not text_b.strip():
        return 0.0

    vectorizer = TfidfVectorizer(**vectorizer_kwargs)
    matrix = vectorizer.fit_transform([text_a, text_b])
    return float(cosine_similarity(matrix[0:1], matrix[1:2])[0][0])


def semantic_similarity(expected_text: str, student_text: str) -> tuple[float, str, str]:
    normalized_expected = normalize_text(expected_text)
    normalized_student = normalize_text(student_text)

    expected_tokens = normalized_expected.split()
    student_tokens = normalized_student.split()

    word_similarity = vector_cosine_similarity(
        normalized_expected,
        normalized_student,
        ngram_range=(1, 2),
    )
    char_similarity = vector_cosine_similarity(
        strip_accents(expected_text.lower()),
        strip_accents(student_text.lower()),
        analyzer="char_wb",
        ngram_range=(3, 5),
    )
    overlap_similarity = keyword_overlap_similarity(expected_tokens, student_tokens)
    coverage_similarity = expected_concept_coverage(expected_tokens, student_tokens)

    combined_similarity = (
        (0.30 * word_similarity)
        + (0.20 * char_similarity)
        + (0.15 * overlap_similarity)
        + (0.35 * coverage_similarity)
    )

    semantic_boost = (0.85 * coverage_similarity) + (0.15 * char_similarity)
    final_similarity = max(combined_similarity, semantic_boost)

    return min(final_similarity, 1.0), normalized_expected, normalized_student


def score_to_feedback(score: float) -> tuple[str, str]:
    if score >= 80:
        return "Entendeu", "green"
    if score >= 50:
        return "Parcial", "yellow"
    return "Nao entendeu", "red"


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/login")
def login(payload: LoginRequest) -> dict[str, str]:
    return {
        "username": payload.username,
        "profile": payload.profile,
        "token": f"{payload.profile}:{payload.username}",
    }


@app.get("/questions", response_model=List[Question])
def list_questions() -> List[Question]:
    return questions_db


@app.post("/questions", response_model=Question)
def create_question(payload: QuestionCreate) -> Question:
    next_id = max((question.id for question in questions_db), default=0) + 1
    question = Question(id=next_id, **payload.model_dump())
    questions_db.append(question)
    return question


@app.post("/evaluate", response_model=EvaluationResponse)
def evaluate_answer(payload: EvaluationRequest) -> EvaluationResponse:
    question = next((item for item in questions_db if item.id == payload.question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Pergunta nao encontrada.")

    similarity, normalized_expected, normalized_student = semantic_similarity(
        question.expected_answer,
        payload.student_answer,
    )

    score = round(similarity * 100, 2)
    feedback, color = score_to_feedback(score)

    return EvaluationResponse(
        score=score,
        similarity=round(similarity, 4),
        feedback=feedback,
        color=color,
        normalized_student_answer=normalized_student,
        normalized_expected_answer=normalized_expected,
    )
