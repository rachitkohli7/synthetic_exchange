import { FormInputRow, FormInputLabel, FormInputLabelSmall } from 'shared/commonStyles';
import styled, { ThemeContext } from 'styled-components';
export const StyledFormInputLabelSmall = styled(FormInputLabelSmall)`
	cursor: ${(props: any) => (props.isInteractive ? 'pointer' : 'default')};
`;
