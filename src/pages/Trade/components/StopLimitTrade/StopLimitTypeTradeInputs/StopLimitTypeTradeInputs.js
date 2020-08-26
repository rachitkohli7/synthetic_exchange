import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { isEmpty } from 'lodash';
import { EMPTY_VALUE } from 'constants/placeholder';
import NumericInputWithCurrency from 'components/Input/NumericInputWithCurrency';
import { FormInputRow, FormInputLabel, FormInputLabelSmall } from 'shared/commonStyles';
import { StyledFormInputLabelSmall } from '../../Common/common';

const StopLimitTypeTradeInputs = (props) => {
    return (
        <div>
            <FormInputRow>
				<NumericInputWithCurrency
					currencyKey={props.quote.name}
					value={`${props.stopLimit}`}
					label={
						<>
							<FormInputLabel>{props.t('trade.trade-card.trade-type-stop-limit.stop-input-label')}:</FormInputLabel>
						</>
					}
					onChange={(_, value) => {
						props.handleStopLimit(value);
					}}
					errorMessage={props.inputError}
				/>
			</FormInputRow>
			<FormInputRow>
				<NumericInputWithCurrency
					currencyKey={props.quote.name}
					value={`${props.limitPrice}`}
					label={
						<>
							<FormInputLabel>{props.t('trade.trade-card.trade-type-stop-limit.limit-input-label')}:</FormInputLabel>
						</>
					}
					onChange={(_, value) => {
						props.handleLimitChange(value);
					}}
				/>
			</FormInputRow>
			<FormInputRow>
				<NumericInputWithCurrency
					currencyKey={props.base.name}
					value={`${props.limitAmount}`}
					label={
						<>
							<FormInputLabel>{props.t('trade.trade-card.trade-type-stop-limit.amount-input-label')}:</FormInputLabel>
						</>
					}
					onChange={(_, value) => {
						props.handleAmountChange(value);
					}}
				/>
			</FormInputRow>
        </div>
    )
};

export default StopLimitTypeTradeInputs;