
import { ComingSoon } from '@/components/ComingSoon';

export const metadata = {
  title: 'Communities - Coming Soon',
  description: 'Advanced community features with template marketplace, bot ecosystem, and developer extensibility are being built',
};

export default function CommunitiesPage() {
  return (
    <ComingSoon
      title="Community Platform Coming Soon"
      description="We're building a modular, template-driven community platform that combines the simplicity of pre-built templates with the power of fully custom, developer-extendable imports and a bot/plugin ecosystem."
      features={[
        "Template Marketplace - Install pre-built community templates",
        "Drag & Drop Community Customizer",
        "Bot Marketplace with JS/Python SDK",
        "Secure Plugin Runtime & Sandboxing",
        "Custom Import System for Developer Packages",
        "Real-time Chat & Presence",
        "Community Analytics Dashboard", 
        "Role-based Permissions & Moderation Tools",
        "Monetization for Templates & Bots",
        "White-label & Enterprise Features"
      ]}
    />
  );
}
