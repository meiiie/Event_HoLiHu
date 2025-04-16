// Thêm component bao bọc với styles phù hợp
import '../styles/main.css'
import { cn } from '@/lib/utils'

export function PageContainer({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn("container mx-auto px-4 py-12", className)}>
      {children}
    </div>
  );
}
