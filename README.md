# Fontella & Ribeiro Advogados Associados — Versão PHP + MySQL

Mesma interface (React via CDN, sem build) da versão anterior, agora com
um **back-end real em PHP + MySQL**: os dados de advogados e dúvidas
ficam salvos no banco de dados e são compartilhados entre **todos** os
visitantes e administradores — e não mais apenas no navegador de quem
cadastrou.

Esta versão foi testada de ponta a ponta antes da entrega: sintaxe de
todos os arquivos PHP e JS validada, banco importado, servidor PHP
local subido e os endpoints testados via requisições reais (listagem
pública, login, cadastro de advogado, envio e resposta de dúvida,
proteção de rotas e logout).

## 📁 Estrutura de diretórios

```
advocacia-site-php/
├── index.html
├── .htaccess
├── README.md
├── css/
│   └── style.css
├── database/
│   └── schema.sql            # Estrutura das tabelas + dados iniciais
├── api/                      # Back-end PHP
│   ├── config.php            # Conexão com o MySQL + sessão + CORS + CSRF
│   ├── auth.php              # Login / logout / verificação de sessão
│   ├── advogados.php         # CRUD de advogados
│   ├── duvidas.php           # Envio, listagem e resposta de dúvidas
│   └── contato.php           # Recebe mensagens do formulário "Fale Conosco"
├── js/
│   ├── api.js                # Cliente HTTP (fetch) que fala com a API PHP
│   ├── App.js
│   ├── main.js
│   └── components/
│       ├── Header.js, Hero.js, About.js, PracticeAreas.js,
│       ├── Lawyers.js, Doubts.js, Contact.js, Footer.js
│       └── admin/
│           ├── AdminLogin.js, AdminLawyers.js, AdminDoubts.js,
│           ├── AdminContacts.js, AdminLayout.js
└── img/
```

## 🚀 Como colocar no ar

### 1. Crie o banco de dados

Importe o arquivo `database/schema.sql` no seu MySQL/MariaDB. Ele cria o
banco `escritorio_advocacia`, as tabelas e já popula com dados de
exemplo (6 advogados, 4 dúvidas e 1 usuário administrador).

```bash
mysql -u seu_usuario -p < database/schema.sql
```

> ⚠️ **Atenção ao encoding**: se os acentos aparecerem corrompidos após a
> importação, rode com o charset explícito:
> `mysql -u seu_usuario -p --default-character-set=utf8mb4 < database/schema.sql`
> (o arquivo já inclui `SET NAMES utf8mb4;` no topo para evitar isso.)

### 2. Configure a conexão

Edite **`api/config.php`** e troque:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'escritorio_advocacia');
define('DB_USER', 'root');      // <-- seu usuário MySQL
define('DB_PASS', '');          // <-- sua senha MySQL
```

### 3. Suba os arquivos

Copie a pasta inteira para o seu servidor (Apache com PHP 7.4+ e
extensão `pdo_mysql` habilitada — praticamente todo hospedagem
compartilhada já vem assim). Acesse `index.html` pelo navegador.

### 4. Acesse a Área Administrativa

`suaurl.com/#admin`

- Usuário: `admin`
- Senha: `admin123`

**Troque a senha assim que possível.** Duas formas:
- Gerando um novo hash e atualizando direto no banco:
  ```bash
  php -r "echo password_hash('SUA_NOVA_SENHA', PASSWORD_DEFAULT);"
  ```
  e depois:
  ```sql
  UPDATE administradores SET senha_hash = 'HASH_GERADO' WHERE usuario = 'admin';
  ```
- Ou criando uma tela de troca de senha (posso montar essa tela se quiser).

## 🔌 Endpoints da API

| Método | Rota                          | Autenticação | Descrição                              |
|--------|-------------------------------|--------------|-----------------------------------------|
| GET    | `/api/advogados.php`          | Pública      | Lista todos os advogados                |
| POST   | `/api/advogados.php`          | Admin        | Cadastra um advogado                    |
| PUT    | `/api/advogados.php?id=1`     | Admin        | Atualiza um advogado                    |
| DELETE | `/api/advogados.php?id=1`     | Admin        | Remove um advogado                      |
| GET    | `/api/duvidas.php`             | Pública*     | Lista dúvidas (e-mail oculto se público)|
| POST   | `/api/duvidas.php`             | Pública      | Cliente envia uma nova dúvida           |
| PATCH  | `/api/duvidas.php?id=1`        | Admin        | Responde a uma dúvida                   |
| DELETE | `/api/duvidas.php?id=1`        | Admin        | Remove uma dúvida                       |
| POST   | `/api/contato.php`             | Pública      | Envia mensagem do formulário "Fale Conosco" |
| GET    | `/api/contato.php`             | Admin        | Lista mensagens recebidas                |
| PATCH  | `/api/contato.php?id=1`        | Admin        | Marca mensagem como lida/não lida        |
| DELETE | `/api/contato.php?id=1`        | Admin        | Remove uma mensagem                      |
| POST   | `/api/auth.php`                | —            | Login (`{usuario, senha}`)              |
| POST   | `/api/auth.php?action=logout`  | —            | Logout                                  |
| GET    | `/api/auth.php?action=session` | —            | Verifica se há sessão ativa             |

\* A listagem de dúvidas nunca expõe o e-mail do cliente para visitantes
não autenticados — só o painel administrativo (com sessão ativa) recebe
esse campo.

## 🔐 Segurança implementada

- Senhas do admin com **hash bcrypt** (`password_hash`/`password_verify`),
  nunca em texto puro.
- Autenticação por **sessão PHP** (cookie `HttpOnly` + `SameSite=Lax` do
  lado do servidor), não por token exposto no JavaScript.
- **Proteção CSRF**: rotas de escrita (criar/editar/excluir advogado,
  responder/excluir dúvida, logout) exigem o cabeçalho `X-CSRF-Token`,
  validado contra o token armazenado na sessão. O token é gerado no login
  e devolvido ao front-end.
- Rotas de escrita protegidas por `requireAdmin()` no back-end — mesmo que
  alguém adultere o front-end, a API recusa a requisição sem sessão
  válida (testamos isso: `401` após logout).
- **CORS restrito**: em vez de refletir qualquer origem, `config.php` só
  libera origens explicitamente listadas (localhost em dev).
- Consultas 100% com **prepared statements** (PDO), sem concatenação de
  SQL — proteção contra SQL Injection.
- `.htaccess` bloqueia acesso direto à pasta `database/` (onde fica o
  `schema.sql`).
- E-mail do cliente nunca exposto na listagem pública de dúvidas.

### Recomendado antes de ir para produção
- Ativar HTTPS (descomente o bloco no `.htaccess`) para que o cookie de
  sessão trafegue de forma criptografada.
- Trocar usuário/senha padrão do admin.
- Trocar `DB_USER`/`DB_PASS` de `config.php` por um usuário MySQL
  dedicado (não use `root` em produção).

## ✉️ Mensagens do "Fale Conosco"

O formulário de contato agora é **funcional**: ao preencher e enviar, a
mensagem é gravada no banco (tabela `mensagens`) e aparece na aba
**Mensagens** da Área Administrativa (`#admin/mensagens`), onde o time
pode marcar como lida ou excluir. As mensagens nunca são enviadas por
e-mail automaticamente — servem como caixa de entrada interna do
escritório.

## 🖼️ Sobre as imagens

Os advogados usam fotos **locais** em `img/advogados/` (sem depender de
rede externa). Para usar fotos próprias, salve-as em `img/advogados/` e
informe o caminho relativo (ex.: `img/advogados/camila.jpg`) no campo
"URL da foto" ao cadastrar/editar um advogado no Admin. Algumas seções
(hero, sobre, contato) ainda usam imagens do Pexels por link direto.

## 🎨 Identidade visual

Sem alterações em relação à versão anterior: paleta marfim + azul-marinho
+ latão + bordô, tipografia Fraunces/Inter/IBM Plex Mono, seções
numeradas como "Artigos" (Art. 1º a 5º), ícones Font Awesome 6, 100%
responsivo.
