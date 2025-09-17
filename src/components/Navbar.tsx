import { Logo } from '@/svg_components';
import { GridFeedCards, Search, TwoPeople } from '@/svg_components';
import MenuBarItem from './MenuBarItem';
import SvgSearch from '@/svg_components/Search';
import { useDialogs } from '@/hooks/useDialogs';
import { DialogsContext } from '@/contexts/DialogsContext';
import { StatusCreator } from '@/components/StatusCreator';

export default function Navbar() {
  return (
    <div className="flex w-full flex-row bg-white px-8 py-4 drop-shadow">
      <Logo className="h-12 w-12" />
      <div className="flex flex-row w-full justify-end gap-4">
        <MenuBarItem href="/feed" icon={<GridFeedCards />} activeIcon={<GridFeedCards />}>
          Feed
        </MenuBarItem>
        <MenuBarItem href="/communities" icon={<TwoPeople />} activeIcon={<TwoPeople />}>
          Communities
        </MenuBarItem>
        <MenuBarItem href="/discover" icon={<Search />} activeIcon={<Search />}>
          Discover
        </MenuBarItem>
      </div>

      {/* Status Section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Share Status</h3>
          <span className="text-xs text-muted-foreground">24h</span>
        </div>
        <StatusCreator />
      </div>
    </div>
  );
}