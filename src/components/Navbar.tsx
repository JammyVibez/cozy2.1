import { Logo } from '@/svg_components';
import { GridFeedCards, Search, TwoPeople } from '@/svg_components';
import MenuBarItem from './MenuBarItem';

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
    </div>
  );
}