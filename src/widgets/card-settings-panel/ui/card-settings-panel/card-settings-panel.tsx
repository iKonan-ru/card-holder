import { useEffect, useRef, type FC } from 'react';
import { FiX } from 'react-icons/fi';
import { useCardSettingsStore } from '@features/card-settings';
import {
  ARIA_HIDDEN_TRUE,
  ARIA_MODAL_TRUE,
  ARIA_ROLE_DIALOG,
  bem,
  KEY_ESC,
  ParentClassProvider,
  useFocusTrap,
  useOverlayClick,
} from '@shared/lib';
import { Portal } from '@shared/ui';
import {
  CARD_SETTINGS_PANEL_BLOCK,
  CARD_SETTINGS_PANEL_CLOSE_ARIA_LABEL,
  CARD_SETTINGS_PANEL_OVERFLOW_HIDDEN,
  CARD_SETTINGS_PANEL_TITLE,
  RESET_ALL_LABEL,
} from '../../constants';
import { useCardSettingsPanel } from '../../hooks';
import { FiltersSection } from '../filters-section';
import { GroupSection } from '../group-section';
import { SortSection } from '../sort-section';
import './card-settings-panel.less';

export const CardSettingsPanel: FC = () => {
  const isOpen = useCardSettingsStore((state) => state.isOpen);
  const close = useCardSettingsStore((state) => state.close);

  const {
    sortKey,
    sortDirection,
    isDirectionDisabled,
    handleSortKeyChange,
    handleSetDirection,
    groupBy,
    handleGroupByChange,
    filterSections,
    activeFilterCount,
    handleFilterChange,
    hasActiveModifiers,
    handleResetAll,
  } = useCardSettingsPanel();

  const contentRef = useRef<HTMLDivElement>(null);

  useFocusTrap({ contentRef, isTopModal: isOpen });

  const {
    handleOverlayMouseDown,
    handleOverlayMouseUp,
    handleContentClick,
    handleContentMouseDown,
  } = useOverlayClick({ onOverlayClick: close, isTopModal: isOpen });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEY_ESC) {
        close();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = CARD_SETTINGS_PANEL_OVERFLOW_HIDDEN;
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  const panelModifiers = [isOpen && 'open'].filter(Boolean) as string[];
  const panelClassName = bem(CARD_SETTINGS_PANEL_BLOCK, panelModifiers);

  return (
    <Portal>
      {isOpen && (
        <div
          className={bem(CARD_SETTINGS_PANEL_BLOCK, 'backdrop')}
          onMouseDown={handleOverlayMouseDown}
          onMouseUp={handleOverlayMouseUp}
        />
      )}
      <div
        ref={contentRef}
        role={ARIA_ROLE_DIALOG}
        aria-modal={ARIA_MODAL_TRUE}
        className={panelClassName}
        onClick={handleContentClick}
        onMouseDown={handleContentMouseDown}
      >
        <ParentClassProvider parentClass={CARD_SETTINGS_PANEL_BLOCK}>
          <div className={bem(CARD_SETTINGS_PANEL_BLOCK, 'header')}>
            <h2 className={bem(CARD_SETTINGS_PANEL_BLOCK, 'title')}>
              {CARD_SETTINGS_PANEL_TITLE}
            </h2>
            <button
              type="button"
              className={bem(CARD_SETTINGS_PANEL_BLOCK, 'close')}
              onClick={close}
              aria-label={CARD_SETTINGS_PANEL_CLOSE_ARIA_LABEL}
            >
              <FiX aria-hidden={ARIA_HIDDEN_TRUE} />
            </button>
          </div>
          <div className={bem(CARD_SETTINGS_PANEL_BLOCK, 'body')}>
            <SortSection
              sortKey={sortKey}
              sortDirection={sortDirection}
              isDirectionDisabled={isDirectionDisabled}
              onSortKeyChange={handleSortKeyChange}
              onDirectionChange={handleSetDirection}
            />
            <GroupSection
              groupBy={groupBy}
              onGroupByChange={handleGroupByChange}
            />
            <FiltersSection
              sections={filterSections}
              activeFilterCount={activeFilterCount}
              onFilterChange={handleFilterChange}
            />
          </div>

          {hasActiveModifiers && (
            <div className={bem(CARD_SETTINGS_PANEL_BLOCK, 'footer')}>
              <button
                type="button"
                className={bem(CARD_SETTINGS_PANEL_BLOCK, 'reset-all')}
                onClick={handleResetAll}
              >
                {RESET_ALL_LABEL}
              </button>
            </div>
          )}
        </ParentClassProvider>
      </div>
    </Portal>
  );
};
