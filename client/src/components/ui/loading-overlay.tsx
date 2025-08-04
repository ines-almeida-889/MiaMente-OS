import { Progress } from "@/components/ui/progress";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
}

export function LoadingOverlay({ 
  isVisible, 
  message = "Processing...", 
  progress = 0 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Processing Request</h3>
          <p className="text-sm text-slate-600 mb-4">{message}</p>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-slate-600">{Math.round(progress)}% complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}
