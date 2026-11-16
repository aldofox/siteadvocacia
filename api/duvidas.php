<?php
/**
 * api/duvidas.php
 * -----------------------------------------------------------------------
 * GET    /api/duvidas.php               -> lista dúvidas
 *          - por padrão, NÃO inclui o e-mail (uso público no site)
 *          - com sessão de admin ativa, inclui o e-mail (uso no painel)
 * POST   /api/duvidas.php               -> cliente envia uma nova dúvida (público)
 * PATCH  /api/duvidas.php?id=1          -> admin responde a dúvida (admin)
 * DELETE /api/duvidas.php?id=1          -> admin remove a dúvida (admin)
 * -----------------------------------------------------------------------
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

function formatDoubt(array $row, bool $includeEmail): array {
    $data = [
        'id' => (int) $row['id'],
        'nome' => $row['nome'],
        'duvida' => $row['duvida'],
        'status' => $row['status'],
        'resposta' => $row['resposta'],
        'respondidoPor' => $row['respondido_por'],
        'data' => $row['data_postagem'],
        'dataResposta' => $row['data_resposta'],
    ];
    if ($includeEmail) {
        $data['email'] = $row['email'];
    }
    return $data;
}

$isAdmin = !empty($_SESSION['admin_id']);

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM duvidas ORDER BY data_postagem DESC');
    $rows = $stmt->fetchAll();
    jsonResponse(array_map(fn($r) => formatDoubt($r, $isAdmin), $rows));
}

if ($method === 'POST') {
    $body = getJsonBody();
    $nome = trim($body['nome'] ?? '');
    $email = trim($body['email'] ?? '');
    $duvida = trim($body['duvida'] ?? '');

    if ($nome === '' || $email === '' || $duvida === '') {
        jsonResponse(['erro' => 'Nome, e-mail e descrição da dúvida são obrigatórios.'], 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['erro' => 'E-mail inválido.'], 422);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO duvidas (nome, email, duvida, status) VALUES (:nome, :email, :duvida, "pendente")'
    );
    $stmt->execute(['nome' => $nome, 'email' => $email, 'duvida' => $duvida]);

    $id = $pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM duvidas WHERE id = :id');
    $stmt->execute(['id' => $id]);
    jsonResponse(formatDoubt($stmt->fetch(), false), 201);
}

if ($method === 'PATCH') {
    requireAdmin();
    requireCsrf();
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) jsonResponse(['erro' => 'ID inválido.'], 422);

    $body = getJsonBody();
    $resposta = trim($body['resposta'] ?? '');
    if ($resposta === '') jsonResponse(['erro' => 'A resposta não pode ser vazia.'], 422);

    $respondidoPor = $_SESSION['admin_nome'] ?? 'Equipe do Escritório';

    $stmt = $pdo->prepare(
        'UPDATE duvidas SET status = "respondida", resposta = :resposta,
         respondido_por = :respondido_por, data_resposta = NOW() WHERE id = :id'
    );
    $stmt->execute(['resposta' => $resposta, 'respondido_por' => $respondidoPor, 'id' => $id]);

    $stmt = $pdo->prepare('SELECT * FROM duvidas WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    if (!$row) jsonResponse(['erro' => 'Dúvida não encontrada.'], 404);
    jsonResponse(formatDoubt($row, true));
}

if ($method === 'DELETE') {
    requireAdmin();
    requireCsrf();
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) jsonResponse(['erro' => 'ID inválido.'], 422);

    // Verifica se o registro existe antes de excluir (evita "sucesso" falso)
    $stmt = $pdo->prepare('SELECT id FROM duvidas WHERE id = :id');
    $stmt->execute(['id' => $id]);
    if (!$stmt->fetch()) jsonResponse(['erro' => 'Dúvida não encontrada.'], 404);

    $stmt = $pdo->prepare('DELETE FROM duvidas WHERE id = :id');
    $stmt->execute(['id' => $id]);
    jsonResponse(['sucesso' => true]);
}

jsonResponse(['erro' => 'Método não suportado.'], 405);
