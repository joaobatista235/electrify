import React from "react";
import { Container } from "./grid.styled";

const Grid = ({ className, children }) => {
  return (
    <Container className={className}>
        {children}
    </Container>
  );
};

export default Grid;
