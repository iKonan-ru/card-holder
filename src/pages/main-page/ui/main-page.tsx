import type { FC } from 'react';
import { ActionButtons } from '@widgets/action-buttons';
import { CardList } from '@widgets/card-list';
import { CardSettingsPanel } from '@widgets/card-settings-panel';
import { useCardSettingsStore } from '@features/card-settings';
import {
  bem,
  buildModifiers,
  ParentClassProvider,
  useClassName,
} from '@shared/lib';
import { MAIN_PAGE_BLOCK } from '../constants';
import './main-page.less';

export const MainPage: FC = () => {
  const isPanelOpen = useCardSettingsStore((state) => state.isOpen);

  const modifiers = buildModifiers(isPanelOpen && 'panel-open');
  const className = useClassName({ blockName: MAIN_PAGE_BLOCK, modifiers });

  return (
    <main className={className}>
      <ParentClassProvider parentClass={MAIN_PAGE_BLOCK}>
        <div className={bem(MAIN_PAGE_BLOCK, 'content')}>
          <CardList />
          <ActionButtons />
        </div>
        <CardSettingsPanel />
      </ParentClassProvider>
    </main>
  );
};
