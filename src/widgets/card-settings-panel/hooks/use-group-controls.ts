import { useCardViewStore, type TGroupBy } from '@features/card-management';
import { GROUP_BY_OPTIONS } from '../constants';

const GROUP_BY_VALUES = new Set<string>(
  GROUP_BY_OPTIONS.map((option) => option.value),
);

const isGroupBy = (value: string): value is TGroupBy =>
  GROUP_BY_VALUES.has(value);

export interface IUseGroupControlsResult {
  groupBy: TGroupBy;
  handleGroupByChange: (value: string) => void;
}

export const useGroupControls = (): IUseGroupControlsResult => {
  const groupBy = useCardViewStore((state) => state.groupBy);
  const setGroupBy = useCardViewStore((state) => state.setGroupBy);

  const handleGroupByChange = (value: string) => {
    if (isGroupBy(value)) {
      setGroupBy(value);
    }
  };

  return { groupBy, handleGroupByChange };
};
