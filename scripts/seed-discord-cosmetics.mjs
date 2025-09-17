import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDiscordCosmetics() {
  try {
    console.log('🎮 Seeding Discord nameplate cosmetics...');

    const discordNameplates = [
      {
        id: 'discord-nameplate-default',
        type: 'NAMEPLATE',
        name: 'Default Discord',
        preview: '/assets/nameplates/discord-default-preview.png',
        assetUrl: '/assets/nameplates/discord-default.css',
        metadata: {
          styles: {
            color: '#ffffff',
            fontWeight: '600',
            padding: '4px 8px',
            borderRadius: '4px'
          },
          description: 'Standard Discord nameplate style'
        }
      },
      {
        id: 'discord-nameplate-nitro',
        type: 'NAMEPLATE',
        name: 'Discord Nitro',
        preview: '/assets/nameplates/discord-nitro-preview.png',
        assetUrl: '/assets/nameplates/discord-nitro.css',
        metadata: {
          styles: {
            background: 'linear-gradient(45deg, #5865f2, #7289da)',
            color: '#ffffff',
            fontWeight: '700',
            padding: '6px 12px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(88, 101, 242, 0.3)',
            border: '1px solid #5865f2'
          },
          overlay: true,
          blendMode: 'screen',
          description: 'Premium Discord Nitro style with gradient background'
        }
      },
      {
        id: 'discord-nameplate-server-booster',
        type: 'NAMEPLATE',
        name: 'Server Booster',
        preview: '/assets/nameplates/discord-booster-preview.png',
        assetUrl: '/assets/nameplates/discord-booster.css',
        metadata: {
          styles: {
            background: 'linear-gradient(45deg, #f47fff, #ff6b9d)',
            color: '#ffffff',
            fontWeight: '700',
            padding: '6px 12px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(244, 127, 255, 0.3)',
            border: '1px solid #f47fff'
          },
          overlay: true,
          blendMode: 'screen',
          description: 'Special nameplate for Discord server boosters'
        }
      },
      {
        id: 'discord-nameplate-hypesquad',
        type: 'NAMEPLATE',
        name: 'Hypesquad',
        preview: '/assets/nameplates/discord-hypesquad-preview.png',
        assetUrl: '/assets/nameplates/discord-hypesquad.css',
        metadata: {
          styles: {
            background: 'linear-gradient(45deg, #faa61a, #ff8c00)',
            color: '#ffffff',
            fontWeight: '700',
            padding: '6px 12px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(250, 166, 26, 0.3)',
            border: '1px solid #faa61a'
          },
          overlay: true,
          blendMode: 'screen',
          description: 'Exclusive nameplate for Hypesquad members'
        }
      }
    ];

    for (const nameplate of discordNameplates) {
      await prisma.cosmetic.upsert({
        where: { id: nameplate.id },
        update: nameplate,
        create: nameplate
      });
      console.log(`✅ Created/updated cosmetic: ${nameplate.name}`);
    }

    console.log('🎉 Successfully seeded Discord nameplate cosmetics!');
  } catch (error) {
    console.error('❌ Error seeding Discord cosmetics:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDiscordCosmetics();