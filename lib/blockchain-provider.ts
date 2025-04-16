import { ethers } from "ethers"
import { getProvider, CHAIN_ID } from "./provider"

// Cấu hình truy vấn blockchain
const MAX_EVENT_BATCH_SIZE = 2000 // Số lượng block tối đa để truy vấn trong một lần
const DEFAULT_LOOKBACK_BLOCKS = 1000 // Số block mặc định để nhìn lại khi không có block bắt đầu

// Clean up providers
export function cleanupProviders() {
  try {
    // Tự động được xử lý bởi garbage collector
    console.log("Cleaning up providers...")
  } catch (e) {
    console.error("Error during provider cleanup:", e)
  }
}

// Create contract instance with caching và retry
export async function getContract(address: string, abi: any[]): Promise<ethers.Contract> {
  try {
    const provider = await getProvider()

    // Ensure provider is ready before creating contract
    if (!provider) {
      throw new Error("Provider is undefined")
    }

    // Check if provider has getBlockNumber method
    if (typeof provider.getBlockNumber !== "function") {
      throw new Error("Provider does not have getBlockNumber method")
    }

    const contract = new ethers.Contract(address, abi, provider)

    // Thêm phương thức hỗ trợ để lấy sự kiện trong khoảng block lớn
    contract.safeQueryFilter = async (eventFilter: any, fromBlock: number, toBlock: number = "latest") => {
      // Nếu khoảng quá lớn thì chia nhỏ để tránh lỗi RPC
      if (toBlock !== "latest") {
        const blockSpan = toBlock - fromBlock
        
        if (blockSpan > MAX_EVENT_BATCH_SIZE) {
          console.log(`Large block range detected (${blockSpan}), splitting into smaller queries...`)
          
          let allEvents: any[] = []
          let currentFromBlock = fromBlock
          
          while (currentFromBlock <= toBlock) {
            const batchToBlock = Math.min(currentFromBlock + MAX_EVENT_BATCH_SIZE - 1, toBlock)
            
            try {
              console.log(`Querying events from blocks ${currentFromBlock} to ${batchToBlock}...`)
              const events = await contract.queryFilter(eventFilter, currentFromBlock, batchToBlock)
              allEvents = [...allEvents, ...events]
            } catch (error) {
              console.error(`Error querying events in range ${currentFromBlock}-${batchToBlock}:`, error)
              // Tiếp tục với batch tiếp theo kể cả khi gặp lỗi
            }
            
            currentFromBlock = batchToBlock + 1
          }
          
          return allEvents
        }
      }
      
      // Nếu khoảng nhỏ thì truy vấn bình thường
      return contract.queryFilter(eventFilter, fromBlock, toBlock)
    }

    return contract
  } catch (error) {
    console.error("Error creating contract:", error)
    throw error
  }
}

// Get current block number safely with retry
export async function getCurrentBlockNumber(): Promise<number> {
  try {
    const provider = await getProvider()
    
    // Thử tối đa 3 lần
    for (let i = 0; i < 3; i++) {
      try {
        return await provider.getBlockNumber()
      } catch (error) {
        if (i === 2) throw error // Throw on final attempt
        console.warn(`Error getting block number (attempt ${i+1}/3), retrying...`)
        await new Promise(r => setTimeout(r, 1000)) // Wait 1s before retry
      }
    }
    
    throw new Error("Failed to get block number after retries")
  } catch (error) {
    console.error("Error getting current block number:", error)
    return 0
  }
}

// Test connection to blockchain
export async function testConnection(): Promise<boolean> {
  try {
    const provider = await getProvider()
    const blockNumber = await provider.getBlockNumber() // Test if we can get block number
    console.log(`Blockchain connection test successful. Current block: ${blockNumber}`)
    return true
  } catch (error) {
    console.error("Connection test failed:", error)
    return false
  }
}

// Lấy event từ một hợp đồng một cách an toàn
export async function getEventsFromContract(
  contract: ethers.Contract,
  fromBlock: number,
  toBlock: number | string = "latest" 
): Promise<any[]> {
  try {
    // Lấy thông tin block hiện tại nếu toBlock là "latest"
    if (toBlock === "latest") {
      toBlock = await getCurrentBlockNumber()
    }
    
    // Đảm bảo fromBlock không vượt quá toBlock
    if (typeof toBlock === "number" && fromBlock > toBlock) {
      console.warn(`fromBlock (${fromBlock}) is greater than toBlock (${toBlock}), no events to fetch`)
      return []
    }
    
    // Dùng safeQueryFilter nếu có, nếu không dùng queryFilter bình thường
    if (contract.safeQueryFilter) {
      return await contract.safeQueryFilter("*", fromBlock, toBlock)
    } else {
      return await contract.queryFilter("*", fromBlock, toBlock)
    }
  } catch (error) {
    console.error(`Error getting events from contract ${contract.target}:`, error)
    return []
  }
}

export { CHAIN_ID }
