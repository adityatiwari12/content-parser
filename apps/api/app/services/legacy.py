"""Ported from web/src/utils — original client-side logic."""

MOCK_SOURCES = [
    {
        "title": "Journal on Applied AI Policy",
        "domain": "doi.org/mock-ai-policy",
        "text": "Methodological rigor and transparent reporting are key requirements in policy research and evaluation frameworks.",
    },
    {
        "title": "Open Research Archive",
        "domain": "openarchive.org/research-methods",
        "text": "Interdisciplinary approaches are increasingly required for complex socio-technical systems and public governance.",
    },
    {
        "title": "Education and Technology Review",
        "domain": "edtechreview.example/ethics",
        "text": "Reproducibility concerns remain a central issue in modern academic publishing and experimental studies.",
    },
    {
        "title": "Systems Design Conference Notes",
        "domain": "conference-notes.example/systems",
        "text": "Context-aware models are more robust than fixed universal models when applied in heterogeneous settings.",
    },
]


def generate_paper(topic: str) -> dict:
    clean = topic.strip()
    short = clean.lower() or "the research topic"
    return {
        "title": f"A Comprehensive Research Framework for {clean}: Evidence, Methods, Evaluation, and Scientific Implications",
        "authors": "Axiom Lab Research Intelligence Group",
        "abstract": f"This paper presents a detailed research treatment of {clean} by integrating literature synthesis, conceptual modeling, methodological design, evaluation planning, and reproducibility guidance into a unified scholarly manuscript. The central argument is that {short} should be studied as a socio-technical research problem rather than a narrow implementation problem because outcomes depend on data quality, institutional context, model behavior, evaluation validity, and governance.\n\nThe study contributes a structured framework for clarifying conceptual boundaries, organizing the literature into methodological families, proposing a mixed-method design, and defining a publication-ready evaluation protocol. It is intended as a professional starting point for researchers preparing a systematic review, empirical study, grant proposal, or journal-style manuscript.",
        "keywords": f"{clean}; research intelligence; systematic review; reproducibility; evaluation methodology; scientific discovery",
        "introduction": f"{clean} has become an increasingly important subject for academic researchers and research-intensive institutions because it sits at the intersection of scientific discovery, methodological rigor, and operational decision-making. However, the field remains uneven: promising results are often reported alongside inconsistent definitions, fragmented benchmarks, and weak documentation of assumptions.\n\nA mature research agenda for {short} must move beyond broad claims of usefulness and toward a disciplined account of what is being measured, why it matters, and under what conditions a proposed approach remains valid. This paper provides that scaffold by connecting research questions, evidence sources, methods, evaluation criteria, and reproducibility standards.",
        "literatureReview": f"The literature surrounding {short} can be grouped into conceptual, methodological, application-oriented, reproducibility-focused, and governance-oriented streams. Conceptual studies define the problem space and terminology. Methodological studies introduce new workflows, benchmarks, or analytical techniques, but often create comparability challenges. Application studies improve ecological validity while revealing constraints such as expertise, workflow integration, and institutional adoption.\n\nReproducibility research argues that robust scholarship requires transparent documentation of datasets, prompts, preprocessing decisions, evaluation scripts, model versions, and statistical assumptions. Governance-oriented work adds that technical performance alone is insufficient when systems influence scientific judgment, publication workflows, or resource allocation.",
        "conceptualFramework": f"This paper conceptualizes {short} as an interaction among evidence, method, interpretation, and governance. Evidence includes publications, datasets, citations, experimental logs, expert annotations, and institutional knowledge. Method includes retrieval, synthesis, modeling, statistical evaluation, and human review. Interpretation concerns the claims researchers draw from outputs and the uncertainty assigned to those claims. Governance includes accountability, documentation, bias monitoring, and reproducibility requirements.",
        "methodology": f"The proposed methodology uses four phases: systematic evidence mapping, analytical coding, pilot empirical evaluation, and reproducibility validation. Evidence mapping defines inclusion criteria, searches scholarly indexes, screens sources, and extracts structured metadata. Analytical coding classifies each artifact by contribution, method, evaluation strategy, reproducibility support, and limitations.\n\nThe pilot evaluation may include benchmark testing, expert review, user studies, simulation experiments, or retrospective case analysis. Reproducibility validation packages datasets, source lists, evaluation scripts, configuration templates, model metadata, and documented exclusions.",
        "evaluationPlan": f"The evaluation plan combines quantitative, qualitative, and procedural measures. Quantitative measures include retrieval precision, citation accuracy, coverage, agreement with expert judgments, task completion time, and robustness. Qualitative measures examine researcher trust, interpretability, perceived usefulness, and clarity of explanations. Procedural measures test whether outputs can be traced back to source evidence and reproduced by another researcher.",
        "expectedResults": f"The expected result is a more coherent and auditable account of {short}. Evidence mapping should reveal influential clusters, underexplored areas, and inconsistent terminology. Coding should make diverse studies comparable. Empirical evaluation should identify where the approach improves research quality and where it introduces risks.\n\nA likely finding is that the most useful methods will not maximize automation alone. Instead, they will support a disciplined partnership between computational assistance and expert judgment.",
        "discussion": f"The broader implication is that {short} should be treated as part of research infrastructure. As scholarly work becomes mediated by software, models, and collaborative systems, research quality depends on the protocols that shape evidence handling. The paper also highlights a tension between speed and rigor: automation can accelerate discovery, but acceleration without traceability can create false confidence.",
        "limitations": "This manuscript is a generated research scaffold and should be supplemented with domain-specific empirical evidence before journal or conference submission. A complete paper requires a finalized corpus, explicit search strings, coding tables, statistical outputs, and verified citations. Human authors should verify all citations and ensure that claims are proportional to evidence.",
        "conclusion": f"This paper developed a detailed research framework for {clean}, emphasizing evidence quality, methodological rigor, evaluation validity, and reproducibility. Future work should apply the framework to a real corpus, compare outcomes across research teams, and test whether the approach improves citation quality, review readiness, and reproducibility.",
        "references": "Vaswani, A. et al. (2017). Attention Is All You Need. arXiv:1706.03762.\nLewis, P. et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. arXiv:2005.11401.\nBrown, T. et al. (2020). Language Models are Few-Shot Learners. arXiv:2005.14165.",
    }


def parse_content(text: str) -> dict:
    words = [w for w in text.strip().split() if w]
    sentences = [s.strip() for s in __import__("re").split(r"[.!?]+", text) if s.strip()]
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    return {
        "wordCount": len(words),
        "sentenceCount": len(sentences),
        "paragraphCount": len(paragraphs),
        "avgWordsPerSentence": round(len(words) / len(sentences)) if sentences else 0,
        "readingTimeMin": max(1, -(-len(words) // 200)),
        "keyPhrases": _top_key_phrases(text),
    }


def _top_key_phrases(text: str) -> list[str]:
    stop = {
        "the", "and", "or", "of", "to", "in", "a", "is", "for", "with", "on", "that",
        "this", "by", "as", "an", "are", "be", "from", "at", "it", "can", "has", "have",
    }
    tokens = [
        t for t in __import__("re").sub(r"[^a-z0-9\s]", " ", text.lower()).split()
        if t and t not in stop and len(t) > 3
    ]
    freq: dict[str, int] = {}
    for t in tokens:
        freq[t] = freq.get(t, 0) + 1
    return [f"{k} ({v})" for k, v in sorted(freq.items(), key=lambda x: -x[1])[:8]]


def run_plagiarism_check(text: str) -> dict:
    sentences = [s.strip() for s in __import__("re").split(r"[.!?]+", text) if len(s.strip()) > 25]
    matches = []
    max_sim = 0.0
    for sentence in sentences:
        for source in MOCK_SOURCES:
            sim = _sentence_similarity(sentence, source["text"])
            if sim >= 0.34:
                matches.append({
                    "sentence": sentence,
                    "sourceTitle": source["title"],
                    "sourceDomain": source["domain"],
                    "similarity": round(sim * 100),
                })
                max_sim = max(max_sim, sim)
    unique = len({m["sentence"] for m in matches})
    base = len(sentences) or 1
    score = min(95, round((unique / base) * 100))
    return {
        "score": score,
        "riskLevel": "High" if score > 45 else "Medium" if score > 20 else "Low",
        "highestSentenceSimilarity": round(max_sim * 100),
        "matches": matches,
    }


def _sentence_similarity(a: str, b: str) -> float:
    set_a = set(_normalize(a))
    set_b = set(_normalize(b))
    if not set_a or not set_b:
        return 0.0
    inter = len(set_a & set_b)
    union = len(set_a | set_b)
    return inter / union if union else 0.0


def _normalize(text: str) -> list[str]:
    return [t for t in __import__("re").sub(r"[^a-z0-9\s]", " ", text.lower()).split() if t]
