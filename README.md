# buenas-tche-backend

Bem-vindo ao **buenas-tche-backend**, a API backend para o projeto **Buenas, tchê!**, um aplicativo de chat em tempo real. Este projeto utiliza Docker para facilitar a configuração e o gerenciamento de ambientes de desenvolvimento e produção, além de implementar funcionalidades avançadas como multi-cluster e autenticação JWT.

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Socket.io**: Biblioteca para comunicação em tempo real via WebSockets.
- **Cluster (Multi-Cluster)**: Módulo para escalabilidade horizontal da aplicação.
- **MongoDB**: Banco de dados NoSQL para armazenamento de dados.
- **Mongoose**: ODM (Object Data Modeling) para MongoDB.
- **Express**: Framework web para construção de rotas e APIs.
- **Passport JWT**: Middleware para autenticação baseada em JSON Web Tokens.
- **Docker**: Plataforma para desenvolvimento, envio e execução de aplicações em contêineres.
- **Docker Compose**: Ferramenta para definir e gerenciar multi-contêineres Docker.

## 🛠️ Instalação e Configuração

### Pré-requisitos

Antes de começar, certifique-se de que você tenha instalado em sua máquina:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Passos para Rodar o Projeto

1. **Clone o Repositório**

   ```bash
   git clone https://github.com/seu-usuario/buenas-tche-backend.git
   cd buenas-tche-backend
   ```

2. **Iniciar os Contêineres**

   Execute o seguinte comando para subir os serviços definidos no `docker-compose.yml`:

   ```bash
   docker-compose up
   ```

   Isso irá construir as imagens Docker necessárias e iniciar os contêineres. A aplicação estará disponível conforme definido na configuração do Docker Compose.

## 🐞 Resolução de Problemas

### Problemas com bcrypt, caso ocorra

Se você encontrar problemas relacionados ao `bcrypt`, como erros de compilação ou incompatibilidade de versão, siga os passos abaixo para reconstruir o módulo `bcrypt` a partir do código-fonte:

1. **Reconstruir o bcrypt**

   Execute o comando abaixo para reconstruir o `bcrypt` dentro do contêiner da aplicação:

   ```bash
   docker-compose run app npm rebuild bcrypt --build-from-source
   ```

2. **Reiniciar os Contêineres**

   Após a reconstrução, reinicie os contêineres para aplicar as mudanças:

   ```bash
   docker-compose down
   docker-compose up
   ```

---

*Desenvolvido  por [Henrique Cavalli](https://github.com/seu-usuario)*
