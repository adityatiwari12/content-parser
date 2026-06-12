import json
from typing import Any


class MockLLMProvider:
    async def complete(self, prompt: str, system: str = "") -> str:
        return json.dumps({"response": f"Analysis complete for: {prompt[:100]}...", "grounded": True})

    async def structured(self, prompt: str, schema: dict[str, Any]) -> dict[str, Any]:
        return {"summary": prompt[:200], "confidence": 0.91, "sources": []}
