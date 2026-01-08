+++
title = "Me brain think how more productive context"
+++

## Core Problem

I capture information everywhere: articles I read, code I write, conversations I have, tasks I track. But when I need that context later, I either can't find it or have to manually piece it together. LLMs could help, but they don't know about my preferences, past work, or the connections between my scattered data. I want a system where I throw everything in once, and the right context automatically surfaces when any tool or agent needs it, without me having to explain myself repeatedly.

## Storage Layer

**Personal State**

- Schedule, active projects, screen time metrics
- Preferences: languages (spoken/code), tooling choices, writing style
- Auto-discover preferences via integrations (GitHub repo analysis for framework patterns, language frequency)

**Documents & Artifacts**

- Articles read, research outputs (ChatGPT/Gemini), pinned Discord messages
- Lightweight references to external stores (e.g. Commit messages -> pointer to file@revision@git-repo, project summary -> repo link)

## Usage Layer

**Context-Aware Prompting**

- Generate dynamic system prompts per session (e.g., OpenCode picks my preferred language without asking)
- Clarifying questions store answers permanently—never ask twice
- Example: "No language stated → use favorite for use case. Unknown use case → ask once, remember forever"

**Intelligent Retrieval**

- Semantic search across everything ("brainrot IDE YC funded" → finds article from a month ago regardless of source)
- Top-k embedding matches without manual tagging/folders

**Proactive Assistance**

- Productivity dashboard: screen time, task completion, habit analysis with AI suggestions
- Delegate planning: meal prep, shopping lists—compliant with stored preferences
- These should be integrations and enabled by the retrieval interface efficiently

**Dual-Mode Retrieval**

- **Agent Navigation (Smart Path)**: LLM explores context tree via tool calls, reasons about where to search, executes queries across storage layers
- **Workflow Execution (Fast Path)**: Agent-discovered paths compile into executable workflows—direct database/API calls with sub-100ms response for repeated queries
- System learns: first query is slow (agent explores), subsequent identical queries are instant (execute cached workflow)

## Design Principles

**Multi-Context Awareness**

- No single embedding store—different use cases need isolated context to avoid pollution
- System determines which context pools are relevant per query

**Zero Client Complexity**

- Clients throw data, system handles organization/navigation/fetching
- Abstracts away storage topology from integrations

**Hierarchical Embedding Architecture**

- Fuzzy tree: embeddings as keys pointing to sub-databases
- Traverse with max depth (shallow levels use embeddings, deep levels use traditional indices for speed)
- Avoids embedding overhead when document sets are small or queries are sequential

**Workflow Learning**

- Agent navigation paths become reusable workflows
- Common patterns compile into parametric templates (e.g., "articles on {topic}" → direct vector search)
- Workflows update when schemas change or new data sources added

## Example Usage Flows

**Fast Path: Productivity Dashboard (Repeated Query)**

_First time:_

1. User: "Show my productivity dashboard"
2. Agent navigates tree: identifies `core/screen_time`, `core/schedule`, `indices/git_commits`
3. Executes SQL queries + GitHub API calls, combines results
4. System stores workflow as executable script

_Subsequent times:_

1. User: "Show my productivity dashboard"
2. Pattern match to stored workflow
3. Execute script directly: ~50ms response
4. No agent invoked

Of course, it's dumb to ask an LLM every time. It makes 0 sense to me the people who like interacting with AI. Would be a web dashboard instead that polls the workflow (via ID rather than natural language) & shows it visually with pretty graphs and stuff. This means the format returned has to be structured and standardized.

**Smart Path: Code Context Discovery (New Query)**

1. User: "Write a web scraper similar to my past projects"
2. Agent gets context tree, navigates to `code_repos` branch
3. Vector search on repo keywords: finds projects tagged "web scraping"
4. Fetches repo metadata: sees Python + requests/beautifulsoup pattern
5. Cross-references `preferences`: confirms Python is preferred language
6. Optionally fetches file summaries for implementation details
7. Generates system prompt with: language preference + framework patterns + example repo structure

**Smart Path: Historical Search (Ambiguous Intent)**

1. User: "What did I do with that API refactor Tuesday?"
2. Agent unsure if looking for: commit message, document about refactor, or schedule entry
3. Navigates multiple branches in parallel:
   - `documents/commits`: searches "API refactor" in commit messages for all repos
   - `core/schedule`: checks Tuesday's calendar for related events
   - `communication/messages`: searches Discord/Slack for discussions
4. Finds commit: "refactor: migrate auth API to v2" on Tuesday 3PM
5. Retrieves commit details + links to affected files in repo
6. Returns: commit message, changed files, related calendar entry

The return here would be natural language, since this is a natural language query. Would still have structured output for sources and data used.

**Fast Path Evolution: Parametric Template**

_After 3-4 queries like "articles on RAG", "articles on agents", "articles on embeddings":_

1. System identifies pattern: searching articles by topic
2. Compiles template workflow:

```python
def articles_on_topic(topic: str):
    embedding = embed(topic)
    results = vector_search("reading_context", embedding, top_k=10)
    return results
```

3. Future queries: "articles on X" → instant execution with topic parameter
4. No tree navigation needed

**Smart Path: Cross-Domain Query**

1. User: "Compare my Python vs Rust project activity this month"
2. Agent identifies need for multiple context pools
3. Navigates to `code_repos` → filters by language
4. Navigates to `indices/git_commits` → filters by date range
5. Executes:
   - Count commits per language
   - Analyze LOC changes
   - Check screen time in relevant IDEs from `core/screen_time`
6. Synthesizes comparison report
7. Stores workflow: "compare_language_activity(lang1, lang2, timeframe)"

I've just bought konteksto.dev... The number of domains in my project graveyard grows...
