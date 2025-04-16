import { type NextRequest, NextResponse } from "next/server"
import { BlockchainService } from "@/services/blockchain-service"

export async function GET() {
  try {
    const configs = await BlockchainService.getContractConfigs()
    return NextResponse.json(configs)
  } catch (error) {
    console.error("Error fetching contract configs:", error)
    return NextResponse.json(
      { error: `Failed to fetch contract configs: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const config = await request.json()

    const updatedConfig = await BlockchainService.updateContractConfig(config)

    if (!updatedConfig) {
      return NextResponse.json({ error: "Failed to update contract config" }, { status: 500 })
    }

    return NextResponse.json(updatedConfig)
  } catch (error) {
    console.error("Error updating contract config:", error)
    return NextResponse.json(
      { error: `Failed to update contract config: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const configs = await request.json()

    if (!Array.isArray(configs)) {
      return NextResponse.json(
        { error: "Invalid request format. Expected an array of contract configs" },
        { status: 400 },
      )
    }

    if (configs.length === 0) {
      return NextResponse.json({ error: "Empty config array provided" }, { status: 400 })
    }

    // Validate each config
    for (const config of configs) {
      if (!config.contract_name || !config.contract_address) {
        return NextResponse.json(
          { error: "Invalid config format. Each config must have contract_name and contract_address" },
          { status: 400 },
        )
      }
    }

    console.log(`Initializing ${configs.length} contract configs...`)

    const result = await BlockchainService.initializeContractConfigs(configs)

    return NextResponse.json({
      success: true,
      message: `Successfully initialized ${configs.length} contract configs`,
      result,
    })
  } catch (error) {
    console.error("Error initializing contract configs:", error)
    return NextResponse.json(
      { error: `Failed to initialize contract configs: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
