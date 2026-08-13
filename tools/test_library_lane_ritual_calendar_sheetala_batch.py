"""Adversarial validation for three Sheetala-family regional lanes."""
import json
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parents[1];LANE=ROOT/"knowledge_packs"/"library_lanes"/"ritual-calendar"
EVENTS={"basoda":"basoda-north-india-sheetala-household-2027-v1","sheetala-ashtami":"sheetala-ashtami-north-india-deity-household-2027-v1","shitala-satam":"shitala-satam-gujarat-household-participant-2027-v1"}
def load(p):return json.loads(p.read_text(encoding="utf-8"))
def pack(s):return load(LANE/"packs"/f"{EVENTS[s]}.json")
def refs(v):
 if isinstance(v,dict):
  for k,c in v.items():
   if k in {"source_ids","resolution_source_ids"}:yield from c
   yield from refs(c)
 elif isinstance(v,list):
  for c in v:yield from refs(c)

def test_exact_three_schema_utf8_source_closure_and_bilingual_completion():
 schema=load(ROOT/"schemas"/"ritual-observance-content-v1.schema.json")
 for slug,lane in EVENTS.items():
  raw=(LANE/"packs"/f"{lane}.json").read_bytes();text=raw.decode("utf-8","strict")
  assert b"\xef\xbf\xbd" not in raw and sum(0x900<=ord(c)<=0x97f for c in text)>1000
  p=json.loads(text);Draft202012Validator(schema).validate(p)
  assert p["lane_id"]==lane and p["observance_slugs"]==[slug]
  assert {x["language_code"] for x in p["localized_content"]}=={"en","hi"}
  assert set(refs(p))<={x["source_id"] for x in p["sources"]}
  assert all(p["product_status"]["completed_dimensions"].values())
  for lc in p["localized_content"]:
   assert len(lc["origin_narratives"])==2 and all(not x["universal_origin_claimed"] for x in lc["origin_narratives"])
   assert [x["tier"] for x in lc["procedures"]]==["minimum","standard","elaborate"]
   assert all(not m["required"] and m["substitutions"] for q in lc["procedures"] for m in q["materials"])

def test_overlap_and_gujarati_material_difference_are_explicit():
 basoda=json.dumps(pack("basoda"),ensure_ascii=False).lower();ashtami=json.dumps(pack("sheetala-ashtami"),ensure_ascii=False).lower();satam=json.dumps(pack("shitala-satam"),ensure_ascii=False).lower()
 for whole in (basoda,ashtami):
  assert all(x in whole for x in ("same observance","do not duplicate","post-holi","30 march 2027"))
 assert all(x in satam for x in ("randhan chhath","shravan","23 august","24 august 2027","months later"))
 for whole in (basoda,ashtami,satam):
  assert all(x in whole for x in ("skanda purana","donkey","broom","winnowing fan","water pot"))

def test_food_and_medical_safety_override_customary_practice():
 forbidden=["food left overnight at room temperature is safe","worship is a cure","worship is prevention","every family must","you must eat stale food","pregnant people must fast","this guarantees protection","smallpox is caused by the goddess"]
 for slug in EVENTS:
  whole=json.dumps(pack(slug),ensure_ascii=False).lower()
  assert all(x not in whole for x in forbidden),slug
  for required in ("within two hours","one hour above about 32 c","shallow containers","4 c or below","shelf-stable","discard doubtful food","vaccination","public-health","112"):
   assert required in whole,(slug,required)

def test_links_progress_matrix_and_unprojected_boundary():
 links=load(LANE/"cross-links"/"sheetala-regional-observance-batch-3-owner-proposals-v1.json")
 Draft202012Validator(load(ROOT/"schemas"/"cross-lane-link-proposal-v1.schema.json")).validate(links)
 assert len(links["proposals"])==3 and all(x["target_resolution"]=="unresolved_owner_lane" for x in links["proposals"])
 p=load(LANE/"inventory"/"ritual-calendar-authoring-progress-v1.json");assert p["completed_after_freeze"]==183 and p["remaining_authoring_items"]==25
 for lane in EVENTS.values():
  assert p["completed_lane_ids"].count(lane)==1
  assert p["completed_pack_refs"].count(f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane}.json")==1
 matrix=(LANE/"research"/"sheetala-regional-observance-batch-3-evidence-matrix-2027-v1.md").read_text(encoding="utf-8")
 for term in ("Exactly three accepted", "must never ask a user", "FSSAI", "No large source payload"):
  assert term in matrix
