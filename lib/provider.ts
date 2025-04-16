import { ethers } from "ethers"

// WebSocket và HTTP endpoints
const WS_ENDPOINT = "wss://geth.holihu.online/ws"
const HTTP_ENDPOINT = "https://geth.holihu.online/rpc"

// Chain ID for HoLiHu network
export const CHAIN_ID = 210

// Thời gian timeout cho kết nối (ms)
const CONNECTION_TIMEOUT = 10000

// Số lần retry tối đa
const MAX_RETRIES = 3

// Singleton provider instances
let wsProvider: ethers.WebSocketProvider | null = null
let httpProvider: ethers.JsonRpcProvider | null = null

/**
 * Tạo một promise với timeout
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
  })
  return Promise.race([promise, timeoutPromise])
}

/**
 * Connect với retry
 */
async function connectWithRetry<T>(
  connectFn: () => Promise<T>, 
  maxRetries = MAX_RETRIES,
  retryDelay = 1000,
  name = "Provider"
): Promise<T> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`${name} connection attempt ${attempt + 1}/${maxRetries}...`)
      }
      return await connectFn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn(`${name} connection failed (attempt ${attempt + 1}/${maxRetries}):`, lastError.message)
      
      if (attempt < maxRetries - 1) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
      }
    }
  }
  
  throw lastError || new Error(`Failed to connect to ${name} after ${maxRetries} attempts`)
}

// Get WebSocket provider (singleton)
export async function getWebSocketProvider(): Promise<ethers.WebSocketProvider> {
  return new Promise(async (resolve, reject) => {
    try {
      // Return existing provider if available
      if (wsProvider) {
        return resolve(wsProvider)
      }

      // Create new provider
      console.log("Creating new WebSocket provider...")
      
      const provider = await connectWithRetry(
        async () => {
          const newProvider = new ethers.WebSocketProvider(WS_ENDPOINT, CHAIN_ID)
          // Ensure provider is ready by checking if we can get the block number
          await withTimeout(
            newProvider.getBlockNumber(),
            CONNECTION_TIMEOUT,
            "WebSocket provider connection timeout"
          )
          return newProvider
        },
        MAX_RETRIES,
        1000,
        "WebSocket provider"
      )

      // Store provider
      wsProvider = provider

      // Log connection
      console.log("WebSocket provider connected (singleton)")

      // Handle disconnection
      const websocket = (provider.provider as any)._websocket
      if (websocket) {
        websocket.onclose = () => {
          console.log("WebSocket connection closed")
          wsProvider = null
        }
        
        // Ping to keep the connection alive
        const pingInterval = setInterval(() => {
          if (websocket.readyState === websocket.OPEN) {
            websocket.ping?.()
          } else {
            clearInterval(pingInterval)
          }
        }, 30000)  // Every 30 seconds
      }

      resolve(provider)
    } catch (error) {
      console.error("Failed to connect WebSocket provider:", error)
      wsProvider = null
      reject(error)
    }
  })
}

// Get HTTP provider (singleton)
export async function getHttpProvider(): Promise<ethers.JsonRpcProvider> {
  return new Promise(async (resolve, reject) => {
    try {
      // Return existing provider if available
      if (httpProvider) {
        return resolve(httpProvider)
      }

      // Create new provider
      console.log("Creating new HTTP provider...")
      
      const provider = await connectWithRetry(
        async () => {
          const newProvider = new ethers.JsonRpcProvider(HTTP_ENDPOINT, CHAIN_ID)
          // Ensure provider is ready by checking if we can get the block number
          await withTimeout(
            newProvider.getBlockNumber(),
            CONNECTION_TIMEOUT,
            "HTTP provider connection timeout"
          )
          return newProvider
        },
        MAX_RETRIES,
        1000,
        "HTTP provider"
      )

      // Store provider
      httpProvider = provider

      // Log connection
      console.log("HTTP provider connected (singleton)")

      resolve(provider)
    } catch (error) {
      console.error("Failed to connect HTTP provider:", error)
      httpProvider = null
      reject(error)
    }
  })
}

// Get best available provider
export async function getProvider(): Promise<ethers.Provider> {
  try {
    return await getWebSocketProvider()
  } catch (error) {
    console.warn("Falling back to HTTP provider:", error)
    return await getHttpProvider()
  }
}
