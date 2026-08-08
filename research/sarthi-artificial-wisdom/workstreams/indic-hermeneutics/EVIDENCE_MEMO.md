# Indic epistemology, hermeneutics, case reasoning, and living authority for Sārthi

**Evidence memo — 2026-08-07**

**Scope.** This memo asks what selected Indian intellectual and practice traditions can responsibly contribute to Sārthi's practical artificial-wisdom architecture. It does not propose an “Indic algorithm,” a machine implementation of dharma, or an artificial guru. Its narrower purpose is to identify historically warranted disciplines for representing sources, warrants, interpretations, contexts, conflicts, cases, and living practice without flattening distinct traditions.

**Research status.** Substantive but bounded. The sources below include primary texts, peer-reviewed scholarship, academic reference works, and ethics standards for living-practice documentation. They are sufficient for architecture decisions and an acquisition pilot, not for representing any tradition as a whole. Sanskrit, Prakrit, Pali, Tamil, and vernacular philology still requires named domain reviewers. All web links were checked during research on 2026-08-07 unless stated otherwise.

**Evidence labels used throughout**

- **HD — historical doctrine:** a claim documented in a primary text or a scholarly reconstruction of a historically situated school. It is not automatically a current community norm.
- **CS — contemporary scholarship:** a published interpretation, reconstruction, or debate. Competing scholarship must remain visible.
- **LC — living convention:** a practice or authority claim reported by a current community, institution, teacher, practitioner, or ethnography. It is contextual evidence, not a universal rule.
- **DI — design inference:** this programme's proposed engineering use. It must be tested against strong grounded retrieval and can be rejected without rejecting the underlying tradition.

## Executive conclusions

1. **The most defensible contribution is epistemic bookkeeping, not a new reasoning engine.** Classical pramāṇa debates make the source and warrant of a claim inspectable; Nyāya discussions of trustworthy testimony make speaker competence, sincerity, linguistic understanding, and defeaters relevant; Mīmāṃsā supplies historically specific models of textual connection, contextual interpretation, and conflict; Jain perspectivism forces explicit conditions of predication; Buddhist two-truths discussions warn that discourse levels cannot simply be merged; itihāsa cases support analogy with disanalogy and consequences; commentary and living-practice traditions require layered, socially located evidence. These can improve a typed evidence-and-case layer in ordinary Postgres. They do not yet justify custom “cognitive architecture.”

2. **Every contribution is tradition-, genre-, period-, and purpose-scoped.** Nyāya, Mīmāṃsā, Jain, and Buddhist theories disagree with one another and contain internal developments. Mīmāṃsā principles created for Vedic ritual injunctions are not universal rules for Purāṇa, Tantra, āgama, devotional poetry, oral custom, secular choices, or modern law. Anekāntavāda is not “all views are equally true.” Buddhist conventional/ultimate truth is not a generic preference switch. The Mahābhārata is not a case-law database.

3. **The core middle layer should preserve difference rather than prematurely reconcile it.** Store a source passage separately from translation, commentary, subcommentary, vernacular exposition, living account, modern scholarly interpretation, and Devam synthesis. Each assertion needs an exact object, warrant, scope, speaker or lineage, interpretive operation, confidence, objections, and review status. Contradictory claims may coexist; Sārthi should explain the conflict or ask a high-value clarification instead of inventing consensus.

4. **Case reasoning is promising only when disanalogies and power are first-class.** Moral narratives can reveal intention, roles, foreseeable consequences, context-sensitive exceptions, and the danger of applying a general rule mechanically. But a memorable story can also launder elite, caste, gender, or sectarian assumptions. Store who tells the story, who has agency, who bears costs, scholarly counterreadings, and the conditions under which the analogy fails.

5. **Living practice must be acquired as consent-governed evidence, not scraped folklore.** Text bytes do not capture pronunciation, embodied sequence, family or temple roles, substitutions, privacy, initiation, or regional variation. Records need community attribution, date/place/occasion, practitioner role, observed versus reported status, consent scope, access restriction, review/withdrawal arrangements, and the distinction between descriptive prevalence and prescriptive authority. No interviews, recordings, institutional contact, or publication should occur without separate authorization and an approved protocol.

6. **The fastest defensible MVP is modest.** Add typed warrant, standpoint, interpretation, conflict, case, and practice-observation records to the planned evidence layer; pilot them on one bounded hero lane with two or more genuine interpretive lineages and several morally ambiguous cases. Compare this enriched retrieval against a strong citation-grounded RAG baseline. Do not build seven-valued logic, a universal dharma rule engine, a Navya-Nyāya parser, or an automated commentary harmonizer unless experiments demonstrate a specific gain.

## 1. What these traditions can and cannot operationally contribute

| Tradition or practice | Historically supportable contribution | Defensible Sārthi use (DI) | Non-transferable or dangerous simplification |
|---|---|---|---|
| Cross-school pramāṇa debate | Knowledge claims are differentiated by putative sources such as perception, inference, testimony, comparison, presumption, and non-apprehension; schools dispute the list and their reducibility. | Record a claim's asserted warrant and the tradition that recognizes it; retrieve evidence appropriate to the question. | A universal six-bucket ontology; treating “pramāṇa” as a decorative word for any citation; assuming a warrant guarantees truth. |
| Nyāya testimony and inference | Testimony is tied to a competent, truth-knowing, sincere speaker and intelligible utterance; subsequent certification and defeaters matter. | Separate speaker/source reliability from claim content; preserve language competence, transmission, corroboration, and known defeaters. | Authority scoring by title, popularity, caste, or lineage alone; automatic trust in scripture, teacher, or institution. |
| Nyāya upamāna and tarka | Upamāna has a technical role in word/reference learning; tarka tests consequences of rival positions but is not itself an independent knowledge source. | Use counterfactual stress tests and explicit analogy dimensions, while citing actual evidence for conclusions. | Calling every moral analogy “Nyāya”; storing model-generated speculation as knowledge because it survived an internal debate. |
| Mīmāṃsā | Sentence connection, contextual indicators, injunctions, exceptions, options, and textual conflicts received highly developed analyses, especially for Vedic ritual interpretation. | Represent passage-to-passage interpretive relations, general/specific conflict, option, restriction, context, and the interpreter who asserts them. | A universal hierarchy that automatically resolves every Hindu text; treating ritual hermeneutics as modern personal ethics or law. |
| Jain anekāntavāda, naya, syādvāda | Predication is conditioned by standpoint and aspect; historically developed theories resist one-sided absolutization while retaining realism and disciplined assertion. | Require explicit standpoint conditions: source, lineage, period, region, object-aspect, purpose, and practical setting. | “All opinions are equally valid”; a seven-valued database imposed on material with no Jain interpretive provenance; erasing power or evidence quality. |
| Buddhist two truths | Conventional and ultimate discourse are related differently across Buddhist schools; conceptual language and soteriological purpose are central to the debate. | Tag discourse level and intended soteriological or practical purpose when a source actually uses such a distinction. | Recasting factual errors as “ultimate truth”; mapping the distinction onto user preference; treating all Buddhist schools as one view or absorbing them into Hinduism. |
| Dharma and itihāsa narrative | Narratives explore subtle, role- and circumstance-dependent judgment, including cases where literal rule-following causes harm. | Store thick cases with roles, intention, rule, exception, outcomes, affected parties, narrator, counterreading, and disanalogies. | Turning an epic episode into binding precedent; selectively quoting a story to validate the user's desired action. |
| Commentary and subcommentary | Interpretation is transmitted through lineages, genres, languages, quotation, reuse, debate, and pedagogy; vernacular and oral exposition can create distinct reading communities. | Build an interpretation graph that never confuses root text, commentary, translation, performance, or Devam synthesis. | “The text says” when only one commentator says it; silently selecting the most digitized or English-language lineage. |
| Ācāra and living practice | Practice and recognized practitioners have historically mattered in reasoning about dharma; living heritage is continuously recreated by communities. | Treat current practice as dated, located, consented evidence that can supplement—but not overwrite—texts and alternatives. | Crowdsourcing normativity; equating common practice with ethical correctness; freezing living practice into a timeless canonical form. |

The table is deliberately asymmetric: it translates methods of *discipline* more readily than metaphysical conclusions. The same architecture must also represent Islamic, Sikh, Christian, secular, regional, tribal, Dalit, feminist, and other perspectives when a user's context or the Devam collection requires them. “Indic” cannot become a gate that excludes relevant evidence.

## 2. Pramāṇa traditions: warrants without false unification

### 2.1 Established historical and scholarly findings

**HD.** Classical Indian epistemology contains extended disagreement about the means or sources of knowledge. Nyāya conventionally recognizes perception (pratyakṣa), inference (anumāna), comparison or analogical identification (upamāna), and testimony (śabda). Mīmāṃsā and Advaita traditions may additionally treat postulation or presumption (arthāpatti) and non-apprehension (anupalabdhi) as independent; Buddhist epistemologists commonly reduce the set to perception and inference. These are not merely labels for “data types”: each school embeds them in theories of cognition, error, language, objects, and liberation [E01–E04].

**HD/CS.** In Nyāya, verbal testimony is classically linked to the utterance of an āpta: one who knows the matter and communicates it reliably. Vātsyāyana's commentary emphasizes knowledge of the truth and a sincere desire to communicate it. The category is not inherently restricted to a birth or sectarian identity; the relevant competence is topic-specific. Later debates distinguish ordinary knowledge acquisition from reflective certification when doubt or challenge arises [E01, E03, E05].

**HD.** Classical theories of sentence understanding discuss expectancy (ākāṅkṣā), semantic fittingness (yogyatā), and contiguity or proximity (āsatti) as conditions for combining words into a meaningful sentence. Meaningful understanding does not thereby guarantee that a sentence is true. A retrieved fragment can be linguistically intelligible yet detached from the passage that controls its force [E01–E02].

**HD.** Tarka is suppositional or consequence-testing reasoning used to expose difficulties in rival proposals; it does not independently confer knowledge. Nyāya upamāna is technically narrower than a modern “case analogy”: a standard example concerns learning a word's reference through similarity and testimony. Sārthi must not retrofit every counterfactual or analogy with a Nyāya label [E01, E03].

### 2.2 Design inference

The useful abstraction is a **warrant record**, not a school-neutral truth machine. A claim can have more than one warrant, and the same source may be accepted differently across traditions.

Minimum fields:

| Field | Purpose |
|---|---|
| "assertion_id" | Stable identity for the exact proposition, not a whole document. |
| "warrant_kind" | Controlled, extensible term such as text testimony, inference, direct observation, participant report, historical reconstruction, linguistic analysis, or model synthesis. Classical labels should appear only with a tradition-qualified definition. |
| "warrant_tradition" | Nyāya, Bhāṭṭa Mīmāṃsā, Prābhākara Mīmāṃsā, a named Buddhist school, a modern discipline, or “Devam operational,” rather than “Indic.” |
| "source_or_speaker" | Exact source object, person, community, institution, or computation. |
| "competence_scope" | What the witness or source is plausibly competent to establish. A ritual practitioner may establish a local sequence but not the universal antiquity of that sequence. |
| "transmission" | Direct observation, manuscript, edition, translation, oral report, quotation, later summary, or model extraction. |
| "understanding_requirements" | Language, technical vocabulary, expected context, and linked passage needed to interpret the statement. |
| "support_strength" | Evidence-specific assessment with rationale, never a prestige-only authority score. |
| "defeaters" | Contradictory source, interpolation concern, mistranslation, conflict of interest, later provenance, regional restriction, or observer effect. |
| "review" | Named reviewer, competence, decision, date, and version. |

This model directly improves answers such as “Is this prescribed?”, where Sārthi must distinguish a textual injunction, a commentator's restriction, a modern temple practice, a family custom, and a Devam synthesis. It should not expose an unfamiliar Sanskrit taxonomy to the user unless useful.

### 2.3 Acquisition implications

- Acquire critical or reputable editions and translations of the Nyāyasūtra with major commentary, not isolated lists of pramāṇas. Record edition, translator, textual locus, language, and rights.
- Acquire at least one serious modern study of testimony and one Buddhist critique so “trustworthy testimony” is not represented as undisputed consensus.
- During extraction, distinguish a source's *claim* from its *account of how the claim is known*.
- Do not infer competence or sincerity automatically. Store the evidence for competence and possible conflicts; allow “unknown.”
- Avoid converting philosophical warrant types into user-facing confidence percentages without empirical calibration.

### 2.4 Safeguards and red-team questions

- Can a prestigious teacher's statement receive less support than a local participant's direct observation when the question is “What happened in this ceremony?” It should.
- Can a direct observation establish theological meaning? Not without a further interpretive warrant.
- Does the sentence parser preserve the governing context and negation, or only an attractive clause?
- If a model produces a persuasive inference, where are the independent premises and rule? Without them, label it hypothesis or synthesis.
- Does “āpta” become a hidden social hierarchy? Require topic-specific competence, a transmission trail, and defeater review.

## 3. Mīmāṃsā: powerful textual disciplines with a strict scope boundary

### 3.1 What the sources support

**HD.** The Mīmāṃsāsūtra begins from inquiry into dharma and characterizes dharma through Vedic injunction. Its developed hermeneutics address how ritual prescriptions, subsidiary acts, linguistic connection, context, repetition, exceptions, and conflicts should be understood. This makes Mīmāṃsā especially relevant to a source-grounded ritual lane, but also especially easy to overextend [E06–E09].

**HD.** Mīmāṃsāsūtra 3.3.14 orders interpretive factors often rendered as direct statement (śruti), indicative force (liṅga), syntactic connection (vākya), context (prakaraṇa), position (sthāna), and name or heading (samākhyā), with later factors weaker when they are more remote from the meaning. The rule belongs to a specific exegetical system and problem setting. It is evidence that interpretation should preserve *why* one passage controls another, not license for an automated universal ranking [E06–E07].

**HD/CS.** Mīmāṃsā authors developed accounts of deontic conflict. General and specific prescriptions can interact through overriding or suspension (bādha); equally authoritative alternatives can yield option (vikalpa); subsidiary prescriptions can inherit purpose from a principal act. Modern scholars have formalized aspects of these systems, but the formalization is an interpretation of a historical body of ritual reasoning, not evidence that modern moral conflict reduces to those operators [E08–E10].

**CS.** Many Mīmāṃsā maxims appeal to ordinary language use, while their deployment remains embedded in a specialized sacrificial and textual domain. Scholarship on paribhāṣā and nyāya warns that metarules and technical meanings differ across disciplines [E09].

### 3.2 Design inference: an interpretation-relation layer

The appropriate engineering use is a typed relation asserted by an interpreter:

- "directly_states"
- "indicates_by_semantic_force"
- "forms_single_sentence_with"
- "is_governed_by_context_of"
- "is_restricted_by_specific_case"
- "is_exception_to"
- "is_optional_alternative_to"
- "is_subsidiary_to"
- "is_repeated_for_emphasis" or "is_separate_injunction"
- "is_named_or_positioned_as"
- "is_overridden_in_context"
- "conflicts_with"
- "interpreter_disputes_relation"

Each edge must include the interpreter or lineage, cited textual locus, argument summary, scope, date/period, and counterposition. The relation is an **interpretive claim**, not a fact derived solely from text adjacency.

### 3.3 Ritual-lane example

Suppose one source presents an observance generally, a commentary restricts it to a particular eligibility condition, a regional manual permits a substitute material, and a living temple practice follows a different sequence.

Sārthi should retrieve:

1. the source injunction or description;
2. the commentary's restriction and its rationale;
3. the regional manual's explicit substitution;
4. the living observation as dated/local practice;
5. the user's tradition, location, role, available materials, and desired strictness;
6. a concise response that distinguishes “source prescription,” “common local practice,” and “safe practical option.”

It should not run a global “specific overrides general” rule and erase the possibility that the sources have different authority within different lineages.

### 3.4 Acquisition and safeguards

- Acquire the Mīmāṃsāsūtra with commentary and a reliable translation as a linked textual family. Do not quote a public-domain translation as if it were philologically current.
- Extract worked disputes, not just a glossary. Every maxim needs its original problem, proposed resolution, dissent, and the domain for which it was formulated.
- For every automated interpretive relation, retain the passage span and require human review before it controls a ritual answer.
- Test whether typed relations beat simple passage retrieval on omission, contradiction, and variant disclosure.
- **Fail closed:** if no lineage-specific relation is evidenced, Sārthi may say that the sources differ; it must not manufacture a Mīmāṃsā resolution.

## 4. Jain perspectivism: conditional assertion, not relativism

### 4.1 Findings and controversy

**HD/CS.** Jain accounts of anekāntavāda, naya, and syādvāda developed across authors and periods. They respond to the many-sidedness of objects and the partiality of unqualified predication. A claim can be appropriate under a specified standpoint or mode without implying that every incompatible claim is equally warranted. The theory is a disciplined meta-epistemology within Jain philosophical projects, not a generic slogan of tolerance [E11–E13].

**CS.** Contemporary philosophers have proposed many-valued, modal, paraconsistent, and other formal reconstructions. These can illuminate structural possibilities, but Piotr Balcerowicz and other historians warn that modern formal vocabulary can be read back anachronistically. Early evidence is scattered and later systematization should not be projected wholesale onto earlier sources [E12–E15].

### 4.2 Design inference: standpoint-complete claims

Devam can require that contestable assertions answer:

- **Who or what tradition asserts this?**
- **About which aspect of the object?**
- **Under what temporal, regional, ritual, linguistic, social, or institutional conditions?**
- **For what purpose—description, prescription, praise, polemic, soteriology, pedagogy, legal administration, or contemporary accommodation?**
- **What is not being asserted?**
- **Which rival standpoint is materially relevant?**

This produces a provenance-aware standpoint matrix. It is valuable even when the source has no Jain provenance, but in that case it must be called a Devam scoping discipline, not “syādvāda implemented.”

### 4.3 Safeguards

- Never replace evidence ranking with perspective multiplication. A well-supported dated observation and an anonymous viral claim are not peers merely because both are “standpoints.”
- Never create seven truth values unless a Jain specialist, a real use case, and evaluation results justify them.
- Preserve the exact Jain lineage, author, textual locus, and development when describing the historical doctrine.
- Include viewpoints of people affected by a practice, not only recognized interpreters who benefit from it.
- Test for false balance: Does standpoint display make dangerous, abusive, or demonstrably false advice look respectable?

## 5. Buddhist two truths: keep levels of discourse separate

### 5.1 Limited but important relevance

**HD/CS.** Indian Buddhist theories of two truths distinguish conventional and ultimate truth in diverse ways. Madhyamaka, Abhidharma, Yogācāra, and later commentators do not supply a single uniform doctrine. In Nāgārjuna's Mūlamadhyamakakārikā 24.8–10, teaching is said to rely on two truths, but the interpretation of their relationship, the status of language, and the nature of ultimate truth remain major scholarly and intra-Buddhist debates [E16–E18].

**DI.** The transferable safeguard is to tag the level and purpose of discourse. A soteriological claim, a conventional ritual instruction, a historical assertion, an empirical health claim, and a metaphor need different evidence and should not be merged into one confidence score.

### 5.2 Hard boundaries

- Do not use “ultimate truth” to immunize a claim from factual challenge.
- Do not translate the distinction into “objective answer versus whatever comforts the user.”
- Do not present one Buddhist school's account as Buddhism, or Hinduize Buddhist thought under a vague civilizational label.
- Include Buddhist material only when Devam's declared collection scope, the source context, or the user's comparative question requires it.

## 6. Dharma and itihāsa: narrative cases, consequences, and disanalogy

### 6.1 Evidence for context-sensitive case reasoning

**HD/CS.** The Mahābhārata repeatedly thematizes the subtlety of dharma. The Balāka–Kauśika episode contrasts literal truth-telling with consequences: Kauśika reveals victims' location to robbers and is criticized for failing to understand subtle dharma. The Tulādhāra–Jājali and Pativratā–Vyādha narratives likewise relocate ethical insight into complicated social relationships and everyday discipline. Mahābhārata 12.252 explicitly considers dharma and adharma difficult to distinguish and responsive to ordinary and adverse circumstances [E19–E22].

**CS.** Brian Black reads selected “subtales” as coherent, communicable explorations of sūkṣma dharma, often stressing effects on others, self-control, and cultivated responsibility. Other scholarship emphasizes disorientation, hierarchy, or elite literary appropriation. A story's apparently subaltern speaker does not guarantee a subaltern social perspective. The critical disagreement is part of the evidence [E19].

### 6.2 Case representation

A Sārthi case should contain at least:

| Dimension | Required content |
|---|---|
| "case_source" | Edition, parvan/chapter/verse, language, translation, rights, and exact span. |
| "narrative_frame" | Who tells the case to whom, in which larger argument, and with what stated purpose. |
| "actors_and_roles" | Relationships, duties, dependencies, power, knowledge, and vulnerabilities. |
| "proposed_rule" | The norm or maxim apparently at issue, with the speaker who formulates it. |
| "context_trigger" | Circumstance alleged to create an exception, conflict, or priority. |
| "action_and_intent" | What was done, intended, known, and foreseeable. |
| "consequences" | Immediate and longer-term effects, including effects on absent or less powerful parties. |
| "narrative_evaluation" | Praise, blame, ambiguity, later resolution, and who supplies it. |
| "interpretations" | Commentary and scholarship, including dissent and social critique. |
| "analogy_dimensions" | Features supporting comparison to a user's situation. |
| "disanalogies" | Features that make transfer unsafe: role, coercion, law, age, gender, caste, era, stakes, or missing knowledge. |
| "anti_precedent" | Conditions under which the apparent lesson should not be applied. |
| "review_and_version" | Specialist review, safety review, and change history. |

### 6.3 Inference-time use

For a morally ambiguous question, retrieval should seek multiple cases, not the nearest story embedding. Deliberation may privately compare:

- relevant relationships and responsibilities;
- intentions and information available;
- who bears short- and long-term costs;
- reversible versus irreversible actions;
- legal, safety, and professional obligations;
- similar features and decisive disanalogies;
- multiple tradition-specific interpretations;
- a minimally harmful practical next step.

The response should give the concise conclusion and, when material, mention that traditions or interpreters differ. It should not expose hidden chain-of-thought, present a story as divine authorization, or infer fate/karma as certainty.

### 6.4 Red-team cases

- A user asks whether “truth is optional” to justify fraud. The Kauśika story must not be a reusable exception token; retrieve intent, harm, duty, law, and alternatives.
- A user in an abusive relationship asks about role-duty. Traditional role language must not override immediate safety or silence the vulnerable party.
- A managerial user compares an employee to an epic antagonist. Reject dehumanizing character mapping and reason from observable behavior and fair process.
- A model retrieves only the story that validates the user's prior wish. Require counter-case retrieval and an anti-sycophancy evaluator.

## 7. Commentary traditions: interpretation has provenance

### 7.1 Findings

**HD/CS.** Indian commentarial cultures are not mere paraphrase pipelines. They quote, reorder, defend, contest, extend, translate, and pedagogically stage earlier texts. Commentaries and subcommentaries can build a lineage's doctrinal identity. Vernacular commentary can create a new reading community, and written cues can depend on oral exposition or performance [E23–E27].

**CS.** Major texts such as the Bhagavadgītā and Rāmcaritmānas have multiple commentarial communities. Later interpreters often claim continuity while making substantive selections. No single digitized English commentary can stand in for “the text.”

### 7.2 Required interpretation graph

Nodes should distinguish:

- witnessed manuscript or inscription;
- critical or diplomatic edition;
- root text passage;
- translation;
- commentary;
- subcommentary;
- digest or manual;
- vernacular exposition;
- sermon, katha, pravachan, performance, or teaching session;
- modern academic analysis;
- practitioner account;
- Devam synthesis;
- model-generated draft.

Edges should distinguish:

- quotes;
- comments_on;
- glosses_term;
- translates;
- paraphrases;
- restricts;
- expands;
- harmonizes_with;
- disputes;
- attributes_to;
- reuses_without_attribution;
- applies_to_practice;
- orally_elaborates;
- modernizes;
- Devam_derives.

Every interpretation node needs author/speaker, lineage or institution where evidenced, period/date, region, language, genre, intended audience, exact interpreted locus, cited antecedents, rights, and uncertainty. “Lineage unknown” is preferable to a guess.

### 7.3 Retrieval safeguard

When Sārthi says “The Gītā teaches …,” the system must know whether the proposition is:

1. directly expressed in the root passage;
2. a translation choice;
3. a particular commentator's interpretation;
4. a later devotional synthesis;
5. a modern scholarly reconstruction; or
6. Devam's own cross-source synthesis.

If (3)–(6), attribute it. A short answer can remain natural: “In this Vaiṣṇava commentary …,” “Advaita and Viśiṣṭādvaita readings differ here …,” or “A common modern interpretation is ….” Attribution is not clutter when it changes the advice.

## 8. Ācāra and living-practice authority

### 8.1 Historical and current evidence

**HD/CS.** Dharmaśāstra traditions recognize custom or ācāra in complex relations with śruti, smṛti, and the conduct of recognized learned or “good” people. Donald Davis's historical work stresses both the centrality of practice and the difference between dharma as lived and Dharmaśāstra as textual representation. This does not make whatever is common morally authoritative; recognition and authority are historically structured and often socially exclusive [E28–E29].

**LC/CS.** UNESCO's 2003 Convention describes intangible cultural heritage as community-recognized, transmitted, and continually recreated. Its safeguarding framework prioritizes community participation and compatibility with human rights, mutual respect, and sustainable development. UNESCO's Vedic chanting record illustrates why accent, pronunciation, memorization, embodiment, and teacher-student transmission cannot be recovered from plain text alone [E30–E33].

**LC/CS.** Oral History Association and American Anthropological Association guidance treats informed consent as an ongoing process, requires clear access and repository arrangements, and foregrounds harm, power, representation, and narrator participation [E34–E36].

### 8.2 Living-practice evidence model

| Field | Requirement |
|---|---|
| "practice_id" | Content-addressed or stable identity for the exact account/observation. |
| "practice_claim" | Atomic, translatable statement separate from raw media. |
| "community_scope" | Family, temple, maṭha, sampradāya, caste/community, regional network, teacher lineage, or self-identified group; never infer a broader scope. |
| "participant_role" | Practitioner, officiant, teacher, organizer, observer, inheritor, dissenter, former member, scholar, or other self-described role. |
| "time_place_occasion" | Date or period, location granularity allowed by consent, lunar/seasonal occasion, and event type. |
| "method" | Interview, participant report, non-participant observation, archival recording, public manual, or ethnography. |
| "observed_or_reported" | Distinguish direct observation, participant recollection, normative claim, and hearsay. |
| "variation" | Known household, regional, sectarian, generational, gendered, or institutional alternatives. |
| "authority_claim" | Who regards this practice as authoritative and why; stored as a claim, not assumed fact. |
| "consent_scope" | Internal research, quotation, transcript, audio/video, product display, model training, or no reuse. |
| "sensitivity" | Public, community-only, private, initiatory, sacred-secret, personal, vulnerable-person, or uncertain. |
| "review_rights" | Participant/community review, correction, withdrawal or embargo terms where agreed. |
| "translation_and_editorial" | Original language, transcript, translator, edits, omissions, and participant approval if applicable. |
| "rights_and_access" | Custodian, license/permission, embargo, retention, deletion conditions, and audit trail. |

### 8.3 Acquisition protocol before any contact

No living-practice fieldwork is authorized by this memo. A future authorized pilot should:

1. define the product question and why published sources are insufficient;
2. obtain ethics, privacy, safeguarding, and rights review;
3. identify affected communities and include less powerful or dissenting participants;
4. create plain-language, language-appropriate consent choices for recording, quotation, product use, and model use separately;
5. make refusal non-penalizing and consent revisitable;
6. agree on sensitive, private, initiatory, location, and embargo boundaries;
7. return transcripts/interpretations for review where promised;
8. preserve disagreement instead of asking a single “representative” to authenticate a whole tradition;
9. compensate fairly if authorized and budgeted, without buying doctrinal endorsement;
10. publish only the minimum necessary, with revocation and incident procedures.

### 8.4 Safety principles

- **Prevalence is not normativity.** “Many households do X” does not establish “you should do X.”
- **Authority is lane-specific.** A priest may be highly competent about a temple sequence but not about another lineage, mental-health care, law, or history.
- **Living does not mean public.** Devam should not ingest or surface initiatory or sacred-secret material merely because it was observable online.
- **Do not freeze variation.** Version and date practices; allow communities to correct representation while preserving an audit trail.
- **Do not romanticize continuity.** Practices change, may be contested, and can coexist with harm or exclusion.

## 9. Homogenization risks: “Hindu,” “Indic,” and “Sanātana” are not flat database categories

Scholarship disputes how “Hinduism” emerged as a category. Lorenzen emphasizes substantial precolonial identity formations while contesting a simple colonial-invention thesis; Pennington analyzes colonial institutions and representations; Nicholson documents precolonial intellectual projects that unified selected schools while still producing a historically situated synthesis [E37–E40]. The responsible conclusion is neither “one timeless unified system” nor “no precolonial commonality.”

Architecture consequences:

- “Devam” may be the umbrella product, but umbrella membership must not collapse self-identification.
- Record tradition, subtradition, lineage, genre, period, region, language, institution, and contested naming as separate dimensions.
- Do not auto-classify Jain, Buddhist, Sikh, tribal, folk, Dalit, or regional materials as Hindu. Preserve source self-description and collection rationale.
- Do not let Sanskrit availability dominate Tamil, Telugu, Kannada, Bengali, Marathi, Hindi, Assamese, Malayalam, Odia, Kashmiri, Nepali, Prakrit, Pali, oral, and other sources.
- Do not infer timeless “Indian values” from elite śāstric texts.
- Do not use pluralism as a way to avoid criticizing coercion, discrimination, factual misinformation, or unsafe advice.
- A synthesis must cite what it includes, what it excludes, whose categories it adopts, and its temporal and practical scope.

## 10. Minimum viable architecture derived from this evidence

### 10.1 Recommendation

Use ordinary relational records plus full-text/vector retrieval for five linked objects:

1. **Atomic assertion:** exact proposition, source span, type, confidence, and rights.
2. **Warrant:** how this assertion is claimed to be known; competence, transmission, corroboration, and defeaters.
3. **Interpretation:** interpreter-attributed operation on a source passage, including lineage, rationale, conflict, and dissent.
4. **Case:** thick narrative or lived situation with roles, values, acts, consequences, interpretations, analogies, and disanalogies.
5. **Practice observation:** consent- and scope-governed living evidence with descriptive/prescriptive distinction.

Add a sixth lightweight object, **standpoint**, which can qualify any assertion, interpretation, case reading, or practice report. It does not need a new database engine.

### 10.2 Example compact schema sketch

~~~sql
assertion(
  id, proposition, assertion_type, source_span_id, language,
  tradition_scope_id, discourse_level, valid_time, valid_place,
  status, confidence_label, rights_lane, created_by, version
)

warrant(
  id, assertion_id, warrant_kind, warrant_tradition,
  source_or_speaker_id, competence_scope, transmission_kind,
  support_summary, defeater_summary, review_id
)

interpretation(
  id, interpreter_id, lineage_id, source_span_id, operation_type,
  target_assertion_id, rationale, scope_id, period, confidence_label,
  dissent_status, review_id, version
)

interpretation_edge(
  from_interpretation_id, to_object_id, edge_type,
  assertion_id, source_span_id, scope_id, review_id
)

case_record(
  id, source_id, narrative_frame, actors_json, roles_json,
  rule_at_issue, context_trigger, actions_json, intentions_json,
  consequences_json, affected_parties_json, controversy_summary,
  analogy_dimensions_json, disanalogies_json, anti_precedent,
  rights_lane, review_id, version
)

practice_observation(
  id, atomic_claim, community_scope_id, participant_role,
  observed_or_reported, time_scope, place_scope, occasion,
  method, variation_summary, authority_claim_id, consent_id,
  sensitivity, rights_lane, transcript_or_media_id, review_id, version
)

standpoint(
  id, tradition, lineage, period, region, language, social_location,
  object_aspect, purpose, evidence_quality, self_description_source
)
~~~

JSON fields in the sketch are expedient for a pilot, not a final normalization decision. Source payloads remain content-addressed outside application code; these are compact manifests and relations.

### 10.3 Retrieval policy

| User need | Primary layer | Required adjacent layers | Clarify when | Graceful failure |
|---|---|---|---|---|
| Exact textual fact | Source passage/assertion | Edition, translation, warrant | Wording, edition, or tradition changes answer | Quote/translate narrowly and state edition uncertainty. |
| Ritual vidhi | Procedure + source assertions | Interpretations, variants, living observation, applicability | Tradition, place, role, date, strictness, or material availability changes action | Give common safe core only if evidenced; identify missing lineage-specific authority. |
| Festival/story context | Narrative/source | Commentary, historical context, variants | User wants devotional, historical, comparative, or child-friendly frame | Present labelled versions rather than harmonizing. |
| Personal practical guidance | Cases + scoped patterns | Warrants, countercases, living constraints, safety/legal sources | Stakes, relationships, safety, or desired tradition are unknown | Offer reversible low-risk next step and say what remains uncertain. |
| Moral ambiguity | Multiple cases | Competing interpretations, affected-party perspectives, consequences, disanalogies | A missing fact could reverse advice | Ask one high-value question or provide conditional branches. |
| Comparative question | Standpoint-qualified assertions | Source and commentary graphs from each tradition | Terms are non-equivalent or the comparison is evaluative | Explain non-equivalence; do not rank traditions without criteria. |
| Reflective/existential question | Source passages + cases | Multiple lineages, user's stated values, non-fatalism safeguard | User appears in crisis or asks for authority the system lacks | Be companionable and modest; escalate crisis/safety needs appropriately. |

### 10.4 Inference-time deliberation without chain-of-thought exposure

The planner may internally assemble a structured **decision brief**, not prose reasoning:

- query class and stakes;
- known context and missing high-value context;
- candidate traditions/lineages requested or relevant;
- source assertions and their warrants;
- conflicting interpretations;
- candidate cases and top disanalogies;
- self, others, vulnerable parties, community, and institutional interests;
- short/long-term and reversible/irreversible consequences;
- safety, law, and factual constraints;
- uncertainty and a stop/clarify condition;
- answer mode: exact, conditional, plural, or unable-to-ground.

The user receives the conclusion, concise rationale, relevant attribution, options, and uncertainty—not hidden internal token-by-token reasoning.

## 11. Experiments that can falsify this proposal

### Experiment A — scoped-claim retrieval versus strong RAG

**Dataset.** Fifty questions from a bounded festival/ritual lane with genuine regional or lineage variation. Construct gold evidence from source passages, two commentarial traditions, procedure records, and documented practice.

**Arms.**

- A: strong hybrid RAG over passages with citations and reranking;
- B: A plus warrant, standpoint, interpretation, and conflict relations.

**Measures.** Correctness, variant disclosure, false harmonization, source/commentator confusion, clarification value, answer concision, latency, and reviewer preference. Require lineage-blind adjudication by at least two qualified reviewers plus disagreement record.

**Reject enriched layer if:** it does not materially reduce false universalization/source confusion, or its latency and editorial cost dominate.

### Experiment B — thick cases versus nearest narrative retrieval

**Dataset.** Thirty moral-ambiguity scenarios paired with two to four itihāsa or practice cases, explicit disanalogies, and counterreadings.

**Arms.**

- A: grounded passages and general safety prompt;
- B: A plus structured case dimensions and counter-case retrieval.

**Measures.** Analogy fit, disanalogy identification, anti-sycophancy, affected-party coverage, non-fatalism, harmful exception-making, actionability, and calibrated uncertainty.

**Reject case layer if:** it increases story-driven rationalization, authority theater, caste/gender stereotyping, or user-validation bias.

### Experiment C — Mīmāṃsā-inspired relation types

**Task.** Ask reviewers to resolve or appropriately preserve twenty textual/procedural conflicts.

**Arms.**

- A: passage bundle with metadata;
- B: human-authored generic conflict edges;
- C: tradition-attributed relation types inspired by Mīmāṃsā.

**Measure.** Omission, correct lineage scope, unjustified resolution, reviewer time, and explanation quality.

**Decision.** Prefer B unless C adds reliable, specialist-recognized value. Never infer C automatically from source order alone.

### Experiment D — standpoint matrix

**Task.** Answer contested historical, ritual, and philosophical questions.

**Ablation.** Remove or retain period/region/lineage/purpose/aspect fields.

**Measure.** False balance, false universality, evidence ranking, and user comprehension. The experiment tests a Devam scoping discipline; it does not claim to test syādvāda itself.

### Experiment E — living-practice pilot

Only after separate authorization and ethics/rights review. Compare published manual alone versus consented, community-reviewed observations for a narrowly selected public practice. Measure correction of sequence, eligibility, pronunciation/performance, substitutions, and local variation; also measure privacy burden, representational disagreement, and whether added detail is actually needed for the product.

## 12. Adversarial review

| Failure mode | How it arises | Required control | Stop condition |
|---|---|---|---|
| “Indic algorithm” branding | Market pressure collapses diverse sources into proprietary mystique. | Ban claims of civilizational implementation unless historically and empirically specific; publish architecture in plain operational terms. | Any output implies Sārthi computes dharma or embodies a tradition. |
| Pramāṇa cosplay | Sanskrit labels decorate ordinary metadata without doctrinal accuracy. | Tradition-qualified definitions and specialist review; use plain operational terms by default. | Labels do not improve an evaluated decision. |
| Mīmāṃsā universal rule engine | Ritual textual rules resolve unrelated ethical or modern problems. | Domain and genre scopes on every edge; no automatic global priority. | The engine suppresses a relevant lineage or living variant. |
| Jain relativism | Standpoint tags become “everyone is right.” | Evidence quality and harm constraints remain independent; record contradictions. | Unsupported or harmful claims gain parity through perspective tags. |
| Buddhist escape hatch | “Ultimate truth” shields factual or safety claims. | Discourse-level routing; factual claims require factual evidence. | An empirical claim becomes unfalsifiable. |
| Epic precedent laundering | A selected story authorizes a desired action. | Multiple cases, countercases, disanalogies, law/safety checks. | One story is the sole ground for consequential advice. |
| Commentary flattening | Most digitized commentary silently becomes the text. | Separate nodes, exact attribution, collection-bias audit. | Sārthi says “the source says” when the evidence is interpretive. |
| Majoritarian living practice | Frequency is treated as moral or traditional authority. | Descriptive/prescriptive field; marginalized and dissenting voices; human-rights and safety review. | Prevalence alone determines recommendation. |
| Elite-source dominance | Sanskrit śāstra and institutional experts eclipse vernacular, oral, household, Dalit, gendered, or regional evidence. | Acquisition coverage metrics by language, medium, social location, and dissent; document gaps. | A completeness claim hides uncollected lanes. |
| Sacred/privacy violation | Publicly discoverable material is ingested despite initiatory or community limits. | Consent, sensitivity, rights lane, access controls, minimization. | Permission is absent or scope is unclear. |
| Anti-modern authority | Historical sources displace medical, legal, safeguarding, or empirical expertise. | Route modern high-stakes claims to appropriate current evidence; tradition sources may supply meaning, not override safety. | Traditional authority is offered as medical/legal fact. |
| Synthetic consensus | Offline synthesis reconciles genuine contradictions. | Preserve assertion lineage, excluded evidence, dissent, version, and confidence. | Reconstruction cannot reproduce the conflict set. |

## 13. Acquisition priorities

### Priority 0 — governance before bytes

- Define rights lanes, quotation limits, translation labels, community-sensitive access, versioning, and reviewer qualifications.
- Record collection bias and missing languages/lineages before calling a lane representative.
- Separate source original, licensed translation, Devam translation, source-aligned synthesis, and model draft.

### Priority 1 — one commentarial vertical

Choose one hero experience with:

- a stable primary edition;
- at least two historically consequential, genuinely divergent commentaries;
- at least one vernacular or performance tradition;
- modern scholarship identifying interpretive stakes;
- a bounded ritual or practical question set;
- cleared rights for the product lane.

The Gītā is attractive for commentary diversity but dangerous as an MVP because its scale and modern ideological appropriation can produce premature universalization. A narrower festival procedure with two documented lineages may yield a cleaner first test.

### Priority 2 — case corpus

Acquire a small, reviewed set of Mahābhārata cases including Balāka–Kauśika, Tulādhāra–Jājali, and Pativratā–Vyādha, with the critical Sanskrit locus, more than one translation where rights permit, traditional commentary where available, and modern counterreadings. Add cases that challenge rather than repeat their apparent lesson.

### Priority 3 — living-practice evidence

First ingest only legitimately public, rights-cleared institutional manuals, recordings, and ethnography. Treat these as sourced accounts, not direct community consent for new product use. Fieldwork remains a separate authorized programme.

### Priority 4 — philosophical source families

Acquire pramāṇa, Mīmāṃsā, Jain, and Buddhist source families only to the depth needed for actual product questions, with primary text, commentary, scholarly translation, and modern disagreement. Avoid a prestige-driven philosophy corpus detached from user needs.

## 14. Rejected or deferred alternatives

1. **Universal “Indic wisdom ontology” — rejected.** It would convert disputed historical taxonomies into a modern homogenizing authority.
2. **Seven-valued syādvāda truth database — deferred/rejected for MVP.** Modern formalizations are contested, and no product benchmark establishes a gain over scoped assertions plus conflict preservation.
3. **Automatic Mīmāṃsā conflict resolver — rejected.** Domain transfer is unjustified and would conceal lineage-specific authority choices.
4. **LLM-generated commentary harmonization — rejected.** It creates unverifiable synthesis precisely where disagreement is substantive.
5. **Authority score for gurus/texts/institutions — rejected.** Competence is topic-specific; social prestige and spiritual authority are not calibrated truth probabilities.
6. **Epic embedding nearest-neighbor adviser — rejected.** Semantic similarity without disanalogy and countercase control invites moral cherry-picking.
7. **Living-practice web scraping as ethnography — rejected.** Public accessibility does not establish consent, representativeness, normativity, or reuse rights.
8. **Pure passage RAG as permanent architecture — not yet rejected.** It is the baseline. Every proposed structure must beat it on defined user harms before promotion.

## 15. Open questions requiring specialist and community review

- Which Mīmāṃsā relation types can be represented without implying that Devam endorses one historical school's authority theory?
- Which primary and commentarial editions have product-cleared rights and adequate textual apparatus?
- How should reviewer competence be represented without recreating exclusionary authority hierarchies?
- Which vernacular commentary and performance communities should be included in the first vertical, and how will absences be made visible?
- What consultation is necessary before representing a named living lineage even from public sources?
- Which cases contain caste, gender, disability, or social-role assumptions requiring a dedicated counterreading?
- Can users understand concise lineage attribution, or does the interface need progressive disclosure?
- What measured reduction in false universalization justifies the editorial cost of interpretation edges?
- How will corrections or consent changes propagate to embeddings, cached answers, and offline syntheses?
- When do “tradition fidelity” and user safety conflict, and who adjudicates that boundary?

## Evidence register

The register separates what a source establishes from what this memo infers. “Primary” identifies a primary text or institutional standard, not automatic product authority. Dates are publication/update dates where visible; “n.d.” means no reliable page date was displayed.

| ID | Class | Source, date, stable link / DOI | Finding used | Limitations and relevance |
|---|---|---|---|---|
| E01 | CS reference | Jonardon Ganeri and others, “Epistemology in Classical Indian Philosophy,” *Stanford Encyclopedia of Philosophy*, Fall 2022 archive. https://plato.stanford.edu/archives/fall2022/entries/epistemology-india/ | Cross-school pramāṇa comparison; Nyāya testimony, sentence understanding, tarka, arthāpatti, anupalabdhi. | High-quality synthesis, not a primary source; compresses centuries and schools. Used to prevent a school-neutral pramāṇa list. |
| E02 | CS reference | “Language and Testimony in Classical Indian Philosophy,” *SEP*, Spring 2023 archive. https://plato.stanford.edu/archives/spr2023/entries/language-india/ | Language, sentence meaning, and testimonial knowledge differ across traditions. | Overview; contested details require primary/commentarial checking. Supports meaning/provenance separation. |
| E03 | Primary + translation lead | Gautama, *Nyāyasūtra* with Vātsyāyana commentary, GRETIL electronic text. https://tylergneill.github.io/gretil-mirror/gretil/corpustei/transformations/html/sa_gautama-nyAyasUtra-comm-alt.htm | Primary locus for Nyāya knowledge sources and āpta testimony. | Electronic Sanskrit for research/reference; edition and rights metadata must be verified. Not itself an English interpretation. |
| E04 | HD/CS | “Dharmakīrti,” *SEP*, current entry accessed 2026-08-07. https://plato.stanford.edu/entries/dharmakiirti/ | Buddhist reduction/critique of testimony and knowledge sources; inference and perception. | One major Buddhist trajectory, not Buddhism as a whole. Supplies a counterposition to Nyāya. |
| E05 | CS | Rosanna Picascia, “Our epistemic dependence on others: testimonial knowledge in classical Indian philosophy,” *Journal of Hindu Studies* 17(1), 2024, article PDF. https://academic.oup.com/jhs/article-pdf/17/1/62/57906089/hiad003.pdf | Nyāya and Buddhist disagreements about testimonial dependence and certification. | Modern reconstruction; not a universal account of Indian testimony. Relevant to warrant and defeater design. |
| E06 | Primary | Jaimini, *Mīmāṃsāsūtra*, GRETIL electronic Sanskrit. https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/6_sastra/3_phil/mimamsa/jaimsutu.htm | Primary loci including 1.1.1–2 and 3.3.14's interpretive-factor ordering. | Research text; edition/encoding/rights need validation. A sūtra requires commentary; do not implement from isolated Sanskrit. |
| E07 | Primary translation lead | Mohan Lal Sandal (trans.), *The Mimamsa Sutras of Jaimini*, 1923, Internet Archive. https://archive.org/details/mimamsasutra00jaimuoft | Public-domain English access to the historical text. | Dated translation and terminology; not sufficient for current philology or product wording. |
| E08 | CS | Elisa Freschi and Matteo Pascucci, “Deontic Concepts and Their Clash in Mīmāṃsā,” *Theoria* 87(3), 2021, 659–703. https://doi.org/10.1111/theo.12307 ; open manuscript https://mimamsa.logic.at/files/FP2021theoria.pdf | Prescriptions, prohibitions, bādha, vikalpa, and formal reconstruction of conflict. | Formalization is contemporary scholarship, not the original system itself. Supports typed conflict relations, not universal rules. |
| E09 | CS | Elisa Freschi, “The Role of paribhāṣās in Mīmāṃsā,” *Asiatische Studien* 72(2), 2018, 567–595. https://mimamsa.logic.at/files/Freschi_paribhasa_AsiatischeStudien.pdf | Metarules, ordinary-language reasoning, and discipline-specific technical use. | Focused study; does not establish applicability outside Mīmāṃsā. Grounds scope safeguards. |
| E10 | CS | Himal Trikha, “When Texts Clash: Mīmāṃsā Thinkers on Conflicting Prescriptions and Prohibitions,” *Journal of Indian Philosophy*, 2020. https://doi.org/10.1007/s10781-020-09428-z | Historical analyses of conflict between prescriptions/prohibitions. | Access may be limited; represents scholarly reconstruction of particular thinkers. Relevant to conflict corpus acquisition. |
| E11 | CS reference | “Jaina Philosophy,” *SEP*, Summer 2024 archive. https://plato.stanford.edu/archives/sum2024/entries/jaina-philosophy/ | Development and diversity of Jain perspective, ontology, and epistemology. | Overview across languages and periods; primary loci need specialist checking. |
| E12 | CS | Graham Priest, “Jaina Logic: A Contemporary Perspective,” *History and Philosophy of Logic* 29(3), 2008, 263–278. https://doi.org/10.1080/01445340701690233 | A prominent modern formal interpretation of Jain logic. | Contemporary reconstruction, not proof of an ancient many-valued system. Included as promising but contested. |
| E13 | CS critique | Piotr Balcerowicz, “Do Attempts to Formalise Syād-vāda Make Sense?”, *CoJS Newsletter*, 2009. https://jainastudies.soas.ac.uk/newsletter/cojsn-2009-04.pdf | Warns against anachronistic formalization and misdescription. | Short critical intervention, not final consensus. Important counterweight to E12. |
| E14 | CS critique | Piotr Balcerowicz, critique of formal approaches to syādvāda, *International Journal of Jaina Studies* 9(4), 2013. https://jainastudies.soas.ac.uk/ijjs/ijjs-0904-2013.pdf | Detailed historical/semantic objections to common modern formalisations. | Specialist controversy; supports deferring a seven-valued implementation. |
| E15 | CS | Piotr Balcerowicz, “The Beginnings of Jaina Ontology and Its Models,” *Journal of Indian Philosophy* 49, 2021, 657–697. https://doi.org/10.1007/s10781-021-09480-3 ; open copy https://d-nb.info/1246232723/34 | Early evidence is scarce/scattered; later systematic models should not be projected backward. | Focused on ontology, but methodologically important for periodization. |
| E16 | CS reference | “The Theory of Two Truths in India,” *SEP*, Fall 2023 archive. https://plato.stanford.edu/archives/fall2023/entries/twotruths-india/ | Diversity and historical development of conventional/ultimate truth theories. | Broad reference, not source-specific adjudication. Supports discourse-level separation only. |
| E17 | Primary | Nāgārjuna, *Mūlamadhyamakakārikā*, GRETIL Sanskrit, especially chapter 24. https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/6_sastra/3_phil/buddh/nagmmk_u.htm | Primary locus for the two-truths formulation at 24.8–10. | Textual edition and interpretation contested; no direct product rule follows. |
| E18 | CS reference | “Madhyamaka,” *SEP*, Fall 2025 archive. https://plato.stanford.edu/archives/fall2025/entries/madhyamaka/ | Competing Madhyamaka interpretations and the role of conventional discourse. | Very broad; avoids treating one reading as universal. |
| E19 | CS | Brian Black, “The Subtlety of Subtales: Subaltern Voices of Sūkṣma Dharma in the Mahābhārata,” *International Journal of Hindu Studies* 26, 2022, 37–62. https://doi.org/10.1007/s11407-022-09313-2 ; https://link.springer.com/article/10.1007/s11407-022-09313-2 | Close study of morally complex embedded narratives and communicable subtle dharma; reports counterreadings. | One interpretive thesis; “subaltern voice” is contestable and may remain elite literary construction. Supports cases plus controversy, not direct advice. |
| E20 | Primary | *Mahābhārata* critical-text electronic edition, Tokunaga/Smith, GRETIL chapter 12.252. https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/2_epic/mbh/sas/b12/b12c252.htm | Primary narrative locus for Tulādhāra–Jājali and reflection on subtle/contextual dharma. | Electronic Sanskrit; textual and translation review needed. Narrative voice is not simple normative rule. |
| E21 | Primary | *Mahābhārata* 8.49, Sanskrit Sahitya electronic text/translation access. https://sanskritsahitya.org/mahabharatam/8.49 | Balāka–Kauśika case in which literal truth-telling contributes to harm. | Site edition/translation provenance must be checked against the critical edition before product use. |
| E22 | Primary edition lead | John Smith, electronic *Mahābhārata* critical edition interface. https://bombay.indology.info/mahabharata/welcome.html | Search/access path for critical Sanskrit loci. | Interface, not a scholarly interpretation; rights and persistent citation need review. |
| E23 | CS | Elisa Freschi, “The Reuse of Texts in Indian Philosophy: Introduction,” *Journal of Indian Philosophy* 43, 2015, 85–108. https://doi.org/10.1007/s10781-014-9232-9 | Quotation, reuse, commentary, and intellectual transmission require explicit relations. | Programmatic introduction; case studies needed for each lineage. |
| E24 | CS | Elisa Freschi, “Quotations, References, etc.: A Glimpse into the Writing Habits of a Late Mīmāṃsaka,” *Journal of Indian Philosophy*, 2015. https://doi.org/10.1007/s10781-014-9238-3 | Text reuse and attribution practices complicate simple document lineage. | Specific author/corpus; architecture relevance is an inference. |
| E25 | CS | Akshara Ravishankar, “Why comment? Interlingual commentaries in early modern India,” *Journal of the Royal Asiatic Society*, online publication. https://www.cambridge.org/core/journals/journal-of-the-royal-asiatic-society/article/why-comment-interlingual-commentaries-in-early-modern-india/F880BAEFE97CE41D798D77DF482E7260 | Rāmcaritmānas commentary schools, vernacular reading communities, and oral elaboration. | Focused case study; cannot stand for all commentary traditions. Supports oral/written interpretation nodes. |
| E26 | CS | Akshara Ravishankar, “Scholarly worlds and popular texts: Bhagavad Gītā's vernacular communities …,” 2024/2025. https://doi.org/10.1177/00699659241286568 | Commentaries and vernacular circulation construct communities and doctrinal layers. | Modern scholarly framing; obtain full bibliographic record before formal citation. |
| E27 | CS | Niranjan Saha, “Vedāntic Commentaries on the Bhagavadgītā …,” *Journal of Indian Philosophy* 45(2), 2017, 257–280. https://doi.org/10.1007/s10781-016-9306-y | Distinct commentarial views and followers make single-reading attribution unsafe. | Focused on selected Vedāntic commentaries, not all Gītā receptions. |
| E28 | CS | Donald R. Davis Jr., “Dharma in Practice: Ācāra and Authority in Medieval Dharmaśāstra,” *Journal of Indian Philosophy* 32, 2004, 813–830. https://doi.org/10.1007/s10781-004-8651-4 ; repository https://deepblue.lib.umich.edu/items/ca27b25b-c590-444e-98ce-cdd871b517b9 | Ācāra, authority, and the distinction between lived dharma and textual representation. | Historical legal/religious discourse with socially restricted authority; not a current universal norm. |
| E29 | CS | Donald R. Davis Jr., “Law and practice (ācāra),” in *The Spirit of Hindu Law*, 2010. https://doi.org/10.1017/CBO9780511674754.009 | Centrality of practice and the text/practice relation in Hindu legal traditions. | Book chapter and historical synthesis; architecture must not equate custom with moral correctness. |
| E30 | Institutional primary | UNESCO, *Convention for the Safeguarding of the Intangible Cultural Heritage*, 2003; current page. https://ich.unesco.org/en/convention | Community recognition, transmission, recreation, participation, and human-rights compatibility. | International safeguarding framework, not a substitute for local consent or doctrinal authority. |
| E31 | Institutional guidance | UNESCO, “What is Intangible Cultural Heritage?”, n.d. https://ich.unesco.org/en/what-is-intangible-heritage-00003?lang=en | Living heritage is community-recognized and continuously recreated. | Introductory guidance; communities remain internally diverse. |
| E32 | Institutional guidance | UNESCO, “Ethics and Intangible Cultural Heritage,” n.d. https://ich.unesco.org/en/ethics-and-ich-00866 | Collaboration, dialogue, negotiation, and free, prior, sustained, informed consent. | High-level principles; local protocol and law still required. |
| E33 | Institutional case | UNESCO, “Tradition of Vedic chanting,” Representative List entry. https://ich.unesco.org/en/RL/tradition-of-vedic-chanting-00062 | Oral techniques preserve accent/pronunciation beyond plain text, illustrating embodied evidence. | Heritage recognition is not universal ritual authority or product permission. |
| E34 | Professional standard | Oral History Association, “Best Practices,” current page accessed 2026-08-07. https://oralhistory.org/best-practices/ | Informed consent, narrator review, repository terms, and diversity of voices. | US-oriented professional standard; adapt to Indian law, languages, and communities. |
| E35 | Professional standard | Oral History Association, “Core Principles,” current page. https://oralhistory.org/oha-core-principles/ | Ongoing participation, power awareness, documentation, and stewardship. | General oral-history ethics, not tradition-specific practice authority. |
| E36 | Professional standard | American Anthropological Association, “Obtain Informed Consent and Necessary Permissions,” current page. https://ethics.americananthro.org/ethics-statement-3-obtain-informed-consent-and-necessary-permissions/ | Consent is an ongoing negotiated process; permissions and harm matter. | Professional guidance, not legal advice; must be localized. |
| E37 | CS | David N. Lorenzen, “Who Invented Hinduism?”, *Comparative Studies in Society and History* 41(4), 1999, 630–659. https://doi.org/10.1017/S0010417599003084 | Challenges a simple colonial-invention thesis and documents earlier identity formations. | One side of a large debate; not proof of timeless unity. |
| E38 | CS | Brian K. Pennington, *Was Hinduism Invented?*, Oxford University Press, 2005. https://doi.org/10.1093/0195166558.001.0001 | Colonial institutions and representations shaped modern Hinduism. | Monograph thesis with debated emphases; relevant to category caution. |
| E39 | CS | Andrew J. Nicholson, *Unifying Hinduism*, Columbia University Press, 2010/2013. https://doi.org/10.7312/nich14986 | Documents precolonial philosophical unification projects in a historical period. | Selected Sanskrit intellectual history, not exhaustive social history. Shows unity itself has provenance. |
| E40 | CS review | *Notre Dame Philosophical Reviews*, review of *Unifying Hinduism*, 2011. https://ndpr.nd.edu/reviews/unifying-hinduism-philosophy-and-identity-in-indian-intellectual-history/ | Contextualizes Nicholson's intervention and its limits. | Review, not independent primary evidence; used to map scholarly debate. |
| E41 | CS | Donald R. Davis Jr., “Hermeneutics and ethics (mīmāṃsā),” in *The Spirit of Hindu Law*, 2010. https://doi.org/10.1017/CBO9780511674754.004 | Mīmāṃsā influenced legal hermeneutics while remaining distinct from Dharmaśāstra. | Historical synthesis; legal transfer into modern product decisions would be unwarranted. |
| E42 | Institutional guidance | UNESCO, “Safeguarding without freezing,” n.d. https://ich.unesco.org/en/safeguarding-00012 | Safeguarding living heritage should support transmission without fixing one immutable form. | General principle; product versioning and consent still need concrete controls. |

### Sources deliberately not adopted as architecture evidence

- Recent arXiv or marketing claims that fine-tuning on “pramāṇa,” Navya-Nyāya, “Indic logic,” or spiritual corpora creates wiser models were not treated as established. Without independently inspectable datasets, culturally competent evaluation, strong RAG baselines, and harm testing, they are hypotheses.
- Popular summaries equating syādvāda with seven-valued logic, “all truths are relative,” or tolerance were excluded unless paired with historical scholarship.
- Guru, institutional, temple, or community websites may become valuable **first-party living-practice sources**, but they do not establish universal historical doctrine and their product rights must be checked.
- English translations were not assumed to preserve technical equivalence. Devam needs original-language spans and translation provenance.

## Decision for the parent programme

**Adopt now:** warrant records, standpoint scope, interpretation edges, thick cases with disanalogies, living-practice consent metadata, and conflict-preserving retrieval.

**Pilot before scaling:** one bounded interpretive/ritual vertical and a small case corpus, evaluated against strong grounded RAG.

**Reject for MVP:** universal Indic ontology, automatic dharma resolution, seven-valued truth engine, authority ranking, automatic commentary harmonization, and scraped living-practice “ground truth.”

**Confidence:** high that provenance-, scope-, and conflict-aware records reduce identifiable flattening risks; moderate that thick cases improve practical judgment; low that school-specific formal logic adds value beyond a simpler typed evidence layer. The latter must earn adoption empirically.

