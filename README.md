# Avaliacao Automatizada de Respostas Discursivas

Aplicacao full stack para cadastro de perguntas discursivas e avaliacao automatizada de respostas em portugues.

## Visao Geral

O projeto possui dois perfis de uso:

- `Professor`: cadastra perguntas e respostas esperadas.
- `Aluno`: escolhe uma pergunta, envia a resposta e recebe nota com feedback imediato.

O motor de avaliacao foi implementado em `FastAPI` e utiliza uma estrategia hibrida para comparar semelhanca semantica em portugues:

- normalizacao textual;
- remocao de stopwords;
- aproximacao por radicais;
- mapeamento simples de sinonimos;
- TF-IDF por palavras;
- TF-IDF por n-gramas de caracteres;
- cobertura de conceitos esperados.

## Stack

### Backend

- `Python`
- `FastAPI`
- `scikit-learn`

### Frontend

- `React`
- `Vite`
- `Tailwind CSS`

## Estrutura

```text
backend/
  main.py
  requirements.txt

frontend/
  src/
  package.json
  tailwind.config.js
```

## Funcionalidades

- Login com selecao de perfil
- Painel do professor para cadastro de perguntas
- Painel do aluno para envio de respostas
- Avaliacao automatizada com nota de `0` a `100`
- Feedback visual:
  - `Entendeu`
  - `Parcial`
  - `Nao entendeu`
- Interface em tema escuro

## Executando o Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API local:

- `POST /login`
- `GET /questions`
- `POST /questions`
- `POST /evaluate`
- `GET /health`

## Executando o Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend local:

- `http://127.0.0.1:5173`

Backend esperado pelo frontend:

- `http://127.0.0.1:8000`

## Exemplo de Avaliacao

Pergunta:

`Explique o conceito de aprendizado supervisionado.`

Resposta esperada:

`Aprendizado supervisionado e uma abordagem de machine learning em que o modelo aprende a partir de dados rotulados para prever uma saida com base em exemplos anteriores.`

Exemplo de resposta de aluno:

`E um metodo em que o sistema aprende usando exemplos ja classificados e tenta fazer previsoes.`

Essa resposta deve receber uma nota intermediaria, pois preserva boa parte do significado mesmo sem repetir exatamente a formulacao da resposta esperada.

## Observacoes

- Os dados das perguntas ficam em memoria no backend.
- A autenticacao atual e simples e voltada para demonstracao.
- O projeto pode ser evoluido para banco de dados e autenticacao real com JWT.
