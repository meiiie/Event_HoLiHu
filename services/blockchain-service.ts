import {
  supabase,
  type BlockchainEvent,
  type ContractConfig,
  type EventStatistics,
  type BlockchainSession,
} from "@/lib/supabase"
import { convertBigIntToString } from "@/utils/utils"

export const BlockchainService = {
  // Event methods
  async saveEvent(event: BlockchainEvent): Promise<BlockchainEvent | null> {
    try {
      // Validate required fields
      if (!event.transaction_hash) {
        console.error("Cannot save event: transaction_hash is required")
        return null
      }

      if (!event.block_number) {
        console.error("Cannot save event: block_number is required")
        return null
      }

      if (!event.event_name) {
        console.error("Cannot save event: event_name is required")
        return null
      }

      // Ensure all BigInt values are converted to strings
      const serializedEvent = {
        ...event,
        data: convertBigIntToString(event.data),
      }

      const { data, error } = await supabase.from("blockchain_events").insert(serializedEvent).select().single()

      if (error) {
        console.error("Error saving event:", error)
        return null
      }

      // Update statistics after saving event
      await this.updateStatistics()

      return data
    } catch (error) {
      console.error("Error in saveEvent:", error)
      return null
    }
  },

  async getEvents(
    options: {
      limit?: number
      contractName?: string
      eventType?: string
      search?: string
    } = {},
  ): Promise<BlockchainEvent[]> {
    const { limit = 100, contractName, eventType, search } = options

    try {
      let query = supabase.from("blockchain_events").select("*").order("timestamp", { ascending: false }).limit(limit)

      if (contractName && contractName !== "all") {
        query = query.eq("contract_name", contractName)
      }

      if (eventType && eventType !== "all") {
        query = query.eq("event_type", eventType)
      }

      if (search) {
        query = query.or(
          `event_name.ilike.%${search}%,contract_name.ilike.%${search}%,transaction_hash.ilike.%${search}%`,
        )
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching events:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getEvents:", error)
      return []
    }
  },

  // Contract config methods
  async getContractConfigs(): Promise<ContractConfig[]> {
    try {
      const { data, error } = await supabase.from("contract_configs").select("*").order("contract_name")

      if (error) {
        console.error("Error fetching contract configs:", error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Error in getContractConfigs:", error)
      throw error
    }
  },

  async updateContractConfig(config: ContractConfig): Promise<ContractConfig | null> {
    try {
      const { data, error } = await supabase
        .from("contract_configs")
        .upsert({
          ...config,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error updating contract config:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error in updateContractConfig:", error)
      throw error
    }
  },

  async initializeContractConfigs(configs: Omit<ContractConfig, "id" | "created_at" | "updated_at">[]): Promise<any> {
    try {
      console.log("Fetching existing configs...")
      const { data: existingConfigs, error: fetchError } = await supabase
        .from("contract_configs")
        .select("contract_name, contract_address")

      if (fetchError) {
        console.error("Error fetching existing contract configs:", fetchError)
        throw new Error(`Error fetching existing configs: ${fetchError.message}`)
      }

      // Only insert configs that don't already exist
      const existingMap = new Map(existingConfigs?.map((c) => [`${c.contract_name}-${c.contract_address}`, true]) || [])

      const newConfigs = configs.filter((c) => !existingMap.has(`${c.contract_name}-${c.contract_address}`))

      console.log(`Found ${existingConfigs?.length || 0} existing configs, ${newConfigs.length} new configs to insert`)

      if (newConfigs.length > 0) {
        console.log("Inserting new configs:", newConfigs)
        const { data, error } = await supabase.from("contract_configs").insert(newConfigs).select()

        if (error) {
          console.error("Error inserting new contract configs:", error)
          throw new Error(`Error inserting new configs: ${error.message}`)
        }

        return { inserted: newConfigs.length, data }
      } else {
        console.log("No new configs to insert")
        return { inserted: 0, message: "No new configs to insert" }
      }
    } catch (error) {
      console.error("Error in initializeContractConfigs:", error)
      throw error
    }
  },

  // Statistics methods
  async getStatistics(): Promise<EventStatistics | null> {
    try {
      const { data, error } = await supabase.from("event_statistics").select("*").eq("id", 1).single()

      if (error) {
        console.error("Error fetching statistics:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getStatistics:", error)
      return null
    }
  },

  async updateStatistics(): Promise<EventStatistics | null> {
    try {
      // Get all events
      const { data: events, error: eventsError } = await supabase
        .from("blockchain_events")
        .select("contract_name, event_type, timestamp")

      if (eventsError) {
        console.error("Error fetching events for statistics:", eventsError)
        return null
      }

      // Calculate statistics
      const eventsByContract: Record<string, number> = {}
      const eventsByType: Record<string, number> = {}
      let lastEventTime = 0

      events?.forEach((event) => {
        // Count by contract
        eventsByContract[event.contract_name] = (eventsByContract[event.contract_name] || 0) + 1

        // Count by type
        eventsByType[event.event_type] = (eventsByType[event.event_type] || 0) + 1

        // Track latest event time
        if (event.timestamp > lastEventTime) {
          lastEventTime = event.timestamp
        }
      })

      // Count events in the last hour
      const oneHourAgo = Date.now() - 3600000
      const eventsPerHour = events?.filter((e) => e.timestamp > oneHourAgo).length || 0

      // Update statistics
      const { data, error } = await supabase
        .from("event_statistics")
        .update({
          total_events: events?.length || 0,
          events_by_contract: eventsByContract,
          events_by_type: eventsByType,
          events_per_hour: eventsPerHour,
          last_event_time: lastEventTime,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1)
        .select()
        .single()

      if (error) {
        console.error("Error updating statistics:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in updateStatistics:", error)
      return null
    }
  },

  // Session methods
  async getSession(sessionId: string): Promise<BlockchainSession | null> {
    try {
      const { data, error } = await supabase
        .from("blockchain_sessions")
        .select("*")
        .eq("session_id", sessionId)
        .single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "row not found" error
        console.error("Error fetching session:", error)
      }

      return data
    } catch (error) {
      console.error("Error in getSession:", error)
      return null
    }
  },

  async createOrUpdateSession(
    session: Omit<BlockchainSession, "id" | "created_at">,
  ): Promise<BlockchainSession | null> {
    try {
      const { data, error } = await supabase
        .from("blockchain_sessions")
        .upsert({
          ...session,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error updating session:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in createOrUpdateSession:", error)
      return null
    }
  },
}
