import styled, { css } from 'styled-components';
import { width } from 'styled-system';

const smallButtonCSS = css`
	height: 32px;
	font-size: 14px;
	padding: 0 12px;
	width: auto;
	line-height: 34px;
`;

const extraSmallButtonCSS = css`
	height: 24px;
	font-size: 11px;
	padding: 0 10px;
	width: auto;
	line-height: 24px;
`;

const ButtonOutlined = styled.button`
	border-radius: 1px;
	height: 48px;
	width: 100%;
	font-size: 16px;
	letter-spacing: 0.2px;
	font-family: ${(props) => props.theme.fonts.medium};
	color: ${(props) => props.theme.colors.white};
	cursor: pointer;
	padding: 0 6px;
	background-color: transparent;
	&:disabled {
		opacity: 0.5;
		cursor: default;
	}
	&:active {
		border: none;
		outline:none;
	}
	&:focus {
		border: none;
		outline:none;
	}
	outline:none;
	background-color: ${(props) =>  props.activeOn ? props.theme.colors.buttonHover : 'transparent'};
    border: none;
	text-transform: uppercase;
	line-height: 44px;
	white-space: nowrap;
	${width};
	${(props) => props.size === 'sm' && smallButtonCSS}
	${(props) => props.size === 'xs' && extraSmallButtonCSS}
`;

export const ButtonOutlinedSmall = styled(ButtonOutlined)`
	${smallButtonCSS}
`;

export const ButtonOutlinedExtraSmall = styled(ButtonOutlined)`
	${extraSmallButtonCSS}
`;

export default ButtonOutlined;
