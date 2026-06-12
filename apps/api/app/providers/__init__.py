from app.providers.mock.llm import MockLLMProvider
from app.providers.mock.papers import MockPaperSearchProvider
from app.providers.mock.rag import MockRAGPipeline
from app.providers.mock.storage import MockObjectStore
from app.providers.mock.vector import MockVectorStore
from app.providers.mock.graph import MockGraphStore
from app.providers.groq import make_copilot_pipeline

paper_search = MockPaperSearchProvider()
llm = MockLLMProvider()
rag = make_copilot_pipeline()
vector_store = MockVectorStore()
graph_store = MockGraphStore()
object_store = MockObjectStore()
