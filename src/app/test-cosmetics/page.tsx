'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';

export default function TestCosmeticsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const seedCosmetics = async () => {
    if (!session?.user?.id) {
      setMessage('Please log in to seed cosmetics');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/cosmetics/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Success! Created ${data.cosmetics.length} sample cosmetics.`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Failed to seed cosmetics');
    } finally {
      setLoading(false);
    }
  };

  const applyCosmetic = async (cosmeticId: string) => {
    if (!session?.user?.id) {
      setMessage('Please log in to apply cosmetics');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/cosmetics/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cosmeticId,
          isActive: true
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Cosmetic applied successfully! Check your profile.');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Failed to apply cosmetic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Cosmetic Overlays Test Page</h1>
      
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Setup</h2>
          <p className="text-muted-foreground mb-4">
            This page helps you test the cosmetic overlay system. First, seed some sample cosmetics, then apply them to see the floating decorations on your profile.
          </p>
          
          <div className="space-y-4">
            <Button 
              onPress={seedCosmetics} 
              loading={loading}
              disabled={!session?.user?.id}
            >
              Seed Sample Cosmetics
            </Button>
            
            {message && (
              <div className={`p-3 rounded-md ${
                message.includes('Error') || message.includes('Failed') 
                  ? 'bg-destructive/10 text-destructive' 
                  : 'bg-green-500/10 text-green-600'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• <strong>PFP_FRAME</strong> cosmetics appear as floating decorations around profile photos</p>
            <p>• <strong>BANNER</strong> cosmetics appear as floating decorations on cover photos</p>
            <p>• Cosmetics are loaded as iframes with custom HTML/CSS/JS</p>
            <p>• Each cosmetic can have custom positioning, size, and opacity</p>
            <p>• The system supports multiple cosmetics per user (one active per type)</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Sample Cosmetics</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div>
                <h3 className="font-medium">Sparkle Frame</h3>
                <p className="text-sm text-muted-foreground">PFP_FRAME - Animated sparkles around profile photo</p>
              </div>
              <Button 
                size="small" 
                onPress={() => applyCosmetic('sparkle-frame-id')}
                disabled={!session?.user?.id}
              >
                Apply
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div>
                <h3 className="font-medium">Purple Gradient Banner</h3>
                <p className="text-sm text-muted-foreground">BANNER - Animated gradient with floating elements</p>
              </div>
              <Button 
                size="small" 
                onPress={() => applyCosmetic('purple-banner-id')}
                disabled={!session?.user?.id}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Seed the sample cosmetics using the button above</p>
            <p>2. Visit your profile page to see the cosmetic overlays in action</p>
            <p>3. Create your own cosmetic HTML files in the <code>/public/cosmetics/</code> directory</p>
            <p>4. Add them to the database with the appropriate metadata for positioning</p>
          </div>
        </div>
      </div>
    </div>
  );
}
