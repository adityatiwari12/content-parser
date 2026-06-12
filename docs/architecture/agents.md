# Multi-Agent System

Coordinator: `services/agents/coordinator.py`

## Agents

| Agent | Responsibility |
|-------|----------------|
| literature_agent | Paper retrieval and mapping |
| review_agent | Literature review synthesis |
| gap_agent | Research opportunity detection |
| methodology_agent | Method suggestions |
| statistics_agent | Metric validation |
| writing_agent | IMRaD document drafting |
| citation_agent | Reference management |
| reviewer_agent | Peer review simulation |

## Workflows

- `writing` → writing_agent, citation_agent
- `literature_review` → literature_agent, review_agent
- `gap_analysis` → literature_agent, gap_agent
- `compliance` → citation_agent, reviewer_agent
- `peer_review` → reviewer_agent, methodology_agent

Each run logs to `agent_runs` with step trace and grounded sources.
