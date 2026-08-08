# Evidence register and synthesis

**Research cut-off:** 2026-08-07  
**URL check date:** 2026-08-07  
**Scope:** decision-relevant evidence for Sārthi's practical artificial-wisdom architecture  
**Status:** research evidence, not product clearance or authority to ingest source content

## How to read this register

The register separates four claims that are often blurred:

- **Established (E):** replicated empirical result, peer-reviewed synthesis, primary source, or authoritative standard within its stated scope.
- **Promising (P):** method with credible bounded evidence, not yet validated for Sārthi.
- **Convention (C):** useful technical or professional standard; adoption is a design choice.
- **Design inference (DI):** this programme's conclusion. It must survive comparison with strong grounded RAG.

An authoritative page can establish what a tradition or standard says; it cannot establish that a proposed software abstraction improves guidance. A peer-reviewed benchmark can establish a result for tested systems; it cannot establish a timeless property of all LLMs. Publication prestige is never a substitute for source fit.

The tables below are the decision register. The three workstream annexes preserve fuller findings and bibliographies:

- [Wisdom science evidence memo](workstreams/wisdom-science/EVIDENCE_MEMO.md): 49 entries.
- [Reasoning architectures evidence memo](workstreams/reasoning-architectures/EVIDENCE_MEMO.md): 39 entries.
- [Indic hermeneutics evidence memo](workstreams/indic-hermeneutics/EVIDENCE_MEMO.md): 42 entries.

## Cross-domain synthesis

1. **Wisdom is not an automatic top rung above knowledge.** Empirical traditions repeatedly include contextualism, uncertainty recognition, perspective coordination, life knowledge, reflection, prosocial orientation, and value pluralism, but measures are heterogeneous. Sārthi should target observable response behaviour and report a capability vector plus hard failures, never a scalar claim that the model “is wise.”
2. **Current LLMs are useful but not dependable judges of their own output.** They can produce fluent support, do well on some perspective tasks, and benefit from retrieval or structured prompts. They can also be sycophantic, poorly calibrated, culturally inconsistent, position/verbosity-biased as judges, and degraded by unsupported self-correction. The architecture must use externally inspectable evidence and tests.
3. **The middle layer should make scope and disagreement visible.** Claim/assertion, warrant, interpretation, applicability, conflict, procedure, case, and counterexample records can solve identifiable retrieval failures. They should remain ordinary Postgres records until benchmarks justify another engine.
4. **Indic traditions contribute disciplines, not a universal algorithm.** Tradition-qualified warrant, context, interpretive relation, standpoint, case/disanalogy, and living-practice provenance are defensible. Automated dharma resolution, authority scoring, commentary harmonization, and generic “Indic logic” are not.
5. **Every extra layer has a null hypothesis.** If the same model and same evidence bytes in strong grounded RAG perform as well, remove the extra feature.

## A. Wisdom, judgment, humility, and compassion

| ID | Status | Source | Finding used | Limitation and Sārthi relevance |
|---|---|---|---|---|
| W01 | C/E | Baltes & Staudinger (2000), [DOI 10.1037/0003-066X.55.1.122](https://doi.org/10.1037/0003-066X.55.1.122) | Berlin paradigm evaluates life knowledge, procedural knowledge, contextualism, value pluralism, and uncertainty. | Think-aloud life dilemmas from one research tradition; supports rubric facets, not a model trait. |
| W02 | C | Sternberg (1998), [DOI 10.1037/1089-2680.2.4.347](https://doi.org/10.1037/1089-2680.2.4.347) | Balance theory makes self/others/community interests and short/long horizons explicit. | Normative theory; use as a coverage hypothesis, not proof that “balance” is correct. |
| W03 | E | Bangen, Meeks & Jeste (2013), [DOI 10.1016/j.jagp.2012.11.020](https://doi.org/10.1016/j.jagp.2012.11.020) | Review found recurring but heterogeneous wisdom components and measures. | Older, gerontology-heavy literature; supports a vector rather than one score. |
| W04 | E | Ardelt (2003), [DOI 10.1177/0164027503025003004](https://doi.org/10.1177/0164027503025003004) | Three-dimensional scale distinguishes cognitive, reflective, and affective dimensions. | Self-report person measure; do not adapt it as model self-certification. |
| W05 | E | Brienza et al. (2018), [DOI 10.1037/pspp0000171](https://doi.org/10.1037/pspp0000171) | Situated measures reduce some biases of global wisdom reports across a large combined sample. | Still human self-report; supports scenario-level evaluation, not global “model wisdom.” |
| W06 | E/C | Grossmann (2017), [DOI 10.1177/1745691616672066](https://doi.org/10.1177/1745691616672066) | Wisdom-related reasoning varies by context and includes humility, uncertainty, and perspectives. | Synthesis of a developing field; motivates material-context flips. |
| W07 | E | Grossmann & Kross (2014), [DOI 10.1177/0956797614535400](https://doi.org/10.1177/0956797614535400) | People reasoned differently about their own versus others' conflicts; distancing reduced the asymmetry. | Human vignette evidence; role swaps are a test, not model metacognition. |
| W08 | E | Dong, Weststrate & Fournier (2023), [DOI 10.1177/17456916221114096](https://doi.org/10.1177/17456916221114096) | Meta-analysis shows heterogeneous relations among wisdom measures, age, intelligence, personality, and well-being. | Heterogeneous constructs and cross-sectional evidence; rejects proxying wisdom by age or intelligence. |
| W09 | C | Grossmann et al. (2020), [DOI 10.1080/1047840X.2020.1750920](https://doi.org/10.1080/1047840X.2020.1750920) | Common Wisdom Model integrates perspectival metacognition and moral aspirations. | Conceptual proposal; keep perspective and prosocial behaviour separately testable. |
| W10 | C | Frické (2009), [DOI 10.1177/0165551508094050](https://doi.org/10.1177/0165551508094050) | Critiques the DIKW pyramid and automatic transformation of lower levels into wisdom. | Analytic critique; supports many-to-many functional distinctions. |
| W11 | E | Leary et al. (2017), [DOI 10.1177/0146167217697695](https://doi.org/10.1177/0146167217697695) | Intellectual humility relates to fallibility recognition and sensitivity to argument strength. | Human studies; operationalize evidence-responsive revision, not a claimed inner virtue. |
| W12 | E | Strauss et al. (2016), [DOI 10.1016/j.cpr.2016.05.004](https://doi.org/10.1016/j.cpr.2016.05.004) | Review proposes compassion components including recognition, tolerance, concern, and helpful motivation. | No full consensus; warmth must remain separate from truth and safety. |
| W13 | E | Baron & Hershey (1988), [DOI 10.1037/0022-3514.54.4.569](https://doi.org/10.1037/0022-3514.54.4.569) | Outcome knowledge biases evaluation of a prior decision. | Lab evidence; evaluate guidance ex ante and use matched outcome-reveal tests. |
| W14 | C/E | Brier (1950), [DOI 10.1175/1520-0493(1950)078%3C0001:VOFEIT%3E2.0.CO;2](https://doi.org/10.1175/1520-0493(1950)078%3C0001:VOFEIT%3E2.0.CO;2) | Proper score evaluates probabilistic forecasts. | Only for auditable outcomes/reference classes, never numeric theatre for moral uncertainty. |

## B. Retrieval, knowledge representation, cases, arguments, and causality

| ID | Status | Source | Finding used | Limitation and Sārthi relevance |
|---|---|---|---|---|
| R01 | E/P | Lewis et al. (2020), [NeurIPS paper](https://papers.nips.cc/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html) | Retrieval-augmented generation improves knowledge-intensive tasks by conditioning generation on retrieved passages. | Benchmark evidence does not guarantee citation entailment or scope; it defines the baseline. |
| R02 | P | Asai et al. (2024), [Self-RAG, ICLR](https://openreview.net/forum?id=hSyW5go0v8) | Learned retrieval and reflection tokens improved tested factuality/citation metrics. | Training-heavy, benchmark-specific; not proof of dependable intrinsic self-critique. |
| R03 | E | Liu et al. (2024), [DOI 10.1162/tacl_a_00638](https://doi.org/10.1162/tacl_a_00638) | Long-context models can underuse information in the middle of context. | Models and tasks change; supports compact, ordered evidence packets rather than context dumping. |
| R04 | E | Karpukhin et al. (2020), [DPR paper](https://aclanthology.org/2020.emnlp-main.550/) | Dense retrieval can outperform a strong sparse baseline on open-domain QA. | Exact identifiers, quotations, and rare terms still need lexical retrieval; use hybrid search. |
| R05 | E | Oh et al. (2024), [NoMIRACL, DOI 10.18653/v1/2024.findings-emnlp.730](https://doi.org/10.18653/v1/2024.findings-emnlp.730) | Models can answer despite insufficient retrieved evidence. | Benchmark-specific; motivates sufficiency/coverage gates and abstention tests. |
| R06 | E | Yoran et al. (2024), [DOI 10.1162/tacl_a_00724](https://doi.org/10.1162/tacl_a_00724) | Retrieval-augmented models can be distracted by irrelevant passages; robustness varies. | Does not solve tradition scope; motivates contradiction-aware reranking and evidence minimization. |
| R07 | P | Edge et al. (2024), [GraphRAG paper](https://arxiv.org/abs/2404.16130) | Graph/community summaries improved tested global corpus questions over naïve RAG. | Preprint and global-query setting; does not justify a graph DB or moral inference. |
| R08 | C | W3C, [PROV-O Recommendation](https://www.w3.org/TR/prov-o/) | Standard vocabulary represents entities, activities, agents, derivation, and attribution. | Generic provenance ontology; use a compact profile, not full complexity by default. |
| R09 | E/C | Dung (1995), [DOI 10.1016/0004-3702(94)00041-X](https://doi.org/10.1016/0004-3702(94)00041-X) | Abstract argumentation formalizes attack relations and acceptability semantics. | Abstract nodes omit meaning, evidence, authority, and cultural scope; defer automated solvers. |
| R10 | E/C | Aamodt & Plaza (1994), [DOI 10.3233/AIC-1994-7104](https://doi.org/10.3233/AIC-1994-7104) | Case-based reasoning cycle covers retrieve, reuse, revise, and retain. | General framework; Sārthi needs reviewed disanalogies and must not auto-retain model outputs. |
| R11 | E/C | Gentner (1983), [DOI 10.1207/s15516709cog0702_3](https://doi.org/10.1207/s15516709cog0702_3) | Structure-mapping distinguishes relational correspondence from surface similarity. | Cognitive theory, not a production ranker; motivates structural case fields. |
| R12 | E | Forbus, Gentner & Law (1995), [DOI 10.1207/s15516709cog1902_1](https://doi.org/10.1207/s15516709cog1902_1) | MAC/FAC models efficient candidate retrieval followed by structural matching. | Controlled cognitive model; supports two-stage case retrieval as a hypothesis. |
| R13 | E/C | Pearl (1995), [DOI 10.1093/biomet/82.4.669](https://doi.org/10.1093/biomet/82.4.669) | Causal diagrams distinguish interventions from observations under explicit assumptions. | Personal moral outcomes rarely have identified causal models; do not generate causal certainty from narratives. |
| R14 | C | PostgreSQL, [full-text search documentation](https://www.postgresql.org/docs/current/textsearch.html) | Postgres supports indexed lexical search and ranking. | Documentation, not benchmark evidence; compatible with the product's Postgres-first rule. |

## C. Indic epistemology, hermeneutics, narratives, and living practice

| ID | Status | Source | Finding used | Limitation and Sārthi relevance |
|---|---|---|---|---|
| I01 | E/CS | [SEP: Epistemology in Classical Indian Philosophy](https://plato.stanford.edu/archives/fall2022/entries/epistemology-india/) | Schools disagree over pramāṇas, testimony, inference, sentence understanding, and error. | Scholarly overview; supports tradition-qualified warrant records, not a universal list. |
| I02 | E/CS | [SEP: Language and Testimony in Classical Indian Philosophy](https://plato.stanford.edu/archives/spr2023/entries/language-india/) | Theories of sentence meaning and testimonial knowledge are internally diverse. | Overview; requires primary/commentarial verification for product claims. |
| I03 | Primary lead | Gautama and Vātsyāyana, [Nyāyasūtra electronic text](https://tylergneill.github.io/gretil-mirror/gretil/corpustei/transformations/html/sa_gautama-nyAyasUtra-comm-alt.htm) | Primary locus for Nyāya pramāṇas and trustworthy testimony. | Edition, encoding, rights, and expert interpretation require validation. |
| I04 | E/CS | Picascia (2024), [Journal of Hindu Studies PDF](https://academic.oup.com/jhs/article-pdf/17/1/62/57906089/hiad003.pdf) | Reconstructs Nyāya/Buddhist disagreement about testimonial dependence and certification. | Modern reconstruction; relevant to warrants and defeaters, not universal authority. |
| I05 | Primary lead | Jaimini, [Mīmāṃsāsūtra electronic Sanskrit](https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/6_sastra/3_phil/mimamsa/jaimsutu.htm) | Primary loci for ritual injunction and interpretive-factor reasoning. | Sūtras require commentary and specialist review; never implement isolated maxims. |
| I06 | E/CS | Freschi & Pascucci (2021), [DOI 10.1111/theo.12307](https://doi.org/10.1111/theo.12307) | Analyzes Mīmāṃsā deontic conflict, including overriding and option. | Contemporary formal reconstruction; supports attributed relation types, not global rules. |
| I07 | E/CS | Trikha (2020), [DOI 10.1007/s10781-020-09428-z](https://doi.org/10.1007/s10781-020-09428-z) | Historical Mīmāṃsā analyses distinguish kinds of conflicting prescriptions/prohibitions. | Particular thinkers and domain; ritual hermeneutics is not a general ethics engine. |
| I08 | E/CS | [SEP: Jaina Philosophy](https://plato.stanford.edu/archives/sum2024/entries/jaina-philosophy/) | Jain standpoint and many-sidedness traditions resist unqualified one-sided predication. | Broad history; does not mean every opinion is equal. Use ordinary scoped claims. |
| I09 | P/CS | Priest (2008), [DOI 10.1080/01445340701690233](https://doi.org/10.1080/01445340701690233) | Offers a modern formal view of Jain logic. | Contested reconstruction; not enough to justify a seven-valued product database. |
| I10 | E/CS critique | Balcerowicz (2013), [open paper](https://jainastudies.soas.ac.uk/ijjs/ijjs-0904-2013.pdf) | Documents historical/semantic objections to common formalizations of syādvāda. | Specialist controversy; grounds deferral rather than a final verdict on Jain logic. |
| I11 | E/CS | [SEP: Two Truths in India](https://plato.stanford.edu/archives/fall2023/entries/twotruths-india/) | Buddhist conventional/ultimate distinctions vary across schools and purposes. | Supports discourse-level labels only; never an escape from empirical falsification. |
| I12 | Primary lead | Nāgārjuna, [Mūlamadhyamakakārikā chapter 24](https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/6_sastra/3_phil/buddh/nagmmk_u.htm) | Primary locus for a two-truths formulation. | Edition and interpretation contested; no direct software rule follows. |
| I13 | E/CS | Black (2022), [DOI 10.1007/s11407-022-09313-2](https://doi.org/10.1007/s11407-022-09313-2) | Reads Mahābhārata subtales as explorations of subtle, communicable, context-sensitive dharma and reports counterreadings. | One scholarly thesis; supports thick cases plus controversy, not epic precedent. |
| I14 | Primary lead | [Mahābhārata critical-text electronic locus 12.252](https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/2_epic/mbh/sas/b12/b12c252.htm) | Narrative locus for Tulādhāra–Jājali and subtle/contextual dharma. | Electronic Sanskrit; narrative voice is not a binding rule. |
| I15 | E/CS | Freschi (2015), [DOI 10.1007/s10781-014-9232-9](https://doi.org/10.1007/s10781-014-9232-9) | Indian philosophical texts reuse, quote, and transform sources in ways needing explicit provenance. | Programmatic scholarship; exact lineage relations require corpus-specific work. |
| I16 | E/CS | Davis (2004), [DOI 10.1007/s10781-004-8651-4](https://doi.org/10.1007/s10781-004-8651-4) | Ācāra and authority expose a complex relation between practice and textual representation. | Historical/social authority can be exclusionary; prevalence is not normativity. |
| I17 | C/standard | UNESCO, [Ethics and Intangible Cultural Heritage](https://ich.unesco.org/en/ethics-and-ich-00866) | Safeguarding should involve sustained consent, dialogue, participation, and respect. | High-level framework, not local consent or product rights; guides a future protocol only. |
| I18 | C/standard | Oral History Association, [Best Practices](https://oralhistory.org/best-practices/) | Requires informed consent, repository/access terms, narrator participation, and stewardship. | US-oriented professional standard; must be localized before fieldwork. |
| I19 | E/CS | Lorenzen (1999), [DOI 10.1017/S0010417599003084](https://doi.org/10.1017/S0010417599003084) | Challenges a simple colonial-invention account and documents earlier identity formations. | One intervention in a large debate; does not prove timeless Hindu unity. |
| I20 | E/CS | Nicholson (2010), [DOI 10.7312/nich14986](https://doi.org/10.7312/nich14986) | Documents historically situated precolonial projects unifying selected philosophical schools. | Selected intellectual history; demonstrates that synthesis itself has provenance and exclusions. |

## D. Current LLM capability, uncertainty, deliberation, and evaluation limits

| ID | Status | Source | Finding used | Limitation and Sārthi relevance |
|---|---|---|---|---|
| L01 | E | Jiang et al. (2021), [DOI 10.1162/tacl_a_00407](https://doi.org/10.1162/tacl_a_00407) | Raw probabilities were poorly calibrated on tested QA systems; post-hoc methods helped in those settings. | Older models/tasks; calibrate per Sārthi task rather than trusting token likelihood. |
| L02 | E | Xiong et al. (2024), [ICLR paper](https://proceedings.iclr.cc/paper_files/paper/2024/hash/6733cf15e10e2cd1d59af033c3bb8507-Abstract-Conference.html) | No tested black-box uncertainty technique dominated across models and tasks. | Does not measure normative uncertainty; separate retrieval, model, source-conflict, and context uncertainty. |
| L03 | E/P | Kuhn, Gal & Farquhar (2024), [DOI 10.1038/s41586-024-07421-0](https://doi.org/10.1038/s41586-024-07421-0) | Semantic entropy improved confabulation detection on tested long-form QA tasks. | Can miss confidently repeated shared errors; a secondary detector only. |
| L04 | E | Huang et al. (2024), [ICLR paper](https://proceedings.iclr.cc/paper_files/paper/2024/file/8b4add8b0aa8749d80a34ca5d941c355-Paper-Conference.pdf) | Intrinsic self-correction without new feedback often failed or degraded tested reasoning. | Model/task snapshots; correction must add evidence, tools, or independent review. |
| L05 | E | Sharma et al. (2024), [ICLR paper](https://proceedings.iclr.cc/paper_files/paper/2024/hash/0105f7972202c1d4fb817da9f21a9663-Abstract-Conference.html) | Assistants and preference models exhibited sycophancy across several free-form tasks. | Designed tasks and historical models; narrator/opinion flips remain mandatory. |
| L06 | E | Strachan et al. (2024), [DOI 10.1038/s41562-024-01882-z](https://doi.org/10.1038/s41562-024-01882-z) | GPT-4 exceeded human averages on some language-based perspective tasks but showed model-specific failures on others. | Proxy tasks do not establish empathy or robust real-world understanding. |
| L07 | E/P | Xu et al. (2024), [DOI 10.18653/v1/2024.emnlp-main.476](https://doi.org/10.18653/v1/2024.emnlp-main.476) | Perspective-taking prompts reduced measured toxicity/bias in tested settings. | Perspectives may be fabricated or stereotyped; use an evidence-labelled ledger and ablate it. |
| L08 | E | Estornell & Liu (2024), [NeurIPS paper](https://proceedings.neurips.cc/paper_files/paper/2024/hash/32e07a110c6c6acf1afbf2bf82b614ad-Abstract-Conference.html) | Similar agents can converge on majority/shared errors in debate. | Debate configurations vary; multiple generations are not independent perspectives. |
| L09 | E | Panickssery et al. (2024), [DOI 10.52202/079017-2197](https://doi.org/10.52202/079017-2197) | LLM evaluators can favor outputs resembling their own generations. | Magnitude varies; generating model family cannot be sole judge. |
| L10 | E | Zheng et al. (2023), [NeurIPS paper](https://proceedings.neurips.cc/paper_files/paper/2023/file/91f18a1287b398d378ef22505bf41832-Paper-Conference.pdf) | LLM judges show position and verbosity biases, especially near ties. | Preference agreement is not cultural or factual validity; randomize/order-control and keep human acceptance. |
| L11 | E | Chen et al. (2024), [DOI 10.18653/v1/2024.emnlp-main.474](https://doi.org/10.18653/v1/2024.emnlp-main.474) | Human and LLM evaluators were affected by authority, misinformation, gender, and presentation cues. | Human review also needs blinding, evidence packets, and scope metadata. |
| L12 | E | Shen et al. (2024), [DOI 10.18653/v1/2024.naacl-long.316](https://doi.org/10.18653/v1/2024.naacl-long.316) | Cultural context and query language produced material commonsense performance gaps. | Benchmark cultures/tasks are partial; mandates slice-level and multilingual testing. |
| L13 | E | Khandelwal et al. (2024), [DOI 10.18653/v1/2024.eacl-long.176](https://doi.org/10.18653/v1/2024.eacl-long.176) | Tested models showed moral-reasoning score differences by language, including lower Hindi results. | Kohlbergian framework and translations are contestable; use Sārthi-owned paired scenarios. |
| L14 | E | Ovsyannikova, de Mello & Inzlicht (2025), [DOI 10.1038/s44271-024-00182-6](https://doi.org/10.1038/s44271-024-00182-6) | Third parties rated one GPT-4 snapshot's brief responses as highly compassionate. | Perceived wording is not recipient outcome or sound judgment; use warm-but-wrong tests. |
| L15 | C/E | Zapf et al. (2016), [DOI 10.1186/s12874-016-0200-9](https://doi.org/10.1186/s12874-016-0200-9) | Agreement statistic should match scale, raters, and missingness; Krippendorff's alpha is flexible. | A coefficient cannot repair a vague rubric or unrepresentative reviewer pool. |

## Evidence-to-decision map

| Decision | Evidence basis | Confidence | What would reverse it |
|---|---|---:|---|
| Define the target as response-level wisdom-supporting behaviour, not model wisdom. | W01–W13, L01–L14 | High | A validated, cross-cultural, response-predictive latent construct with safer product consequences. |
| Use strong grounded hybrid RAG as the null baseline. | R01–R06 | High | A simpler architecture consistently beats it under same-evidence, same-budget tests. |
| Add material-context/applicability and typed conflict before large case/pattern stores. | R03–R06, I01–I20, local probes | Moderate-high | No improvement in false universalization, source confusion, or applicability over baseline. |
| Pilot thick cases with explicit disanalogies only for guidance/ambiguity slices. | R10–R12, I13–I14, W02/W07 | Moderate | Analogy errors, stereotyping, or story-driven rationalization meet or exceed baseline. |
| Keep hidden chain of thought out of provenance; store a bounded decision record. | L02–L10, W11 | Moderate-high | A safer, externally validated audit method with clear privacy and fidelity evidence. |
| Reject a universal Indic ontology or dharma solver. | I01–I20 | High | No plausible reversal foreseen; only narrow, tradition-attributed formal modules could be piloted. |
| Defer native graph, argument solvers, causal models, and multi-agent debate. | R07–R13, L04/L08 | High for MVP | A preregistered task shows ≥10-point practical gain with acceptable cost and no new severe failures. |

## Known evidence gaps

- No production Sārthi pipeline has been evaluated.
- No expert-reviewed, rights-cleared scenario packet currently proves the middle layer's efficacy.
- Reviewer agreement across traditions and Hindi/English is unknown.
- Living-practice acquisition is not authorized and has not been conducted.
- Longitudinal user benefit, dependency risk, and behavioural outcomes are unknown.
- Current model comparisons will drift; any later model claims must record provider, model/version, date, parameters, prompts, evidence packet, and exact test commit or artifact hash.
