class MockGraphStore:
    async def get_nodes(self, node_type: str | None = None, limit: int = 50) -> list[dict]:
        nodes = [
            {"id": "n1", "type": "paper", "label": "Attention Is All You Need"},
            {"id": "n2", "type": "author", "label": "Vaswani, A."},
            {"id": "n3", "type": "institution", "label": "Google Brain"},
            {"id": "n4", "type": "topic", "label": "Transformers"},
            {"id": "n5", "type": "paper", "label": "BERT: Pre-training of Deep Bidirectional Transformers"},
            {"id": "n6", "type": "journal", "label": "NeurIPS"},
        ]
        if node_type:
            nodes = [n for n in nodes if n["type"] == node_type]
        return nodes[:limit]

    async def get_edges(self, limit: int = 50) -> list[dict]:
        return [
            {"source": "n2", "target": "n1", "type": "AUTHORED"},
            {"source": "n3", "target": "n2", "type": "AFFILIATED_WITH"},
            {"source": "n1", "target": "n4", "type": "TOPIC_OF"},
            {"source": "n1", "target": "n5", "type": "CITES"},
            {"source": "n5", "target": "n6", "type": "PUBLISHED_IN"},
        ][:limit]

    async def get_clusters(self) -> list[dict]:
        return [
            {"id": "c1", "label": "Transformer Architectures", "size": 1240},
            {"id": "c2", "label": "Retrieval-Augmented Generation", "size": 890},
            {"id": "c3", "label": "Scientific Discovery Automation", "size": 456},
        ]
