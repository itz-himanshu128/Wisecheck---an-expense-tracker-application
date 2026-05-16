import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import Navbar from "@/components/Navbar";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen relative selection:bg-[var(--accent)] selection:text-white" style={{ background: "var(--bg-primary)" }}>
        {/* Background Gradients */}
        <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-20 pointer-events-none" style={{ background: "var(--accent)" }} />
        <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-10 pointer-events-none" style={{ background: "#4ADE80" }} />
        
        <Navbar />
        <main className="pt-24 pb-20">
          {children}
        </main>
      </div>
    </SmoothScrollProvider>
  );
}
