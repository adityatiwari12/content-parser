from fastapi import APIRouter, Depends

from app.middleware.auth import get_current_user

router = APIRouter(prefix="/v1/trends", tags=["Trend Intelligence"])


@router.get("/topics")
def get_trending_topics(_user=Depends(get_current_user)):
    return {
        "growing": [
            {"topic": "Retrieval-Augmented Generation", "growth": 142},
            {"topic": "Multimodal Foundation Models", "growth": 98},
            {"topic": "AI for Scientific Discovery", "growth": 87},
        ],
        "declining": [
            {"topic": "Word2Vec Applications", "growth": -34},
            {"topic": "Rule-Based NLP Pipelines", "growth": -28},
        ],
    }


@router.get("/forecast")
def forecast_topics(_user=Depends(get_current_user)):
    return {
        "forecasts": [
            {"topic": "Agentic Research Systems", "predicted_growth": 210, "confidence": 0.82},
            {"topic": "Automated Peer Review", "predicted_growth": 95, "confidence": 0.71},
        ]
    }


@router.get("/dashboard")
def trends_dashboard(_user=Depends(get_current_user)):
    return {
        "emerging_authors": ["Chen, L.", "Patel, R.", "Kim, S."],
        "emerging_institutions": ["MIT CSAIL", "Stanford HAI", "Mila"],
        "publication_velocity": 12400,
        "citation_velocity": 892000,
    }
