from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Axiom Lab API"
    app_version: str = "2.0.0"
    debug: bool = True
    database_url: str = "sqlite:///./axiom_lab.db"
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"
    s3_endpoint: str = "http://localhost:9000"
    s3_access_key: str = "axiom"
    s3_secret_key: str = "axiomsecret"
    s3_bucket: str = "axiom-lab"
    qdrant_url: str = "http://localhost:6333"
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "axiomsecret"
    opensearch_url: str = "http://localhost:9200"
    clerk_secret_key: str = ""
    stripe_secret_key: str = ""
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    dev_auth_bypass: bool = True
    cors_origins: str = "http://localhost:5173,http://localhost:3000,https://web-ten-delta-78.vercel.app"

    class Config:
        env_file = ".env"


settings = Settings()
