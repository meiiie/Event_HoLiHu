import React from 'react'
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

export function Section({
  children,
  className,
  id
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={cn("py-12", className)}>
      {children}
    </section>
  );
}

export function HeroSection({
  title,
  description,
  children,
  className
}: {
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <Section className={cn("py-12 md:py-24 lg:py-32 flex flex-col items-center text-center space-y-10", className)}>
      <div className="mx-auto max-w-[800px] space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          {title}
        </h1>
        
        {description && (
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
            {description}
          </p>
        )}
        
        {children}
      </div>
    </Section>
  );
}

export function GridSection({
  title,
  description,
  children,
  columns = 3,
  className
}: {
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}) {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };
  
  return (
    <Section className={className}>
      <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>
      
      {description && (
        <p className="text-center text-muted-foreground max-w-[700px] mx-auto mb-12">
          {description}
        </p>
      )}
      
      <div className={cn("grid gap-6", colsClass[columns])}>
        {children}
      </div>
    </Section>
  );
}

export function GradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export function FeatureCard({ 
  icon, 
  title, 
  description,
  footer
}: { 
  icon: React.ReactNode
  title: string
  description: string
  footer?: React.ReactNode
}) {
  return (
    <div className="blockchain-card hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      <div className="flex-1">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {footer && <div className="mt-4 pt-4 border-t">{footer}</div>}
    </div>
  );
}
