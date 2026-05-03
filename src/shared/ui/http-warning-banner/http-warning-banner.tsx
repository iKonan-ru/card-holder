import { type FC } from 'react';
import { HTTP_WARNING_MESSAGE } from '@shared/lib';
import { HTTP_WARNING_BANNER_BLOCK } from './constants';
import './http-warning-banner.less';

export const HttpWarningBanner: FC = () => {
  return (
    <div
      className={HTTP_WARNING_BANNER_BLOCK}
      role="alert"
    >
      {HTTP_WARNING_MESSAGE}
    </div>
  );
};
