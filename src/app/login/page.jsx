"use client";

import React from "react";
import { Container, Form, LinkStyled, Logo, Title } from "./page.styled";
import Grid from "@/components/Grid/grid";

import Button from "@/components/Button/button";
import Input from "@/components/Input/input";

const Page = () => {
  return (
    <Container>
      <Logo>
        <h1>Electrify</h1>
      </Logo>

      <Form>
        <Title>Entrar</Title>
        <Input label={"Usuário"} />
        <Input label={"Senha"} />

        <Button text={"Entrar"} />

        <LinkStyled href="">
          Ainda não possui uma conta? <span>Crie agora</span>
        </LinkStyled>
      </Form>
    </Container>
  );
};

export default Page;
