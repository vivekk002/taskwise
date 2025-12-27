import { CheckCircle2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/20 via-background to-background" />
      </div>

      <div className="relative flex flex-col items-center gap-4 animate-pulse-subtle">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 ring-1 ring-primary/20">
          <CheckCircle2 className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Taskwise
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Loading your workspace...
          </p>
        </div>
      </div>
    </div>
  );
}
