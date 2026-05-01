import { type FC } from 'react';
import { HTTP_WARNING_MESSAGE } from '@shared/lib';
import './http-warning-banner.less';

const BLOCK = 'http-warning-banner';

export const HttpWarningBanner: FC = () => {
  return (
    <div
      className={BLOCK}
      role="alert"
    >
      {HTTP_WARNING_MESSAGE}
    </div>
  );
};
