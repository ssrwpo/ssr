import styled from 'styled-components';
import { bgColor, secondaryColor } from '/imports/styles/colors';
import { defaultTransition } from '/imports/styles/transitions';
import { borderRadius } from '/imports/styles/variables';

export default styled.button`
  background: ${secondaryColor};
  border: 2px solid ${secondaryColor};
  border-radius: ${borderRadius};
  color: ${bgColor};
  padding: 0.3em 0.5em;
  font-size: 1.1em;
  font-weight: bold;
  outline: 0;
  transition: color ${defaultTransition}, background-color ${defaultTransition};
  &:hover {
    background-color: ${bgColor};
    color: ${secondaryColor};
  }
`;
