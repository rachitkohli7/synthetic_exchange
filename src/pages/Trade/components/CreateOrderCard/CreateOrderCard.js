import React, { useState, useEffect, useContext, useCallback } from 'react';
import { connect } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash/isEmpty';

import snxJSConnector from 'utils/snxJSConnector';

import Card from 'components/Card';

import { getWalletInfo } from 'ducks/wallet/walletDetails';
import { getSynthsWalletBalances } from 'ducks/wallet/walletBalances';
import { getSynthPair, getAvailableSynthsMap } from 'ducks/synths';
import { getRatesExchangeRates, getEthRate } from 'ducks/rates';

import {
	getGasInfo,
	createTransaction,
	updateTransaction,
	getTransactions,
} from 'ducks/transaction';

import { BALANCE_FRACTIONS, BUY } from 'constants/order';
import { SYNTHS_MAP, CATEGORY_MAP } from 'constants/currency';
import { TRANSACTION_STATUS } from 'constants/transaction';

import { getExchangeRatesForCurrencies } from 'utils/rates';
import { normalizeGasLimit } from 'utils/transactions';
import { GWEI_UNIT } from 'utils/networkUtils';
import errorMessages from 'utils/errorMessages';
import {
	formatCurrency,
	bytesFormatter,
	bigNumberFormatter,
	secondsToTime,
} from 'utils/formatters';

import { HeadingSmall, DataSmall } from 'components/Typography';
import { ButtonFilter, ButtonPrimary } from 'components/Button';
import DismissableMessage from 'components/DismissableMessage';

import { ReactComponent as ReverseArrow } from 'assets/images/reverse-arrow.svg';
import NetworkInfo from '../../../../components/NetworkInfo/NetworkInfo';
import LimitTypeTradeInputs from '../LimitTrade/LimitTypeTradeInputs';
import StopLimitTypeTradeInputs from '../StopLimitTrade/StopLimitTypeTradeInputs';
import MarketTypeTradeInputs from '../MarketTrade/MarketTypeTradeInputs';
import TradeTypeTabs from '../TradeTypeTabs';
import { MARKET, LIMIT, STOP_LIMIT } from 'constants/order';
import { TRADE_TYPES } from 'constants/order';
import MarketTypeTradeHeader from '../MarketTrade/MarketTypeTradeHeader';
import LimitTypeTradeHeader from '../LimitTrade/LimitTypeTradeHeader';
import StopLimitTypeTradeHeader from '../StopLimitTrade/StopLimitTypeTradeHeader';

const INPUT_DEFAULT_VALUE = '';

const CreateOrderCard = ({
	synthPair,
	walletInfo: { currentWallet, walletType },
	synthsWalletBalances,
	exchangeRates,
	gasInfo,
	ethRate,
	createTransaction,
	updateTransaction,
	transactions,
	synthsMap,
}) => {
	const { t } = useTranslation();
	const { colors } = useContext(ThemeContext);
	const [baseAmount, setBaseAmount] = useState(INPUT_DEFAULT_VALUE);
	const [quoteAmount, setQuoteAmount] = useState(INPUT_DEFAULT_VALUE);
	const [feeRate, setFeeRate] = useState(0);
	const [{ base, quote }, setPair] = useState(
		synthPair.reversed ? { base: synthPair.quote, quote: synthPair.base } : synthPair
	);
	const [tradeAllBalance, setTradeAllBalance] = useState(false);
	const [gasLimit, setGasLimit] = useState(gasInfo.gasLimit);
	const [hasSetGasLimit, setHasSetGasLimit] = useState(false);
	const [inputError, setInputError] = useState(null);
	const [txErrorMessage, setTxErrorMessage] = useState(null);
	const [feeReclamationError, setFeeReclamationError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hasMarketClosed, setHasMarketClosed] = useState(false);
	const [tradeType, setTradeType] = useState(MARKET);
	const [limitPrice, setLimitPrice] = useState(INPUT_DEFAULT_VALUE);
	const [stopLimit, setStopLimit] = useState(INPUT_DEFAULT_VALUE);
	const [limitAmount, setLimitAmount] = useState(INPUT_DEFAULT_VALUE);
	const [transactionType, setTransactionType] = useState(BUY);

	const resetInputAmounts = () => {
		setBaseAmount(INPUT_DEFAULT_VALUE);
		setQuoteAmount(INPUT_DEFAULT_VALUE);
	};

	useEffect(() => {
		if (synthPair.reversed) {
			setPair({ base: synthPair.quote, quote: synthPair.base });
		} else {
			setPair(synthPair);
		}
		resetInputAmounts();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [synthPair.base.name, synthPair.quote.name, synthPair.reversed]);

	useEffect(() => {
		const getFeeRateForExchange = async () => {
			try {
				const {
					snxJS: { Exchanger },
				} = snxJSConnector;
				const feeRateForExchange = await Exchanger.feeRateForExchange(
					bytesFormatter(quote.name),
					bytesFormatter(base.name)
				);
				setFeeRate(100 * bigNumberFormatter(feeRateForExchange));
			} catch (e) {
				console.log(e);
			}
		};
		getFeeRateForExchange();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [base.name, quote.name]);

	useEffect(() => {
		const {
			snxJS: { SystemStatus },
		} = snxJSConnector;
		const getIsSuspended = async () => {
			try {
				const [baseResult, quoteResult] = await Promise.all([
					SystemStatus.synthSuspension(bytesFormatter(synthPair.base.name)),
					SystemStatus.synthSuspension(bytesFormatter(synthPair.quote.name)),
				]);
				setHasMarketClosed(baseResult.suspended || quoteResult.suspended);
			} catch (e) {
				console.log(e);
			}
		};
		if ([base.category, quote.category].includes(CATEGORY_MAP.equities)) {
			getIsSuspended();
		} else {
			setHasMarketClosed(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [base.name, quote.name]);

	const baseBalance =
		(synthsWalletBalances && synthsWalletBalances.find((synth) => synth.name === base.name)) || 0;
	const quoteBalance =
		(synthsWalletBalances && synthsWalletBalances.find((synth) => synth.name === quote.name)) || 0;

	const rate = getExchangeRatesForCurrencies(exchangeRates, quote.name, base.name);
	const inverseRate = getExchangeRatesForCurrencies(exchangeRates, base.name, quote.name);

	const buttonDisabled =
		!baseAmount || !currentWallet || inputError || isSubmitting || feeReclamationError;

	const isEmptyQuoteBalance = !quoteBalance || !quoteBalance.balance;

	useEffect(() => {
		setInputError(null);
		if (!quoteAmount || !baseAmount) return;
		if (currentWallet && quoteAmount > quoteBalance.balance) {
			setInputError(t('common.errors.amount-exceeds-balance'));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [quoteAmount, baseAmount, currentWallet, baseBalance, quoteBalance]);

	const getMaxSecsLeftInWaitingPeriod = useCallback(async () => {
		if (!currentWallet) return;
		const {
			snxJS: { Exchanger },
		} = snxJSConnector;
		try {
			const maxSecsLeftInWaitingPeriod = await Exchanger.maxSecsLeftInWaitingPeriod(
				currentWallet,
				bytesFormatter(quote.name)
			);
			const waitingPeriodInSecs = Number(maxSecsLeftInWaitingPeriod);
			if (waitingPeriodInSecs) {
				setFeeReclamationError(
					t('common.errors.fee-reclamation', {
						waitingPeriod: secondsToTime(waitingPeriodInSecs),
						currency: quote.name,
					})
				);
			} else setFeeReclamationError(null);
		} catch (e) {
			console.log(e);
			setFeeReclamationError(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [quote.name, currentWallet, quoteAmount]);

	useEffect(() => {
		getMaxSecsLeftInWaitingPeriod();
	}, [getMaxSecsLeftInWaitingPeriod]);

	useEffect(() => {
		const getGasEstimate = async () => {
			const {
				snxJS: { Synthetix },
				utils,
			} = snxJSConnector;

			if (!quoteAmount || !quoteBalance || hasSetGasLimit) return;
			const amountToExchange = tradeAllBalance
				? quoteBalance.balanceBN
				: utils.parseEther(quoteAmount.toString());

			const gasEstimate = await Synthetix.contract.estimate.exchange(
				bytesFormatter(quote.name),
				amountToExchange,
				bytesFormatter(base.name)
			);
			const rectifiedGasLimit = normalizeGasLimit(Number(gasEstimate));
			setGasLimit(rectifiedGasLimit);
			setHasSetGasLimit(true);
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [quoteAmount]);

	const setMaxBalance = () => {
		if (!isEmptyQuoteBalance) {
			setTradeAllBalance(true);
			setBaseAmount(quoteBalance.balance * rate);
			setQuoteAmount(quoteBalance.balance);
		}
	};

	const handleSubmit = async () => {
		const {
			snxJS: { Synthetix },
			utils,
		} = snxJSConnector;
		const transactionId = transactions.length;
		setTxErrorMessage(null);
		setIsSubmitting(true);
		try {
			const amountToExchange = tradeAllBalance
				? quoteBalance.balanceBN
				: utils.parseEther(quoteAmount.toString());

			const gasEstimate = await Synthetix.contract.estimate.exchange(
				bytesFormatter(quote.name),
				amountToExchange,
				bytesFormatter(base.name)
			);
			const rectifiedGasLimit = normalizeGasLimit(Number(gasEstimate));

			setGasLimit(rectifiedGasLimit);

			createTransaction({
				id: transactionId,
				date: new Date(),
				base: base.name,
				quote: quote.name,
				fromAmount: quoteAmount,
				toAmount: baseAmount,
				price:
					base.name === SYNTHS_MAP.sUSD
						? getExchangeRatesForCurrencies(exchangeRates, quote.name, base.name)
						: getExchangeRatesForCurrencies(exchangeRates, base.name, quote.name),
				amount: formatCurrency(baseAmount),
				priceUSD:
					base.name === SYNTHS_MAP.sUSD
						? getExchangeRatesForCurrencies(exchangeRates, quote.name, SYNTHS_MAP.sUSD)
						: getExchangeRatesForCurrencies(exchangeRates, base.name, SYNTHS_MAP.sUSD),
				totalUSD: formatCurrency(
					baseAmount * getExchangeRatesForCurrencies(exchangeRates, base.name, SYNTHS_MAP.sUSD)
				),
				status: TRANSACTION_STATUS.WAITING,
			});

			const tx = await Synthetix.exchange(
				bytesFormatter(quote.name),
				amountToExchange,
				bytesFormatter(base.name),
				{
					gasPrice: gasInfo.gasPrice * GWEI_UNIT,
					gasLimit: rectifiedGasLimit,
				}
			);

			updateTransaction({ status: TRANSACTION_STATUS.PENDING, ...tx }, transactionId);
			setIsSubmitting(false);
		} catch (e) {
			console.log(e);
			const error = errorMessages(e, walletType);
			updateTransaction(
				{
					status:
						error.type === 'cancelled' ? TRANSACTION_STATUS.CANCELLED : TRANSACTION_STATUS.FAILED,
					error: error.message,
				},
				transactionId
			);
			setTxErrorMessage(t('common.errors.unknown-error-try-again'));
			setIsSubmitting(false);
		}
	};

	const handleTradeTypeChange = (event, newValue) => {
		setTradeType(TRADE_TYPES[newValue]);
	}

	function commonProps() {
		return {
			quote: quote,
			quoteAmount: quoteAmount,
			isEmptyQuoteBalance: isEmptyQuoteBalance,
			setMaxBalance: setMaxBalance,
			quoteBalance: quoteBalance,
			synthsWalletBalances: synthsWalletBalances,
			setTradeAllBalance: setTradeAllBalance,
			setQuoteAmount: setQuoteAmount,
			setBaseAmount: setBaseAmount,
			inputError: inputError,
			base: base,
			baseAmount: baseAmount,
			baseBalance: baseBalance,
			rate: rate,
			inverseRate: inverseRate,
			t: t,
		};
	}

	const handleTransactionTypeChange = (transaction) => {
		console.log(transaction)
		setTransactionType(transaction);
	}

	const getTradeHeader = () => {
		switch(tradeType){
			case MARKET:
				return (
					<MarketTypeTradeHeader
						setPair={setPair}
						resetInputAmounts={resetInputAmounts}
						t={t}
						base={base}
						quote={quote}
					/>);
			case LIMIT:
				return (
					<LimitTypeTradeHeader
						transactionType={transactionType}
						handleTransactionTypeChange={handleTransactionTypeChange}
					/>);
			case STOP_LIMIT:
				return (
					<StopLimitTypeTradeHeader
						transactionType={transactionType}
						handleTransactionTypeChange={handleTransactionTypeChange}
					/>);
			default:
				return (<div/>);
		}
	}

	const getTradeInputs = () => {
		switch(tradeType){
			case MARKET:
				return (
					<MarketTypeTradeInputs
						{...commonProps()}
						
					/>);
			case LIMIT:
				return (
					<LimitTypeTradeInputs
						{...commonProps()}
						limitPrice={limitPrice}
						handleLimitChange={setLimitPrice}
						limitAmount={limitAmount}
						handleAmountChange={setLimitAmount}
					/>);
			case STOP_LIMIT:
				return (
					<StopLimitTypeTradeInputs
						{...commonProps()}
						limitPrice={limitPrice}
						handleLimitChange={setLimitPrice}
						limitAmount={limitAmount}
						handleAmountChange={setLimitAmount}
						stopLimit={stopLimit}
						handleStopLimit={setStopLimit}
					/>);
			default:
				return (<div/>);
		}
	}

	return (
		<Card>
			<Card.Header>
				<HeaderContainer>
					<TabsContainer>
					<TradeTypeTabs value={tradeType} values={TRADE_TYPES} handleChange={handleTradeTypeChange}/>
					</TabsContainer>
				</HeaderContainer>
			</Card.Header>
			<Card.Body>
				<div>
					{getTradeHeader()}
				</div>
				<div style={{marginTop: '12px'}}>
					{getTradeInputs()}
				</div>
				<BalanceFractionRow>
					{BALANCE_FRACTIONS.map((fraction, id) => (
						<ButtonAmount
							disabled={isEmptyQuoteBalance}
							key={`button-fraction-${id}`}
							onClick={() => {
								const balance = quoteBalance.balance;
								const isWholeBalance = fraction === 100;
								const amount = isWholeBalance ? balance : (balance * fraction) / 100;
								setTradeAllBalance(isWholeBalance);
								setQuoteAmount(amount);
								setBaseAmount(amount * rate);
							}}
						>
							<DataSmall color={colors.fontTertiary}>{fraction}%</DataSmall>
						</ButtonAmount>
					))}
				</BalanceFractionRow>
				<NetworkInfo
					gasPrice={gasInfo.gasPrice}
					gasLimit={gasLimit}
					ethRate={ethRate}
					exchangeFeeRate={feeRate}
					amount={tradeType === MARKET ? baseAmount : limitAmount}
					usdRate={tradeType === MARKET ? getExchangeRatesForCurrencies(exchangeRates, base.name, SYNTHS_MAP.sUSD) : limitPrice}
				/>

				{hasMarketClosed ? (
					<ButtonPrimary disabled={true}>
						{t('common.systemStatus.suspended-synths.reasons.market-closed')}
					</ButtonPrimary>
				) : feeReclamationError ? (
					<ButtonPrimary onClick={() => getMaxSecsLeftInWaitingPeriod()}>
						{t('trade.trade-card.retry-button')}
					</ButtonPrimary>
				) : synthsMap[base.name].isFrozen ? (
					<ButtonPrimary disabled={true}>{t('trade.trade-card.frozen-synth')}</ButtonPrimary>
				) : (
					<ButtonPrimary disabled={buttonDisabled} onClick={handleSubmit}>
						{t('trade.trade-card.confirm-trade-button')}
					</ButtonPrimary>
				)}
				{txErrorMessage && (
					<TxErrorMessage
						onDismiss={() => setTxErrorMessage(null)}
						type="error"
						size="sm"
						floating={true}
					>
						{txErrorMessage}
					</TxErrorMessage>
				)}
				{feeReclamationError && (
					<TxErrorMessage
						onDismiss={() => setFeeReclamationError(null)}
						type="error"
						size="sm"
						floating={true}
					>
						{feeReclamationError}
					</TxErrorMessage>
				)}
			</Card.Body>
		</Card>
	);
};

const BalanceFractionRow = styled.div`
	display: grid;
	grid-column-gap: 8px;
	grid-auto-flow: column;
`;

const ButtonAmount = styled.button`
	&:disabled {
		pointer-events: none;
		opacity: 0.5;
	}
	border-radius: 1px;
	cursor: pointer;
	flex: 1;
	border: none;
	background-color: ${(props) => props.theme.colors.accentL2};
	height: 24px;
`;

const HeaderContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const TabsContainer = styled.div`
	margin-bottom: 7px;
`;

export const TxErrorMessage = styled(DismissableMessage)`
	margin-top: 8px;
`;

const mapStateToProps = (state) => {
	return {
		synthPair: getSynthPair(state),
		walletInfo: getWalletInfo(state),
		synthsWalletBalances: getSynthsWalletBalances(state),
		exchangeRates: getRatesExchangeRates(state),
		gasInfo: getGasInfo(state),
		ethRate: getEthRate(state),
		transactions: getTransactions(state),
		synthsMap: getAvailableSynthsMap(state),
	};
};

const mapDispatchToProps = {
	createTransaction,
	updateTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrderCard);
