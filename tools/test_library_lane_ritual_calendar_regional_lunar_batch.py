"""Adversarial checks for thirteen regional lunar-phase lanes."""

import json
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parents[1]
LANE=ROOT/"knowledge_packs"/"library_lanes"/"ritual-calendar"
SLUGS=["thai-amavasai","mauni-amavas","dol-purnima","chitra-pournami","madana-pournami","savitri-amabasya","aadi-amavasai","somavati-amavasya","gamha-purnima","pithori-amavasya","mahalaya-amabasya","mahalaya-amavasai","sharad-purnima"]
IDS=[f"{x}-regional-household-participant-2027-v1" for x in SLUGS]
DATES={"thai-amavasai":"6 February 2027","mauni-amavas":"6 February 2027","dol-purnima":"22 March 2027","chitra-pournami":"20 April 2027","madana-pournami":"20 April 2027","savitri-amabasya":"4 June 2027","aadi-amavasai":"2 August 2027","somavati-amavasya":"8 March, 2 August and 27 December 2027","gamha-purnima":"17 August 2027","pithori-amavasya":"31 August 2027","mahalaya-amabasya":"29 September 2027","mahalaya-amavasai":"29 September 2027","sharad-purnima":"14 October 2027 named observance; actual Purnima continues 15 October"}

def load(p): return json.loads(p.read_text(encoding="utf-8"))
def pack(slug): return load(LANE/"packs"/f"{slug}-regional-household-participant-2027-v1.json")
def refs(v):
 if isinstance(v,dict):
  for k,c in v.items():
   if k in {"source_ids","resolution_source_ids"}: yield from c
   yield from refs(c)
 elif isinstance(v,list):
  for c in v: yield from refs(c)

def test_exact_13_schema_utf8_source_closure_and_bilingual_contract():
 schema=load(ROOT/"schemas"/"ritual-observance-content-v1.schema.json")
 assert len(IDS)==len(set(IDS))==13
 for slug,lane_id in zip(SLUGS,IDS):
  raw=(LANE/"packs"/f"{lane_id}.json").read_bytes(); text=raw.decode("utf-8","strict"); assert "\ufffd" not in text
  p=json.loads(text); Draft202012Validator(schema).validate(p); assert p["lane_id"]==lane_id and p["observance_slugs"]==[slug]
  assert {x["language_code"] for x in p["localized_content"]}=={"en","hi"}
  assert p["calendar"]["timing_kind"]=="mixed" and p["calendar"]["location_aware"] and p["calendar"]["tradition_aware"]
  assert set(refs(p))<={x["source_id"] for x in p["sources"]}
  for lc in p["localized_content"]:
   assert len(lc["origin_narratives"])==2 and all(not x["universal_origin_claimed"] for x in lc["origin_narratives"])
   assert [x["tier"] for x in lc["procedures"]]==["minimum","standard","elaborate"]
   assert all(not m["required"] and m["substitutions"] for q in lc["procedures"] for m in q["materials"])
   assert len([x for x in lc["variants"] if not x["separate_lane_required"]])==1

def test_dates_recompute_and_shared_story_does_not_become_origin():
 for slug in SLUGS:
  p=pack(slug); whole=json.dumps(p,ensure_ascii=False).lower()
  assert DATES[slug].lower() in whole and "recompute" in whole and "never copy" in whole
  assert "not observance origin" in whole or "not regional amavasya origin" in whole
  assert "no fast" in whole and "112" in whole
  if "purn" in slug or "pourn" in slug or slug=="gamha-purnima": assert "soma" in whole and "rohini" in whole and "prabhasa" in whole
  else: assert "nachiketa" in whole and "yama" in whole and "afterlife fact" in whole

def test_material_differences_are_preserved_without_coercion():
 expected={
  "mauni-amavas":["voluntary and interruptible","speech deprivation","holy dip"],
  "dol-purnima":["colour","explicit consent","named organiser"],
  "chitra-pournami":["chitragupta","divine surveillance","sin scoring"],
  "savitri-amabasya":["savitri-satyavan","no wife","accept abuse"],
  "somavati-amavasya":["monday coincidence","tree-circling","fertility"],
  "gamha-purnima":["balabhadra","raksha","cattle"],
  "pithori-amavasya":["sixty-four yogini","sapta matrika","cow-dung","no pregnancy"],
  "sharad-purnima":["milk is optional","refrigeration","moonlight is not a cure","vigil"],
 }
 for slug,terms in expected.items():
  whole=json.dumps(pack(slug),ensure_ascii=False).lower(); assert all(x in whole for x in terms),(slug,[x for x in terms if x not in whole])
 for slug in ("aadi-amavasai","thai-amavasai","mahalaya-amabasya","mahalaya-amavasai"):
  whole=json.dumps(pack(slug),ensure_ascii=False).lower(); assert "ancestor remembrance" in whole and "formal tarpana" in whole

def test_rejects_universal_promises_and_compulsory_materials():
 forbidden=["every hindu must","all indians must","you must fast","must take a holy dip","must drink milk","must remain silent","wife must fast","mother must observe","guarantees child protection","moonlight cures","ancestor is satisfied","donation is mandatory"]
 for slug in SLUGS:
  whole=json.dumps(pack(slug),ensure_ascii=False).lower(); assert all(x not in whole for x in forbidden),slug

def test_links_progress_matrix_and_unprojected_boundary():
 links=load(LANE/"cross-links"/"regional-lunar-phase-batch-13-owner-proposals-v1.json"); schema=load(ROOT/"schemas"/"cross-lane-link-proposal-v1.schema.json"); Draft202012Validator(schema).validate(links)
 assert len(links["proposals"])==26 and len({x["proposal_id"] for x in links["proposals"]})==26
 assert all(x["target_resolution"]=="unresolved_owner_lane" for x in links["proposals"])
 p=load(LANE/"inventory"/"ritual-calendar-authoring-progress-v1.json"); assert p["completed_after_freeze"]==149 and p["remaining_authoring_items"]==59
 assert p["completed_after_freeze"]+p["remaining_authoring_items"]==208
 for lane_id in IDS:
  assert p["completed_lane_ids"].count(lane_id)==1
  assert p["completed_pack_refs"].count(f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane_id}.json")==1
 matrix=(LANE/"research"/"regional-lunar-phase-batch-13-evidence-matrix-2027-v1.md").read_text(encoding="utf-8")
 for term in ("thirteen accepted lunar-phase","Major variants only","does not count a lane as authored","19,480"): assert term in matrix
