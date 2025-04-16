import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types based on our database schema
export type BlockchainEvent = {
  id?: number
  event_id: string
  contract_name: string
  contract_address: string
  event_name: string
  transaction_hash: string
  block_number: number
  timestamp: number
  data: any
  event_type: "vote" | "session" | "candidate" | "system" | "token" | "other"
  created_at?: string
}

export type ContractConfig = {
  id?: number
  contract_name: string
  contract_address: string
  enabled: boolean
  from_block: number
  created_at?: string
  updated_at?: string
}

export type EventStatistics = {
  id?: number
  total_events: number
  events_by_contract: Record<string, number>
  events_by_type: Record<string, number>
  events_per_hour: number
  last_event_time: number
  updated_at?: string
}

export type BlockchainSession = {
  id?: number
  session_id: string
  election_address: string
  is_active: boolean
  last_block_processed: number
  created_at?: string
  updated_at?: string
}

export type ElectionData = {
  id?: number
  election_id: string
  server_id: number
  election_address: string
  owner_address: string
  start_time: number
  end_time: number
  status: "pending" | "active" | "completed" | "cancelled"
  created_at?: string
  updated_at?: string
}

export type ElectionSession = {
  id?: number
  session_id: string
  election_id: string
  start_time: number
  end_time: number
  status: "pending" | "active" | "completed" | "cancelled"
  elected_candidates: string[]
  created_at?: string
  updated_at?: string
}

export type Candidate = {
  id?: number
  session_id: string
  candidate_address: string
  candidate_name?: string
  vote_count: number
  created_at?: string
  updated_at?: string
}

export type Voter = {
  id?: number
  session_id: string
  voter_address: string
  ballot_token_id?: number
  has_voted: boolean
  voted_for?: string
  voted_at?: string
  created_at?: string
  updated_at?: string
}
