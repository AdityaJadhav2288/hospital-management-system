import { PublicShell } from "@/components/public/public-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Lightbulb, Shield, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <PublicShell>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Manrope:wght@600;700;800&display=swap');

        :root {
          --primary: #0369a1;
          --primary-light: #06b6d4;
          --accent: #f59e0b;
          --dark: #0f172a;
          --light: #f8fafc;
        }

        * {
          font-family: 'Sora', sans-serif;
        }

        .modern-card {
          background: white;
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
          animation: fadeInUp 0.6s ease-out backwards;
          overflow: hidden;
        }

        .modern-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(3, 105, 161, 0.1);
        }

        .feature-grid > .modern-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-grid > .modern-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-grid > .modern-card:nth-child(3) { animation-delay: 0.3s; }
        .feature-grid > .modern-card:nth-child(4) { animation-delay: 0.4s; }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          border-radius: 12px;
          color: white;
          margin-bottom: 12px;
          transition: transform 0.3s ease;
        }

        .modern-card:hover .icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }

        .card-header {
          background: linear-gradient(135deg, rgba(3, 105, 161, 0.02) 0%, rgba(6, 182, 212, 0.02) 100%);
          border-bottom: 1px solid rgba(3, 105, 161, 0.1);
        }

        .card-title {
          font-family: 'Manrope', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--dark);
          letter-spacing: -0.5px;
        }

        .card-content {
          color: #64748b;
          line-height: 1.7;
          font-weight: 400;
        }

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

        .section-title {
          font-family: 'Manrope', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -1px;
          margin-bottom: 1rem;
        }

        .divider {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, var(--accent) 0%, var(--primary-light) 100%);
          border-radius: 2px;
          margin-bottom: 2rem;
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
          margin: 3rem 0;
        }

        .stat-item {
          text-align: center;
          animation: fadeInUp 0.6s ease-out backwards;
        }

        .stat-item:nth-child(1) { animation-delay: 0.2s; }
        .stat-item:nth-child(2) { animation-delay: 0.3s; }
        .stat-item:nth-child(3) { animation-delay: 0.4s; }

        .stat-number {
          font-family: 'Manrope', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          font-weight: 500;
        }

        .badge {
          display: inline-block;
          padding: 0.5rem 1.25rem;
          background: linear-gradient(135deg, rgba(3, 105, 161, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
          border: 1px solid rgba(3, 105, 161, 0.2);
          border-radius: 100px;
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 1rem;
          animation: fadeInUp 0.6s ease-out;
        }

        .story-section {
          background: linear-gradient(135deg, rgba(3, 105, 161, 0.02) 0%, rgba(6, 182, 212, 0.02) 100%);
          border: 1px solid rgba(3, 105, 161, 0.1);
          border-radius: 16px;
          padding: 2.5rem;
          animation: fadeInUp 0.6s ease-out 0.1s backwards;
        }

        .story-section p {
          color: #334155;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .accent-text {
          color: var(--primary);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 1.5rem;
          }

          .stats-container {
            grid-template-columns: repeat(1, 1fr);
            gap: 2rem;
          }

          .story-section {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Minimal Professional Header */}
        <div className="border-b border-slate-200 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl py-12">
            <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
              MediCore Hospital
            </h1>
            <p className="mt-2 text-slate-600">About our organization</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Our Story Section */}
          <div className="mb-20">
            <div className="mb-8">
              <span className="badge">Our Heritage</span>
              <h2 className="section-title">Our Story</h2>
              <div className="divider"></div>
            </div>
            <div className="story-section">
              <p>
                What started as a modest <span className="accent-text">30-bed emergency center</span> has blossomed into a comprehensive <span className="accent-text">multidisciplinary tertiary care hospital</span>. Our journey reflects our unwavering dedication to serving both urban and rural communities with the same level of excellence and compassion.
              </p>
              <p className="mt-4">
                Today, CityCare stands as a beacon of healthcare innovation, merging cutting-edge medical technology with human-centered care to create an environment where healing truly happens.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-20">
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Healthcare Professionals</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100K+</div>
                <div className="stat-label">Patients Served Annually</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Emergency Services</div>
              </div>
            </div>
          </div>

          {/* Mission & Vision Section */}
          <div className="mb-20">
            <div className="mb-8">
              <span className="badge">Core Values</span>
              <h2 className="section-title">Our Foundation</h2>
              <div className="divider"></div>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="modern-card">
                <CardHeader className="card-header">
                  <div className="icon-wrapper">
                    <Heart size={28} />
                  </div>
                  <CardTitle className="card-title">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 card-content">
                  Deliver <span className="accent-text">safe, ethical, evidence-driven healthcare</span> with dignified patient experience. We prioritize compassionate care that respects the unique needs of every individual who walks through our doors.
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="card-header">
                  <div className="icon-wrapper" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)' }}>
                    <Lightbulb size={28} />
                  </div>
                  <CardTitle className="card-title">Our Vision</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 card-content">
                  Become the <span className="accent-text">most trusted digital-first hospital network</span> in India. We envision a future where technology enhances care, accessibility is universal, and every patient receives world-class treatment.
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Infrastructure & Capabilities Section */}
          <div className="mb-20">
            <div className="mb-8">
              <span className="badge">Excellence & Standards</span>
              <h2 className="section-title">World-Class Infrastructure</h2>
              <div className="divider"></div>
            </div>
            <div className="feature-grid grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              <Card className="modern-card">
                <CardHeader className="card-header">
                  <div className="icon-wrapper" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' }}>
                    <Zap size={28} />
                  </div>
                  <CardTitle className="card-title">Advanced Facilities</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 card-content">
                  State-of-the-art <span className="accent-text">modular operation theaters</span>, high-resolution <span className="accent-text">MRI and CT diagnostics</span>, and fully equipped 24/7 emergency response systems designed for optimal patient outcomes.
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="card-header">
                  <div className="icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' }}>
                    <Shield size={28} />
                  </div>
                  <CardTitle className="card-title">Quality & Safety</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 card-content">
                  <span className="accent-text">NABH-ready</span> quality frameworks, rigorous infection control protocols, and continuous compliance monitoring ensure the highest standards of patient safety and care excellence.
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Features Section */}
          <div>
            <div className="mb-8">
              <span className="badge">Why Choose Us</span>
              <h2 className="section-title">Innovation & Compassion</h2>
              <div className="divider"></div>
            </div>
            <div className="feature-grid grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              <Card className="modern-card">
                <CardHeader className="card-header">
                  <CardTitle className="card-title">Digital-First Approach</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 card-content">
                  Seamlessly integrated digital systems for telemedicine, online consultations, and real-time patient monitoring that brings healthcare to your doorstep.
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="card-header">
                  <CardTitle className="card-title">Community Focus</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 card-content">
                  Dedicated outreach programs serving both urban and rural communities, with a commitment to accessible, equitable healthcare for all.
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="card-header">
                  <CardTitle className="card-title">Expert Team</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 card-content">
                  500+ highly trained healthcare professionals with specialized expertise, continuous professional development, and a patient-centric philosophy.
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="card-header">
                  <CardTitle className="card-title">Holistic Care</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 card-content">
                  Beyond treatment—we focus on prevention, wellness, and recovery, supporting your journey to optimal health with comprehensive care pathways.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}