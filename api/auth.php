<?php
/**
 * api/auth.php
 * -----------------------------------------------------------------------
 * Autenticação da área administrativa.
 *
 * GET  /api/auth.php?action=session   -> verifica se há sessão ativa
 * POST /api/auth.php  { usuario, senha } -> efetua login
 * POST /api/auth.php?action=logout    -> encerra a sessão
 * -----------------------------------------------------------------------
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

if ($method === 'GET' && $action === 'session') {
    if (!empty($_SESSION['admin_id'])) {
        jsonResponse([
            'autenticado' => true,
            'usuario' => $_SESSION['admin_usuario'],
            'nome' => $_SESSION['admin_nome'],
            'csrf_token' => csrfToken(),
        ]);
    }
    jsonResponse(['autenticado' => false]);
}

if ($method === 'POST' && $action === 'logout') {
    requireCsrf();
    $_SESSION = [];
    session_destroy();
    jsonResponse(['sucesso' => true]);
}

if ($method === 'POST') {
    $body = getJsonBody();
    $usuario = trim($body['usuario'] ?? '');
    $senha = (string) ($body['senha'] ?? '');

    if ($usuario === '' || $senha === '') {
        jsonResponse(['erro' => 'Informe usuário e senha.'], 422);
    }

    $pdo = getDB();
    $stmt = $pdo->prepare('SELECT id, usuario, senha_hash, nome FROM administradores WHERE usuario = :usuario LIMIT 1');
    $stmt->execute(['usuario' => $usuario]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($senha, $admin['senha_hash'])) {
        jsonResponse(['erro' => 'Usuário ou senha inválidos.'], 401);
    }

    // Regenera o ID de sessão a cada login (proteção contra fixação de sessão)
    session_regenerate_id(true);
    $_SESSION['admin_id'] = $admin['id'];
    $_SESSION['admin_usuario'] = $admin['usuario'];
    $_SESSION['admin_nome'] = $admin['nome'];

    jsonResponse([
        'sucesso' => true,
        'usuario' => $admin['usuario'],
        'nome' => $admin['nome'],
        'csrf_token' => csrfToken(),
    ]);
}

jsonResponse(['erro' => 'Rota ou método não suportado.'], 404);
