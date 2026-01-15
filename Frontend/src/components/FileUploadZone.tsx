import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, FolderOpen, Camera, Image, X, FileVideo, CheckCircle2, Car, Bike, Truck, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface DetectionResult {
  id: string;
  fileName: string;
  plateNumber: string;
  confidence: number;
  timestamp: Date;
  vehicleType?: string;
}

const FileUploadZone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraError("Unable to access camera. Please grant permission.");
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to use live detection.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const handleLiveDetection = () => {
    startCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  }, []);

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startDetection = async () => {
  if (uploadedFiles.length === 0) return;

  setIsDetecting(true);

  const results: DetectionResult[] = [];

  for (const file of uploadedFiles) {
    const formData = new FormData();
    formData.append("file", file);

    const isVideo = file.type.startsWith("video/");
    const endpoint = isVideo
      ? "http://127.0.0.1:5000/api/detect-video"
      : "http://127.0.0.1:5000/api/detect-image";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.ok) {
        if (isVideo) {
          data.plates.forEach((plate: string) => {
            results.push({
              id: crypto.randomUUID(),
              fileName: file.name,
              plateNumber: plate,
              confidence: 90,
              timestamp: new Date(),
              vehicleType: "Car",
            });
          });
        } else {
          data.plates.forEach((p: any) => {
            results.push({
              id: crypto.randomUUID(),
              fileName: file.name,
              plateNumber: p.plate_number,
              confidence: p.confidence,
              timestamp: new Date(),
              vehicleType: "Car",
            });
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Detection Failed",
        description: "Backend not responding",
        variant: "destructive",
      });
    }
  }

  setDetectionResults(prev => [...results, ...prev]);
  setUploadedFiles([]);
  setIsDetecting(false);

  toast({
    title: "Detection Complete",
    description: `${results.length} plate(s) detected`,
  });
};


  return (
    <div className="space-y-6">
      {/* Main Upload Zone */}
      <div
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border/60 hover:border-primary/50 bg-card/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Animated scan line */}
        {isDragging && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
          </div>
        )}

        <div className="p-8 lg:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-6 relative">
            <Upload className={`w-8 h-8 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
            {isDragging && (
              <div className="absolute inset-0 rounded-2xl border-2 border-primary animate-pulse-glow" />
            )}
          </div>

          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
            {isDragging ? "Drop your files here" : "Drag & Drop Files"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
            Upload images or videos of vehicle number plates for instant detection and recognition
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <label>
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*"
                multiple
                onChange={handleFileInput}
              />
              <Button variant="outline" className="cursor-pointer border-border/60 hover:border-primary hover:bg-primary/5" asChild>
                <span>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Browse Files
                </span>
              </Button>
            </label>
            <span className="text-xs text-muted-foreground">or</span>
            <label>
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*"
                multiple
                onChange={handleFileInput}
                // @ts-ignore
                capture="environment"
              />
              <Button variant="outline" className="cursor-pointer border-border/60 hover:border-primary hover:bg-primary/5" asChild>
                <span>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Select Folder
                </span>
              </Button>
            </label>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Supports: JPG, PNG, WEBP, MP4, MOV • Max 50MB
          </p>
        </div>
      </div>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Uploaded Files ({uploadedFiles.length})</h4>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-destructive"
              onClick={() => setUploadedFiles([])}
            >
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="relative group rounded-xl bg-secondary/50 border border-border/50 p-3 animate-scale-in"
              >
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center shrink-0">
                    {file.type.startsWith("video/") ? (
                      <FileVideo className="w-5 h-5 text-primary" />
                    ) : (
                      <Image className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Camera Dialog */}
      <Dialog open={isCameraOpen} onOpenChange={(open) => !open && stopCamera()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Live Detection
            </DialogTitle>
          </DialogHeader>
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <p className="text-destructive text-sm">{cameraError}</p>
              </div>
            )}
            {/* Scanning overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
              <div className="absolute inset-4 border-2 border-primary/30 rounded-lg" />
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Point camera at vehicle number plate</p>
            <Button variant="destructive" size="sm" onClick={stopCamera}>
              Stop Camera
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          className="flex-1 gradient-primary text-primary-foreground font-medium h-12 shadow-glow hover:opacity-90 transition-opacity"
          onClick={handleLiveDetection}
        >
          <Camera className="w-5 h-5 mr-2" />
          Live Detection
        </Button>
        <label className="flex-1">
          <input
            type="file"
            className="hidden"
            accept="image/*,video/*"
            multiple
            onChange={handleFileInput}
          />
          <Button variant="outline" className="w-full h-12 border-primary/30 hover:bg-primary/5 cursor-pointer" asChild>
            <span>
              <Upload className="w-5 h-5 mr-2" />
              Upload Files
            </span>
          </Button>
        </label>
        <Button 
          className="flex-1 h-12 bg-success hover:bg-success/90 text-success-foreground font-medium"
          disabled={uploadedFiles.length === 0 || isDetecting}
          onClick={startDetection}
        >
          {isDetecting ? (
            <>
              <div className="w-5 h-5 mr-2 border-2 border-success-foreground/30 border-t-success-foreground rounded-full animate-spin" />
              Detecting...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Start Detection
            </>
          )}
        </Button>
      </div>

      {/* Detection Status */}
      {uploadedFiles.length > 0 && detectionResults.length === 0 && (
        <div className="rounded-xl bg-success/10 border border-success/30 p-4 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
          <div>
            <p className="text-sm font-medium text-success">Ready for Detection</p>
            <p className="text-xs text-muted-foreground">
              {uploadedFiles.length} file(s) uploaded. Click "Start Detection" to process.
            </p>
          </div>
        </div>
      )}

      {/* Detection Results Section */}
      {detectionResults.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Detection Results ({detectionResults.length})
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  const csv = detectionResults.map(r => `${r.plateNumber},${r.vehicleType},${r.confidence}%,${r.fileName}`).join('\n');
                  navigator.clipboard.writeText(`Plate Number,Vehicle Type,Confidence,File\n${csv}`);
                  toast({ title: "Copied!", description: "Results copied to clipboard" });
                }}
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-destructive"
                onClick={() => setDetectionResults([])}
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {detectionResults.map((result) => (
              <div
                key={result.id}
                className="rounded-xl bg-card border border-border/50 p-4 hover:border-primary/30 transition-colors animate-scale-in"
              >
                <div className="flex items-center gap-4">
                  {/* Vehicle Icon */}
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    {result.vehicleType === "Car" && <Car className="w-6 h-6 text-primary" />}
                    {result.vehicleType === "Bike" && <Bike className="w-6 h-6 text-primary" />}
                    {result.vehicleType === "Truck" && <Truck className="w-6 h-6 text-primary" />}
                  </div>

                  {/* Plate Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-xl text-foreground tracking-wider">
                        {result.plateNumber}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(result.plateNumber);
                          toast({ title: "Copied!", description: result.plateNumber });
                        }}
                        className="p-1 rounded hover:bg-secondary transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Image className="w-3 h-3" />
                        {result.fileName}
                      </span>
                      <span>•</span>
                      <span>{result.vehicleType}</span>
                    </div>
                  </div>

                  {/* Confidence Badge */}
                  <div className="text-right shrink-0">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      result.confidence >= 95 
                        ? 'bg-success/20 text-success' 
                        : result.confidence >= 85 
                        ? 'bg-warning/20 text-warning' 
                        : 'bg-destructive/20 text-destructive'
                    }`}>
                      {result.confidence}% match
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {result.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
