import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Define the valid event types
 */
export type EventType = "vote" | "session" | "candidate" | "election" | "token" | "system" | "operation" | "paymaster" | "creation" | "other";

/**
 * Interface defining the structure of a blockchain event
 */
export interface BlockchainEvent {
  event_id?: string;
  transaction_hash?: string;
  block_number: number;
  event_name: string;
  contract_name: string;
  contract_address: string;
  timestamp?: number;
  data?: Record<string, any>;
  event_type: EventType;
}

/**
 * Combines class names using clsx and twMerge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts BigInt values in an object to string to make them serializable
 */
export function convertBigIntToString(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }

  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = convertBigIntToString(obj[key]);
      }
    }
    return result;
  }

  return obj;
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
 * Determines the type category of an event based on its name
 */
export function determineEventType(eventName: string): EventType {
  const lowerCaseName = eventName.toLowerCase();
  
  // EntryPoint contract events
  if (lowerCaseName.includes('thaotuoc') || lowerCaseName.includes('thucthi')) {
    return "operation";
  }
  
  if (lowerCaseName.includes('paymaster')) {
    return "paymaster";
  }
  
  if (lowerCaseName.includes('tao') && lowerCaseName.includes('nguoigui')) {
    return "creation";
  }
  
  // Original event types
  if (lowerCaseName.includes('vote') || lowerCaseName.includes('ballot') || lowerCaseName.includes('phieubau')) {
    return "vote";
  }
  
  if (lowerCaseName.includes('session') || lowerCaseName.includes('phien')) {
    return "session";
  }
  
  if (lowerCaseName.includes('candidate') || lowerCaseName.includes('ungvien')) {
    return "candidate";
  }

  if (lowerCaseName.includes('election') || lowerCaseName.includes('cuocbaucu')) {
    return "election";
  }
  
  if (lowerCaseName.includes('token') || lowerCaseName.includes('transfer') || lowerCaseName.includes('approval')) {
    return "token";
  }
  
  if (lowerCaseName.includes('system') || lowerCaseName.includes('hethong')) {
    return "system";
  }
  
  // If no specific category is found
  return "other";
}

/**
 * Format event name for display
 */
export function formatEventName(eventName: string): string {
  // Remove common prefixes if present
  let formattedName = eventName.replace(/^event/i, "").trim();
  
  // Add spaces before capital letters and numbers
  formattedName = formattedName.replace(/([A-Z])/g, " $1").trim();
  
  // Capitalize first letter
  formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
  
  // Special case for EntryPoint contract event names (translate from Vietnamese)
  const translations: Record<string, string> = {
    "Thao Tac Nguoi Dung Duoc Thuc Thi": "User Operation Executed",
    "Paymaster Them Vao Trang Danh Sach": "Paymaster Whitelisted",
    "Thuc Thi Thao Tac": "Operation Executed",
    "Post Op That Bai": "Post Operation Failed",
    "Paymaster Xac Thuc Thanh Cong": "Paymaster Validation Successful",
    "Tao Nguoi Gui Thanh Cong": "Sender Creation Successful"
  };
  
  if (translations[formattedName]) {
    return translations[formattedName];
  }
  
  return formattedName;
}

/**
 * Format relative time for display
 */
export function formatTimeAgo(timestamp: number): string {
  if (!timestamp) return 'Never';
  
  const now = Date.now();
  const secondsAgo = Math.floor((now - timestamp) / 1000);
  
  if (secondsAgo < 60) {
    return `${secondsAgo} giây trước`;
  }
  
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} phút trước`;
  }
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} giờ trước`;
  }
  
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) {
    return `${daysAgo} ngày trước`;
  }
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('vi-VN');
}

/**
 * SEO-friendly URL slug generator
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Generate structured data for SEO
 */
export function generateEventStructuredData(event: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    'name': formatEventName(event.event_name),
    'startDate': new Date(event.timestamp).toISOString(),
    'location': {
      '@type': 'VirtualLocation',
      'url': `https://explorer.holihu.online/tx/${event.transaction_hash}`
    },
    'organizer': {
      '@type': 'Organization',
      'name': 'HoLiHu Blockchain',
      'url': 'https://holihu.online'
    },
    'description': `Blockchain event ${event.event_name} from contract ${event.contract_name}`
  }
}
