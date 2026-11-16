<?php
/**
 * api/advogados.php
 * -----------------------------------------------------------------------
 * GET    /api/advogados.php          -> lista todos os advogados (público)
 * POST   /api/advogados.php          -> cria advogado (admin)
 * PUT    /api/advogados.php?id=1     -> atualiza advogado (admin)
 * DELETE /api/advogados.php?id=1     -> remove advogado (admin)
 * -----------------------------------------------------------------------
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

/** Converte a linha do banco (atuacao como string) para o formato usado no front-end (array). */
function formatLawyer(array $row): array {
    return [
        'id' => (int) $row['id'],
        'nome' => $row['nome'],
        'oab' => $row['oab'],
        'atuacao' => array_values(array_filter(array_map('trim', explode(',', $row['atuacao'])))),
        'foto' => $row['foto'],
        'descricao' => $row['descricao'],
        'destaque' => (bool) $row['destaque'],
    ];
}

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM advogados ORDER BY destaque DESC, nome ASC');
    $rows = $stmt->fetchAll();
    jsonResponse(array_map('formatLawyer', $rows));
}

if ($method === 'POST') {
    requireAdmin();
    requireCsrf();
    $body = getJsonBody();
    $nome = trim($body['nome'] ?? '');
    $oab = trim($body['oab'] ?? '');
    $atuacao = trim($body['atuacao'] ?? ''); // já vem como string "A, B, C" do front-end
    $foto = trim($body['foto'] ?? '');
    $descricao = trim($body['descricao'] ?? '');
    $destaque = !empty($body['destaque']) ? 1 : 0;

    if ($nome === '' || $oab === '') {
        jsonResponse(['erro' => 'Nome e OAB são obrigatórios.'], 422);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO advogados (nome, oab, atuacao, foto, descricao, destaque)
         VALUES (:nome, :oab, :atuacao, :foto, :descricao, :destaque)'
    );
    $stmt->execute([
        'nome' => $nome,
        'oab' => $oab,
        'atuacao' => $atuacao,
        'foto' => $foto,
        'descricao' => $descricao,
        'destaque' => $destaque,
    ]);

    $id = $pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM advogados WHERE id = :id');
    $stmt->execute(['id' => $id]);
    jsonResponse(formatLawyer($stmt->fetch()), 201);
}

if ($method === 'PUT') {
    requireAdmin();
    requireCsrf();
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) jsonResponse(['erro' => 'ID inválido.'], 422);

    $body = getJsonBody();
    $nome = trim($body['nome'] ?? '');
    $oab = trim($body['oab'] ?? '');
    $atuacao = trim($body['atuacao'] ?? '');
    $foto = trim($body['foto'] ?? '');
    $descricao = trim($body['descricao'] ?? '');
    $destaque = !empty($body['destaque']) ? 1 : 0;

    if ($nome === '' || $oab === '') {
        jsonResponse(['erro' => 'Nome e OAB são obrigatórios.'], 422);
    }

    $stmt = $pdo->prepare(
        'UPDATE advogados SET nome=:nome, oab=:oab, atuacao=:atuacao,
         foto=:foto, descricao=:descricao, destaque=:destaque WHERE id=:id'
    );
    $stmt->execute([
        'nome' => $nome, 'oab' => $oab, 'atuacao' => $atuacao,
        'foto' => $foto, 'descricao' => $descricao, 'destaque' => $destaque, 'id' => $id,
    ]);

    $stmt = $pdo->prepare('SELECT * FROM advogados WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    if (!$row) jsonResponse(['erro' => 'Advogado não encontrado.'], 404);
    jsonResponse(formatLawyer($row));
}

if ($method === 'DELETE') {
    requireAdmin();
    requireCsrf();
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) jsonResponse(['erro' => 'ID inválido.'], 422);

    // Verifica se o registro existe antes de excluir (evita "sucesso" falso)
    $stmt = $pdo->prepare('SELECT id FROM advogados WHERE id = :id');
    $stmt->execute(['id' => $id]);
    if (!$stmt->fetch()) {
        jsonResponse(['erro' => 'Advogado não encontrado.'], 404);
    }

    $stmt = $pdo->prepare('DELETE FROM advogados WHERE id = :id');
    $stmt->execute(['id' => $id]);
    jsonResponse(['sucesso' => true]);
}

jsonResponse(['erro' => 'Método não suportado.'], 405);
