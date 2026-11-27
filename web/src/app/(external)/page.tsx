import { ArchitectureSection } from "@/components/landing/architecture-section";
import { CapabilitiesGrid } from "@/components/landing/capabilities-grid";
import { DeploySection } from "@/components/landing/deploy-section";
import { HeroSection } from "@/components/landing/hero-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <CapabilitiesGrid />
        <ArchitectureSection />
        <DeploySection />
      </main>
      <SiteFooter />
    </div>
  );
}
