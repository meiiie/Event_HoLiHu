/**
 * Recursively converts BigInt values to strings in an object or array
 * This is useful for serializing blockchain data that contains BigInt values
 */
export function convertBigIntToString(value: any): any {
  if (typeof value === "bigint") {
    return value.toString()
  }

  if (Array.isArray(value)) {
    return value.map(convertBigIntToString)
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, any> = {}
    for (const key in value) {
      result[key] = convertBigIntToString(value[key])
    }
    return result
  }

  return value
}

/**
 * Validates a blockchain event to ensure it has all required fields
 */
export function validateBlockchainEvent(event: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!event.transaction_hash) {
    errors.push("transaction_hash is required")
  }

  if (!event.block_number) {
    errors.push("block_number is required")
  }

  if (!event.event_name) {
    errors.push("event_name is required")
  }

  if (!event.contract_name) {
    errors.push("contract_name is required")
  }

  if (!event.contract_address) {
    errors.push("contract_address is required")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Determines the event type based on the event name
 */
export function determineEventType(eventName: string): string {
  if (eventName.includes("PhieuBau") || eventName.includes("PhieuDaBo") || eventName.includes("PhieuBauDaGhiNhan")) {
    return "vote"
  }

  if (eventName.includes("PhienBauCu") || eventName.includes("TaiBauCu") || eventName.includes("HoaPhieu")) {
    return "session"
  }

  if (eventName.includes("UngVien") || eventName.includes("CuTri")) {
    return "candidate"
  }

  if (
    eventName.includes("CuocBauCu") ||
    eventName.includes("Server") ||
    eventName.includes("HeThong") ||
    eventName.includes("VaiTro") ||
    eventName.includes("BaoCao")
  ) {
    return "system"
  }

  if (
    eventName.includes("Transfer") ||
    eventName.includes("Approval") ||
    eventName.includes("HLU") ||
    eventName.includes("Token") ||
    eventName.includes("NFT")
  ) {
    return "token"
  }

  return "other"
}

/**
 * Format event name for display
 */
export function formatEventName(name: string): string {
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

    // Default
    Transfer: "Chuyển token",
    Approval: "Phê duyệt",
  }

  return eventNameMap[name] || name
}
