"""Adversarial validation for three Naga/Garuda observance lanes."""
import json
from pathlib import Path
from jsonschema import Draft202012Validator
ROOT=Path(__file__).resolve().parents[1];L=ROOT/"knowledge_packs"/"library_lanes"/"ritual-calendar"
E={"nag-panchami":"nag-panchami-multi-regional-animal-safe-household-2027-v1","nagula-chavithi":"nagula-chavithi-telugu-animal-safe-household-2027-v1","garuda-panjami":"garuda-panchami-south-india-household-temple-participant-2027-v1"}
def load(p):return json.loads(p.read_text(encoding="utf-8"))
def pack(s):return load(L/"packs"/f"{E[s]}.json")
def refs(v):
 if isinstance(v,dict):
  for k,c in v.items():
   if k in {"source_ids","resolution_source_ids"}:yield from c
   yield from refs(c)
 elif isinstance(v,list):
  for c in v:yield from refs(c)
def test_exact_three_schema_utf8_source_closure_and_bilingual_completion():
 schema=load(ROOT/"schemas"/"ritual-observance-content-v1.schema.json")
 for slug,lane in E.items():
  raw=(L/"packs"/f"{lane}.json").read_bytes();text=raw.decode("utf-8","strict");assert b"\xef\xbf\xbd" not in raw
  assert sum(0x900<=ord(c)<=0x97f for c in text)>900
  p=json.loads(text);Draft202012Validator(schema).validate(p);assert p["lane_id"]==lane and p["observance_slugs"]==[slug]
  assert {x["language_code"] for x in p["localized_content"]}=={"en","hi"};assert set(refs(p))<={x["source_id"] for x in p["sources"]}
  assert all(p["product_status"]["completed_dimensions"].values())
  for lc in p["localized_content"]:
   assert len(lc["origin_narratives"])==2 and all(not x["universal_origin_claimed"] for x in lc["origin_narratives"])
   assert [x["tier"] for x in lc["procedures"]]==["minimum","standard","elaborate"]
   assert all(not m["required"] and m["substitutions"] for q in lc["procedures"] for m in q["materials"])
def test_timing_routes_and_story_sequence_are_materially_distinct():
 n=json.dumps(pack("nag-panchami"),ensure_ascii=False).lower();c=json.dumps(pack("nagula-chavithi"),ensure_ascii=False).lower();g=json.dumps(pack("garuda-panjami"),ensure_ascii=False).lower()
 assert all(x in n for x in ("6 august 2027","22 august 2027","shravana shukla","shravana krishna"))
 assert all(x in c for x in ("2 november 2027","kartika shukla chaturthi","not the august"))
 assert all(x in g for x in ("ttd","garuda vahana","not a requirement for women or parents","recomputed"))
 for whole in (n,c,g):
  assert all(x in whole for x in ("kadru","vinata","amrita","janamejaya","astika","mass killing"))
def test_rejects_live_snake_contact_milk_myth_and_ritual_first_aid():
 forbidden=["catch a live snake","feed milk to snakes","put your hand into","mantra replaces antivenom","snake stone cures","every woman must","guarantees fertility","kill the snake for safety"]
 for slug in E:
  whole=json.dumps(pack(slug),ensure_ascii=False).lower();assert all(x not in whole for x in forbidden),slug
  for req in ("never seek","never feed a snake","do not catch or kill","antivenom","urgent clinical care/112","do not cut","substitute mantra for antivenom"):
   assert req in whole,(slug,req)
def test_links_progress_matrix_and_unprojected_boundary():
 links=load(L/"cross-links"/"naga-garuda-observance-batch-3-owner-proposals-v1.json");Draft202012Validator(load(ROOT/"schemas"/"cross-lane-link-proposal-v1.schema.json")).validate(links)
 assert len(links["proposals"])==3 and all(x["target_resolution"]=="unresolved_owner_lane" for x in links["proposals"])
 p=load(L/"inventory"/"ritual-calendar-authoring-progress-v1.json");assert p["completed_after_freeze"]==176 and p["remaining_authoring_items"]==32
 for lane in E.values():assert p["completed_lane_ids"].count(lane)==1 and p["completed_pack_refs"].count(f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane}.json")==1
 matrix=(L/"research"/"naga-garuda-observance-batch-3-evidence-matrix-2027-v1.md").read_text(encoding="utf-8")
 for x in ("Exactly three accepted","Government/WHO guidance","never directs a user","No source payload is copied"):assert x in matrix
