"use client";

import React from "react";
import { ThemeProvider } from "styled-components";

const ThemeProviderNext = ({ children, theme }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeProviderNext;
