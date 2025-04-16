import React from "react";
import { Separator } from "@/components/ui/separator";

interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageTitle({ title, description, className = "" }: PageTitleProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-1">{description}</p>
      )}
      <Separator className="my-4" />
    </div>
  );
}