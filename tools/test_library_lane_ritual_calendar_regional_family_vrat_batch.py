"""Adversarial validation for eight regional women's/family-vrat lanes."""
import json
from pathlib import Path
from jsonschema import Draft202012Validator
ROOT=Path(__file__).resolve().parents[1];LANE=ROOT/"knowledge_packs"/"library_lanes"/"ritual-calendar"
SLUGS=["karadaiyan-nombu","gangaur","jayaparvati-vrat","kokila-vrat","hariyali-teej","kajari-teej","kevda-trij","atla-tadde"]
DATES=["15 March 2027","9 April 2027","16-21 July 2027","17 July 2027 Gujarati reference; 18 July generic reference","4 August 2027","20 August 2027","3 September 2027","18 October 2027"]
IDS=[f"{x}-regional-family-household-participant-2027-v1" for x in SLUGS]
def load(p):return json.loads(p.read_text(encoding="utf-8"))
def pack(s):return load(LANE/"packs"/f"{s}-regional-family-household-participant-2027-v1.json")
def refs(v):
 if isinstance(v,dict):
  for k,c in v.items():
   if k in {"source_ids","resolution_source_ids"}:yield from c
   yield from refs(c)
 elif isinstance(v,list):
  for c in v:yield from refs(c)
def test_exact_8_schema_utf8_source_closure_and_bilingual_completion():
 schema=load(ROOT/"schemas"/"ritual-observance-content-v1.schema.json")
 for slug,lane,date in zip(SLUGS,IDS,DATES):
  raw=(LANE/"packs"/f"{lane}.json").read_bytes();text=raw.decode("utf-8","strict");assert b"\xef\xbf\xbd" not in raw
  p=json.loads(text);Draft202012Validator(schema).validate(p);assert p["lane_id"]==lane and p["observance_slugs"]==[slug]
  assert {x["language_code"] for x in p["localized_content"]}=={"en","hi"};assert set(refs(p))<={x["source_id"] for x in p["sources"]}
  assert date in p["calendar"]["freshness_note"] and "Recompute" in p["calendar"]["freshness_note"] and "Never copy" in p["calendar"]["freshness_note"]
  assert all(p["product_status"]["completed_dimensions"].values())
  for lc in p["localized_content"]:
   assert len(lc["origin_narratives"])==2 and all(not x["universal_origin_claimed"] for x in lc["origin_narratives"])
   assert [x["tier"] for x in lc["procedures"]]==["minimum","standard","elaborate"]
   assert all(not m["required"] and m["substitutions"] for q in lc["procedures"] for m in q["materials"])
def test_material_differences_and_dignity_boundaries():
 expected={"karadaiyan-nombu":["savitri","yellow thread","remain in harm"],"gangaur":["procession","marriage","mutual respect"],"jayaparvati-vrat":["multi-day","salt/grain","normal nutrition"],"kokila-vrat":["17 july 2027 gujarati","18 july generic","bird is never"],"hariyali-teej":["rajasthan","swing","consent-led"],"kajari-teej":["distinct from hariyali","kajri","no marital status"],"kevda-trij":["allergy","varaha jayanti","fragrance"],"atla-tadde":["nirjala","moon arghya","skip the swing"]}
 for slug,terms in expected.items():
  whole=json.dumps(pack(slug),ensure_ascii=False).lower();assert all(x in whole for x in terms),(slug,[x for x in terms if x not in whole])
def test_rejects_gender_coercion_and_promises():
 forbidden=["every woman must","every wife must","unmarried girls must","you must fast","must remain married","must pray for husband","must use a swing","must wear the thread","guarantees spouse longevity","guarantees marriage","abuse is a duty"]
 for slug in SLUGS:
  whole=json.dumps(pack(slug),ensure_ascii=False).lower();assert all(x not in whole for x in forbidden),slug
def test_links_progress_matrix_and_unprojected_boundary():
 links=load(LANE/"cross-links"/"regional-womens-family-vrat-batch-8-owner-proposals-v1.json");Draft202012Validator(load(ROOT/"schemas"/"cross-lane-link-proposal-v1.schema.json")).validate(links)
 assert len(links["proposals"])==8 and all(x["target_resolution"]=="unresolved_owner_lane" for x in links["proposals"])
 p=load(LANE/"inventory"/"ritual-calendar-authoring-progress-v1.json");assert p["completed_after_freeze"]==176 and p["remaining_authoring_items"]==32
 for lane in IDS:assert p["completed_lane_ids"].count(lane)==1 and p["completed_pack_refs"].count(f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane}.json")==1
 matrix=(LANE/"research"/"regional-womens-family-vrat-batch-8-evidence-matrix-2027-v1.md").read_text(encoding="utf-8")
 for term in ("eight accepted named answers","Major variants only","No woman, girl, wife","0 of 19,480"):assert term in matrix
