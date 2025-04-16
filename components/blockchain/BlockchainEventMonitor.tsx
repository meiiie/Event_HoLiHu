"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { ethers } from "ethers"

interface BlockchainEventMonitorProps {
  electionAddress: string;
  sessionId: string;
  isActive?: boolean; // Add isActive as an optional prop
  getSession?: () => Promise<{
    last_block_processed?: number;
    [key: string]: any;
  }>;
  processEvent?: (contractName: string, contractAddress: string, event: any) => Promise<void>;
  fetchEvents?: () => Promise<void>;
  commonAbi?: any[];
}

const BlockchainEventMonitor: React.FC<BlockchainEventMonitorProps> = ({
  electionAddress,
  sessionId,
  isActive = true, // Default to true if not provided
  getSession = async () => ({ last_block_processed: 0 }), // Provide expected property in default object
  processEvent = async () => {},
  fetchEvents = async () => {},
  commonAbi = [],
}) => {
  const isInitializedRef = useRef(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastBlockProcessed, setLastBlockProcessed] = useState(0)
  const contractRef = useRef<ethers.Contract | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

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
          
          // Get the provider - with safety checks
          if (typeof window === 'undefined' || !window.ethereum) {
            throw new Error("Ethereum provider not available. Please make sure you have a wallet installed.");
          }
          
          const provider = new ethers.BrowserProvider(window.ethereum)
          
          // Get current block
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
              
              // Check if ethereum provider is available
              if (typeof window === 'undefined' || !window.ethereum) {
                console.warn("Ethereum provider not available during polling");
                return;
              }
              
              // Create a new provider instance to get the block number
              const provider = new ethers.BrowserProvider(window.ethereum)
              
              // Get current block number
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
        } catch (contractError: unknown) {
          // Properly handle unknown type error
          const errorMessage = contractError instanceof Error 
            ? contractError.message 
            : 'Unknown contract error';
          throw new Error(`Không thể kết nối đến hợp đồng: ${errorMessage}`);
        }
      } catch (error: unknown) {
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
  }, [isActive, electionAddress, sessionId, getSession, processEvent, fetchEvents, lastBlockProcessed, commonAbi])

  return null
}

async function getContract(address: string, abi: any[]): Promise<ethers.Contract> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error("Ethereum provider not available. Please make sure you have a wallet installed.");
  }
  // Use ethers v6 BrowserProvider instead of Web3Provider
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(address, abi, signer);
}

export default BlockchainEventMonitor
