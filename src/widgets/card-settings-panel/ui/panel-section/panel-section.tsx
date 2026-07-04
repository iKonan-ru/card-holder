import { type FC, type PropsWithChildren } from 'react';
import { bem, useClassName } from '@shared/lib';
import { PANEL_SECTION_BLOCK } from './constants';
import './panel-section.less';

interface IPanelSectionProps extends PropsWithChildren {
  title: string;
  badge?: number;
}

export const PanelSection: FC<IPanelSectionProps> = ({
  title,
  badge,
  children,
}) => {
  const className = useClassName({ blockName: PANEL_SECTION_BLOCK });
  const hasBadge = badge !== undefined && badge > 0;

  return (
    <section className={className}>
      <div className={bem(PANEL_SECTION_BLOCK, 'header')}>
        <h3 className={bem(PANEL_SECTION_BLOCK, 'title')}>{title}</h3>
        {hasBadge && (
          <span className={bem(PANEL_SECTION_BLOCK, 'badge')}>{badge}</span>
        )}
      </div>
      <div className={bem(PANEL_SECTION_BLOCK, 'content')}>{children}</div>
    </section>
  );
};
