import React from 'react';
import { HeadingSmall, HeadingMedium,headingH4CSS  } from 'components/Typography';
import { ButtonFilter } from 'components/Button';
import { ReactComponent as ReverseArrow } from 'assets/images/reverse-arrow.svg';
import styled from 'styled-components';

const MarketTypeTradeHeader = (props) => {
    return (<HeaderContainer>
        {props.t('trade.trade-card.title')}
        <ButtonFilter
            onClick={() => {
                props.setPair({ quote: props.base, base: props.quote });
                props.resetInputAmounts();
            }}
            height={'22px'}
        >
            <ButtonFilterInner>
                {props.t('trade.trade-card.reverse-button')}
                <ReverseArrowStyled />
            </ButtonFilterInner>
        </ButtonFilter>
        </HeaderContainer>)
}

const ButtonFilterInner = styled.div`
	display: flex;
	align-items: center;
`;

const HeaderContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 10px;
`;

const ReverseArrowStyled = styled(ReverseArrow)`
	height: 10px;
	margin-left: 8px;
`;

export default MarketTypeTradeHeader;