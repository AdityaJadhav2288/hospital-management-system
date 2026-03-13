"use client";

import { useState } from "react";
import { Activity, Ambulance, Brain, HeartPulse, Microscope, Stethoscope, ArrowRight, Sparkles } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";

interface Service {
  name: string;
  description: string;
  icon: React.ComponentType<{ size: number }>;
  category: "Emergency" | "Specialist" | "Diagnostic";
  fullDescription: string;
  features: string[];
}

const services: Service[] = [
  {
    name: "Cardiology",
    description: "Comprehensive cardiac diagnostics, interventions, and rehabilitation programs.",
    category: "Specialist",
    icon: HeartPulse,
    fullDescription: "Advanced cardiac care with state-of-the-art catheterization labs and rehabilitation services.",
    features: ["ECG & Stress Testing", "Cardiac Catheterization", "Heart Failure Management", "Rehabilitation Programs"],
  },
  {
    name: "Neurology",
    description: "Advanced neurological evaluation and treatment for stroke and neuro disorders.",
    category: "Specialist",
    icon: Brain,
    fullDescription: "Specialized neurological care with rapid stroke response and advanced diagnostic capabilities.",
    features: ["Stroke Management", "EEG & Neuro Monitoring", "Epilepsy Care", "Movement Disorders"],
  },
  {
    name: "Emergency Care",
    description: "24x7 rapid-response emergency, trauma support, and critical stabilization.",
    category: "Emergency",
    icon: Ambulance,
    fullDescription: "Round-the-clock emergency response with trauma-ready facilities and specialized protocols.",
    features: ["24/7 Rapid Response", "Trauma Management", "Acute Care", "Poison Control"],
  },
  {
    name: "General Medicine",
    description: "Preventive and curative care for acute and chronic health conditions.",
    category: "Specialist",
    icon: Stethoscope,
    fullDescription: "Comprehensive medical care addressing acute and chronic health management needs.",
    features: ["Preventive Care", "Chronic Disease Management", "Wellness Programs", "Health Screening"],
  },
  {
    name: "Diagnostics",
    description: "High-accuracy pathology, imaging, and preventive screening services.",
    category: "Diagnostic",
    icon: Microscope,
    fullDescription: "Advanced diagnostic services with precision pathology and multi-modality imaging.",
    features: ["CT & MRI Imaging", "Ultrasound", "Pathology Labs", "Genetic Testing"],
  },
  {
    name: "ICU & Critical Care",
    description: "Continuous specialist monitoring for high-dependency and critical patients.",
    category: "Emergency",
    icon: Activity,
    fullDescription: "Advanced intensive care with 24/7 specialist monitoring and life support systems.",
    features: ["Mechanical Ventilation", "ECMO Support", "Continuous Monitoring", "Specialist Care"],
  },
];

const categoryColors: Record<string, { bg: string; accent: string; gradient: string }> = {
  Emergency: {
    bg: "from-red-50 to-rose-50",
    accent: "text-red-600",
    gradient: "from-red-500 to-rose-500",
  },
  Specialist: {
    bg: "from-blue-50 to-cyan-50",
    accent: "text-blue-600",
    gradient: "from-blue-500 to-cyan-500",
  },
  Diagnostic: {
    bg: "from-purple-50 to-indigo-50",
    accent: "text-purple-600",
    gradient: "from-purple-500 to-indigo-500",
  },
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = categoryColors[service.category];
  const Icon = service.icon;

  return (
    <div
      className="group h-full"
      style={{
        animation: `fadeInUp 0.6s ease-out backwards`,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .service-card {
          background: white;
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .service-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1);
          border-color: currentColor;
        }

        .service-card:hover::before {
          opacity: 1;
        }

        .service-card:hover .icon-wrapper {
          transform: scale(1.15) rotate(-5deg);
        }

        .service-card:hover .arrow-icon {
          transform: translateX(6px) scale(1.1);
        }

        .icon-wrapper {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
          color: white;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }

        .category-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: var(--category-bg);
          border: 1px solid var(--category-border);
        }

        .card-title {
          font-family: 'Manrope', 'Segoe UI', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #0f172a;
        }

        .card-description {
          color: #64748b;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .arrow-icon {
          transition: all 0.3s ease;
        }

        .expanded-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
          opacity: 0;
        }

        .service-card.expanded .expanded-content {
          max-height: 200px;
          opacity: 1;
        }

        .feature-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .feature-item {
          font-size: 0.825rem;
          padding: 6px 12px;
          background: rgba(0,0,0,0.03);
          border-radius: 12px;
          color: #475569;
          border: 1px solid rgba(0,0,0,0.05);
        }
      `}</style>

      <div
        className={`service-card ${isExpanded ? "expanded" : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
        style={
          {
            "--gradient-start": `var(--${service.category.toLowerCase()}-start)`,
            "--gradient-end": `var(--${service.category.toLowerCase()}-end)`,
            "--category-bg": `${
              service.category === "Emergency"
                ? "rgba(239, 68, 68, 0.1)"
                : service.category === "Specialist"
                  ? "rgba(59, 130, 246, 0.1)"
                  : "rgba(147, 51, 234, 0.1)"
            }`,
            "--category-border": `${
              service.category === "Emergency"
                ? "rgba(239, 68, 68, 0.3)"
                : service.category === "Specialist"
                  ? "rgba(59, 130, 246, 0.3)"
                  : "rgba(147, 51, 234, 0.3)"
            }`,
            "--emergency-start": "#ef4444",
            "--emergency-end": "#f43f5e",
            "--specialist-start": "#3b82f6",
            "--specialist-end": "#06b6d4",
            "--diagnostic-start": "#9333ea",
            "--diagnostic-end": "#6366f1",
          } as React.CSSProperties
        }
      >
        <div className="p-6 flex flex-col flex-grow">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="icon-wrapper">
                <Icon size={32} />
              </div>
              <span
                className={`category-badge ${
                  service.category === "Emergency"
                    ? "text-red-600"
                    : service.category === "Specialist"
                      ? "text-blue-600"
                      : "text-purple-600"
                }`}
              >
                {service.category}
              </span>
            </div>

            <h3 className="card-title mb-2">{service.name}</h3>
            <p className="card-description">{service.description}</p>
          </div>

          {/* Expanded Content */}
          <div className="expanded-content mt-auto">
            <div className="mb-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-3">{service.fullDescription}</p>
              <div className="feature-list">
                {service.features.map((feature) => (
                  <span key={feature} className="feature-item">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`mt-6 flex items-center ${colors.accent} font-semibold text-sm group-hover:gap-3 transition-all`}>
            <span>Learn More</span>
            <ArrowRight size={16} className="arrow-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : services;

  const categories = ["Emergency", "Specialist", "Diagnostic"];

  return (
    <PublicShell>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Sora:wght@400;500;600&display=swap');

        :root {
          --primary: #0369a1;
          --primary-light: #06b6d4;
          --accent: #f59e0b;
        }

        * {
          font-family: 'Sora', sans-serif;
        }

        .section-title {
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          letter-spacing: -1px;
          color: #0f172a;
        }

        .divider {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #06b6d4 0%, #0369a1 100%);
          border-radius: 2px;
        }

        .category-filter {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-start;
        }

        .filter-button {
          padding: 10px 20px;
          border-radius: 12px;
          border: 2px solid transparent;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        .filter-button.inactive {
          background: #f1f5f9;
          color: #64748b;
          border-color: #e2e8f0;
        }

        .filter-button.inactive:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }

        .filter-button.active {
          color: white;
        }

        .filter-button.active.emergency {
          background: linear-gradient(135deg, #ef4444, #f43f5e);
          border-color: #ef4444;
        }

        .filter-button.active.specialist {
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          border-color: #3b82f6;
        }

        .filter-button.active.diagnostic {
          background: linear-gradient(135deg, #9333ea, #6366f1);
          border-color: #9333ea;
        }

        .services-grid {
          display: grid;
          gap: 28px;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        }

        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .hero-gradient {
            padding: 40px 20px;
          }
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          {/* Section Header */}
          <div className="text-left mb-16 max-w-3xl">
            <span className="text-sm font-semibold text-cyan-600 uppercase tracking-widest">Medical Services</span>
            <h2 className="section-title mb-4 text-4xl sm:text-5xl">
              Comprehensive Care
            </h2>
            <div className="divider"></div>
            <p className="text-gray-600 text-lg leading-relaxed mt-6">
              Explore our comprehensive range of medical services, each staffed with expert specialists and equipped with cutting-edge technology. From emergency response to specialized treatments, we deliver world-class healthcare across all disciplines.
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-16">
            <p className="text-gray-600 text-sm font-medium uppercase tracking-wider mb-4">Filter by service</p>
            <div className="category-filter">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`filter-button touch-manipulation ${selectedCategory === null ? "active specialist" : "inactive"}`}
              >
                <Sparkles size={14} className="inline mr-2" />
                All Services
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`filter-button touch-manipulation ${
                    selectedCategory === category ? `active ${category.toLowerCase()}` : "inactive"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="services-grid">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service.name} service={service} index={index} />
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-24 text-center max-w-3xl mx-auto">
            <h3
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: "'Manrope', sans-serif", color: "#0f172a" }}
            >
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-10 text-lg">
              Connect with our healthcare professionals to discuss your medical needs and find the right care pathway for you.
            </p>
            
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
