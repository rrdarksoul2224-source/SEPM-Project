import { Scan, Zap, Shield, Eye, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import FileUploadZone from "@/components/FileUploadZone";
import InfoSidebar from "@/components/InfoSidebar";
import Footer from "@/components/Footer";

const Index = () => {
  const features = [
    { icon: Zap, text: "Real-time Detection", desc: "Instant results" },
    { icon: Shield, text: "99.2% Accuracy", desc: "AI-powered" },
    { icon: Eye, text: "Multi-format", desc: "Image & Video" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <main id="home" className="pt-20 lg:pt-24">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 relative">
          {/* Top Badge */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20">
              <Scan className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">YOLO + OCR Technology</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12" id="details">
            {/* Left Section - Detection Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* Hero Heading */}
              <div className="space-y-4 animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
                <h1 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span className="text-foreground">Vehicle</span>{" "}
                  <span className="text-primary">Number Plate</span>
                  <br />
                  <span className="text-foreground">Detector</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Advanced AI-powered automatic number plate recognition system for traffic management, security, and law enforcement.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{feature.text}</p>
                      <p className="text-[10px] text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* File Upload Zone */}
              <div className="animate-slide-in-left" style={{ animationDelay: "0.3s" }}>
                <FileUploadZone />
              </div>

              {/* Stats Bar */}
              <div
                className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50 animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-heading font-bold text-foreground">1M+</p>
                  <p className="text-xs text-muted-foreground">Plates Detected</p>
                </div>
                <div className="text-center border-x border-border/50">
                  <p className="text-2xl lg:text-3xl font-heading font-bold text-primary">0.3s</p>
                  <p className="text-xs text-muted-foreground">Avg. Response</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-heading font-bold text-foreground">50+</p>
                  <p className="text-xs text-muted-foreground">Countries</p>
                </div>
              </div>
            </div>

            {/* Right Section - Info Sidebar */}
            <div className="lg:col-span-2 animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
              <InfoSidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
