import { motion } from "framer-motion";
import styled from "styled-components";

export const Container = styled(motion.button)`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({theme}) => theme.gradient.yellow};
    padding: 1rem 1.5rem;
    font-size: ${({theme}) => theme.sizes.font.lg};
    text-transform: uppercase;
    border-radius: 1rem;
    box-shadow: ${({theme}) => theme.shadow.default};
    border: none;
    outline: none;
`;