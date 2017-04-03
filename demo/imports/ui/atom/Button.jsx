import styled from 'styled-components';
import { bgColor, secondaryColor } from '/imports/styles/colors';

export default styled.button`
  background: ${secondaryColor};
  border: 0;
  color: ${bgColor};
  padding: 0.3em 0.5em;
  font-size: 1.1em;
  font-weight: bold;
  outline: 0;
`;
