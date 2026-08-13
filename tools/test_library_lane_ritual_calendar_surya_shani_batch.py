"""Adversarial validation for four Surya and Shani observance lanes."""
import json
from pathlib import Path
from jsonschema import Draft202012Validator
ROOT=Path(__file__).resolve().parents[1];L=ROOT/"knowledge_packs"/"library_lanes"/"ritual-calendar"
E={"ratha-saptami":"ratha-saptami-surya-household-participant-2027-v1","bhanu-saptami":"bhanu-saptami-recurring-surya-household-2027-v1","shani-jayanti":"shani-jayanti-amavasya-household-temple-participant-2027-v1","shani-trayodashi":"shani-trayodashi-recurring-owner-routed-household-2027-v1"}
def load(p):return json.loads(p.read_text(encoding="utf-8"))
def pack(s):return load(L/"packs"/f"{E[s]}.json")
def refs(v):
 if isinstance(v,dict):
  for k,c in v.items():
   if k in {"source_ids","resolution_source_ids"}:yield from c
   yield from refs(c)
 elif isinstance(v,list):
  for c in v:yield from refs(c)
def test_exact_four_schema_utf8_source_closure_and_bilingual_completion():
 schema=load(ROOT/"schemas"/"ritual-observance-content-v1.schema.json")
 for slug,lane in E.items():
  raw=(L/"packs"/f"{lane}.json").read_bytes();text=raw.decode("utf-8","strict");assert b"\xef\xbf\xbd" not in raw and sum(0x900<=ord(c)<=0x97f for c in text)>700
  p=json.loads(text);Draft202012Validator(schema).validate(p);assert p["lane_id"]==lane and p["observance_slugs"]==[slug]
  assert {x["language_code"] for x in p["localized_content"]}=={"en","hi"} and set(refs(p))<={x["source_id"] for x in p["sources"]}
  assert all(p["product_status"]["completed_dimensions"].values()) and p["product_status"]["review_status"]=="internal_beta_reviewed"
  for lc in p["localized_content"]:
   assert len(lc["origin_narratives"])==2 and all(not x["universal_origin_claimed"] for x in lc["origin_narratives"])
   assert [x["tier"] for x in lc["procedures"]]==["minimum","standard","elaborate"] and all(not m["required"] and m["substitutions"] for q in lc["procedures"] for m in q["materials"])
def test_deterministic_rules_dates_and_material_overlap():
 r=json.dumps(pack("ratha-saptami"),ensure_ascii=False).lower();b=json.dumps(pack("bhanu-saptami"),ensure_ascii=False).lower();j=json.dumps(pack("shani-jayanti"),ensure_ascii=False).lower();t=json.dumps(pack("shani-trayodashi"),ensure_ascii=False).lower()
 assert all(x in r for x in ("13 february 2027","magha shukla saptami","07:04","arunodaya","not merge"))
 assert all(x in b for x in ("sunday plus locally assigned saptami","8 august","19 december","recurring","not one fixed annual date"))
 assert all(x in j for x in ("4 june 2027","jyeshtha amavasya","vaishakha amavasya","same occurrence","vat savitri"))
 assert all(x in t for x in ("31 july","14 august","11 december","25 december","post-sunset","one chosen route once","do not duplicate"))
def test_source_label_safety_and_no_result_guarantees():
 forbidden=["this ritual guarantees health","this ritual guarantees longevity","this ritual guarantees prosperity","this ritual guarantees luck","will remove sins","will cure","will end sade sati","must fast","must stare","must pour oil"]
 for slug in E:
  whole=json.dumps(pack(slug),ensure_ascii=False).lower();assert all(x not in whole for x in forbidden),slug
  for req in ("never stare","normal food","prescribed medicine","no guaranteed","112","not a universal","current-owner"):assert req in whole,(slug,req)
 assert "do not establish one fixed universal origin story" in json.dumps(pack("bhanu-saptami"),ensure_ascii=False).lower()
 assert "vishnu purana" in json.dumps(pack("shani-jayanti"),ensure_ascii=False).lower()
def test_links_progress_matrix_and_unprojected_boundary():
 links=load(L/"cross-links"/"surya-shani-observance-batch-4-owner-proposals-v1.json");Draft202012Validator(load(ROOT/"schemas"/"cross-lane-link-proposal-v1.schema.json")).validate(links)
 assert len(links["proposals"])==4 and all(x["target_resolution"]=="unresolved_owner_lane" for x in links["proposals"])
 p=load(L/"inventory"/"ritual-calendar-authoring-progress-v1.json");assert p["completed_after_freeze"]==208 and p["remaining_authoring_items"]==0
 for lane in E.values():assert p["completed_lane_ids"].count(lane)==1 and p["completed_pack_refs"].count(f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane}.json")==1
 matrix=(L/"research"/"surya-shani-observance-batch-4-evidence-matrix-2027-v1.md").read_text(encoding="utf-8")
 for x in ("exactly four accepted","No single fixed origin","act once","No source payload is copied"):assert x in matrix
