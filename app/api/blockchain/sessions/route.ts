import { type NextRequest, NextResponse } from "next/server"
import { BlockchainService } from "@/services/blockchain-service"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionId = searchParams.get("sessionId")

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
  }

  const session = await BlockchainService.getSession(sessionId)

  return NextResponse.json(session || { exists: false })
}

export async function POST(request: NextRequest) {
  const session = await request.json()

  const updatedSession = await BlockchainService.createOrUpdateSession(session)

  if (!updatedSession) {
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
  }

  return NextResponse.json(updatedSession)
}
