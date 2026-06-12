class MockVectorStore:
    async def upsert(self, collection: str, id: str, vector: list[float], payload: dict) -> None:
        pass

    async def search(self, collection: str, vector: list[float], limit: int = 10) -> list[dict]:
        return [{"id": f"vec-{i}", "score": 0.9 - i * 0.1, "payload": {}} for i in range(limit)]
