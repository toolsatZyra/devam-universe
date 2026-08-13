"""Adversarial validation for the exact final 32 accepted ritual-calendar items."""
import json
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parents[1]
LANE=ROOT/"knowledge_packs"/"library_lanes"/"ritual-calendar"

def load(path): return json.loads(path.read_text(encoding="utf-8"))

def refs(value):
    if isinstance(value,dict):
        for key,child in value.items():
            if key in {"source_ids","resolution_source_ids"}: yield from child
            yield from refs(child)
    elif isinstance(value,list):
        for child in value: yield from refs(child)

def mapping(): return load(LANE/"inventory"/"ritual-calendar-final-32-completion-map-v1.json")

def test_exact_mapping_schema_utf8_and_source_closure():
    m=mapping(); assert m["accepted_authoring_denominator"]==208 and m["prior_reconciled_completed"]==176
    assert m["mapped_here"]==32 and m["completed_total"]==208 and m["remaining"]==0
    assert len(m["mappings"])==len({x["accepted_id"] for x in m["mappings"]})==32
    schema=load(ROOT/"schemas"/"ritual-observance-content-v1.schema.json")
    for item in m["mappings"]:
        path=ROOT/item["pack_ref"]; raw=path.read_bytes(); text=raw.decode("utf-8","strict")
        assert b"\xef\xbf\xbd" not in raw and sum(0x900<=ord(c)<=0x97f for c in text)>250,path.name
        pack=json.loads(text); Draft202012Validator(schema).validate(pack)
        assert pack["lane_id"]==item["lane_id"] and len(pack["observance_slugs"])==1
        assert set(refs(pack))<={x["source_id"] for x in pack["sources"]}

def test_bilingual_product_contract_and_no_universal_origins():
    for item in mapping()["mappings"]:
        pack=load(ROOT/item["pack_ref"])
        assert {x["language_code"] for x in pack["localized_content"]}=={"en","hi"}
        assert all(pack["product_status"]["completed_dimensions"].values())
        assert pack["product_status"]["review_status"]=="internal_beta_reviewed"
        for local in pack["localized_content"]:
            assert len(local["origin_narratives"])==2
            assert all(not x["universal_origin_claimed"] for x in local["origin_narratives"])
            assert [x["tier"] for x in local["procedures"]]==["minimum","standard","elaborate"]
            assert all((not material["required"] and material["substitutions"]) for proc in local["procedures"] for material in proc["materials"])

def test_item_specific_adversarial_boundaries():
    by_id={x["accepted_id"]:json.dumps(load(ROOT/x["pack_ref"]),ensure_ascii=False).lower() for x in mapping()["mappings"]}
    required={
      "krishna-janmashtami-south-rohini":["rohin","north"],"hanuman-jayanthi-tamil":["margazhi","chaitra"],
      "hanuman-puja-gujarati":["diwali","late-night"],"jagannath-ratha-yatra":["chariot","climb"],
      "ekadashi-papanasini-vaishnava":["no portable 2027","sampradaya"],"gayatri-jayanti":["shravana purnima","initiation"],
      "gopalakala":["human-pyramid","climbing"],"jamai-shashti":["gendered","consent"],
      "ranga-panchami":["explicit consent","eyes"],"simhasta-kumbha-nashik":["river entry","official"],
      "sita-navami":["spouse","gender duties"],"thrissur-pooram":["fireworks","animal"],
    }
    for key,terms in required.items():
        assert all(term in by_id[key] for term in terms),(key,terms)
    forbidden=["this ritual guarantees","will cure","must fast","must enter the river","must climb","must attend the temple","universal national ritual"]
    for key,text in by_id.items(): assert all(term not in text for term in forbidden),key

def test_links_progress_matrix_and_pitru_accounting_guard():
    links=load(LANE/"cross-links"/"final-accepted-32-owner-proposals-v1.json")
    Draft202012Validator(load(ROOT/"schemas"/"cross-lane-link-proposal-v1.schema.json")).validate(links)
    assert len(links["proposals"])==32 and all(x["target_resolution"]=="unresolved_owner_lane" for x in links["proposals"])
    progress=load(LANE/"inventory"/"ritual-calendar-authoring-progress-v1.json")
    assert progress["completed_after_freeze"]==208 and progress["remaining_authoring_items"]==0
    for item in mapping()["mappings"]:
        assert progress["completed_lane_ids"].count(item["lane_id"])==1
        assert progress["completed_pack_refs"].count(item["pack_ref"])==1
    guard=mapping()["pitru_accounting_guard"]
    assert guard["accepted_items_implemented"]==5 and guard["tithi_router_components_collectively_count_as"]==1
    assert len(guard["non_denominator_utility_lanes"])==2
    matrix=(LANE/"research"/"final-accepted-32-evidence-matrix-2027-v1.md").read_text(encoding="utf-8")
    for accepted in (x["accepted_id"] for x in mapping()["mappings"]): assert accepted in matrix
    assert "Authored is not projected, hosted, independently reviewed, or released" in matrix
