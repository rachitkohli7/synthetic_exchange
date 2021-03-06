import React, { FC } from 'react';

import { formatCurrencyPair } from '../../../utils/formatters';

import CurrencyIcon from '../CurrencyIcon';

import { Container } from '../commonStyles';
import { CurrencyKey } from 'constants/currency';

type CurrencyPairProps = {
	baseCurrencyKey: CurrencyKey;
	baseCurrencyAsset?: string;
	quoteCurrencyKey: CurrencyKey;
	quoteCurrencyAsset?: string;
	showIcon?: boolean;
	iconProps?: any;
};

export const CurrencyPair: FC<CurrencyPairProps> = ({
	baseCurrencyKey,
	baseCurrencyAsset,
	quoteCurrencyKey,
	quoteCurrencyAsset,
	showIcon = true,
	iconProps = {},
	...rest
}) => (
	<Container showIcon={showIcon} {...rest}>
		{showIcon && <CurrencyIcon currencyKey={baseCurrencyKey} {...iconProps} />}
		{/*formatCurrencyPair(baseCurrencyAsset || baseCurrencyKey, quoteCurrencyKey)*/}
		{formatCurrencyPair(baseCurrencyAsset || baseCurrencyKey, quoteCurrencyAsset || quoteCurrencyKey)}
	</Container>
);

export default CurrencyPair;
