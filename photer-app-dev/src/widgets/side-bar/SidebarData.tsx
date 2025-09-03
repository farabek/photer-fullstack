import { SpriteName } from 'public/icons/spriteNames';

type SidebarItem = {
  title?: string;
  path?: string;
  defaultIconName: SpriteName;
  activeIconName: SpriteName;
  nestedItems?: SidebarItem[];
  nestedTitle?: string;
};

export const ytSidebarDataset: SidebarItem[] = [
  {
    title: 'Feed',
    path: '/',
    defaultIconName: 'home-outline',
    activeIconName: 'home',
  },
  {
    title: 'Create',
    path: '/create-post',
    defaultIconName: 'plus-square-outline',
    activeIconName: 'plus-square',
  },
  {
    title: 'Profile',
    path: '/profile',
    defaultIconName: 'person-outline',
    activeIconName: 'person',
  },
  {
    title: 'Messenger',
    path: '/messenger',
    defaultIconName: 'message-circle-outline',
    activeIconName: 'message-circle',
  },
  {
    title: 'Search',
    path: '/search',
    defaultIconName: 'search-outline',
    activeIconName: 'search',
  },
  {
    title: 'Statistics',
    path: '/statistics',
    defaultIconName: 'trending-up-outline',
    activeIconName: 'trending-up',
  },
  {
    title: 'Favorites',
    path: '/favorites',
    defaultIconName: 'bookmark-outline',
    activeIconName: 'bookmark',
  },
  {
    title: 'Log Out',
    path: '/logout',
    defaultIconName: 'home-outline',
    activeIconName: 'home-outline',
  },
];
