import type { FC } from 'react';
import { ActionButtons } from '@widgets/action-buttons';
import { CardList } from '@widgets/card-list';
import { bem, ParentClassProvider } from '@shared/lib';
import { MAIN_PAGE_BLOCK } from '../constants';
import './main-page.less';

export const MainPage: FC = () => {
  return (
    <main className={MAIN_PAGE_BLOCK}>
      <ParentClassProvider parentClass={MAIN_PAGE_BLOCK}>
        <div className={bem(MAIN_PAGE_BLOCK, 'content')}>
          <CardList />
          <ActionButtons />
        </div>
      </ParentClassProvider>
    </main>
  );
};
