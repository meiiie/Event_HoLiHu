"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { ethers } from "ethers"

interface BlockchainEventMonitorProps {
  electionAddress: string
  sessionId: string
  getSession: () => Promise<any>
  processEvent: (contractName: string, contractAddress: string, event: any) => Promise<void>
  fetchEvents: () => Promise<void>
  commonAbi: any
}

const BlockchainEventMonitor: React.FC<BlockchainEventMonitorProps> = ({
  electionAddress,
  sessionId,
  getSession,
  processEvent,
  fetchEvents,
  commonAbi,
}) => {
  const [isActive, setIsActive] = useState(true) // Assume active by default, can be controlled by a prop
  const isInitializedRef = useRef(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastBlockProcessed, setLastBlockProcessed] = useState(0)
  const contractRef = useRef<any>(null)
  const pollingIntervalRef = useRef<any>(null)

  // Connect to blockchain and listen for events
  useEffect(() => {
    if (!isActive || isInitializedRef.current) return

    let isMounted = true

    const setupBlockchainConnection = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get session from database
        const session = await getSession()

        try {
          // Get contract instance
          const contract = await getContract(electionAddress, commonAbi)

          // Get current block
          // In ethers v6, we need to get provider directly, not via contract.provider
          const provider = contract.runner
          const currentBlock = await provider.getBlockNumber()

          // Set from block
          const fromBlock = session?.last_block_processed || Math.max(0, currentBlock - 1000)
          setLastBlockProcessed(fromBlock)

          // Store contract reference
          contractRef.current = contract

          // Listen for events
          contract.on("*", (event: any) => {
            if (!isMounted) return

            // Ensure event has required properties
            if (event && event.transactionHash && event.blockNumber) {
              processEvent("QuanLyCuocBauCu", electionAddress, event)
            } else {
              console.warn("Received invalid event in monitor:", event)
            }
          })

          // Get past events
          try {
            const pastEvents = await contract.queryFilter("*", fromBlock)

            if (isMounted) {
              for (const event of pastEvents) {
                // Ensure event has required properties
                if (event && event.transactionHash && event.blockNumber) {
                  await processEvent("QuanLyCuocBauCu", electionAddress, event)
                } else {
                  console.warn("Received invalid past event in monitor:", event)
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching past events:`, error)
          }

          // Set up polling for new blocks
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
          }

          pollingIntervalRef.current = setInterval(async () => {
            try {
              if (!contractRef.current) return

              const provider = contractRef.current.runner
              const newBlock = await provider.getBlockNumber()

              if (newBlock > lastBlockProcessed) {
                // Check for new events
                const events = await contractRef.current.queryFilter("*", lastBlockProcessed + 1, newBlock)

                for (const event of events) {
                  // Ensure event has required properties
                  if (event && event.transactionHash && event.blockNumber) {
                    await processEvent("QuanLyCuocBauCu", electionAddress, event)
                  } else {
                    console.warn("Received invalid event during polling in monitor:", event)
                  }
                }
                
                // Update last processed block
                setLastBlockProcessed(newBlock)
              }
            } catch (error) {
              console.error("Error polling for new events:", error)
            }
          }, 15000) // Poll every 15 seconds

          setIsConnected(true)
          setIsLoading(false)
          isInitializedRef.current = true

          // Fetch initial events from database
          await fetchEvents()
        } catch (contractError) {
          throw new Error(`Không thể kết nối đến hợp đồng: ${contractError.message}`)
        }
      } catch (error) {
        console.error("Error connecting to blockchain:", error)
        setError(`Không thể kết nối đến blockchain: ${error instanceof Error ? error.message : String(error)}`)
        setIsConnected(false)
        setIsLoading(false)
      }
    }

    setupBlockchainConnection()

    // Cleanup
    return () => {
      isMounted = false

      // Remove event listeners
      if (contractRef.current) {
        contractRef.current.removeAllListeners()
        contractRef.current = null
      }

      // Clear polling interval
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }

      // Reset initialization flag
      isInitializedRef.current = false
    }
  }, [isActive, electionAddress, sessionId, getSession, processEvent, fetchEvents, lastBlockProcessed])

  return null
}

async function getContract(address: string, abi: any) {
  // Use ethers v6 BrowserProvider instead of Web3Provider
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  return new ethers.Contract(address, abi, signer)
}

export default BlockchainEventMonitor
