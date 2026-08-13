"""Adversarial checks for eight South devotional-calendar lanes."""
import json
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parents[1]; LANE=ROOT/"knowledge_packs"/"library_lanes"/"ritual-calendar"
SLUGS=["thai-pusam","panguni-uthiram","ramanuja-jayanthi","vaikasi-visakam","andal-jayanthi","soora-samharam","subrahmanya-sashti","karthigai-deepam"]
DATES=["22 January 2027","22 March 2027","10 May 2027","20 May 2027","5 August 2027","4 November 2027","3 December 2027","11 December 2027"]
IDS=[f"{x}-south-devotional-household-participant-2027-v1" for x in SLUGS]
def load(p): return json.loads(p.read_text(encoding="utf-8"))
def pack(s): return load(LANE/"packs"/f"{s}-south-devotional-household-participant-2027-v1.json")
def refs(v):
 if isinstance(v,dict):
  for k,c in v.items():
   if k in {"source_ids","resolution_source_ids"}: yield from c
   yield from refs(c)
 elif isinstance(v,list):
  for c in v: yield from refs(c)

def test_exact_8_schema_utf8_source_closure_and_bilingual_completion():
 schema=load(ROOT/"schemas"/"ritual-observance-content-v1.schema.json")
 assert len(IDS)==len(set(IDS))==8
 for slug,lane,date in zip(SLUGS,IDS,DATES):
  raw=(LANE/"packs"/f"{lane}.json").read_bytes(); text=raw.decode("utf-8","strict"); assert b"\xef\xbf\xbd" not in raw
  p=json.loads(text); Draft202012Validator(schema).validate(p)
  assert p["lane_id"]==lane and p["observance_slugs"]==[slug]
  assert {x["language_code"] for x in p["localized_content"]}=={"en","hi"}
  assert set(refs(p))<={x["source_id"] for x in p["sources"]}
  assert date in p["calendar"]["freshness_note"] and "Recompute" in p["calendar"]["freshness_note"] and "Never copy" in p["calendar"]["freshness_note"]
  assert all(p["product_status"]["completed_dimensions"].values())
  for lc in p["localized_content"]:
   assert len(lc["origin_narratives"])==2 and all(not x["universal_origin_claimed"] for x in lc["origin_narratives"])
   assert [x["tier"] for x in lc["procedures"]]==["minimum","standard","elaborate"]
   assert all(not m["required"] and m["substitutions"] for q in lc["procedures"] for m in q["materials"])

def test_material_differences_and_story_boundaries():
 expected={"thai-pusam":["kavadi","piercing","vel"],"panguni-uthiram":["marriage pressure","ten-day","consent"],"ramanuja-jayanthi":["1017-1137","lineage","fabricate quotations"],"vaikasi-visakam":["milk abhisheka","murugan's birth","food waste"],"andal-jayanthi":["tiruppavai","without rights","marriage aspirations"],"soora-samharam":["combat","soorapadman","dehumanising"],"subrahmanya-sashti":["december","november soora samharam","snake handling"],"karthigai-deepam":["maha deepam","unattended","hill flame"]}
 for slug,terms in expected.items():
  whole=json.dumps(pack(slug),ensure_ascii=False).lower(); assert all(x in whole for x in terms),(slug,[x for x in terms if x not in whole])

def test_no_universal_or_harmful_instruction():
 forbidden=["every hindu must","all indians must","you must fast","you must carry kavadi","pierce your skin","perform milk abhisheka at home","marriage is required","fertility is guaranteed","kill your enemy","light a hill fire","full tiruppavai text"]
 for slug in SLUGS:
  whole=json.dumps(pack(slug),ensure_ascii=False).lower(); assert all(x not in whole for x in forbidden),slug

def test_links_progress_and_matrix():
 links=load(LANE/"cross-links"/"south-devotional-calendar-batch-8-owner-proposals-v1.json"); schema=load(ROOT/"schemas"/"cross-lane-link-proposal-v1.schema.json"); Draft202012Validator(schema).validate(links)
 assert len(links["proposals"])==8 and all(x["target_resolution"]=="unresolved_owner_lane" for x in links["proposals"])
 p=load(LANE/"inventory"/"ritual-calendar-authoring-progress-v1.json"); assert p["completed_after_freeze"]==177 and p["remaining_authoring_items"]==31
 for lane in IDS:
  assert p["completed_lane_ids"].count(lane)==1 and p["completed_pack_refs"].count(f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane}.json")==1
 matrix=(LANE/"research"/"south-devotional-calendar-batch-8-evidence-matrix-2027-v1.md").read_text(encoding="utf-8")
 for term in ("eight accepted named answers","Masi Magam and Thrissur Pooram","Major variants only","0 of 19,480"): assert term in matrix
