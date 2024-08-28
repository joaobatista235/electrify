import { motion } from "framer-motion";
import Link from "next/link";
import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.yellow900};
`;
export const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 5rem 0;

  h1 {
    font-size: ${({ theme }) => theme.sizes.font.title};
  }
`;

export const Title = styled(motion.h1)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2.5rem 0;
  font-size: ${({ theme }) => theme.sizes.font.title};
  text-transform: uppercase;
  font-weight: 600;
`;

export const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  background-color: #fff;
  padding: 2.5rem 1rem;

  border-top-left-radius: 15%;
`;

export const LinkStyled = styled(motion(Link))`
  margin-top: 4rem;

  font-size: ${({ theme }) => theme.sizes.font.md};
  font-weight: 500;

  span {
    color: ${({ theme }) => theme.colors.yellow900};
  }
`;
