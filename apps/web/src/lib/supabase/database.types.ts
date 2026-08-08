export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      atlas_edges: {
        Row: {
          created_at: string
          id: string
          label: string
          publication_state: Database["public"]["Enums"]["publication_state"]
          relationship_id: string | null
          rights_lane: Database["public"]["Enums"]["rights_lane"]
          source_node_id: string
          target_node_id: string
          visual: Json
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          relationship_id?: string | null
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          source_node_id: string
          target_node_id: string
          visual?: Json
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          relationship_id?: string | null
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          source_node_id?: string
          target_node_id?: string
          visual?: Json
        }
        Relationships: [
          {
            foreignKeyName: "atlas_edges_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atlas_edges_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "atlas_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atlas_edges_target_node_id_fkey"
            columns: ["target_node_id"]
            isOneToOne: false
            referencedRelation: "atlas_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      atlas_nodes: {
        Row: {
          created_at: string
          entity_id: string | null
          id: string
          is_gateway: boolean
          node_kind: string
          position: Json
          publication_state: Database["public"]["Enums"]["publication_state"]
          reveal_at: number
          rights_lane: Database["public"]["Enums"]["rights_lane"]
          slug: string
          subtitle: string | null
          title: string
          updated_at: string
          visual: Json
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          id?: string
          is_gateway?: boolean
          node_kind: string
          position: Json
          publication_state?: Database["public"]["Enums"]["publication_state"]
          reveal_at?: number
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string
          visual?: Json
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          id?: string
          is_gateway?: boolean
          node_kind?: string
          position?: Json
          publication_state?: Database["public"]["Enums"]["publication_state"]
          reveal_at?: number
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          visual?: Json
        }
        Relationships: [
          {
            foreignKeyName: "atlas_nodes_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_evidence: {
        Row: {
          claim_id: string
          created_at: string
          evidence_role: string
          note: string | null
          passage_id: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          evidence_role: string
          note?: string | null
          passage_id: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          evidence_role?: string
          note?: string | null
          passage_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_evidence_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_evidence_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "passages"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          applicability: Json
          claim_kind: string
          confidence: number | null
          created_at: string
          evidence_class: string
          id: string
          language_code: string
          publication_state: Database["public"]["Enums"]["publication_state"]
          rights_lane: Database["public"]["Enums"]["rights_lane"]
          search_document: unknown
          stable_key: string
          statement: string
          subject_entity_id: string | null
          uncertainty_note: string | null
          updated_at: string
        }
        Insert: {
          applicability?: Json
          claim_kind: string
          confidence?: number | null
          created_at?: string
          evidence_class: string
          id?: string
          language_code: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          search_document?: unknown
          stable_key: string
          statement: string
          subject_entity_id?: string | null
          uncertainty_note?: string | null
          updated_at?: string
        }
        Update: {
          applicability?: Json
          claim_kind?: string
          confidence?: number | null
          created_at?: string
          evidence_class?: string
          id?: string
          language_code?: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          search_document?: unknown
          stable_key?: string
          statement?: string
          subject_entity_id?: string | null
          uncertainty_note?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_subject_entity_id_fkey"
            columns: ["subject_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          content: string
          created_at: string
          grounding: Json
          id: string
          role: string
          thread_id: string
        }
        Insert: {
          content: string
          created_at?: string
          grounding?: Json
          id?: string
          role: string
          thread_id: string
        }
        Update: {
          content?: string
          created_at?: string
          grounding?: Json
          id?: string
          role?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "conversation_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_threads: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      editions: {
        Row: {
          created_at: string
          edition_statement: string | null
          edition_title: string
          expression_id: string
          id: string
          identifiers: Json
          publication_place: string | null
          publication_state: Database["public"]["Enums"]["publication_state"]
          publication_year: number | null
          publisher: string | null
          rights_lane: Database["public"]["Enums"]["rights_lane"]
        }
        Insert: {
          created_at?: string
          edition_statement?: string | null
          edition_title: string
          expression_id: string
          id?: string
          identifiers?: Json
          publication_place?: string | null
          publication_state?: Database["public"]["Enums"]["publication_state"]
          publication_year?: number | null
          publisher?: string | null
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
        }
        Update: {
          created_at?: string
          edition_statement?: string | null
          edition_title?: string
          expression_id?: string
          id?: string
          identifiers?: Json
          publication_place?: string | null
          publication_state?: Database["public"]["Enums"]["publication_state"]
          publication_year?: number | null
          publisher?: string | null
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
        }
        Relationships: [
          {
            foreignKeyName: "editions_expression_id_fkey"
            columns: ["expression_id"]
            isOneToOne: false
            referencedRelation: "expressions"
            referencedColumns: ["id"]
          },
        ]
      }
      entities: {
        Row: {
          canonical_name: string
          created_at: string
          description: string | null
          entity_kind: string
          geographic_scope: Json
          id: string
          publication_state: Database["public"]["Enums"]["publication_state"]
          rights_lane: Database["public"]["Enums"]["rights_lane"]
          slug: string
          temporal_scope: Json
          updated_at: string
        }
        Insert: {
          canonical_name: string
          created_at?: string
          description?: string | null
          entity_kind: string
          geographic_scope?: Json
          id?: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          slug: string
          temporal_scope?: Json
          updated_at?: string
        }
        Update: {
          canonical_name?: string
          created_at?: string
          description?: string | null
          entity_kind?: string
          geographic_scope?: Json
          id?: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          slug?: string
          temporal_scope?: Json
          updated_at?: string
        }
        Relationships: []
      }
      entity_names: {
        Row: {
          created_at: string
          entity_id: string
          id: string
          is_preferred: boolean
          language_code: string
          name: string
          name_kind: string
          script_code: string | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          id?: string
          is_preferred?: boolean
          language_code: string
          name: string
          name_kind?: string
          script_code?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          id?: string
          is_preferred?: boolean
          language_code?: string
          name?: string
          name_kind?: string
          script_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_names_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      expressions: {
        Row: {
          ai_generated: boolean
          attribution: string | null
          created_at: string
          expression_kind: string
          id: string
          is_source_original: boolean
          language_code: string
          publication_state: Database["public"]["Enums"]["publication_state"]
          rights_lane: Database["public"]["Enums"]["rights_lane"]
          script_code: string | null
          work_id: string
        }
        Insert: {
          ai_generated?: boolean
          attribution?: string | null
          created_at?: string
          expression_kind: string
          id?: string
          is_source_original?: boolean
          language_code: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          script_code?: string | null
          work_id: string
        }
        Update: {
          ai_generated?: boolean
          attribution?: string | null
          created_at?: string
          expression_kind?: string
          id?: string
          is_source_original?: boolean
          language_code?: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          script_code?: string | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expressions_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      observance_rules: {
        Row: {
          claim_id: string | null
          created_at: string
          explanation: string
          id: string
          observance_id: string
          publication_state: Database["public"]["Enums"]["publication_state"]
          region_codes: string[]
          rights_lane: Database["public"]["Enums"]["rights_lane"]
          rule_expression: Json
          ruleset_version: string
          tradition_code: string
        }
        Insert: {
          claim_id?: string | null
          created_at?: string
          explanation: string
          id?: string
          observance_id: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          region_codes?: string[]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          rule_expression: Json
          ruleset_version: string
          tradition_code: string
        }
        Update: {
          claim_id?: string | null
          created_at?: string
          explanation?: string
          id?: string
          observance_id?: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          region_codes?: string[]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          rule_expression?: Json
          ruleset_version?: string
          tradition_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "observance_rules_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observance_rules_observance_id_fkey"
            columns: ["observance_id"]
            isOneToOne: false
            referencedRelation: "observances"
            referencedColumns: ["id"]
          },
        ]
      }
      observances: {
        Row: {
          canonical_name: string
          created_at: string
          entity_id: string | null
          id: string
          observance_kind: string
          publication_state: Database["public"]["Enums"]["publication_state"]
          rights_lane: Database["public"]["Enums"]["rights_lane"]
          slug: string
          summary: string | null
        }
        Insert: {
          canonical_name: string
          created_at?: string
          entity_id?: string | null
          id?: string
          observance_kind: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          slug: string
          summary?: string | null
        }
        Update: {
          canonical_name?: string
          created_at?: string
          entity_id?: string | null
          id?: string
          observance_kind?: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          slug?: string
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "observances_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      panchang_calculations: {
        Row: {
          calculated_at: string
          civil_date: string
          created_at: string
          engine_name: string
          engine_version: string
          id: string
          input_hash: string
          latitude: number
          longitude: number
          result: Json
          ruleset_version: string
          timezone: string
          tradition_code: string
        }
        Insert: {
          calculated_at: string
          civil_date: string
          created_at?: string
          engine_name: string
          engine_version: string
          id?: string
          input_hash: string
          latitude: number
          longitude: number
          result: Json
          ruleset_version: string
          timezone: string
          tradition_code: string
        }
        Update: {
          calculated_at?: string
          civil_date?: string
          created_at?: string
          engine_name?: string
          engine_version?: string
          id?: string
          input_hash?: string
          latitude?: number
          longitude?: number
          result?: Json
          ruleset_version?: string
          timezone?: string
          tradition_code?: string
        }
        Relationships: []
      }
      passages: {
        Row: {
          created_at: string
          exact_text: string | null
          id: string
          language_code: string
          locator: Json
          parent_passage_id: string | null
          publication_state: Database["public"]["Enums"]["publication_state"]
          rights_lane: Database["public"]["Enums"]["rights_lane"]
          script_code: string | null
          search_document: unknown
          source_object_id: string
          source_ordinal: number
          span_sha256: string | null
          text_status: string
        }
        Insert: {
          created_at?: string
          exact_text?: string | null
          id?: string
          language_code: string
          locator: Json
          parent_passage_id?: string | null
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          script_code?: string | null
          search_document?: unknown
          source_object_id: string
          source_ordinal: number
          span_sha256?: string | null
          text_status?: string
        }
        Update: {
          created_at?: string
          exact_text?: string | null
          id?: string
          language_code?: string
          locator?: Json
          parent_passage_id?: string | null
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          script_code?: string | null
          search_document?: unknown
          source_object_id?: string
          source_ordinal?: number
          span_sha256?: string | null
          text_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "passages_parent_passage_id_fkey"
            columns: ["parent_passage_id"]
            isOneToOne: false
            referencedRelation: "passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passages_source_object_id_fkey"
            columns: ["source_object_id"]
            isOneToOne: false
            referencedRelation: "source_objects"
            referencedColumns: ["id"]
          },
        ]
      }
      product_events: {
        Row: {
          account_state: string
          event_name: string
          id: string
          occurred_at: string
          retain_until: string
          session_id: string
          surface: string
          target: string | null
        }
        Insert: {
          account_state: string
          event_name: string
          id: string
          occurred_at?: string
          retain_until?: string
          session_id: string
          surface: string
          target?: string | null
        }
        Update: {
          account_state?: string
          event_name?: string
          id?: string
          occurred_at?: string
          retain_until?: string
          session_id?: string
          surface?: string
          target?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          family_practice: Json
          home_location: Json | null
          id: string
          personalization_consent: boolean
          preferred_language: string | null
          sampradaya_code: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          family_practice?: Json
          home_location?: Json | null
          id: string
          personalization_consent?: boolean
          preferred_language?: string | null
          sampradaya_code?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          family_practice?: Json
          home_location?: Json | null
          id?: string
          personalization_consent?: boolean
          preferred_language?: string | null
          sampradaya_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      relationships: {
        Row: {
          applicability: Json
          claim_id: string | null
          created_at: string
          id: string
          object_entity_id: string
          predicate: string
          publication_state: Database["public"]["Enums"]["publication_state"]
          rights_lane: Database["public"]["Enums"]["rights_lane"]
          subject_entity_id: string
        }
        Insert: {
          applicability?: Json
          claim_id?: string | null
          created_at?: string
          id?: string
          object_entity_id: string
          predicate: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          subject_entity_id: string
        }
        Update: {
          applicability?: Json
          claim_id?: string | null
          created_at?: string
          id?: string
          object_entity_id?: string
          predicate?: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          subject_entity_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationships_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationships_object_entity_id_fkey"
            columns: ["object_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationships_subject_entity_id_fkey"
            columns: ["subject_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      ritual_procedures: {
        Row: {
          applicability: Json
          created_at: string
          evidence_status: string
          family_practice_note: string | null
          id: string
          language_code: string
          observance_id: string | null
          publication_state: Database["public"]["Enums"]["publication_state"]
          region_codes: string[]
          rights_lane: Database["public"]["Enums"]["rights_lane"]
          sampradaya_codes: string[]
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          applicability?: Json
          created_at?: string
          evidence_status?: string
          family_practice_note?: string | null
          id?: string
          language_code: string
          observance_id?: string | null
          publication_state?: Database["public"]["Enums"]["publication_state"]
          region_codes?: string[]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          sampradaya_codes?: string[]
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          applicability?: Json
          created_at?: string
          evidence_status?: string
          family_practice_note?: string | null
          id?: string
          language_code?: string
          observance_id?: string | null
          publication_state?: Database["public"]["Enums"]["publication_state"]
          region_codes?: string[]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          sampradaya_codes?: string[]
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ritual_procedures_observance_id_fkey"
            columns: ["observance_id"]
            isOneToOne: false
            referencedRelation: "observances"
            referencedColumns: ["id"]
          },
        ]
      }
      ritual_steps: {
        Row: {
          claim_id: string | null
          created_at: string
          id: string
          instruction: string
          is_optional: boolean
          procedure_id: string
          publication_state: Database["public"]["Enums"]["publication_state"]
          rationale: string | null
          rights_lane: Database["public"]["Enums"]["rights_lane"]
          step_ordinal: number
          variation_note: string | null
        }
        Insert: {
          claim_id?: string | null
          created_at?: string
          id?: string
          instruction: string
          is_optional?: boolean
          procedure_id: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rationale?: string | null
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          step_ordinal: number
          variation_note?: string | null
        }
        Update: {
          claim_id?: string | null
          created_at?: string
          id?: string
          instruction?: string
          is_optional?: boolean
          procedure_id?: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rationale?: string | null
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          step_ordinal?: number
          variation_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ritual_steps_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ritual_steps_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "ritual_procedures"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_items: {
        Row: {
          atlas_node_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          atlas_node_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          atlas_node_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_items_atlas_node_id_fkey"
            columns: ["atlas_node_id"]
            isOneToOne: false
            referencedRelation: "atlas_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      source_objects: {
        Row: {
          acquired_at: string | null
          byte_count: number
          completeness_status: string
          created_at: string
          edition_id: string | null
          id: string
          media_type: string
          provenance: Json
          provider: string | null
          provider_identifier: string | null
          rights_basis: Json
          rights_lane: Database["public"]["Enums"]["rights_lane"]
          sha256: string
          source_url: string | null
          storage_backend: string
          storage_bucket: string | null
          storage_key: string
        }
        Insert: {
          acquired_at?: string | null
          byte_count: number
          completeness_status?: string
          created_at?: string
          edition_id?: string | null
          id?: string
          media_type: string
          provenance?: Json
          provider?: string | null
          provider_identifier?: string | null
          rights_basis?: Json
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          sha256: string
          source_url?: string | null
          storage_backend?: string
          storage_bucket?: string | null
          storage_key: string
        }
        Update: {
          acquired_at?: string | null
          byte_count?: number
          completeness_status?: string
          created_at?: string
          edition_id?: string | null
          id?: string
          media_type?: string
          provenance?: Json
          provider?: string | null
          provider_identifier?: string | null
          rights_basis?: Json
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          sha256?: string
          source_url?: string | null
          storage_backend?: string
          storage_bucket?: string | null
          storage_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_objects_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "editions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          id: string
          plan_code: string
          source: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_code?: string
          source: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_code?: string
          source?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_memories: {
        Row: {
          created_at: string
          id: string
          memory_kind: string
          source_thread_id: string | null
          updated_at: string
          user_confirmed: boolean
          user_id: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          memory_kind: string
          source_thread_id?: string | null
          updated_at?: string
          user_confirmed?: boolean
          user_id: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          memory_kind?: string
          source_thread_id?: string | null
          updated_at?: string
          user_confirmed?: boolean
          user_id?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "user_memories_source_thread_id_fkey"
            columns: ["source_thread_id"]
            isOneToOne: false
            referencedRelation: "conversation_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      works: {
        Row: {
          canonical_title: string
          created_at: string
          id: string
          publication_state: Database["public"]["Enums"]["publication_state"]
          rights_lane: Database["public"]["Enums"]["rights_lane"]
          slug: string
          summary: string | null
          tradition_scope: string[]
          updated_at: string
          work_kind: string
        }
        Insert: {
          canonical_title: string
          created_at?: string
          id?: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          slug: string
          summary?: string | null
          tradition_scope?: string[]
          updated_at?: string
          work_kind: string
        }
        Update: {
          canonical_title?: string
          created_at?: string
          id?: string
          publication_state?: Database["public"]["Enums"]["publication_state"]
          rights_lane?: Database["public"]["Enums"]["rights_lane"]
          slug?: string
          summary?: string | null
          tradition_scope?: string[]
          updated_at?: string
          work_kind?: string
        }
        Relationships: []
      }
    }
    Views: {
      product_funnel_daily: {
        Row: {
          account_state: string | null
          event_count: number | null
          event_day: string | null
          event_name: string | null
          surface: string | null
          target: string | null
          unique_sessions: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      search_public_passages: {
        Args: {
          language_filter?: string
          result_limit?: number
          search_query: string
        }
        Returns: Json
      }
      search_public_knowledge: {
        Args: {
          language_filter?: string
          result_limit?: number
          search_query: string
        }
        Returns: Json
      }
    }
    Enums: {
      publication_state: "draft" | "review" | "published" | "retired"
      rights_lane:
        | "private_evidence"
        | "citation_only"
        | "product_allowed"
        | "derivative_allowed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      publication_state: ["draft", "review", "published", "retired"],
      rights_lane: [
        "private_evidence",
        "citation_only",
        "product_allowed",
        "derivative_allowed",
      ],
    },
  },
} as const
