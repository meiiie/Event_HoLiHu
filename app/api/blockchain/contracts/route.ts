import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

// Lấy danh sách các cấu hình hợp đồng
export async function GET() {
  try {
    const { data, error } = await supabase.from("contract_configs").select("*").order("id", { ascending: true })

    if (error) {
      console.error("Error fetching contract configs:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error fetching contract configs:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định" },
      { status: 500 }
    )
  }
}

// Tạo hoặc cập nhật nhiều cấu hình hợp đồng
export async function PUT(request: NextRequest) {
  try {
    const configs = await request.json()

    if (!Array.isArray(configs)) {
      return NextResponse.json({ error: "Dữ liệu phải là mảng các cấu hình hợp đồng" }, { status: 400 })
    }

    // Xóa ID nếu có để tránh lỗi khi upsert
    const preparedConfigs = configs.map(({ id, ...config }) => config)

    // Chú ý: thêm xử lý tùy chỉnh cho phù hợp với schema của bạn nếu cần
    const { data, error } = await supabase.from("contract_configs").upsert(preparedConfigs, {
      onConflict: "contract_name",
      ignoreDuplicates: false,
    })

    if (error) {
      console.error("Error upserting contract configs:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fetch lại dữ liệu
    const { data: updatedData, error: fetchError } = await supabase
      .from("contract_configs")
      .select("*")
      .order("id", { ascending: true })

    if (fetchError) {
      console.error("Error fetching updated contract configs:", fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    return NextResponse.json(updatedData)
  } catch (error) {
    console.error("Unexpected error upserting contract configs:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định" },
      { status: 500 }
    )
  }
}

// Cập nhật một cấu hình hợp đồng cụ thể
export async function POST(request: NextRequest) {
  try {
    const config = await request.json()

    if (!config.contract_name) {
      return NextResponse.json({ error: "contract_name là bắt buộc" }, { status: 400 })
    }

    // Xóa ID nếu có để tránh lỗi khi upsert
    const { id, ...preparedConfig } = config

    const { data, error } = await supabase
      .from("contract_configs")
      .upsert(preparedConfig, {
        onConflict: "contract_name",
        ignoreDuplicates: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error updating contract config:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error updating contract config:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định" },
      { status: 500 }
    )
  }
}
