import { NextResponse } from "next/server"
import { BlockchainService } from "@/services/blockchain-service"

export async function GET() {
  const stats = await BlockchainService.getStatistics()

  if (!stats) {
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }

  return NextResponse.json(stats)
}
