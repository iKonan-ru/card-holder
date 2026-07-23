import { type FC, type PropsWithChildren, type ReactNode } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { ARIA_HIDDEN_TRUE, bem, buildModifiers } from '@shared/lib';
import type { Procedure } from '@shared/types';

interface ICollapsibleSectionProps extends PropsWithChildren {
  blockName: string;
  isCollapsed: boolean;
  onToggle: Procedure;
  label: ReactNode;
  headerExtra?: ReactNode;
}

export const CollapsibleSection: FC<ICollapsibleSectionProps> = ({
  blockName,
  isCollapsed,
  onToggle,
  label,
  headerExtra,
  children,
}) => {
  const chevronModifiers = buildModifiers(isCollapsed && 'collapsed');
  const chevronClassName = bem(bem(blockName, 'chevron'), chevronModifiers);

  const contentModifiers = buildModifiers(!isCollapsed && 'expanded');
  const contentClassName = bem(bem(blockName, 'content'), contentModifiers);

  return (
    <>
      <button
        type="button"
        className={bem(blockName, 'header')}
        onClick={onToggle}
        aria-expanded={!isCollapsed}
      >
        <FiChevronDown
          className={chevronClassName}
          aria-hidden={ARIA_HIDDEN_TRUE}
        />
        {label}
        {headerExtra}
      </button>

      <div className={contentClassName}>
        <div className={bem(blockName, 'content-inner')}>{children}</div>
      </div>
    </>
  );
};
