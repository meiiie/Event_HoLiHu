import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { BlockchainEvent } from "@/lib/supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Recursively converts BigInt values to strings in an object or array
 * This is useful for serializing blockchain data that contains BigInt values
 */
export function convertBigIntToString(value: any): any {
  if (value === null || value === undefined) {
    return value
  }

  // Handle BigInt values
  if (typeof value === 'bigint') {
    return value.toString()
  }

  // Handle arrays by mapping over each item
  if (Array.isArray(value)) {
    return value.map(item => convertBigIntToString(item))
  }

  // Handle Date objects
  if (value instanceof Date) {
    return value.toISOString()
  }

  // Handle Buffer or Uint8Array (common in blockchain data)
  if (value instanceof Uint8Array || Buffer.isBuffer(value)) {
    // Convert to hex string prefixed with 0x
    return '0x' + Buffer.from(value).toString('hex')
  }

  // Handle plain objects recursively
  if (typeof value === 'object') {
    const result: Record<string, any> = {}
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = convertBigIntToString(value[key])
      }
    }
    return result
  }

  return value
}

/**
 * Validates a blockchain event to ensure it has all required fields
 */
export function validateBlockchainEvent(event: Partial<BlockchainEvent>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!event.event_id && !event.transaction_hash) {
    errors.push("event_id hoặc transaction_hash là bắt buộc")
  }

  if (!event.block_number) {
    errors.push("block_number là bắt buộc")
  }

  if (!event.event_name) {
    errors.push("event_name là bắt buộc")
  }

  if (!event.contract_name) {
    errors.push("contract_name là bắt buộc")
  }

  if (!event.contract_address) {
    errors.push("contract_address là bắt buộc")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Determines the event type based on the event name
 */
export function determineEventType(eventName: string): BlockchainEvent["event_type"] {
  if (!eventName) return "other"
  
  const name = eventName.toLowerCase()
  
  if (name.includes("phieubau") || name.includes("phieubo") || name.includes("phieudabo") || name.includes("phieudaghinhan")) {
    return "vote"
  }

  if (name.includes("phienbaucu") || name.includes("taibaucu") || name.includes("hoaphieu")) {
    return "session"
  }

  if (name.includes("ungvien") || name.includes("cutri")) {
    return "candidate"
  }

  if (
    name.includes("cuocbaucu") ||
    name.includes("server") ||
    name.includes("hethong") ||
    name.includes("vaitro") ||
    name.includes("baocao")
  ) {
    return "system"
  }

  if (
    name.includes("transfer") ||
    name.includes("approval") ||
    name.includes("hlu") ||
    name.includes("token") ||
    name.includes("nft")
  ) {
    return "token"
  }

  return "other"
}

/**
 * Format event name for display
 */
export function formatEventName(name: string): string {
  if (!name) return "Không xác định"
  
  // Mapping of event names to display names
  const eventNameMap: Record<string, string> = {
    // QuanLyCuocBauCu events
    CuocBauCuDaTao: "Cuộc bầu cử đã tạo",
    CuocBauCuDaBatDau: "Cuộc bầu cử đã bắt đầu",
    CuocBauCuDaKetThuc: "Cuộc bầu cử đã kết thúc",
    CuocBauCuDaHuy: "Cuộc bầu cử đã hủy",
    CuocBauCuDaXoa: "Cuộc bầu cử đã xóa",
    PhienBauCuDaTao: "Phiên bầu cử đã tạo",
    PhienBauCuDaBatDau: "Phiên bầu cử đã bắt đầu",
    PhienBauCuDaKetThuc: "Phiên bầu cử đã kết thúc",
    PhienBauCuDaHuy: "Phiên bầu cử đã hủy",
    HoaPhieuBaoCao: "Báo cáo hòa phiếu",
    UngVienDaThem: "Ứng viên đã thêm",
    CuTriDaThem: "Cử tri đã thêm",
    PhieuBauDaGhiNhan: "Phiếu bầu đã ghi nhận",
    XacNhanTaiBauCu: "Xác nhận tái bầu cử",
    TaiBauCuDaDuocDuyet: "Tái bầu cử đã được duyệt",
    VaiTroDuocCap: "Vai trò được cấp",
    VaiTroBiThuHoi: "Vai trò bị thu hồi",
    HLUTruPhi: "HLU trừ phí",
    HLUHoanTien: "HLU hoàn tiền",

    // QuanLyPhieuBauToanCuc events
    PhieuBauDaCap: "Phiếu bầu đã cấp",
    PhieuDaBo: "Phiếu đã bỏ",
    NFTDaThuHoi: "NFT đã thu hồi",

    // QuanLyThanhTuuToanCuc events
    ThanhTuuDaCap: "Thành tựu đã cấp",
    QuanLyPhieuBauDaCapNhat: "Quản lý phiếu bầu đã cập nhật",

    // CuocBauCuFactory events
    ServerDaTao: "Server đã tạo",
    CuocBauCuDaLuuTru: "Cuộc bầu cử đã lưu trữ",
    CuocBauCuDaTamDung: "Cuộc bầu cử đã tạm dừng",
    CuocBauCuDaKhoiPhuc: "Cuộc bầu cử đã khôi phục",
    BaoCaoViPhamDaNhan: "Báo cáo vi phạm đã nhận",
    BaoCaoDaXuLy: "Báo cáo đã xử lý",
    HeThongDaTamDung: "Hệ thống đã tạm dừng",
    HeThongDaTiepTuc: "Hệ thống đã tiếp tục",
    MauDaCapNhat: "Mẫu đã cập nhật",
    VaiTroTrustSafetyDaCap: "Vai trò Trust & Safety đã cấp",
    VaiTroTrustSafetyDaThuHoi: "Vai trò Trust & Safety đã thu hồi",
    YeuCauCapNhatMau: "Yêu cầu cập nhật mẫu",
    SimpleAccountDaTao: "Simple Account đã tạo",

    // ERC20/721 events
    Transfer: "Chuyển token",
    Approval: "Phê duyệt",
    ApprovalForAll: "Phê duyệt tất cả",
    
    // HoLiHu Token events
    PhiDaThu: "Phí đã thu",
    GiamPhiDaDat: "Giảm phí đã đặt",
    CapNhatPhiChuyen: "Cập nhật phí chuyển",
    CapNhatDiaChiNhanPhi: "Cập nhật địa chỉ nhận phí",
    ChuyenVaiTroAdmin: "Chuyển vai trò admin",
    TaiKhoanBiDanhDauDeDot: "Tài khoản bị đánh dấu để đốt",
  }

  return eventNameMap[name] || name
}

/**
 * Format time ago from timestamp
 */
export function formatTimeAgo(timestamp: number): string {
  if (!timestamp) return "Chưa có"

  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return `${seconds} giây trước`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`
  
  // Format date for older events
  const date = new Date(timestamp)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
