"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { ethers } from "ethers"
import { PageTitle } from "@/components/page-title"
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Clock,
  AlertTriangle,
  Download,
  BarChart2,
  Settings,
  Save,
  LineChart,
  Info,
  Calendar,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { ContractAddresses, getTransactionUrl } from "@/lib/contract-addresses"
import type { BlockchainEvent, ContractConfig, EventStatistics } from "@/lib/supabase"
import { BlockchainService } from "@/services/blockchain-service"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, subHours } from "date-fns"
import { vi } from "date-fns/locale"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  BarElement,
  ArcElement,
  PieController,
} from "chart.js"
import { Line, Bar, Pie } from "react-chartjs-2"
import { getContract, cleanupProviders, getEventsFromContract, CHAIN_ID, getCurrentBlockNumber } from "@/lib/blockchain-provider"
import { convertBigIntToString, determineEventType, formatEventName, formatTimeAgo } from "@/lib/utils"

// Define EventType directly in this file
type EventType = "system" | "vote" | "session" | "candidate" | "token" | "other" | "election" | "operation" | "paymaster" | "creation"
import { CSVLink } from "react-csv"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  PieController,
  Title,
  ChartTooltip,
  Legend
)

// ABI for events based on the documentation
const CONTRACT_ABIS = {
  QuanLyCuocBauCu: [
    // Quản lý cuộc bầu cử
    "event CuocBauCuDaTao(uint256 indexed idCuocBauCu, address indexed nguoiSoHuu, uint256 thoiGianBatDau, uint256 thoiGianKetThuc)",
    "event CuocBauCuDaBatDau(uint256 indexed idCuocBauCu)",
    "event CuocBauCuDaKetThuc(uint256 indexed idCuocBauCu)",
    "event CuocBauCuDaHuy(uint256 indexed idCuocBauCu, string lyDo)",
    "event CuocBauCuDaXoa(uint256 indexed idCuocBauCu, address indexed quanTri)",

    // Quản lý phiên bầu cử
    "event PhienBauCuDaTao(uint256 indexed idCuocBauCu, uint256 indexed idPhienBauCu, address nguoiSoHuu)",
    "event PhienBauCuDaBatDau(uint256 indexed idCuocBauCu, uint256 indexed idPhienBauCu)",
    "event PhienBauCuDaKetThuc(uint256 indexed idCuocBauCu, uint256 indexed idPhienBauCu, uint256 thoiGianKetThuc, address[] ungVienDacCu)",
    "event PhienBauCuDaHuy(uint256 indexed idCuocBauCu, uint256 indexed idPhienBauCu, string lyDo)",
    "event HoaPhieuBaoCao(uint256 indexed idCuocBauCu, uint256 indexed idPhienBauCu, uint256 soPhieuCaoNhat, uint256 soUngVienHoaPhieu)",

    // Quản lý ứng viên và cử tri
    "event UngVienDaThem(uint256 indexed idCuocBauCu, uint256 indexed idPhienBauCu, address ungVien)",
    "event CuTriDaThem(uint256 indexed idCuocBauCu, uint256 indexed idPhienBauCu, address cuTri)",
    "event PhieuBauDaGhiNhan(uint256 indexed idCuocBauCu, uint256 indexed idPhienBauCu, address ungVien, uint256 soPhieu, address cuTri)",

    // Quản lý tái bầu cử
    "event XacNhanTaiBauCu(uint256 indexed idCuocBauCu, uint256 indexed idPhienBauCu, address xacNhan)",
    "event TaiBauCuDaDuocDuyet(uint256 indexed idCuocBauCu, uint256 indexed idPhienBauCu)",

    // Quản lý vai trò và thanh toán
    "event VaiTroDuocCap(bytes32 indexed vaiTro, address indexed taiKhoan)",
    "event VaiTroBiThuHoi(bytes32 indexed vaiTro, address indexed taiKhoan)",
    "event HLUTruPhi(address indexed nguoiDung, uint256 soLuong, string hanhDong)",
    "event HLUHoanTien(address indexed nguoiSoHuu, uint256 soLuong)",
    "event DebugLog(string message, address caller)",
  ],
  QuanLyPhieuBauToanCuc: [
    "event PhieuBauDaCap(address indexed cuTri, uint256 idToken, uint256 idCuocBauCu, uint256 idPhienBauCu, string uriToken)",
    "event PhieuDaBo(uint256 indexed serverId, uint256 indexed idPhienBauCu, address indexed cuTri, uint256 idToken, address ungVien, uint256 thoiGian)",
    "event NFTDaThuHoi(uint256 indexed idToken, address indexed nguoiThuHoi)",
  ],
  QuanLyThanhTuuToanCuc: [
    "event ThanhTuuDaCap(address indexed cuTri, uint256 idToken, uint8 capBac, uint256 idCuocBauCu, uint256 idPhienBauCu, string uriToken)",
    "event QuanLyPhieuBauDaCapNhat(address indexed diaChiCu, address indexed diaChiMoi)",
  ],
  CuocBauCuFactory: [
    "event ServerDaTao(uint128 indexed id, address indexed quanLyCuocBauCu, address indexed nguoiTao, string tenCuocBauCu)",
    "event CuocBauCuDaLuuTru(uint128 indexed id, address indexed quanLyCuocBauCu)",
    "event CuocBauCuDaTamDung(uint128 indexed id, string lyDo)",
    "event CuocBauCuDaKhoiPhuc(uint128 indexed id, address indexed nguoiKhoiPhuc)",
    "event VaiTroTrustSafetyDaCap(bytes32 indexed role, address indexed account)",
    "event VaiTroTrustSafetyDaThuHoi(bytes32 indexed role, address indexed account)",
    "event YeuCauCapNhatMau(address indexed nguoiYeuCau, address mauMoi, uint128 thoiGian)",
    "event MauDaCapNhat(address indexed mauQuanLyCuocBauCuMoi, address quanLyPhieuBauToanCucMoi, address quanLyThanhTuuToanCucMoi)",
    "event BaoCaoViPhamDaNhan(uint128 indexed idServer, address indexed nguoiBaoCao, string lyDo)",
    "event BaoCaoDaXuLy(uint128 indexed idServer, uint128 indexed idBaoCao, bool ketQua, string lyDoTuChoi)",
    "event HeThongDaTamDung(string lyDo)",
    "event HeThongDaTiepTuc()",
    "event ThoiGianKhoaCapNhatDaThayDoi(uint128 thoiGianMoi)",
    "event SimpleAccountDaTao(address indexed account, address indexed accountOwner)",
  ],
  HoLiHuToken: [
    "event PhiDaThu(address indexed nguoiGui, address indexed nguoiNhan, uint256 phi)",
    "event GiamPhiDaDat(address indexed taiKhoan, uint256 mucGiam)",
    "event CapNhatPhiChuyen(uint256 phiMoi)",
    "event CapNhatDiaChiNhanPhi(address indexed diaChiMoi)",
    "event ChuyenVaiTroAdmin(address indexed adminCu, address indexed adminMoi)",
    "event TaiKhoanBiDanhDauDeDot(address indexed taiKhoan, bool trangThai)",
    // ERC20 events
    "event Transfer(address indexed from, address indexed to, uint256 amount)",
    "event Approval(address indexed owner, address indexed spender, uint256 amount)",
  ],
  // Common ERC721 events for NFT contracts
  ERC721: [
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
    "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
  ],
  EntryPoint: [
    "event ThaoTacNguoiDungDuocThucThi(address indexed sender, uint256 nonce, bool thanhCong)",
    "event PaymasterThemVaoTrangDanhSach(address indexed paymaster)",
    "event ThucThiThaoTac(address indexed sender, bool thanhCong, uint256 gasSuDung)",
    "event PostOpThatBai(address indexed paymaster, uint256 nonce, string lyDo)",
    "event PaymasterXacThucThanhCong(address indexed paymaster, address indexed sender)",
    "event TaoNguoiGuiThanhCong(address indexed nguoiGui, uint256 gasUsed)"
  ],
}

// Tùy chọn khoảng thời gian cho filter
const TIME_FILTER_OPTIONS = [
  { value: "1h", label: "1 giờ trước" },
  { value: "24h", label: "24 giờ trước" },
  { value: "7d", label: "7 ngày trước" },
  { value: "30d", label: "30 ngày trước" },
  { value: "all", label: "Tất cả" },
]

// Component chính
export default function BlockchainMonitorPage() {
  const [events, setEvents] = useState<BlockchainEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<BlockchainEvent[]>([])
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("events")
  const [contractFilter, setContractFilter] = useState<string>("all")
  const [eventTypeFilter, setEventTypeFilter] = useState<"all" | EventType>("all")
  const [timeFilter, setTimeFilter] = useState<string>("all")
  const [stats, setStats] = useState<EventStatistics>({
    id: 1,
    total_events: 0,
    events_by_contract: {},
    events_by_type: {},
    events_per_hour: 0,
    last_event_time: 0,
  })
  const [monitorConfigs, setMonitorConfigs] = useState<ContractConfig[]>([])
  const [currentBlockNumber, setCurrentBlockNumber] = useState<number>(0)
  const [quanLyCuocBauCuAddress, setQuanLyCuocBauCuAddress] = useState<string>(ContractAddresses.QuanLyCuocBauCu)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState<boolean>(false)
  const [newAddress, setNewAddress] = useState<string>("")
  const [isValidAddress, setIsValidAddress] = useState<boolean>(true)
  const [timeSeriesData, setTimeSeriesData] = useState<{
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
    }[]
  }>({
    labels: [],
    datasets: [
      {
        label: "Sự kiện theo thời gian",
        data: [],
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.5)",
      },
    ],
  })

  // Refs to track contracts and event listeners
  const contractsRef = useRef<Record<string, ethers.Contract>>({})
  const isInitializedRef = useRef<boolean>(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const { toast } = useToast()

  // Fetch contract configs
  const fetchContractConfigs = useCallback(async () => {
    try {
      const configs = await BlockchainService.getContractConfigs()
      setMonitorConfigs(configs)

      // Find QuanLyCuocBauCu config
      const quanLyCuocBauCuConfig = configs.find((config) => config.contract_name === "QuanLyCuocBauCu")
      if (quanLyCuocBauCuConfig) {
        setQuanLyCuocBauCuAddress(quanLyCuocBauCuConfig.contract_address)
      }
    } catch (error) {
      console.error("Error fetching contract configs:", error)
    }
  }, [])

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      const events = await BlockchainService.getEvents({ limit: 500 })
      setEvents(events)
      updateFilteredEvents(events, searchTerm, contractFilter, eventTypeFilter, timeFilter)
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }, [searchTerm, contractFilter, eventTypeFilter, timeFilter])

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const stats = await BlockchainService.getStatistics()
      if (stats) {
        setStats(stats)
      }
    } catch (error) {
      console.error("Error fetching statistics:", error)
    }
  }, [])

  // Generate time series data
  const generateTimeSeriesData = useCallback(() => {
    // Group events by hour
    const hourlyData: Record<string, number> = {}
    const now = new Date()

    // Initialize last 24 hours with 0 events
    for (let i = 23; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 60 * 60 * 1000)
      const hourKey = format(date, "HH:00", { locale: vi })
      hourlyData[hourKey] = 0
    }

    // Count events per hour
    events.forEach((event) => {
      const date = new Date(event.timestamp)
      if (date.getTime() > now.getTime() - 24 * 60 * 60 * 1000) {
        const hourKey = format(date, "HH:00", { locale: vi })
        hourlyData[hourKey] = (hourlyData[hourKey] || 0) + 1
      }
    })

    // Convert to chart data
    const labels = Object.keys(hourlyData)
    const data = Object.values(hourlyData)

    setTimeSeriesData({
      labels,
      datasets: [
        {
          label: "Sự kiện theo giờ",
          data,
          borderColor: "rgba(99, 102, 241, 1)",
          backgroundColor: "rgba(99, 102, 241, 0.5)",
        },
      ],
    })
  }, [events])

  // Update QuanLyCuocBauCu address
  const updateQuanLyCuocBauCuAddress = async () => {
    if (!isValidAddress) {
      toast({
        title: "Địa chỉ không hợp lệ",
        description: "Vui lòng nhập địa chỉ hợp đồng hợp lệ",
        variant: "destructive",
      })
      return
    }

    try {
      // Find QuanLyCuocBauCu config
      const config = monitorConfigs.find((config) => config.contract_name === "QuanLyCuocBauCu")

      if (config) {
        // Update config
        await BlockchainService.updateContractConfig({
          ...config,
          contract_address: newAddress,
        })

        // Update state
        setQuanLyCuocBauCuAddress(newAddress)
        setMonitorConfigs((prev) =>
          prev.map((c) => (c.contract_name === "QuanLyCuocBauCu" ? { ...c, contract_address: newAddress } : c)),
        )

        toast({
          title: "Cập nhật thành công",
          description: "Địa chỉ hợp đồng QuanLyCuocBauCu đã được cập nhật",
        })

        // Close dialog
        setIsAddressDialogOpen(false)

        // Refresh connection
        refreshConnection()
      }
    } catch (error) {
      console.error("Error updating QuanLyCuocBauCu address:", error)
      toast({
        title: "Lỗi cập nhật",
        description: "Không thể cập nhật địa chỉ hợp đồng",
        variant: "destructive",
      })
    }
  }

  // Validate Ethereum address
  const validateAddress = (address: string) => {
    try {
      return ethers.isAddress(address)
    } catch (error) {
      return false
    }
  }

  // Process blockchain event
  const processEvent = async (contractName: string, contractAddress: string, event: any) => {
    try {
      // Skip if event doesn't have required properties
      if (!event || !event.transactionHash || !event.blockNumber) {
        console.warn("Skipping invalid event:", event)
        return
      }

      const eventName = event.eventName || event.fragment?.name || "UnknownEvent"

      // Determine event type
      const eventType = determineEventType(eventName)

      // Convert event args to serializable format
      const eventData = event.args ? convertBigIntToString(Object.values(event.args)) : {}

      const newEvent: BlockchainEvent = {
        event_id: `${event.blockNumber}-${event.transactionHash}-${event.logIndex || Math.random()}`,
        contract_name: contractName,
        contract_address: contractAddress,
        event_name: eventName,
        transaction_hash: event.transactionHash,
        block_number: Number(event.blockNumber),
        timestamp: Date.now(),
        event_type: eventType as any as BlockchainEvent["event_type"],
        data: eventData,
      }

      // Save event to database
      await BlockchainService.saveEvent(newEvent)

      // Refresh events and stats
      await fetchEvents()
      await fetchStats()

      // Hiển thị thông báo cho sự kiện mới
      toast({
        title: `Sự kiện mới: ${formatEventName(eventName)}`,
        description: `Từ hợp đồng ${contractName}`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error processing event:", error)
    }
  }

  // Setup blockchain connection
  const setupBlockchainConnection = useCallback(async () => {
    if (isInitializedRef.current) return

    try {
      setIsLoading(true)
      setError(null)

      // Get current block number safely
      const currentBlock = await getCurrentBlockNumber()
      setCurrentBlockNumber(currentBlock)

      // Setup contracts
      const enabledConfigs = monitorConfigs.filter((config) => config.enabled)

      for (const config of enabledConfigs) {
        try {
          // Get ABI for contract
          const abi = CONTRACT_ABIS[config.contract_name as keyof typeof CONTRACT_ABIS] ||
            CONTRACT_ABIS.ERC721 || ["event allEvents()"]

          // Create contract instance
          const contract = await getContract(config.contract_address, abi)
          contractsRef.current[config.contract_address] = contract

          // Setup event listener
          contract.on("*", (event: any) => {
            // Ensure event has required properties
            if (event && event.transactionHash && event.blockNumber) {
              processEvent(config.contract_name, config.contract_address, event)
            } else {
              console.warn("Received invalid event:", event)
            }
          })

          // Get past events
          const fromBlock = config.from_block > 0 ? config.from_block : Math.max(0, currentBlock - 1000)

          try {
            const pastEvents = await contract.queryFilter("*", fromBlock)

            for (const event of pastEvents) {
              // Ensure event has required properties
              if (event && event.transactionHash && event.blockNumber) {
                await processEvent(config.contract_name, config.contract_address, event)
              } else {
                console.warn("Received invalid past event:", event)
              }
            }
          } catch (error) {
            console.error(`Error fetching past events for ${config.contract_name}:`, error)
          }
        } catch (contractError) {
          console.error(`Error setting up contract ${config.contract_name}:`, contractError)
        }
      }

      // Setup polling for new blocks
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }

      pollingIntervalRef.current = setInterval(async () => {
        try {
          const newBlock = await getCurrentBlockNumber()

          if (newBlock > currentBlockNumber) {
            setCurrentBlockNumber(newBlock)

            // Check for new events
            for (const config of enabledConfigs) {
              const contract = contractsRef.current[config.contract_address]
              if (contract) {
                try {
                  const events = await contract.queryFilter("*", currentBlockNumber + 1, newBlock)

                  for (const event of events) {
                    // Ensure event has required properties
                    if (event && event.transactionHash && event.blockNumber) {
                      await processEvent(config.contract_name, config.contract_address, event)
                    } else {
                      console.warn("Received invalid event during polling:", event)
                    }
                  }
                } catch (error) {
                  console.error(`Error querying events for ${config.contract_name}:`, error)
                }
              }
            }
          }
        } catch (error) {
          console.error("Error polling for new events:", error)
        }
      }, 15000) // Poll every 15 seconds

      setIsConnected(true)
      setIsLoading(false)
      isInitializedRef.current = true
    } catch (error) {
      console.error("Error connecting to blockchain:", error)
      setError(`Không thể kết nối đến blockchain: ${error instanceof Error ? error.message : String(error)}`)
      setIsConnected(false)
      setIsLoading(false)
    }
  }, [monitorConfigs, currentBlockNumber, fetchEvents, fetchStats])

  // Kết nối đến blockchain
  useEffect(() => {
    // Load data
    const loadData = async () => {
      await fetchContractConfigs()
      await fetchEvents()
      await fetchStats()
    }

    loadData()

    // Cleanup when component unmounts
    return () => {
      // Remove event listeners
      Object.values(contractsRef.current).forEach((contract) => {
        contract.removeAllListeners()
      })

      // Clear polling interval
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }

      // Clean up providers
      cleanupProviders()

      // Reset initialization flag
      isInitializedRef.current = false
    }
  }, [fetchContractConfigs, fetchEvents, fetchStats])

  // Setup blockchain connection after configs are loaded
  useEffect(() => {
    if (monitorConfigs.length > 0 && !isInitializedRef.current) {
      setupBlockchainConnection()
    }
  }, [monitorConfigs, setupBlockchainConnection])

  // Update time series data when events change
  useEffect(() => {
    generateTimeSeriesData()
  }, [events, generateTimeSeriesData])

  // Validate new address when it changes
  useEffect(() => {
    setIsValidAddress(validateAddress(newAddress))
  }, [newAddress])

  // Hàm cập nhật danh sách sự kiện đã lọc
  const updateFilteredEvents = (
    allEvents: BlockchainEvent[],
    search: string,
    contractFilter: string,
    eventTypeFilter: string,
    timeFilter: string,
  ) => {
    let filtered = [...allEvents]

    // Lọc theo hợp đồng
    if (contractFilter !== "all") {
      filtered = filtered.filter((event) => event.contract_name === contractFilter)
    }

    // Lọc theo loại sự kiện
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter((event) => event.event_type === eventTypeFilter)
    }

    // Lọc theo từ khóa tìm kiếm
    if (search) {
      const term = search.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.event_name.toLowerCase().includes(term) ||
          event.contract_name.toLowerCase().includes(term) ||
          event.transaction_hash.toLowerCase().includes(term) ||
          JSON.stringify(event.data).toLowerCase().includes(term),
      )
    }

    // Lọc theo khoảng thời gian
    if (timeFilter !== "all") {
      const now = Date.now()
      const timeLimit = {
        "1h": now - 1 * 60 * 60 * 1000,
        "24h": now - 24 * 60 * 60 * 1000,
        "7d": now - 7 * 24 * 60 * 60 * 1000,
        "30d": now - 30 * 24 * 60 * 60 * 1000,
      }[timeFilter] ?? now // Fallback to current time if timeFilter doesn't match any key

      filtered = filtered.filter((event) => event.timestamp >= timeLimit)
    }

    setFilteredEvents(filtered)
  }

  // Format event type with enhanced styling
  const formatEventType = (type: string) => {
    switch (type) {
      case "vote":
        return { label: "Vote", color: "bg-gradient-to-r from-green-400 to-emerald-500 text-white" }
      case "session":
        return { label: "Session", color: "bg-gradient-to-r from-blue-400 to-blue-600 text-white" }
      case "candidate":
        return { label: "Candidate", color: "bg-gradient-to-r from-purple-400 to-purple-600 text-white" }
      case "election":
        return { label: "Election", color: "bg-gradient-to-r from-indigo-400 to-indigo-600 text-white" }
      case "token":
        return { label: "Token", color: "bg-gradient-to-r from-amber-400 to-amber-600 text-white" }
      case "system":
        return { label: "System", color: "bg-gradient-to-r from-sky-400 to-sky-600 text-white" }
      case "operation":
        return { label: "Operation", color: "bg-gradient-to-r from-rose-400 to-rose-600 text-white" }
      case "paymaster":
        return { label: "Paymaster", color: "bg-gradient-to-r from-cyan-400 to-cyan-600 text-white" }
      case "creation":
        return { label: "Creation", color: "bg-gradient-to-r from-teal-400 to-teal-600 text-white" }
      default:
        return { label: "Other", color: "bg-gradient-to-r from-gray-500 to-gray-700 text-white" }
    }
  }

  // Hàm xuất dữ liệu sự kiện
  const exportEvents = () => {
    const dataStr = JSON.stringify(events, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `blockchain-events-${new Date().toISOString()}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Hàm làm mới kết nối
  const refreshConnection = () => {
    // Remove event listeners
    Object.values(contractsRef.current).forEach((contract) => {
      contract.removeAllListeners()
    })

    // Clear contracts
    contractsRef.current = {}

    // Clear polling interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }

    // Clean up providers
    cleanupProviders()

    // Reset initialization flag
    isInitializedRef.current = false

    // Reset state
    setIsConnected(false)
    setIsLoading(true)

    // Setup connection again
    setupBlockchainConnection()
  }

  // Hàm bật/tắt theo dõi hợp đồng
  const toggleContractMonitoring = async (contractName: string) => {
    // Find the config
    const config = monitorConfigs.find((c) => c.contract_name === contractName)

    if (config) {
      // Update config
      const updatedConfig = await BlockchainService.updateContractConfig({
        ...config,
        enabled: !config.enabled,
      })

      if (updatedConfig) {
        // Update state
        setMonitorConfigs((prev) => prev.map((c) => (c.contract_name === contractName ? updatedConfig : c)))

        // Refresh connection
        refreshConnection()
      }
    }
  }

  // Hàm đặt block bắt đầu cho hợp đồng
  const setContractFromBlock = async (contractName: string, fromBlock: number) => {
    // Find the config
    const config = monitorConfigs.find((c) => c.contract_name === contractName)

    if (config) {
      // Update config
      const updatedConfig = await BlockchainService.updateContractConfig({
        ...config,
        from_block: fromBlock,
      })

      if (updatedConfig) {
        // Update state
        setMonitorConfigs((prev) => prev.map((c) => (c.contract_name === contractName ? updatedConfig : c)))
      }
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Giám sát Blockchain</h1>
          <p className="text-muted-foreground">
            Theo dõi các sự kiện blockchain trên mạng HoLiHu (Chain ID: {CHAIN_ID})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={
              isConnected
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            }
          >
            {isConnected ? "Đã kết nối" : isLoading ? "Đang kết nối..." : "Mất kết nối"}
          </Badge>

          <Button variant="outline" size="sm" onClick={refreshConnection}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Làm mới
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Tùy chọn
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={exportEvents}>
                <Download className="h-4 w-4 mr-2" />
                Xuất dữ liệu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsAddressDialogOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Cấu hình địa chỉ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {error && (
        <Alert className="bg-red-50/70 dark:bg-red-900/20 border border-red-100/50 dark:border-red-800/30 backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-300">Lỗi kết nối</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tổng số sự kiện</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total_events}</div>
            <p className="text-sm text-muted-foreground">{stats.events_per_hour} sự kiện/giờ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Block hiện tại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentBlockNumber}</div>
            <p className="text-sm text-muted-foreground">Sự kiện gần nhất: {formatTimeAgo(stats.last_event_time)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Hợp đồng đang theo dõi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{monitorConfigs.filter((c) => c.enabled).length}</div>
            <p className="text-sm text-muted-foreground">Trên tổng số {monitorConfigs.length} hợp đồng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sự kiện đã lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredEvents.length}</div>
            <p className="text-sm text-muted-foreground">
              {searchTerm || contractFilter !== "all" || eventTypeFilter !== "all"
                ? "Đang áp dụng bộ lọc"
                : "Không có bộ lọc"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="events">
            <Activity className="h-4 w-4 mr-2" />
            Sự kiện
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart2 className="h-4 w-4 mr-2" />
            Thống kê
          </TabsTrigger>
          <TabsTrigger value="charts">
            <LineChart className="h-4 w-4 mr-2" />
            Biểu đồ
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Cấu hình
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sự kiện..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    updateFilteredEvents(events, e.target.value, contractFilter, eventTypeFilter, timeFilter)
                  }}
                />
              </div>
            </div>

            <Select
              value={contractFilter}
              onValueChange={(value) => {
                setContractFilter(value)
                updateFilteredEvents(events, searchTerm, value, eventTypeFilter, timeFilter)
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Hợp đồng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả hợp đồng</SelectItem>
                {monitorConfigs
                  .filter((config) => config.enabled)
                  .map((config) => (
                    <SelectItem key={config.contract_address} value={config.contract_name}>
                      {config.contract_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              value={eventTypeFilter}
              onValueChange={(value) => {
                setEventTypeFilter(value as "all" | EventType)
                updateFilteredEvents(events, searchTerm, contractFilter, value, timeFilter)
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Loại sự kiện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="vote">Bỏ phiếu</SelectItem>
                <SelectItem value="session">Phiên bầu cử</SelectItem>
                <SelectItem value="candidate">Ứng viên</SelectItem>
                <SelectItem value="election">Cuộc bầu cử</SelectItem>
                <SelectItem value="token">Token</SelectItem>
                <SelectItem value="system">Hệ thống</SelectItem>
                <SelectItem value="operation">Operation</SelectItem>
                <SelectItem value="paymaster">Paymaster</SelectItem>
                <SelectItem value="creation">Creation</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={timeFilter}
              onValueChange={(value) => {
                setTimeFilter(value)
                updateFilteredEvents(events, searchTerm, contractFilter, eventTypeFilter, value)
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                {TIME_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <div className="mt-3 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Chưa có sự kiện nào</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || contractFilter !== "all" || eventTypeFilter !== "all" || timeFilter !== "all"
                  ? "Không tìm thấy sự kiện nào phù hợp với bộ lọc. Hãy thử thay đổi bộ lọc."
                  : "Các sự kiện blockchain sẽ xuất hiện ở đây khi có hoạt động mới"}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-3 pr-4">
                {filteredEvents.map((event) => {
                  const eventTypeInfo = formatEventType(event.event_type)
                  return (
                    <Accordion type="single" collapsible key={event.event_id}>
                      <AccordionItem value={event.event_id} className="border rounded-lg">
                        <AccordionTrigger className="px-4 py-2 hover:no-underline">
                          <div className="flex flex-1 justify-between items-center">
                            <div className="flex items-center">
                              <Badge className={eventTypeInfo.color}>{eventTypeInfo.label}</Badge>
                              <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                                {formatEventName(event.event_name)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(event.timestamp).toLocaleTimeString("vi-VN")}
                              </span>
                              <Badge variant="outline">{event.contract_name}</Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-3">
                          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <p className="font-medium text-gray-700 dark:text-gray-300">Thông tin giao dịch</p>
                                <div className="mt-1 space-y-1">
                                  <div className="flex justify-between">
                                    <span>Block:</span>
                                    <span className="font-mono">{event.block_number}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Transaction:</span>
                                    <span className="font-mono truncate max-w-[200px]">{event.transaction_hash}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Thời gian:</span>
                                    <span>{new Date(event.timestamp).toLocaleString("vi-VN")}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <p className="font-medium text-gray-700 dark:text-gray-300">Dữ liệu sự kiện</p>
                                <div className="mt-1 space-y-1">
                                  {Object.entries(event.data || {}).map(([key, value], index) => (
                                    <div key={index} className="flex justify-between">
                                      <span>Tham số {index + 1}:</span>
                                      <span className="font-mono truncate max-w-[200px]">
                                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="pt-2 flex justify-end">
                              <a
                                href={getTransactionUrl(event.transaction_hash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                              >
                                Xem giao dịch trên Explorer
                              </a>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        {/* Tab thống kê */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thống kê theo hợp đồng */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bố sự kiện theo hợp đồng</CardTitle>
                <CardDescription>
                  Số lượng sự kiện được ghi nhận từ mỗi hợp đồng
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(stats.events_by_contract || {})
                      .sort((a, b) => b[1] - a[1])
                      .map(([contract, count]) => (
                        <div key={contract} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono">
                              {contract}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{count}</span>
                            <span className="text-xs text-muted-foreground">sự kiện</span>
                          </div>
                        </div>
                      ))}
                    {Object.keys(stats.events_by_contract || {}).length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Chưa có dữ liệu thống kê theo hợp đồng
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Thống kê theo loại sự kiện */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bố sự kiện theo loại</CardTitle>
                <CardDescription>
                  Số lượng sự kiện được phân loại theo từng nhóm
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(stats.events_by_type || {})
                      .sort((a, b) => b[1] - a[1])
                      .map(([type, count]) => {
                        const eventTypeInfo = formatEventType(type)
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={eventTypeInfo.color}>{eventTypeInfo.label}</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">{count}</span>
                              <span className="text-xs text-muted-foreground">sự kiện</span>
                            </div>
                          </div>
                        )
                      })}
                    {Object.keys(stats.events_by_type || {}).length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Chưa có dữ liệu thống kê theo loại sự kiện
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Thống kê hoạt động gần đây */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>
                  Tổng hợp các hoạt động và sự kiện blockchain trong 24 giờ qua
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                    <span className="text-muted-foreground mb-1">Tổng số sự kiện hôm nay</span>
                    <span className="text-4xl font-bold">
                      {events.filter(
                        (e) => e.timestamp > Date.now() - 24 * 60 * 60 * 1000
                      ).length}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                    <span className="text-muted-foreground mb-1">Sự kiện/giờ</span>
                    <span className="text-4xl font-bold">{stats.events_per_hour}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                    <span className="text-muted-foreground mb-1">Sự kiện gần nhất</span>
                    <span className="text-3xl font-bold">{formatTimeAgo(stats.last_event_time)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Xuất dữ liệu sự kiện */}
          <div className="flex justify-end mt-4">
            {events.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-block">
                      <CSVLink
                        data={events.map(event => ({
                          EventId: event.event_id,
                          EventName: formatEventName(event.event_name),
                          ContractName: event.contract_name,
                          ContractAddress: event.contract_address,
                          BlockNumber: event.block_number,
                          TransactionHash: event.transaction_hash,
                          Timestamp: new Date(event.timestamp).toLocaleString("vi-VN"),
                          EventType: formatEventType(event.event_type).label
                        }))}
                        filename={`blockchain-events-${new Date().toISOString().split('T')[0]}.csv`}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Xuất báo cáo CSV
                      </CSVLink>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tải xuống báo cáo chi tiết dưới dạng tệp CSV</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </TabsContent>

        {/* Tab biểu đồ */}
        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Biểu đồ sự kiện theo thời gian */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Sự kiện theo thời gian</CardTitle>
                <CardDescription>Phân bố sự kiện blockchain theo giờ trong 24 giờ qua</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoading ? (
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : timeSeriesData.labels.length > 0 ? (
                  <div className="h-[300px]">
                    <Line
                      data={timeSeriesData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              precision: 0,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Không có đủ dữ liệu để hiển thị biểu đồ</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Biểu đồ phân bố loại sự kiện */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bố loại sự kiện</CardTitle>
                <CardDescription>Biểu đồ tròn thể hiện tỷ lệ các loại sự kiện</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoading ? (
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : Object.keys(stats.events_by_type || {}).length > 0 ? (
                  <div className="h-[300px]">
                    <Pie
                      data={{
                        labels: Object.entries(stats.events_by_type || {}).map(([type]) =>
                          formatEventType(type).label
                        ),
                        datasets: [
                          {
                            data: Object.entries(stats.events_by_type || {}).map(([, count]) => count),
                            backgroundColor: [
                              "rgba(34, 197, 94, 0.7)", // green
                              "rgba(59, 130, 246, 0.7)", // blue
                              "rgba(168, 85, 247, 0.7)", // purple
                              "rgba(245, 158, 11, 0.7)", // amber
                              "rgba(99, 102, 241, 0.7)", // indigo
                              "rgba(156, 163, 175, 0.7)", // gray
                            ],
                            borderColor: [
                              "rgba(34, 197, 94, 1)",
                              "rgba(59, 130, 246, 1)",
                              "rgba(168, 85, 247, 1)",
                              "rgba(245, 158, 11, 1)",
                              "rgba(99, 102, 241, 1)",
                              "rgba(156, 163, 175, 1)",
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Không có đủ dữ liệu để hiển thị biểu đồ</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Biểu đồ phân bố theo hợp đồng */}
            <Card>
              <CardHeader>
                <CardTitle>Sự kiện theo hợp đồng</CardTitle>
                <CardDescription>Biểu đồ cột hiển thị số lượng sự kiện từ mỗi hợp đồng</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoading ? (
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : Object.keys(stats.events_by_contract || {}).length > 0 ? (
                  <div className="h-[300px]">
                    <Bar
                      data={{
                        labels: Object.entries(stats.events_by_contract || {}).map(
                          ([contract]) => contract
                        ),
                        datasets: [
                          {
                            label: "Số lượng sự kiện",
                            data: Object.entries(stats.events_by_contract || {}).map(
                              ([, count]) => count
                            ),
                            backgroundColor: "rgba(99, 102, 241, 0.5)",
                            borderColor: "rgba(99, 102, 241, 1)",
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              precision: 0,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Không có đủ dữ liệu để hiển thị biểu đồ</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab cấu hình */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình theo dõi hợp đồng</CardTitle>
              <CardDescription>
                Quản lý danh sách hợp đồng blockchain được theo dõi và thiết lập các tùy chọn
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <Skeleton className="h-5 w-40 mb-1" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {monitorConfigs.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Chưa có hợp đồng nào được cấu hình</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-4">
                        {monitorConfigs.map((config) => (
                          <div key={config.contract_address} className="p-4 border rounded-lg">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{config.contract_name}</h3>
                                  <Badge variant={config.enabled ? "default" : "outline"}>
                                    {config.enabled ? "Đang theo dõi" : "Đã tắt"}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 font-mono">{config.contract_address}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant={config.enabled ? "outline" : "default"}
                                        size="sm"
                                        onClick={() => toggleContractMonitoring(config.contract_name)}
                                      >
                                        {config.enabled ? "Tắt theo dõi" : "Bật theo dõi"}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{config.enabled ? "Tắt" : "Bật"} theo dõi sự kiện từ hợp đồng này</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <a
                                  href={`https://explorer.holihu.online/address/${config.contract_address}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </a>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <div className="flex items-center">
                                <Label htmlFor={`from-block-${config.contract_name}`} className="mr-2">Block bắt đầu:</Label>
                                <Input
                                  id={`from-block-${config.contract_name}`}
                                  type="number"
                                  className="max-w-[120px]"
                                  value={config.from_block}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0
                                    setMonitorConfigs(prev =>
                                      prev.map(c => c.contract_name === config.contract_name
                                        ? { ...c, from_block: value }
                                        : c
                                      )
                                    )
                                  }}
                                />
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="ml-2"
                                  onClick={() => setContractFromBlock(config.contract_name, parseInt(config.from_block.toString()))}
                                >
                                  Áp dụng
                                </Button>
                              </div>
                              <div className="flex items-center ml-auto">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="ml-2"
                                        onClick={() => setContractFromBlock(config.contract_name, currentBlockNumber)}
                                      >
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Từ block hiện tại
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Đặt block bắt đầu là block hiện tại ({currentBlockNumber})</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button onClick={refreshConnection}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới kết nối blockchain
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog for changing QuanLyCuocBauCu address */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thay đổi địa chỉ QuanLyCuocBauCu</DialogTitle>
            <DialogDescription>
              Nhập địa chỉ hợp đồng QuanLyCuocBauCu mới. Địa chỉ phải là địa chỉ Ethereum hợp lệ.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Địa chỉ
              </Label>
              <Input
                id="address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className={`col-span-3 ${!isValidAddress && newAddress ? "border-red-500" : ""}`}
                placeholder="0x..."
              />
            </div>
            {!isValidAddress && newAddress && (
              <p className="text-sm text-red-500 col-start-2 col-span-3">
                Địa chỉ không hợp lệ. Vui lòng nhập địa chỉ Ethereum hợp lệ.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={updateQuanLyCuocBauCuAddress} disabled={!isValidAddress || !newAddress}>
              <Save className="h-4 w-4 mr-1" />
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
