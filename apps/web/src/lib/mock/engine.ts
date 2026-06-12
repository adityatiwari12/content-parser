import { MOCK_SOURCES } from './data'

const MOCK_PLAG_SOURCES = [
  { title: 'Journal on Applied AI Policy', domain: 'doi.org/mock-ai-policy', text: 'Methodological rigor and transparent reporting are key requirements in policy research and evaluation frameworks.' },
  { title: 'Open Research Archive', domain: 'openarchive.org/research-methods', text: 'Interdisciplinary approaches are increasingly required for complex socio-technical systems and public governance.' },
  { title: 'Education and Technology Review', domain: 'edtechreview.example/ethics', text: 'Reproducibility concerns remain a central issue in modern academic publishing and experimental studies.' },
  { title: 'Systems Design Conference Notes', domain: 'conference-notes.example/systems', text: 'Context-aware models are more robust than fixed universal models when applied in heterogeneous settings.' },
]

export function generatePaper(topic: string) {
  const clean = topic.trim() || 'Research Topic'
  const short = clean.toLowerCase()
  return {
    title: `A Comprehensive Research Framework for ${clean}: Evidence, Methods, Evaluation, and Scientific Implications`,
    authors: 'Axiom Lab Research Intelligence Group',
    abstract: [
      `This paper presents a detailed research treatment of ${clean} by integrating literature synthesis, conceptual modeling, methodological design, evaluation planning, and reproducibility guidance into a unified scholarly manuscript. The central argument is that ${short} should be studied as a socio-technical research problem rather than a narrow implementation problem, because its outcomes depend on interacting assumptions about data quality, institutional context, model behavior, evaluation validity, and downstream governance.`,
      `The study contributes four elements. First, it clarifies the conceptual boundaries of ${short} and identifies the assumptions that often remain implicit in prior work. Second, it organizes the literature into methodological families, highlighting where consensus exists and where evidence remains contradictory. Third, it proposes a mixed-method research design that combines systematic evidence mapping, benchmark construction, expert review, and reproducibility checks. Fourth, it outlines an evaluation protocol suitable for publication-oriented research, including validity threats, reporting standards, and citation-grounded interpretation.`,
      `Although the manuscript is generated in a mock environment, it follows the structure, density, and tone of a professional academic paper. It is intended to serve as a high-quality starting point for researchers preparing a systematic review, empirical study, grant proposal, or journal-style manuscript on ${short}.`,
    ].join('\n\n'),
    keywords: `${clean}; research intelligence; systematic review; reproducibility; evaluation methodology; scientific discovery`,
    introduction: [
      `${clean} has become an increasingly important subject for academic researchers, technology organizations, and research-intensive institutions because it sits at the intersection of scientific discovery, methodological rigor, and operational decision-making. As research ecosystems become larger and more computationally mediated, the ability to understand, evaluate, and reproduce work in this area has become a central requirement for credible scholarship. However, the field remains uneven: promising results are often reported alongside inconsistent definitions, limited external validation, fragmented benchmarks, and weak documentation of assumptions.`,
      `A mature research agenda for ${short} must therefore move beyond broad claims of usefulness and toward a more disciplined account of what is being measured, why it matters, and under what conditions the proposed approach remains valid. This requires careful attention to construct validity, data provenance, citation quality, model selection, evaluation criteria, and reproducibility artifacts. Without these foundations, research claims may appear persuasive while remaining difficult to verify or compare across studies.`,
      `This paper addresses that gap by presenting a comprehensive framework for studying ${short}. The manuscript is organized as a professional research paper: it begins with a literature-oriented problem framing, develops a conceptual framework, proposes a methodology, defines an evaluation plan, discusses expected findings, and closes with implications for future work. The aim is not to claim final empirical results, but to provide a publication-ready scaffold that researchers can extend with their own data, experiments, and citations.`,
    ].join('\n\n'),
    literatureReview: [
      `The literature surrounding ${short} can be grouped into five major streams. The first stream consists of foundational conceptual work that defines the problem space and establishes terminology. These studies are valuable because they clarify what counts as evidence, what forms of performance are meaningful, and how the research object differs across domains. Their limitation is that they often remain abstract and do not provide sufficient operational guidance for empirical evaluation.`,
      `The second stream focuses on methodological innovation. In this body of work, researchers propose new architectures, workflows, benchmarks, or analytical techniques intended to improve reliability, scale, interpretability, or usefulness. These contributions often produce rapid technical progress, but they also introduce comparability problems because each study may use different datasets, metrics, baselines, and reporting conventions. As a result, the field benefits from innovation while simultaneously struggling to accumulate stable evidence.`,
      `The third stream consists of application-oriented studies. These papers examine how ${short} operates in realistic research, institutional, or organizational settings. Their strength is ecological validity: they reveal constraints that are invisible in controlled laboratory experiments, including user expertise, workflow integration, governance requirements, and incentive structures. Their weakness is that findings can be difficult to generalize without clearer sampling, evaluation, and replication protocols.`,
      `The fourth stream emphasizes reproducibility and integrity. Scholars in this area argue that robust research requires transparent documentation of datasets, prompts, preprocessing decisions, evaluation scripts, model versions, and statistical assumptions. This stream is especially important because many high-performing systems are difficult to reproduce when implementation details are omitted or when proprietary components are involved. The fifth stream focuses on ethics, policy, and institutional adoption, noting that technical performance alone is insufficient when systems shape scientific judgment, publication workflows, or resource allocation.`,
    ].join('\n\n'),
    conceptualFramework: [
      `This paper conceptualizes ${short} as an interaction among four layers: evidence, method, interpretation, and governance. The evidence layer includes publications, datasets, citations, experimental logs, expert annotations, and institutional knowledge. The method layer includes retrieval, synthesis, modeling, statistical evaluation, and human review procedures. The interpretation layer includes the claims researchers draw from outputs, the confidence assigned to those claims, and the degree to which uncertainty is communicated. The governance layer includes accountability, documentation, access control, bias monitoring, and reproducibility requirements.`,
      `The key premise of the framework is that failure at any layer can undermine the whole research process. High-quality evidence can be weakened by poor methodology; strong methods can be misrepresented through overconfident interpretation; and valid results can lose scientific value if they cannot be audited or reproduced. Therefore, evaluation should not focus only on output quality. It should also examine whether the system preserves traceability from source evidence to final claim, whether it supports expert correction, and whether it produces artifacts that other researchers can inspect.`,
      `Three research questions follow from this framework. RQ1: What evidence structures and source attribution mechanisms best support rigorous study of ${short}? RQ2: Which methodological choices produce reliable and reproducible outcomes across contexts? RQ3: How should researchers evaluate practical usefulness while preserving academic standards for transparency, uncertainty, and citation integrity?`,
    ].join('\n\n'),
    methodology: [
      `The proposed methodology uses a mixed-method design consisting of four phases. Phase one is a systematic evidence mapping process. Researchers define inclusion and exclusion criteria, search across scholarly indexes, screen papers for relevance, and extract structured metadata such as research design, dataset type, evaluation method, reported limitations, and citation context. This phase produces a research corpus that can be inspected, filtered, and reused.`,
      `Phase two develops an analytical coding scheme. Each paper or artifact is coded for conceptual contribution, methodological approach, evaluation strategy, reproducibility support, and stated limitations. To reduce subjectivity, two independent coders should annotate a subset of the corpus and calculate agreement before the full coding process begins. Disagreements should be resolved through documented adjudication rather than silent averaging.`,
      `Phase three introduces a pilot empirical evaluation. Depending on the topic, this may involve benchmark testing, expert panel review, user study protocols, simulation experiments, or retrospective case analysis. The purpose is to connect literature-derived claims to observable indicators. Metrics should include not only performance outcomes, but also error rates, traceability, source coverage, uncertainty calibration, and robustness across conditions.`,
      `Phase four focuses on reproducibility validation. All materials should be packaged with versioned datasets, source lists, evaluation scripts, prompt or configuration templates, model metadata, and a clear description of exclusions. Where proprietary tools are used, the paper should specify the dependency and provide a replicable substitute or sensitivity analysis.`,
    ].join('\n\n'),
    evaluationPlan: [
      `A professional evaluation plan for ${short} should combine quantitative, qualitative, and procedural measures. Quantitative measures may include retrieval precision, citation accuracy, coverage of relevant literature, agreement with expert judgments, task completion time, and robustness under input variation. Qualitative measures should examine researcher trust, interpretability, perceived usefulness, and the clarity of generated explanations. Procedural measures should test whether outputs can be traced back to source evidence and whether another researcher can reproduce the reported workflow.`,
      `The evaluation should include at least three baselines: a manual expert workflow, a conventional search or analysis workflow, and an automated system without the proposed framework. Comparing against these baselines allows researchers to distinguish genuine methodological improvement from interface convenience or novelty effects. Statistical analysis should include confidence intervals and, where appropriate, significance testing or Bayesian estimation. However, statistical results should be interpreted alongside qualitative findings because research quality cannot be reduced to a single aggregate score.`,
      `Validity threats should be reported explicitly. Internal validity may be affected by evaluator bias, prompt sensitivity, incomplete corpora, or undocumented preprocessing. External validity may be limited by domain specificity, language coverage, institutional setting, and publication bias. Construct validity may be weakened if metrics do not align with the concept being studied. Reliability may be reduced if model versions, API behavior, or dataset availability change over time.`,
    ].join('\n\n'),
    expectedResults: [
      `The expected result of applying this framework is a more coherent and auditable account of ${short}. First, the evidence mapping phase is likely to reveal clusters of highly cited work, underexplored methodological areas, and inconsistent terminology. Second, the coding phase should make it easier to compare studies that otherwise appear unrelated because it translates diverse papers into a common analytical structure. Third, the empirical evaluation should identify where the proposed approach improves research quality and where it introduces new risks.`,
      `A likely finding is that the most useful systems or methods will not simply maximize automation. Instead, they will support a disciplined partnership between computational assistance and expert judgment. In this model, automation improves scale and speed, while researchers remain responsible for interpretation, methodological choices, and final claims. This balance is especially important in academic contexts where unsupported claims, weak citations, or unreproducible workflows can have long-term consequences.`,
      `The framework is also expected to improve manuscript quality. By forcing explicit links among research questions, evidence sources, methods, evaluation criteria, and limitations, the approach reduces the likelihood of vague contribution claims. It encourages authors to state what is known, what remains uncertain, and what future work is required.`,
    ].join('\n\n'),
    discussion: [
      `The broader implication of this work is that ${short} should be treated as part of a research infrastructure problem. As scholarly work becomes increasingly mediated by software, databases, models, and collaborative systems, the quality of research depends not only on individual insight but also on the tools and protocols that shape evidence handling. A strong framework can help research teams move from isolated experiments toward cumulative, verifiable knowledge.`,
      `The paper also highlights a tension between speed and rigor. AI-assisted research workflows can accelerate discovery, but acceleration without traceability may create a false sense of confidence. Conversely, rigorous documentation can appear slow, but it increases the long-term value of research artifacts. The most productive direction is therefore not to reject automation, but to embed automation within standards for verification, citation integrity, and reproducibility.`,
      `For universities and research organizations, this suggests that adoption should be accompanied by governance practices: shared evaluation rubrics, approved source repositories, audit trails, training for researchers, and periodic review of system performance. For individual researchers, the framework offers a practical checklist for turning an early idea into a defensible study design.`,
    ].join('\n\n'),
    limitations: [
      `This manuscript is designed as a generated research scaffold and should be supplemented with domain-specific empirical evidence before submission to a journal or conference. Its claims are intentionally framed at the level of research design and expected outcomes rather than definitive experimental results. A complete paper would require a finalized corpus, explicit search strings, coding tables, statistical outputs, and verified citations.`,
      `Another limitation is that the framework may need adaptation across disciplines. Methods suitable for computer science may not transfer directly to biomedical research, education, policy studies, or social science without changes to evidence standards and evaluation criteria. Finally, the quality of any generated manuscript depends on researcher review. Human authors should verify all citations, replace placeholders with actual findings, and ensure that claims are proportional to evidence.`,
    ].join('\n\n'),
    conclusion: [
      `This paper developed a detailed research framework for ${clean}, emphasizing evidence quality, methodological rigor, evaluation validity, and reproducibility. The proposed approach integrates systematic literature mapping, structured coding, empirical evaluation, and documentation standards into a single publication-oriented workflow. By doing so, it helps researchers transform a broad topic into a more precise, auditable, and scientifically useful manuscript.`,
      `Future work should apply the framework to a real corpus, compare outcomes across research teams, and test whether the approach improves citation quality, review readiness, and reproducibility. The long-term goal is to support better science: work that is faster to develop, easier to inspect, more honest about uncertainty, and more durable as a contribution to collective knowledge.`,
    ].join('\n\n'),
    references: [
      'Vaswani, A. et al. (2017). Attention Is All You Need. arXiv:1706.03762. https://arxiv.org/abs/1706.03762',
      'Lewis, P. et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. arXiv:2005.11401. https://arxiv.org/abs/2005.11401',
      'Brown, T. et al. (2020). Language Models are Few-Shot Learners. arXiv:2005.14165. https://arxiv.org/abs/2005.14165',
      'Ammar, W. et al. (2018). Construction of the Literature Graph in Semantic Scholar. NAACL. https://aclanthology.org/N18-3011/',
    ].join('\n'),
  }
}

export function parseContent(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean)
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const stop = new Set(['the', 'and', 'or', 'of', 'to', 'in', 'a', 'is', 'for', 'with', 'on', 'that', 'this', 'by', 'as', 'an', 'are', 'be', 'from', 'at', 'it', 'can', 'has', 'have'])
  const tokens = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((t) => t && !stop.has(t) && t.length > 3)
  const freq = new Map<string, number>()
  tokens.forEach((t) => freq.set(t, (freq.get(t) || 0) + 1))
  const keyPhrases = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k} (${v})`)

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    avgWordsPerSentence: sentences.length ? Math.round(words.length / sentences.length) : 0,
    readingTimeMin: Math.max(1, Math.ceil(words.length / 200)),
    keyPhrases,
  }
}

export function runPlagiarismCheck(text: string) {
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 25)
  const matches: Array<{ sentence: string; sourceTitle: string; sourceDomain: string; similarity: number }> = []
  let maxSim = 0

  sentences.forEach((sentence) => {
    MOCK_PLAG_SOURCES.forEach((source) => {
      const sim = jaccard(sentence, source.text)
      if (sim >= 0.34) {
        matches.push({ sentence, sourceTitle: source.title, sourceDomain: source.domain, similarity: Math.round(sim * 100) })
        maxSim = Math.max(maxSim, sim)
      }
    })
  })

  const unique = new Set(matches.map((m) => m.sentence)).size
  const score = Math.min(95, Math.round((unique / (sentences.length || 1)) * 100))
  return {
    score,
    riskLevel: score > 45 ? 'High' : score > 20 ? 'Medium' : 'Low',
    highestSentenceSimilarity: Math.round(maxSim * 100),
    matches,
  }
}

function jaccard(a: string, b: string) {
  const setA = new Set(norm(a))
  const setB = new Set(norm(b))
  const inter = [...setA].filter((t) => setB.has(t)).length
  const union = new Set([...setA, ...setB]).size
  return union ? inter / union : 0
}

function norm(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
}

export function literatureReview(topic: string) {
  const t = topic.trim() || 'the research domain'
  return {
    landscape: `Research landscape for ${t} spans 2,400+ indexed publications across arXiv, Semantic Scholar, and OpenAlex.`,
    key_themes: ['Methodological rigor', 'Interdisciplinary integration', 'Reproducibility', 'Scalable evaluation'],
    influential_papers: MOCK_SOURCES,
    consensus: 'Standardized evaluation frameworks and transparent reporting are widely adopted.',
    contradictions: 'Debate persists on universal vs. context-specific modeling approaches.',
    open_challenges: ['Cross-domain generalization', 'Benchmark standardization', 'Long-context evaluation'],
    opportunities: ['Hybrid human-AI review pipelines', 'Open dataset initiatives'],
    draft: `A comprehensive literature review of ${t} reveals a rapidly evolving field characterized by methodological diversification and increasing emphasis on reproducibility. Key themes include the integration of retrieval-augmented methods, scalable evaluation frameworks, and interdisciplinary collaboration. While consensus exists around transparent reporting standards, contradictory findings emerge regarding the generalizability of context-agnostic models. Open challenges remain in benchmark design and cross-lingual evaluation. Future research opportunities include agentic research assistants and automated provenance verification systems.`,
  }
}

export function gapAnalysis(topic: string) {
  const t = topic.trim() || 'the field'
  return {
    opportunities: [
      { area: `Underexplored causal methods in ${t}`, confidence: 0.87, rank: 1 },
      { area: 'Missing cross-lingual benchmarks for scientific text', confidence: 0.82, rank: 2 },
      { area: 'Conflicting scalability results across model families', confidence: 0.79, rank: 3 },
      { area: 'Limited reproducibility artifacts in applied studies', confidence: 0.76, rank: 4 },
    ],
    underexplored_areas: ['Long-context evaluation', 'Causal inference for research automation'],
    missing_datasets: ['Multi-domain scholarly corpus v2', 'Peer-review decision traces'],
    emerging_topics: ['Agentic research assistants', 'Automated peer review calibration'],
  }
}

export function peerReview(text: string) {
  const hasContent = text.trim().length > 50
  return {
    scores: {
      novelty: hasContent ? 7.2 : 4.0,
      methodology: hasContent ? 8.1 : 5.0,
      writing_quality: hasContent ? 7.8 : 5.5,
      citation_quality: hasContent ? 6.9 : 4.5,
      publication_readiness: hasContent ? 7.5 : 5.0,
    },
    comments: [
      'The methodology section would benefit from additional detail on data preprocessing and validation splits.',
      'Several claims in the introduction lack direct citation support — consider grounding with recent surveys.',
      'Results are clearly presented but statistical significance testing should be included for key comparisons.',
      'The related work section provides adequate coverage but could better position contributions against RAG-based systems.',
    ],
    recommendation: hasContent ? 'Minor Revision' : 'Major Revision',
  }
}

export function copilotAnswer(message: string) {
  return {
    answer: `Based on retrieved literature, your question about "${message.slice(0, 80)}${message.length > 80 ? '…' : ''}" relates to established methodological frameworks in the field. Key findings suggest that retrieval-augmented approaches improve factual grounding, while hybrid evaluation metrics better capture research quality than single-score benchmarks. I recommend reviewing the influential papers cited below for primary source evidence.`,
    sources: MOCK_SOURCES,
    confidence: 0.89,
  }
}

export function datasetProfile(filename: string) {
  return {
    name: filename,
    rows: 1240 + Math.floor(Math.random() * 500),
    columns: 12,
    missing_values_pct: +(Math.random() * 5 + 1).toFixed(1),
    numeric_columns: 8,
    categorical_columns: 4,
    bias_flags: ['class_imbalance_detected', 'geographic_skew_toward_north_america'],
    column_summary: [
      { name: 'feature_a', type: 'numeric', mean: 0.42, std: 0.18 },
      { name: 'feature_b', type: 'categorical', unique: 14 },
      { name: 'target', type: 'numeric', mean: 0.71, std: 0.09 },
    ],
  }
}

export function reproReport() {
  return {
    reproducibility_score: 78,
    dependency_consistency: true,
    missing_assets: ['requirements-lock.txt', 'dataset-checksums.sha256'],
    experimental_validity: 'moderate',
    recommendations: [
      'Pin all dependency versions in a lock file',
      'Include random seed documentation for all stochastic steps',
      'Provide dataset checksums and download scripts',
      'Add container specification (Dockerfile) for environment parity',
    ],
  }
}
