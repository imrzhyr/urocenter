import { cn } from "@/lib/utils";

interface RootLayoutProps {
  children: React.ReactNode;
  className?: string;
  allowScroll?: boolean;
}

export const RootLayout = ({
  children,
  className,
  allowScroll = false,
}: RootLayoutProps) => {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col",
        allowScroll ? "scrollable" : "overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}; 