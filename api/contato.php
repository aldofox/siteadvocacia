<?php
/**
 * api/contato.php
 * -----------------------------------------------------------------------
 * POST   /api/contato.php          -> grava mensagem do "Fale Conosco" (público)
 * GET    /api/contato.php          -> lista mensagens (admin)
 * PATCH  /api/contato.php?id=1     -> marca mensagem como lida (admin)
 * DELETE /api/contato.php?id=1     -> exclui mensagem (admin)
 * -----------------------------------------------------------------------
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

function formatMessage(array $row): array {
    return [
        'id' => (int) $row['id'],
        'nome' => $row['nome'],
        'telefone' => $row['telefone'],
        'email' => $row['email'],
        'mensagem' => $row['mensagem'],
        'lida' => (bool) $row['lida'],
        'data' => $row['data_envio'],
    ];
}

// ---------- Envio público (formulário "Fale Conosco") ----------
if ($method === 'POST') {
    $body = getJsonBody();
    $nome = trim($body['nome'] ?? '');
    $telefone = trim($body['telefone'] ?? '');
    $email = trim($body['email'] ?? '');
    $mensagem = trim($body['mensagem'] ?? '');

    if ($nome === '' || $email === '' || $mensagem === '') {
        jsonResponse(['erro' => 'Nome, e-mail e mensagem são obrigatórios.'], 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['erro' => 'E-mail inválido.'], 422);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO mensagens (nome, telefone, email, mensagem) VALUES (:nome, :telefone, :email, :mensagem)'
    );
    $stmt->execute([
        'nome' => $nome,
        'telefone' => $telefone,
        'email' => $email,
        'mensagem' => $mensagem,
    ]);

    jsonResponse([
        'sucesso' => true,
        'mensagem' => 'Mensagem enviada com sucesso! Retornaremos em breve.',
    ], 201);
}

// ---------- Rotas administrativas ----------
if ($method === 'GET') {
    requireAdmin();
    $stmt = $pdo->query('SELECT * FROM mensagens ORDER BY lida ASC, data_envio DESC');
    jsonResponse(array_map('formatMessage', $stmt->fetchAll()));
}

if ($method === 'PATCH') {
    requireAdmin();
    requireCsrf();
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) jsonResponse(['erro' => 'ID inválido.'], 422);

    // Marca como lida (ou desmarca, se passado "lida": false)
    $body = getJsonBody();
    $lida = array_key_exists('lida', $body) ? (!empty($body['lida']) ? 1 : 0) : 1;

    $stmt = $pdo->prepare('UPDATE mensagens SET lida = :lida WHERE id = :id');
    $stmt->execute(['lida' => $lida, 'id' => $id]);

    $stmt = $pdo->prepare('SELECT * FROM mensagens WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    if (!$row) jsonResponse(['erro' => 'Mensagem não encontrada.'], 404);
    jsonResponse(formatMessage($row));
}

if ($method === 'DELETE') {
    requireAdmin();
    requireCsrf();
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) jsonResponse(['erro' => 'ID inválido.'], 422);

    $stmt = $pdo->prepare('SELECT id FROM mensagens WHERE id = :id');
    $stmt->execute(['id' => $id]);
    if (!$stmt->fetch()) jsonResponse(['erro' => 'Mensagem não encontrada.'], 404);

    $stmt = $pdo->prepare('DELETE FROM mensagens WHERE id = :id');
    $stmt->execute(['id' => $id]);
    jsonResponse(['sucesso' => true]);
}

jsonResponse(['erro' => 'Método não suportado.'], 405);
