```markdown
# Electrify ⚡

![Electrify Logo](https://via.placeholder.com/150) <!-- Adicione o link da logo do projeto aqui -->

**Electrify** é um aplicativo mobile desenvolvido em React Native que permite monitorar e analisar o consumo de energia elétrica em tempo real. Com insights personalizados, o app ajuda os usuários a economizarem energia e reduzirem custos.

---

## Índice 📚

- [Visão Geral](#visão-geral-)
- [Funcionalidades](#funcionalidades-)
- [Tecnologias Utilizadas](#tecnologias-utilizadas-)
- [Pré-requisitos](#pré-requisitos-)
- [Como Executar](#como-executar-)
- [Estrutura do Projeto](#estrutura-do-projeto-)
- [Capturas de Tela](#capturas-de-tela-)
- [Contribuição](#contribuição-)
- [Licença](#licença-)

---

## Visão Geral 🌟

O **Electrify** foi desenvolvido como parte de um Trabalho de Conclusão de Curso (TCC) com o objetivo de promover a conscientização sobre o consumo de energia elétrica. O aplicativo coleta dados em tempo real de dispositivos IoT, como medidores de energia inteligentes, e os exibe de forma intuitiva para o usuário. Além disso, o app oferece dicas personalizadas para economizar energia e conquistar badges por metas alcançadas.

---

## Funcionalidades ✨

- **Monitoramento em Tempo Real**: Visualize o consumo de energia elétrica em tempo real.
- **Insights Personalizados**: Receba dicas para reduzir o consumo de energia.
- **Sistema de Badges**: Conquiste badges ao atingir metas de economia.
- **Histórico de Consumo**: Acompanhe o consumo diário, semanal e mensal.
- **Integração com IoT**: Conecte-se a dispositivos IoT para coleta de dados.
- **Autenticação Segura**: Login e cadastro com Firebase Authentication.

---

## Tecnologias Utilizadas 🛠️

- **Frontend**: React Native, React Navigation, React Native Paper
- **Backend**: Firebase (Firestore, Authentication)
- **IoT**: Medidores de energia inteligentes (ex: Shelly EM, SCT-013 com ESP32)
- **Ferramentas**: Expo, Git, Visual Studio Code
- **Ícones**: FontAwesome, Material Community Icons

---

## Pré-requisitos 📋

Antes de executar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (v6 ou superior)
- [Git](https://git-scm.com/)
- Um dispositivo físico ou emulador (Android/iOS)

---

## Como Executar 🚀

Siga os passos abaixo para rodar o projeto localmente:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/electrify.git
   cd electrify
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure o Firebase**:
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
   - Adicione as credenciais do Firebase no arquivo `firebaseConfig.js`.
   - Ative o **Firestore** e o **Authentication** no Firebase Console.

4. **Execute o projeto**:
   ```bash
   expo start
   ```
   - Escaneie o QR code com o aplicativo **Expo Go** (disponível na App Store e Google Play).
   - Ou execute em um emulador:
     ```bash
     expo run:android
     ```
     ```bash
     expo run:ios
     ```

---

## Estrutura do Projeto 🗂️

```
electrify/
├── assets/               # Arquivos estáticos (imagens, ícones)
├── src/                  # Código-fonte do projeto
│   ├── components/       # Componentes reutilizáveis
│   ├── screens/          # Telas do aplicativo
│   ├── firebase/         # Configuração do Firebase
│   ├── utils/            # Utilitários e funções auxiliares
│   └── App.js            # Ponto de entrada do aplicativo
├── .gitignore            # Arquivos ignorados pelo Git
├── package.json          # Dependências do projeto
└── README.md             # Documentação do projeto
```

---

## Capturas de Tela 📸

| Tela de Login | Tela de Registro | Tela de Consumo |
|---------------|------------------|-----------------|
| ![Login](https://via.placeholder.com/300) | ![Registro](https://via.placeholder.com/300) | ![Consumo](https://via.placeholder.com/300) |

| Tela de Badges | Tela de Dicas | Tela de Perfil |
|----------------|---------------|----------------|
| ![Badges](https://via.placeholder.com/300) | ![Dicas](https://via.placeholder.com/300) | ![Perfil](https://via.placeholder.com/300) |

---

## Contribuição 🤝

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b feature/nova-feature
   ```
3. Commit suas alterações:
   ```bash
   git commit -m "Adiciona nova feature"
   ```
4. Envie as alterações:
   ```bash
   git push origin feature/nova-feature
   ```
5. Abra um Pull Request.

---

## Licença 📜

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com ❤️ por [João Batista](https://github.com/joaobatista235).
```
