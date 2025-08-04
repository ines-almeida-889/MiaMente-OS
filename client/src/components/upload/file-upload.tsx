import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CloudUpload, FileText, X, Check } from "lucide-react";

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
  childId?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

export function FileUpload({ isOpen, onClose, childId }: FileUploadProps) {
  const [documentType, setDocumentType] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback((files: FileList) => {
    Array.from(files).forEach((file) => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0,
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, progress: Math.min(f.progress + 20, 100) }
              : f
          )
        );
      }, 200);

      // Complete upload after 1 second
      setTimeout(() => {
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'completed', progress: 100 }
              : f
          )
        );
      }, 1000);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = () => {
    // Here you would implement the actual upload logic
    console.log('Uploading files:', uploadedFiles, 'Document type:', documentType);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Upload Medical Documents
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary-400 bg-primary-50' 
                : 'border-slate-300 hover:border-primary-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                <CloudUpload className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-900 mb-2">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-slate-600">
                  Support: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
                </p>
              </div>
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" asChild>
                <Button variant="default" className="cursor-pointer">
                  Choose Files
                </Button>
              </Label>
            </div>
          </div>

          {/* Document Type Selection */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-3 block">
              Document Type
            </Label>
            <RadioGroup value={documentType} onValueChange={setDocumentType}>
              <div className="grid grid-cols-2 gap-3">
                <Label className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                  <RadioGroupItem value="diagnostic" className="mr-3" />
                  <span className="text-sm font-medium text-slate-900">Diagnostic Report</span>
                </Label>
                <Label className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                  <RadioGroupItem value="therapy" className="mr-3" />
                  <span className="text-sm font-medium text-slate-900">Therapy Notes</span>
                </Label>
                <Label className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                  <RadioGroupItem value="medical" className="mr-3" />
                  <span className="text-sm font-medium text-slate-900">Medical Records</span>
                </Label>
                <Label className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                  <RadioGroupItem value="assessment" className="mr-3" />
                  <span className="text-sm font-medium text-slate-900">Assessment Results</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">
                Uploaded Files
              </Label>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{file.name}</p>
                        <p className="text-xs text-slate-600">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.status === 'completed' ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center space-x-1">
                          <Check className="h-3 w-3" />
                          <span>Uploaded</span>
                        </span>
                      ) : (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {file.progress}%
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={uploadedFiles.length === 0 || !documentType}
            >
              Upload Documents
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
