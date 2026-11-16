<?php
/**
 * config.php
 * -----------------------------------------------------------------------
 * Configuração central da API: conexão com o banco de dados, sessão
 * administrativa e cabeçalhos de resposta.
 *
 * IMPORTANTE: edite as constantes DB_* abaixo com os dados do seu banco
 * MySQL antes de publicar o site.
 * -----------------------------------------------------------------------
 */

// ---------- Credenciais do banco de dados ----------
define('DB_HOST', 'localhost');
define('DB_NAME', 'escritorio_advocacia');
define('DB_USER', 'root');          // <-- troque pelo usuário do seu MySQL
define('DB_PASS', 'aldo');              // <-- troque pela senha do seu MySQL
define('DB_CHARSET', 'utf8mb4');

// ---------- Sessão administrativa ----------
// Necessário para manter o admin logado entre requisições (cookie de sessão)
//
// Configuração de segurança do cookie de sessão:
//  - HttpOnly: não acessível via JavaScript (mitiga XSS)
//  - SameSite=Lax: dificulta ataques CSRF vindos de outras origens
//  - Secure: somente via HTTPS (comentado por padrão; ative em produção)
if (session_status() === PHP_SESSION_NONE) {
    session_name('escritorio_admin_sessao');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => false, // <-- troque para true quando usar HTTPS
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

// ---------- Cabeçalhos padrão ----------
header('Content-Type: application/json; charset=utf-8');

// CORS: em vez de refletir qualquer origem (inseguro), permitimos apenas
// origens explicitamente listadas. Se o site é servido na mesma origem
// (front + API no mesmo domínio), o header não é necessário; a lista
// abaixo cobre o caso de desenvolvimento/teste em portas diferentes.
$allowedOrigins = [
    'http://localhost',
    'http://localhost:8000',
    'http://localhost:3000',
    'http://127.0.0.1',
    'http://127.0.0.1:8000',
    'http://127.0.0.1:3000',
];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Requisições "preflight" do navegador (CORS) não precisam de processamento
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/**
 * Retorna a conexão PDO (criada uma única vez por requisição).
 */
function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            jsonResponse(['erro' => 'Falha ao conectar ao banco de dados.'], 500);
        }
    }
    return $pdo;
}

/**
 * Envia uma resposta JSON e encerra a execução.
 */
function jsonResponse($data, int $statusCode = 200): void {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Lê e decodifica o corpo JSON da requisição.
 */
function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function requireAdmin(): void {
    if (empty($_SESSION['admin_id'])) {
        jsonResponse(['erro' => 'Não autenticado. Faça login na área administrativa.'], 401);
    }
}

function csrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function requireCsrf(): void {
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if ($token === '' || !hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        jsonResponse(['erro' => 'Token de segurança inválido. Recarregue a página e tente novamente.'], 403);
    }
}
