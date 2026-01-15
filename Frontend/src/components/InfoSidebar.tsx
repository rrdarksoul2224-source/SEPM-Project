import { AlertTriangle, Phone, BookOpen, Shield, FileText, AlertCircle } from "lucide-react";

const InfoSidebar = () => {
  const regulations = [
    "Valid registration certificate (RC) is mandatory",
    "Number plate must be clearly visible",
    "High-security registration plates (HSRP) required",
    "Standard font and color compliance",
    "No alterations or fancy fonts allowed",
  ];

  const violations = [
    { text: "Fake/Forged number plate", severity: "high" },
    { text: "Obscured or dirty plate", severity: "medium" },
    { text: "Non-standard formatting", severity: "medium" },
    { text: "Missing front/rear plate", severity: "high" },
    { text: "Expired registration", severity: "high" },
  ];

  const helplines = [
    { name: "Traffic Police Control Room", number: "100" },
    { name: "ParivahanSewa", number: "+91-120-4925505" },
    { name: "Vehicle Theft Reporting", number: "112" },
    { name: "Cyber Crime Helpline", number: "1930" },
  ];

  return (
    <div className="space-y-6">
      {/* Rules & Regulations */}
      <div className="rounded-2xl gradient-card border border-border/50 p-6 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">Rules & Regulations</h3>
            <p className="text-xs text-muted-foreground">Driving compliance guidelines</p>
          </div>
        </div>
        <ul className="space-y-3">
          {regulations.map((rule, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-medium text-primary">{index + 1}</span>
              </div>
              <span className="text-muted-foreground leading-relaxed">{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Violations */}
      <div className="rounded-2xl gradient-card border border-border/50 p-6 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">Common Violations</h3>
            <p className="text-xs text-muted-foreground">Penalties may apply</p>
          </div>
        </div>
        <ul className="space-y-3">
          {violations.map((violation, index) => (
            <li key={index} className="flex items-center gap-3">
              <AlertCircle
                className={`w-4 h-4 shrink-0 ${
                  violation.severity === "high" ? "text-destructive" : "text-warning"
                }`}
              />
              <span className="text-sm text-muted-foreground">{violation.text}</span>
              <span
                className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  violation.severity === "high"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {violation.severity}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Helpline Numbers */}
      <div className="rounded-2xl gradient-card border border-border/50 p-6 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <Phone className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">Helpline Numbers</h3>
            <p className="text-xs text-muted-foreground">24/7 assistance available</p>
          </div>
        </div>
        <ul className="space-y-3">
          {helplines.map((helpline, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{helpline.name}</span>
              <a
                href={`tel:${helpline.number}`}
                className="text-sm font-mono font-medium text-primary hover:underline"
              >
                {helpline.number}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Info */}
      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="font-heading font-semibold text-foreground text-sm mb-1">
              Powered by AI
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our system uses advanced YOLO object detection and OCR technology for accurate and
              real-time number plate recognition with 99.2% accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSidebar;
