import React from 'react';
import { ButtonOutlined, ButtonOutlinedSmall } from 'components/Button';
import styled from 'styled-components';
import { BUY, SELL } from 'constants/order';

const StopLimitTypeTradeHeader = (props) => {
    return (
        <HeaderContainer>
            <ButtonRow>
                <ButtonOutlinedSmall activeOn={props.transactionType === BUY}
                onClick={() => {props.handleTransactionTypeChange(BUY)}}>Buy</ButtonOutlinedSmall>
                <ButtonOutlinedSmall activeOn={props.transactionType === SELL}
                onClick={() => {props.handleTransactionTypeChange(SELL)}}>Sell</ButtonOutlinedSmall>
            </ButtonRow>
        </HeaderContainer>
    )
}

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ButtonRow = styled.div`
    display: grid;
    grid-column-gap: 8px;
    grid-auto-flow: column;
`;

export default StopLimitTypeTradeHeader;