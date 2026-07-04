import { useMemo } from 'react';
import {
  DEFAULT_GROUP_BY,
  useCardViewStore,
  type TGroupBy,
} from '@features/card-management';
import { GROUP_BY_OPTIONS } from '../constants';

const GROUP_BY_VALUES = new Set<string>(
  GROUP_BY_OPTIONS.map((option) => option.value),
);

const isGroupBy = (value: string): value is TGroupBy =>
  GROUP_BY_VALUES.has(value);

export interface IUseGroupControlsResult {
  groupBy: TGroupBy;
  isGroupActive: boolean;
  activeGroupLabel: string;
  handleGroupByChange: (value: string) => void;
  handleResetGroup: () => void;
}

export const useGroupControls = (): IUseGroupControlsResult => {
  const groupBy = useCardViewStore((state) => state.groupBy);
  const setGroupBy = useCardViewStore((state) => state.setGroupBy);

  const isGroupActive = groupBy !== DEFAULT_GROUP_BY;

  const handleGroupByChange = (value: string) => {
    if (isGroupBy(value)) {
      setGroupBy(value);
    }
  };

  const handleResetGroup = () => {
    setGroupBy(DEFAULT_GROUP_BY);
  };

  const activeGroupLabel = useMemo(() => {
    const option = GROUP_BY_OPTIONS.find((item) => item.value === groupBy);

    return option?.label ?? groupBy;
  }, [groupBy]);

  return {
    groupBy,
    isGroupActive,
    activeGroupLabel,
    handleGroupByChange,
    handleResetGroup,
  };
};
