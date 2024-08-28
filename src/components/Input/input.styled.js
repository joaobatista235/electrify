import { motion } from "framer-motion";
import styled from "styled-components";

export const Container = styled.fieldset`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-inline: 0.5rem;
  padding-top: 1rem;
  border-radius: 1rem;
  border: 1px solid ${({theme}) => theme.colors.defaultBorder};
`;

export const InputStyled = styled.input`
  display: flex;
  width: 100%;
  border: none;
  outline: none;
  height: 30px;
  font-size: 16px;
  background-color: transparent;
`;

export const Label = styled(motion.label)`
  position: absolute;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.sizes.font.md};
  top: 30%;
  left: 3%;
`;
