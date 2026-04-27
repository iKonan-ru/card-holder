import type { FC } from 'react';
import type { IBankCardAddress } from '@entities/bank-card';
import { bem, ParentClassProvider, useClassName } from '@shared/lib';
import { ValidatedField } from '@shared/ui';
import {
  ADDRESS_CITY_FIELD_CONFIG,
  ADDRESS_COUNTY_FIELD_CONFIG,
  ADDRESS_GROUP_LEGEND,
  ADDRESS_LINE1_FIELD_CONFIG,
  ADDRESS_LINE2_FIELD_CONFIG,
  ADDRESS_STATE_FIELD_CONFIG,
  ADDRESS_ZIP_FIELD_CONFIG,
  CARD_FORM_GROUP_BLOCK,
} from '../../constants';
import './card-form-group.less';

interface ICardFormGroupProps {
  address: IBankCardAddress;
  disabled: boolean;
}

export const CardFormGroup: FC<ICardFormGroupProps> = ({
  address,
  disabled,
}) => {
  const className = useClassName({ blockName: CARD_FORM_GROUP_BLOCK });

  return (
    <ParentClassProvider parentClass={CARD_FORM_GROUP_BLOCK}>
      <fieldset className={className}>
        <legend className={bem(CARD_FORM_GROUP_BLOCK, 'legend')}>
          {ADDRESS_GROUP_LEGEND}
        </legend>

        <div className={bem(CARD_FORM_GROUP_BLOCK, 'row')}>
          <ValidatedField
            {...ADDRESS_LINE1_FIELD_CONFIG}
            value={address.line1 || ''}
            disabled={disabled}
            parentClass={CARD_FORM_GROUP_BLOCK}
          />

          <ValidatedField
            {...ADDRESS_LINE2_FIELD_CONFIG}
            value={address.line2 || ''}
            disabled={disabled}
            parentClass={CARD_FORM_GROUP_BLOCK}
          />
        </div>

        <div className={bem(CARD_FORM_GROUP_BLOCK, 'row')}>
          <ValidatedField
            {...ADDRESS_CITY_FIELD_CONFIG}
            value={address.city || ''}
            disabled={disabled}
            parentClass={CARD_FORM_GROUP_BLOCK}
          />

          <ValidatedField
            {...ADDRESS_STATE_FIELD_CONFIG}
            value={address.state || ''}
            disabled={disabled}
            parentClass={CARD_FORM_GROUP_BLOCK}
          />
        </div>

        <div className={bem(CARD_FORM_GROUP_BLOCK, 'row')}>
          <ValidatedField
            {...ADDRESS_COUNTY_FIELD_CONFIG}
            value={address.county || ''}
            disabled={disabled}
            parentClass={CARD_FORM_GROUP_BLOCK}
          />

          <ValidatedField
            {...ADDRESS_ZIP_FIELD_CONFIG}
            value={address.zip || ''}
            disabled={disabled}
            parentClass={CARD_FORM_GROUP_BLOCK}
          />
        </div>
      </fieldset>
    </ParentClassProvider>
  );
};
