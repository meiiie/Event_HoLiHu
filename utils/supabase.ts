import { createClient } from "@supabase/supabase-js"

// Sử dụng URL và Key từ biến môi trường hoặc giá trị mặc định nếu không có
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wbygabwsqgvszpehwszj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieWdhYndzcWd2c3pwZWh3c2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2ODIwNDcsImV4cCI6MjA2MDI1ODA0N30._MMTef0lOVminPjzqZZQ-UXlbBNpou92xvGEYVkBS7A'

const options = {
  auth: {
    persistSession: false,
  },
}

// Tạo một client Supabase với xử lý lỗi tốt hơn
let supabase: ReturnType<typeof createClient>

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, options)
} catch (error) {
  console.error("Lỗi khởi tạo Supabase client:", error)
  // Tạo giả lập client với xử lý lỗi để tránh lỗi khi build
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      upsert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
    }),
  } as any
}

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
