"use client";

import React from "react";
import { Container } from "./button.styled";

const Button = ({ className, text, onClick }) => {
  const onClickButton = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Container onClick={onClickButton} className={className}>
      {text}
    </Container>
  );
};

export default Button;
