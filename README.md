# 🌍 Destinos Mundo

Site de destinos de viagem desenvolvido como **Trabalho Prático 2**. Reúne um catálogo de destinos com busca, filtro por categoria, página de detalhes, login, favoritos, cadastro e edição de destinos e uma página de visualização de dados com gráficos. Os dados vêm de uma API REST simulada com **JSON Server**.

> 📸 **Demonstração:** adicione aqui um print ou GIF do projeto em funcionamento.
>
> `![Demonstração do Destinos Mundo](docs/demo.gif)`

---

## 📑 Sumário

- [Funcionalidades](#-funcionalidades)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Dependências](#-dependências)
- [Estrutura de diretórios](#-estrutura-de-diretórios)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e execução local](#-instalação-e-execução-local)
- [Usuários de teste](#-usuários-de-teste)
- [Rotas da API](#-rotas-da-api)
- [Autor](#-autor)

---

## ✨ Funcionalidades

- **Home** com carrossel de destinos em destaque e grade com todos os destinos.
- **Busca** por título ou descrição.
- **Filtro** por categoria (região).
- **Página de detalhes** de cada destino, com descrição completa, país, melhor época, preço, avaliação, tags e atrações.
- **Login e logout**, com sessão guardada no navegador.
- **Cadastro de usuário.**
- **Favoritos** por usuário (exige login).
- **CRUD de destinos** (somente administrador): cadastrar, editar e excluir.
- **Visualização de dados** com 4 gráficos (Chart.js): um de pizza e três de barras.
- **Feedback ao usuário:** indicador de carregamento e mensagem de erro caso o servidor da API não esteja rodando.
- **Layout responsivo** com Bootstrap.

---

## 🛠 Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura das páginas |
| **CSS3** | Estilos personalizados (`styles.css`) |
| **JavaScript (ES6+)** | Lógica do front-end, consumo da API com `fetch` |
| **Bootstrap 5.3** | Layout responsivo, componentes e carrossel (via CDN) |
| **Chart.js 4.4** | Gráficos da página de visualização (via CDN) |
| **JSON Server** | API REST simulada a partir do arquivo `db/db.json` |
| **http-server** | Servidor estático para os arquivos da pasta `public` |
| **Node.js / npm** | Ambiente de execução e gerenciador de pacotes |

---

## 📦 Dependências

Instaladas com `npm install` (definidas no `package.json`):

| Pacote | Versão | Tipo |
|---|---|---|
| `json-server` | ^0.17.4 | dependência |
| `http-server` | ^14.1.1 | dependência de desenvolvimento |

Carregadas por CDN (não precisam ser instaladas):

- Bootstrap 5.3.8 (CSS e JS)
- Chart.js 4.4.3

---

## 📂 Estrutura de diretórios

```
trabalho-pratico-2-PedroArthur-SR/
├── db/
│   └── db.json                  # "Banco de dados" usado pelo JSON Server
├── public/                      # Front-end (servido pelo http-server)
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css       # Estilos personalizados
│   │   ├── img/                 # Imagens dos destinos (uma pasta por destino)
│   │   │   ├── islandia/
│   │   │   ├── kyoto/
│   │   │   ├── machu/
│   │   │   ├── marrakech/
│   │   │   ├── patagonia/
│   │   │   └── santorini/
│   │   └── js/
│   │       ├── script.js        # Home: listagem, busca, filtros, favoritos, sessão
│   │       ├── login.js         # Login e logout
│   │       ├── details.js       # Página de detalhes e exclusão
│   │       ├── editar.js        # Edição de destino
│   │       └── visualizacao.js  # Gráficos (Chart.js)
│   ├── index.html               # Página inicial
│   ├── details.html             # Detalhes do destino
│   ├── login.html               # Login
│   ├── cadastro_usuario.html    # Cadastro de usuário
│   ├── cadastro_destino.html    # Cadastro de destino (admin)
│   ├── editar_destino.html      # Edição de destino (admin)
│   ├── favoritos.html           # Favoritos do usuário
│   └── visualizacao.html        # Gráficos
├── package.json                 # Scripts e dependências
└── README.md
```

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada), que já inclui o npm.
- [Git](https://git-scm.com/).

Confira se estão instalados:

```bash
node -v
npm -v
git --version
```

---

## 🚀 Instalação e execução local

O projeto precisa de **dois servidores rodando ao mesmo tempo**: a API (porta 3001) e o front-end (porta 5500). Use dois terminais.

### 1. Clone o repositório

```bash
git clone https://github.com/PedroArthur-SR/trabalho-pratico-2-PedroArthur-SR.git
cd trabalho-pratico-2-PedroArthur-SR
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie a API (Terminal 1)

```bash
npm run server
```

A API ficará disponível em `http://localhost:3001`.

### 4. Inicie o front-end (Terminal 2)

Abra um **novo terminal** na mesma pasta e execute:

```bash
npm run client
```

O site ficará disponível em `http://localhost:5500`.

### 5. Acesse no navegador

Abra [http://localhost:5500](http://localhost:5500).

> ⚠️ **Se aparecer "Não foi possível carregar os destinos":** a API não está rodando. Confirme que o `npm run server` está ativo no Terminal 1.

### Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run server` | Inicia o JSON Server na porta 3001 |
| `npm run client` | Inicia o servidor estático da pasta `public` na porta 5500 |
| `npm start` | Igual a `npm run server` |

---

## 🔐 Usuários de teste

Contas já cadastradas em `db/db.json`:

| Perfil | Login | Senha | Permissões |
|---|---|---|---|
| Administrador | `admin` | `123` | Tudo, incluindo cadastrar, editar e excluir destinos |
| Usuário | `user` | `123` | Ver destinos e usar favoritos |

> Este é um projeto acadêmico. As senhas ficam em texto puro no `db.json` e a autenticação roda no navegador, então **não use esse modelo em produção**.

---

## 🔌 Rotas da API

Base: `http://localhost:3001`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/destinos` | Lista todos os destinos |
| GET | `/destinos/:id` | Busca um destino |
| POST | `/destinos` | Cria um destino |
| PUT | `/destinos/:id` | Atualiza um destino |
| DELETE | `/destinos/:id` | Remove um destino |
| GET | `/usuarios` | Lista usuários (usado no login) |
| POST | `/usuarios` | Cadastra um usuário |

---

## 👤 Autor

**Pedro Arthur**

- GitHub: [@PedroArthur-SR](https://github.com/PedroArthur-SR)