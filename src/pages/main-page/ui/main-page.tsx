import type { FC } from 'react';
import { bem } from '@shared/lib';
import { PWAButton } from '@features/pwa-button';
import { CardList } from '@widgets/card-list';
import { MAIN_PAGE_BLOCK } from '../lib/constants';
import './main-page.less';

export const MainPage: FC = () => {
  return (
    <main className={MAIN_PAGE_BLOCK}>
      <div className={bem(MAIN_PAGE_BLOCK, 'content')}>
        <div className={bem(MAIN_PAGE_BLOCK, 'header')}>
          <PWAButton parentClass={MAIN_PAGE_BLOCK} />
        </div>

        <CardList parentClass={MAIN_PAGE_BLOCK} />
      </div>
    </main>
  );
};
