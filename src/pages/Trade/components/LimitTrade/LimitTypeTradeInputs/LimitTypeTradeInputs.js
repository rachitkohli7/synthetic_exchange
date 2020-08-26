import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { isEmpty } from 'lodash';
import { EMPTY_VALUE } from 'constants/placeholder';
import NumericInputWithCurrency from 'components/Input/NumericInputWithCurrency';
import { FormInputRow, FormInputLabel, FormInputLabelSmall } from 'shared/commonStyles';
import { StyledFormInputLabelSmall } from '../../Common/common';

const LimitTypeTradeInputs = (props) => {
    return (
        <div>
            <FormInputRow>
				<NumericInputWithCurrency
					currencyKey={props.quote.name}
					value={`${props.limitPrice}`}
					label={
						<>
							<FormInputLabel>{props.t('trade.trade-card.trade-type-limit.price-input-label')}:</FormInputLabel>
						</>
					}
					onChange={(_, value) => {
						//props.setTradeAllBalance(false);
						//props.setBaseAmount(value * props.rate);
						props.handleLimitChange(value);
					}}
					errorMessage={props.inputError}
				/>
			</FormInputRow>
			<FormInputRow>
				<NumericInputWithCurrency
					currencyKey={props.base.name}
					value={`${props.limitAmount}`}
					label={
						<>
							<FormInputLabel>{props.t('trade.trade-card.trade-type-limit.amount-input-label')}:</FormInputLabel>
						</>
					}
					onChange={(_, value) => {
						//props.setTradeAllBalance(false);
						//props.setQuoteAmount(value * props.inverseRate);
						props.handleAmountChange(value);
					}}
				/>
			</FormInputRow>
        </div>
    )
};

export default LimitTypeTradeInputs;