import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { isEmpty } from 'lodash';
import { EMPTY_VALUE } from 'constants/placeholder';
import NumericInputWithCurrency from 'components/Input/NumericInputWithCurrency';
import { FormInputRow, FormInputLabel, FormInputLabelSmall } from 'shared/commonStyles';
import { StyledFormInputLabelSmall } from '../Common/common';

const MarketTypeTradeInputs = (props) => {
    return (
        <div>
            <FormInputRow>
				<NumericInputWithCurrency
					currencyKey={props.quote.name}
					value={`${props.quoteAmount}`}
					label={
						<>
							<FormInputLabel>{props.t('trade.trade-card.trade-type-market.sell-input-label')}:</FormInputLabel>
							<StyledFormInputLabelSmall
								isInteractive={!props.isEmptyQuoteBalance}
								onClick={props.setMaxBalance}
							>
								{props.t('common.wallet.balance-currency', {
									balance: props.quoteBalance
										? formatCurrency(props.quoteBalance.balance)
										: !isEmpty(props.synthsWalletBalances)
										? 0
										: EMPTY_VALUE,
								})}
							</StyledFormInputLabelSmall>
						</>
					}
					onChange={(_, value) => {
						props.setTradeAllBalance(false);
						props.setBaseAmount(value * props.rate);
						props.setQuoteAmount(value);
					}}
					errorMessage={props.inputError}
				/>
			</FormInputRow>
			<FormInputRow>
				<NumericInputWithCurrency
					currencyKey={props.base.name}
					value={`${props.baseAmount}`}
					label={
						<>
							<FormInputLabel>{props.t('trade.trade-card.trade-type-market.buy-input-label')}:</FormInputLabel>
							<StyledFormInputLabelSmall
								isInteractive={!props.isEmptyQuoteBalance}
								onClick={props.setMaxBalance}
							>
								{props.t('common.wallet.balance-currency', {
									balance: props.baseBalance
										? formatCurrency(props.baseBalance.balance)
										: !isEmpty(props.synthsWalletBalances)
										? 0
										: EMPTY_VALUE,
								})}
							</StyledFormInputLabelSmall>
						</>
					}
					onChange={(_, value) => {
						props.setTradeAllBalance(false);
						props.setQuoteAmount(value * props.inverseRate);
						props.setBaseAmount(value);
					}}
				/>
			</FormInputRow>
        </div>
    )
};

export default MarketTypeTradeInputs;