# REQUISITOS DO PROJETO

## REQUISITO FUNCIONAL
| RF-1 Cadastrar usuario |
|------|
| **DESCRIÇÃO DETALHADA DO REQUISITO FUNCIONAL** |
| O sistema deverá permitir que novos usuários se cadastrem fornecendo informações como nome, e-mail e senha. Após o cadastro bem-sucedido, o usuário terá acesso completo às funcionalidades do aplicativo com perfil inicial configurado. |
| **REQUISITOS NÃO FUNCIONAIS RELACIONADOS** |


| DESCRIÇÃO DETALHADA DA REGRA/RESTRIÇÃO | TIPO | CLASSIFICAÇÃO |
|----------------------------------------|------|---------------|
| RNFR-1.1 O cadastro deve validar o formato do e-mail inserido pelo usuário. | Padrão | Obrigatório |
| RNFR-1.2 O sistema deve impedir o cadastro de e-mails já utilizados por outros usuários. | Segurança | Obrigatório |
| RNFR-1.3 As senhas devem ter no mínimo 6 caracteres para garantir segurança básica. | Segurança | Obrigatório |
| RNFR-1.4 Os dados do usuário devem ser persistidos de forma segura no sistema. | Segurança | Obrigatório |

---

## REQUISITO FUNCIONAL
| RF-2 Autenticar usuario |
|------|
| **DESCRIÇÃO DETALHADA DO REQUISITO FUNCIONAL** |
| O sistema deverá permitir que usuários registrados façam login utilizando suas credenciais. O sistema deve oferecer opção de lembrar as credenciais para facilitar acessos futuros. |
| **REQUISITOS NÃO FUNCIONAIS RELACIONADOS** |

| DESCRIÇÃO DETALHADA DA REGRA/RESTRIÇÃO | TIPO | CLASSIFICAÇÃO |
|----------------------------------------|------|---------------|
| RNFR-2.1 A autenticação deve ser segura e validar as credenciais do usuário. | Segurança | Obrigatório |
| RNFR-2.2 O sistema deve manter o usuário logado entre sessões do aplicativo. | Padrão | Obrigatório |
| RNFR-2.3 As credenciais podem ser armazenadas localmente quando o usuário optar por lembrar login. | Segurança | Desejável |
| RNFR-2.4 Mensagens de erro claras devem ser exibidas quando o login falhar. | Padrão | Obrigatório |

---

## REQUISITO FUNCIONAL
| RF-3 Visualizar apresentação educativa |
|------|
| **DESCRIÇÃO DETALHADA DO REQUISITO FUNCIONAL** |
| O sistema deverá apresentar telas educativas de introdução sempre que o usuário acessar o aplicativo, explicando conceitos de consumo energético e funcionalidades disponíveis. O usuário pode pular esta apresentação se desejar. |
| **REQUISITOS NÃO FUNCIONAIS RELACIONADOS** |

| DESCRIÇÃO DETALHADA DA REGRA/RESTRIÇÃO | TIPO | CLASSIFICAÇÃO |
|----------------------------------------|------|---------------|
| RNFR-3.1 A apresentação educativa deve ser sempre exibida após o acesso do usuário. | Padrão | Obrigatório |
| RNFR-3.2 O usuário deve poder interromper a apresentação a qualquer momento. | Padrão | Obrigatório |
| RNFR-3.3 O conteúdo deve ser carregado antes da exibição para evitar problemas visuais. | Performance | Obrigatório |

---

## REQUISITO FUNCIONAL
| RF-4 Gerenciar perfil de usuario |
|------|
| **DESCRIÇÃO DETALHADA DO REQUISITO FUNCIONAL** |
| O sistema deverá permitir que o usuário visualize e edite informações de seu perfil, incluindo dados pessoais e foto. O perfil deve exibir informações de progresso do usuário no aplicativo e permitir saída segura da conta. |
| **REQUISITOS NÃO FUNCIONAIS RELACIONADOS** |

| DESCRIÇÃO DETALHADA DA REGRA/RESTRIÇÃO | TIPO | CLASSIFICAÇÃO |
|----------------------------------------|------|---------------|
| RNFR-4.1 Imagens de perfil devem ser otimizadas para não impactar performance do aplicativo. | Performance | Obrigatório |
| RNFR-4.2 O sistema deve solicitar permissões necessárias antes de acessar galeria de imagens. | Segurança | Obrigatório |
| RNFR-4.3 Alterações de dados sensíveis devem ser validadas com segurança. | Segurança | Obrigatório |
| RNFR-4.4 O progresso do usuário deve ser calculado automaticamente baseado em suas atividades. | Padrão | Obrigatório |

---

## REQUISITO FUNCIONAL
| RF-5 Monitorar consumo de energia |
|------|
| **DESCRIÇÃO DETALHADA DO REQUISITO FUNCIONAL** |
| O sistema deverá permitir que o usuário registre e visualize dados de consumo de energia através de representações gráficas em diferentes períodos. Deve possibilitar adição de novos registros com datas específicas e exibir resumos informativos. |
| **REQUISITOS NÃO FUNCIONAIS RELACIONADOS** |

| DESCRIÇÃO DETALHADA DA REGRA/RESTRIÇÃO | TIPO | CLASSIFICAÇÃO |
|----------------------------------------|------|---------------|
| RNFR-5.1 Os dados de consumo devem ser sincronizados em tempo real. | Performance | Obrigatório |
| RNFR-5.2 As visualizações gráficas devem se adaptar a diferentes tamanhos de tela. | Padrão | Obrigatório |
| RNFR-5.3 O custo da energia deve ser configurável conforme região do usuário. | Padrão | Desejável |
| RNFR-5.4 Os dados devem ser organizados cronologicamente para melhor visualização. | Padrão | Obrigatório |

---

## REQUISITO FUNCIONAL
| RF-6 Simular consumo de equipamentos |
|------|
| **DESCRIÇÃO DETALHADA DO REQUISITO FUNCIONAL** |
| O sistema deverá oferecer uma calculadora de consumo energético onde o usuário pode simular gastos de diferentes equipamentos especificando quantidade e tempo de uso. Deve permitir criação de equipamentos personalizados conforme necessidade do usuário. |
| **REQUISITOS NÃO FUNCIONAIS RELACIONADOS** |

| DESCRIÇÃO DETALHADA DA REGRA/RESTRIÇÃO | TIPO | CLASSIFICAÇÃO |
|----------------------------------------|------|---------------|
| RNFR-6.1 Equipamentos personalizados devem ter nome e consumo validados antes da criação. | Padrão | Obrigatório |
| RNFR-6.2 Os cálculos de consumo devem seguir fórmulas padrão de energia elétrica. | Padrão | Obrigatório |
| RNFR-6.3 Equipamentos adicionados devem ser salvos automaticamente para uso futuro. | Padrão | Obrigatório |
| RNFR-6.4 O sistema deve reconhecer conquistas do usuário ao usar a calculadora. | Padrão | Desejável |

---

## REQUISITO FUNCIONAL
| RF-7 Visualizar dicas de economia |
|------|
| **DESCRIÇÃO DETALHADA DO REQUISITO FUNCIONAL** |
| O sistema deverá apresentar dicas educativas categorizadas para economia de energia. Deve permitir que o usuário marque dicas como lidas, integrando com sistema de recompensas. |
| **REQUISITOS NÃO FUNCIONAIS RELACIONADOS** |

| DESCRIÇÃO DETALHADA DA REGRA/RESTRIÇÃO | TIPO | CLASSIFICAÇÃO |
|----------------------------------------|------|---------------|
| RNFR-7.1 O sistema deve controlar quais dicas foram lidas para evitar recompensas duplicadas. | Padrão | Obrigatório |
| RNFR-7.2 O progresso de leitura deve ser salvo no perfil do usuário. | Padrão | Obrigatório |

---

## REQUISITO FUNCIONAL
| RF-8 Sistema de gamificação |
|------|
| **DESCRIÇÃO DETALHADA DO REQUISITO FUNCIONAL** |
| O sistema deverá implementar mecânicas de engajamento através de níveis e conquistas para motivar o uso contínuo. Deve incluir pontuação por ações realizadas, progressão de níveis e sistema de conquistas com feedback visual. |
| **REQUISITOS NÃO FUNCIONAIS RELACIONADOS** |

| DESCRIÇÃO DETALHADA DA REGRA/RESTRIÇÃO | TIPO | CLASSIFICAÇÃO |
|----------------------------------------|------|---------------|
| RNFR-8.1 A pontuação deve ser atribuída de forma consistente para ações específicas do usuário. | Padrão | Obrigatório |
| RNFR-8.2 Conquistas devem ser apresentadas com animações para melhor experiência. | Padrão | Desejável |
| RNFR-8.3 A progressão de níveis deve seguir critérios claros e consistentes. | Padrão | Obrigatório |
| RNFR-8.4 Conquistas devem ser verificadas e atualizadas automaticamente. | Performance | Obrigatório |

---

## REQUISITO FUNCIONAL
| RF-9 Visualizar informações de ajuda |
|------|
| **DESCRIÇÃO DETALHADA DO REQUISITO FUNCIONAL** |
| O sistema deverá fornecer seção de ajuda com explicações sobre conceitos de energia elétrica e instruções de uso das funcionalidades do aplicativo para orientar adequadamente os usuários. |
| **REQUISITOS NÃO FUNCIONAIS RELACIONADOS** |

| DESCRIÇÃO DETALHADA DA REGRA/RESTRIÇÃO | TIPO | CLASSIFICAÇÃO |
|----------------------------------------|------|---------------|
| RNFR-9.1 As informações de ajuda devem ser organizadas de forma intuitiva. | Padrão | Obrigatório |
| RNFR-9.2 Os indicadores visuais devem seguir padrões reconhecíveis pelos usuários. | Padrão | Obrigatório |

---

## REQUISITOS TÉCNICOS GERAIS

| DESCRIÇÃO DETALHADA DA REGRA/RESTRIÇÃO | TIPO | CLASSIFICAÇÃO |
|----------------------------------------|------|---------------|
| RNFR-T.1 O aplicativo deve ser compatível com dispositivos móveis Android. | Tecnológico | Obrigatório |
| RNFR-T.2 O sistema deve utilizar serviços de nuvem para armazenamento e autenticação. | Tecnológico | Obrigatório |
| RNFR-T.3 A interface deve seguir padrões modernos de design com identidade visual consistente. | Padrão | Obrigatório |
| RNFR-T.4 A navegação deve ser intuitiva e fluida entre as diferentes seções. | Tecnológico | Obrigatório |
| RNFR-T.5 O aplicativo deve incluir animações para melhorar a experiência do usuário. | Padrão | Desejável |
| RNFR-T.6 Gráficos e visualizações devem ser renderizados de forma eficiente. | Tecnológico | Obrigatório |
| RNFR-T.7 Ícones devem ser padronizados e facilmente reconhecíveis. | Padrão | Obrigatório |
| RNFR-T.8 Dados não críticos podem ser armazenados localmente para melhor performance. | Tecnológico | Obrigatório | 