"use client";

import React, { useState } from "react";
import { Container, InputStyled, Label } from "./input.styled";

// assets

const Input = ({ label }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (event) => {
    setIsFocused(false);
    setHasContent(event.target.value !== "");
  };
  return (
    <Container>
      <Label
        initial={{ x: 0 }}
        animate={{
          y: isFocused || hasContent ? -10 : 0,
          x: isFocused || hasContent ? -5 : 0,
        }}
        transition={{ ease: "linear", duration: 0.2 }}
      >
        {label}
      </Label>
      <InputStyled
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(event) => setHasContent(event.target.value !== "")}
      />
    </Container>
  );
};

export default Input;
