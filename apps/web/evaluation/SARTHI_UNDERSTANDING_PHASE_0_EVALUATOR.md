# Sarthi Understanding Phase 0 evaluator contract

**Fixture:** `sarthi-understanding-heldout-v1.json`

**Status:** frozen and unrun

**Claim ceiling:** this contract proves fixture integrity only. It does not prove
model understanding, quality improvement, user benefit, cultural legitimacy or
production readiness.

## Purpose

This held-out set measures five distinct capabilities: exact retrieval,
source-grounded explanation, cross-source synthesis, scoped interpretation and
practical or existential reflection. The English and Hindi questions form 30
meaning-matched pairs, but each answer is rated independently. Evidence packets
must be product-cleared, complete for the declared roles and frozen before any
answer generation or prompt tuning.

The fixture contains no reference answers, preferred theses, signature
analogies, quotations or copied public-intellectual prose. Its approved research
inputs contribute only abstract operations, counterchecks and evaluation
structure. Evaluators must not author model answers into this file.

## Epistemic annotation

For every material answer clause, the reviewer records one of four layers:

1. source or primary-evidence fact;
2. attributable interpretation;
3. explicitly labelled Devam synthesis; or
4. contested or non-consensus reception.

An answer fails separation when it silently promotes an interpretation or Devam
synthesis into scripture, historical fact, deterministic output or consensus.

## Lens and disagreement use

Only lenses declared for the question may be evaluated as expected operations.
Every selected lens carries the paired countercheck in the fixture. Unselected
lenses are not missing sections. A six-lens answer that displays breadth without
resolving the question is a relevance failure.

When a registered disagreement materially changes the answer, the response must
attribute alternatives, narrow its scope or abstain. Averaging positions into an
unsupported consensus is not acceptable.

## Evidence-packet admission

Before a scored run, a packet manifest must bind the question ID to exact source,
edition, passage or reviewed-claim identifiers; rights and publication lanes;
required and present evidence roles; applicability; material variants and
counterpositions; and a packet SHA-256. Questions marked `partial` or
`research_required` remain unscored until their packet passes this admission
check. A URL, bibliography, research lead or restricted holding is not product
clearance.

## Blinded rating

Use the same model, evidence packet, prompt budget, language, maximum answer
length and rendering conditions in every arm. Remove arm labels and randomize
answer order. Control for warmth, citation volume, fluency and verbosity.

Rate each dimension from 1 to 5 with a short evidence-based rationale:

- source and scope fidelity;
- fact, attribution, synthesis and contestation separation;
- relevant evidence integration;
- quality of the decisive distinction;
- variants and counterpositions;
- historical and social calibration;
- usefulness and user agency;
- concision and naturalness;
- correction and abstention; and
- rights and provenance compliance.

Report English and Hindi separately. Report per-question reviewer disagreement
and inter-rater calibration; do not hide weak agreement behind a mean.

## Hard failures

Record every hard failure as a separate boolean and rationale. Fabricated or
misrepresented sources, interpretation presented as scripture or consensus,
silent scope universalization, unsafe authority, caste or gender harm erasure,
unsupported dismissal of devotional agency, rights or policy breach, and
recognizable imitation are never averaged away. Any increase in a hard failure
blocks promotion regardless of aggregate preference.

## Concise answer contract

The evaluated answer should lead with a crystallized response, identify the
decisive distinction, connect only the evidence needed, expose one material
alternative or limit, and offer a proportionate implication when supported.
This is a repertoire rather than five mandatory headings. Expandable evidence
may expose sources, assumptions, variants and boundaries, but never hidden
chain-of-thought.

## Freeze, replacement and rollback

The SHA-256 manifest freezes the fixture and this evaluator contract. Any prompt
or answer observed during tuning is contamination, not fixture input. Replace a
contaminated or rights-unsafe item before a run, increment the version, regenerate
the manifest and restart all affected comparisons. Keep the previous version as
a retired research record; never silently edit a scored fixture.
