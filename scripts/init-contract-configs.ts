"use client"

import { useEffect, useState } from "react"
import { ContractAddresses } from "@/lib/contract-addresses"

interface InitContractConfigsProps {
  onInitialized?: () => void
  onError?: (error: Error) => void
}

export function InitContractConfigs({ onInitialized, onError }: InitContractConfigsProps = {}) {
  const [isInitializing, setIsInitializing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initializeConfigs = async () => {
      if (isInitializing) return

      setIsInitializing(true)
      try {
        console.log("Starting contract configs initialization...")

        // Create contract config objects
        const configs = Object.entries(ContractAddresses).map(([name, address]) => ({
          contract_name: name,
          contract_address: address,
          enabled: name === "QuanLyCuocBauCu", // Only enable QuanLyCuocBauCu by default
          from_block: 0,
        }))

        console.log(`Preparing to initialize ${configs.length} contract configs`)

        // Send to API
        const response = await fetch("/api/blockchain/contracts", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(configs),
        })

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(`Failed to initialize contract configs: ${responseData.error || response.statusText}`)
        }

        console.log("Contract configs initialized successfully:", responseData)

        // Call the callback if provided
        if (onInitialized) {
          onInitialized()
        }
      } catch (err) {
        console.error("Error initializing contract configs:", err)
        const errorObj = err instanceof Error ? err : new Error(String(err))
        setError(errorObj)
        if (onError) {
          onError(errorObj)
        }
      } finally {
        setIsInitializing(false)
      }
    }

    initializeConfigs()
  }, [onInitialized, onError, isInitializing])

  // Remove all JSX to avoid syntax issues
  return null
}
