"use client";

interface RobotAssistantTriggerProps {
  open: boolean;
  showGreeting: boolean;
  onClick: () => void;
}

export function RobotAssistantTrigger({ open, showGreeting, onClick }: RobotAssistantTriggerProps) {
  return (
    <div className="pointer-events-auto relative group">
      {showGreeting && (
        <div className="mb-3 max-w-[270px] rounded-2xl border border-cyan-100 bg-white px-4 py-2 text-sm text-slate-700 shadow-[0_14px_38px_-20px_rgba(15,23,42,0.45)] transition-all duration-500 animate-[robotGreetingFloat_2.8s_ease-in-out_infinite]">
          👋 Hello! Need help with doctors, appointments, or symptoms?
        </div>
      )}

      <button
        type="button"
        onClick={onClick}
        aria-label={open ? "Close chatbot" : "Open chatbot"}
        className="relative inline-flex h-16 w-16 touch-manipulation items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e,#0ea5e9_58%,#2563eb)] text-3xl shadow-[0_18px_45px_-16px_rgba(37,99,235,0.65)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 animate-[robotPulse_2.4s_ease-in-out_infinite]"
      >
        {!open && <span className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />}
        <span className="relative" role="img" aria-label="Robot assistant">
          🤖
        </span>
      </button>

      {!open && (
        <span className="pointer-events-none absolute -top-2 -left-2 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 shadow-sm">
          🏥 AI
        </span>
      )}

      <style jsx>{`
        @keyframes robotPulse {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-2px) scale(1.02);
          }
        }

        @keyframes robotGreetingFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
}
