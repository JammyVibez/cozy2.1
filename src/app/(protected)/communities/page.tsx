import { ComingSoon } from '@/components/ComingSoon';

export const metadata = {
  title: 'Communities - Coming Soon',
  description: 'Advanced community features are being developed',
};

export default function CommunitiesPage() {
  return (
    <ComingSoon
      title="Community Features Coming Soon"
      description="We're building amazing community features that will transform how you connect and collaborate with others who share your interests."
      features={[
        "Real-time Community Chat Rooms",
        "Advanced Community Moderation Tools", 
        "Community Events & Scheduling",
        "File Sharing & Media Galleries",
        "Voice & Video Chat Integration",
        "Custom Community Themes",
        "Community Analytics Dashboard",
        "Cross-Platform Notifications"
      ]}
    />
  );
}