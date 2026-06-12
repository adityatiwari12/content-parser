class MockObjectStore:
    async def upload(self, key: str, data: bytes, content_type: str = "application/octet-stream") -> str:
        return f"s3://axiom-lab/{key}"

    async def get_url(self, key: str) -> str:
        return f"http://localhost:9000/axiom-lab/{key}"
