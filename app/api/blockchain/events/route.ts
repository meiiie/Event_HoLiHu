import { type NextRequest, NextResponse } from "next/server"
import { BlockchainService } from "@/services/blockchain-service"
import { convertBigIntToString } from "@/utils/utils"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = Number.parseInt(searchParams.get("limit") || "100")
  const contractName = searchParams.get("contractName") || undefined
  const eventType = searchParams.get("eventType") || undefined
  const search = searchParams.get("search") || undefined

  const events = await BlockchainService.getEvents({
    limit,
    contractName,
    eventType,
    search,
  })

  return NextResponse.json(events)
}

export async function POST(request: NextRequest) {
  try {
    const rawEvent = await request.json()

    // Validate required fields
    if (!rawEvent.transaction_hash) {
      return NextResponse.json({ error: "transaction_hash is required" }, { status: 400 })
    }

    if (!rawEvent.block_number) {
      return NextResponse.json({ error: "block_number is required" }, { status: 400 })
    }

    if (!rawEvent.event_name) {
      return NextResponse.json({ error: "event_name is required" }, { status: 400 })
    }

    // Ensure all BigInt values are converted to strings
    const event = {
      ...rawEvent,
      data: convertBigIntToString(rawEvent.data),
    }

    const savedEvent = await BlockchainService.saveEvent(event)

    if (!savedEvent) {
      return NextResponse.json({ error: "Failed to save event" }, { status: 500 })
    }

    return NextResponse.json(savedEvent)
  } catch (error) {
    console.error("Error in POST /api/blockchain/events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
