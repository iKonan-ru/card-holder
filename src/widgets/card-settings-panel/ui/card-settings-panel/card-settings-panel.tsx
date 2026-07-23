import { useEffect, useRef, type FC } from 'react';
import { FiX } from 'react-icons/fi';
import { useCardSettingsStore } from '@features/card-settings';
import {
  ARIA_HIDDEN_TRUE,
  ARIA_MODAL_TRUE,
  ARIA_ROLE_DIALOG,
  bem,
  buildModifiers,
  KEY_ESC,
  ParentClassProvider,
  useFocusTrap,
  useOverlayClick,
} from '@shared/lib';
import { Button, Portal } from '@shared/ui';
import {
  CARD_SETTINGS_PANEL_BLOCK,
  CARD_SETTINGS_PANEL_CLOSE_ARIA_LABEL,
  CARD_SETTINGS_PANEL_OVERFLOW_HIDDEN,
  CARD_SETTINGS_PANEL_TITLE,
  RESET_ALL_LABEL,
  TABLET_BREAKPOINT_PX,
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
    collapsedFacets,
    handleFilterChange,
    handleToggleFacetCollapse,
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

    const narrowScreenQuery = window.matchMedia(
      `(max-width: ${TABLET_BREAKPOINT_PX - 1}px)`,
    );
    const previousOverflow = document.body.style.overflow;

    const applyBodyScrollLock = () => {
      document.body.style.overflow = narrowScreenQuery.matches
        ? CARD_SETTINGS_PANEL_OVERFLOW_HIDDEN
        : previousOverflow;
    };

    applyBodyScrollLock();
    narrowScreenQuery.addEventListener('change', applyBodyScrollLock);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      narrowScreenQuery.removeEventListener('change', applyBodyScrollLock);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  const panelModifiers = buildModifiers(isOpen && 'open');
  const panelClassName = bem(CARD_SETTINGS_PANEL_BLOCK, panelModifiers);

  return (
    <Portal>
      <div
        className={bem(
          bem(CARD_SETTINGS_PANEL_BLOCK, 'backdrop'),
          panelModifiers,
        )}
        onMouseDown={handleOverlayMouseDown}
        onMouseUp={handleOverlayMouseUp}
      />
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
              collapsedFacets={collapsedFacets}
              onFilterChange={handleFilterChange}
              onToggleFacetCollapse={handleToggleFacetCollapse}
            />
          </div>

          <div className={bem(CARD_SETTINGS_PANEL_BLOCK, 'footer')}>
            <Button
              type="button"
              disabled={!hasActiveModifiers}
              onClick={handleResetAll}
              variant="secondary"
            >
              {RESET_ALL_LABEL}
            </Button>
          </div>
        </ParentClassProvider>
      </div>
    </Portal>
  );
};
