"""Adversarial checks for twelve seasonal, harvest and new-year answers."""

import json
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parents[1]
LANE=ROOT/"knowledge_packs"/"library_lanes"/"ritual-calendar"
SLUGS=["aadi-perukku","bhogi-pandigai","magh-bihu","makaravilakku","malayalam-new-year","mandalakala-pooja","mattu-pongal","nutan-varsh-prarambha","pohela-boishakha","pongal","puthandu","vishu"]
IDS=[f"{x}-seasonal-household-participant-2027-v1" for x in SLUGS]
DATES={"aadi-perukku":"3 August 2027","bhogi-pandigai":"14 January 2027","magh-bihu":"15 January 2027","makaravilakku":"15 January 2027","malayalam-new-year":"17 August 2027","mandalakala-pooja":"27 December 2027","mattu-pongal":"16 January 2027","nutan-varsh-prarambha":"7 April 2027","pohela-boishakha":"15 April 2027","pongal":"14–17 January 2027 sequence","puthandu":"14 April 2027","vishu":"15 April 2027"}

def load(p): return json.loads(p.read_text(encoding="utf-8"))
def pack(slug): return load(LANE/"packs"/f"{slug}-seasonal-household-participant-2027-v1.json")
def refs(v):
 if isinstance(v,dict):
  for k,c in v.items():
   if k in {"source_ids","resolution_source_ids"}: yield from c
   yield from refs(c)
 elif isinstance(v,list):
  for c in v: yield from refs(c)

def test_exact_12_schema_utf8_source_closure_and_complete_bilingual_contract():
 schema=load(ROOT/"schemas"/"ritual-observance-content-v1.schema.json")
 assert len(IDS)==len(set(IDS))==12
 for slug,lane_id in zip(SLUGS,IDS):
  raw=(LANE/"packs"/f"{lane_id}.json").read_bytes(); text=raw.decode("utf-8","strict")
  assert "\ufffd" not in text
  p=json.loads(text); Draft202012Validator(schema).validate(p)
  assert p["lane_id"]==lane_id and p["observance_slugs"]==[slug]
  assert {x["language_code"] for x in p["localized_content"]}=={"en","hi"}
  assert set(refs(p))<={x["source_id"] for x in p["sources"]}
  assert all(p["product_status"]["completed_dimensions"].values())
  for lc in p["localized_content"]:
   assert len(lc["origin_narratives"])==2
   assert all(not x["universal_origin_claimed"] for x in lc["origin_narratives"])
   assert [x["tier"] for x in lc["procedures"]]==["minimum","standard","elaborate"]
   assert all(not m["required"] and m["substitutions"] for q in lc["procedures"] for m in q["materials"])

def test_fixtures_are_recomputed_and_never_copied():
 for slug in SLUGS:
  whole=json.dumps(pack(slug),ensure_ascii=False)
  assert DATES[slug] in whole and "Recompute" in whole and "Never copy" in whole
  assert "city" in whole.lower() and "112" in whole

def test_material_differences_are_preserved():
 expected={
  "aadi-perukku":["water","river entry","flood"],
  "bhogi-pandigai":["clean","plastic","bonfire"],
  "magh-bihu":["Uruka","Meji","pitha"],
  "makaravilakku":["Sabarimala","pilgrimage","unauthorised light"],
  "malayalam-new-year":["Chingam 1","Vishu"],
  "mandalakala-pooja":["41-day","austerity","current institutional"],
  "mattu-pongal":["cattle","unfamiliar animal","welfare"],
  "nutan-varsh-prarambha":["Chaitra Shukla Pratipada","Gudi Padwa","Ugadi"],
  "pohela-boishakha":["Haal Khata","Bengali New Year","financial consent"],
  "pongal":["four-day","Bhogi","Kaanum"],
  "puthandu":["Chithirai","Brahma","living myth"],
  "vishu":["Vishukkani","money gifts","luck"],
 }
 for slug,terms in expected.items():
  whole=json.dumps(pack(slug),ensure_ascii=False).lower()
  assert all(x.lower() in whole for x in terms),(slug,[x for x in terms if x.lower() not in whole])

def test_reuse_is_explicit_and_does_not_duplicate_parent_payload():
 parent="knowledge_packs/library_lanes/ritual-calendar/packs/thai-pongal-tamil-household-participant-2027-v1.json"
 for slug in ("bhogi-pandigai","mattu-pongal","pongal"):
  p=pack(slug); src={x["source_id"]:x for x in p["sources"]}["devam-thai-pongal-parent"]
  assert src["citation_coordinates"]["path"]==parent
  assert (LANE/"packs"/f"{slug}-seasonal-household-participant-2027-v1.json").stat().st_size < 35000

def test_rejects_universal_promises_and_unsafe_requirements():
 forbidden=["every hindu must","all indians must","you must fast","must enter the river","must light a bonfire","must handle cattle","guarantees luck","guarantees prosperity","donation is mandatory","fireworks are required"]
 for slug in SLUGS:
  whole=json.dumps(pack(slug),ensure_ascii=False).lower()
  assert all(x not in whole for x in forbidden),slug

def test_links_progress_matrix_and_unprojected_boundary():
 links=load(LANE/"cross-links"/"seasonal-new-year-harvest-batch-12-owner-proposals-v1.json")
 schema=load(ROOT/"schemas"/"cross-lane-link-proposal-v1.schema.json")
 Draft202012Validator(schema).validate(links)
 assert len(links["proposals"])==12 and len({x["proposal_id"] for x in links["proposals"]})==12
 assert all(x["target_resolution"]=="unresolved_owner_lane" for x in links["proposals"])
 p=load(LANE/"inventory"/"ritual-calendar-authoring-progress-v1.json")
 assert p["completed_after_freeze"]==149 and p["remaining_authoring_items"]==59
 assert p["completed_after_freeze"]+p["remaining_authoring_items"]==208
 for lane_id in IDS:
  assert p["completed_lane_ids"].count(lane_id)==1
  assert p["completed_pack_refs"].count(f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane_id}.json")==1
 matrix=(LANE/"research"/"seasonal-new-year-harvest-batch-12-evidence-matrix-2027-v1.md").read_text(encoding="utf-8")
 for term in ("twelve accepted named answers","Major variants only","does not count a lane as projected","19,480"):
  assert term in matrix
