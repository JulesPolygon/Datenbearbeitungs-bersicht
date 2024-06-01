import styled, {keyframes} from 'styled-components'
import { secondaryColor } from '../constants';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const CircularProgress = styled.div`
  position: relative;
  width: ${(props)=>(!props.height ? `30px` : `${props.height}`)};
  height: ${(props)=>(!props.height ? `30px` : `${props.height}`)};
  border-radius: 50%;
  border: 5px solid #e0e0e0;
  border-top: ${(props)=>(!props.color ? `5px solid ${secondaryColor}` : `5px solid ${props.color}`)} ;
  animation: ${rotate} 1s linear infinite; 
`;