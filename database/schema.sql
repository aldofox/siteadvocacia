-- =============================================================================
-- Fontella & Ribeiro Advogados — Banco de Dados
-- Compatível com MySQL 5.7+ / MariaDB 10.3+
-- =============================================================================

-- Garante que os acentos (UTF-8) sejam interpretados corretamente durante
-- a importação deste arquivo, independentemente do charset padrão do cliente.
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS escritorio_advocacia
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE escritorio_advocacia;

-- -----------------------------------------------------------------------
-- Tabela: administradores
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS administradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(60) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(120) NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Usuário padrão: admin / admin123
-- (o hash abaixo foi gerado com password_hash('admin123', PASSWORD_DEFAULT))
INSERT INTO administradores (usuario, senha_hash, nome) VALUES
  ('admin', '$2y$10$uRF5hnavkKO2bA0ztpaNmubHVw2gsnuRDC6kfkZ3B95aEUPptBitO', 'Administrador do Escritório')
ON DUPLICATE KEY UPDATE usuario = usuario;

-- -----------------------------------------------------------------------
-- Tabela: advogados
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS advogados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  oab VARCHAR(60) NOT NULL,
  atuacao VARCHAR(500) NOT NULL COMMENT 'palavras-chave separadas por vírgula',
  foto VARCHAR(500) DEFAULT NULL,
  descricao TEXT,
  destaque TINYINT(1) NOT NULL DEFAULT 0,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO advogados (nome, oab, atuacao, foto, descricao, destaque) VALUES
('Dra. Camila Fontella', 'OAB/SC 45.812', 'Direito de Família, Sucessões, Divórcio',
 'img/advogados/sofia.JPG',
 'Sócia-fundadora do escritório. Atua há 14 anos em Direito de Família e Sucessões, com foco em soluções extrajudiciais e mediação de conflitos familiares.', 1),

('Dr. Eduardo Ribeiro', 'OAB/SC 38.204', 'Direito Empresarial, Contratos, Recuperação Judicial',
 'img/advogados/eduardo_ribeiro.jpg',
 'Sócio-fundador do escritório. Especialista em Direito Empresarial e Societário, assessora empresas de pequeno a grande porte em contratos e reestruturações.', 1),

('Dra. Renata Azevedo', 'OAB/SC 51.977', 'Direito Trabalhista, Acordos Coletivos',
 'img/advogados/renata_azevedo.jpg',
 'Advogada trabalhista com atuação em ações individuais e coletivas, representando tanto empregados quanto empresas em todas as instâncias.', 0),

('Dr. Marcos Vinícius Souza', 'OAB/SC 42.310', 'Direito Criminal, Júri, Habeas Corpus',
 'img/advogados/tiago_nascimento.jpg',
 'Advogado criminalista, atua em defesas técnicas em todas as fases do processo penal, do inquérito ao tribunal do júri.', 0),

('Dr. Felipe Antunes', 'OAB/SC 55.630', 'Direito Cível, Imobiliário, Consumidor',
 'img/advogados/eduardo_ribeiro.jpg',
 'Atua em contratos imobiliários, ações de reparação de danos e defesa do consumidor, com abordagem objetiva e orientada a resultados.', 0),

('Dr. Thiago Nascimento', 'OAB/SC 47.895', 'Direito Tributário, Planejamento Fiscal',
 'img/advogados/tiago_nascimento.jpg',
 'Especialista em planejamento tributário e contencioso fiscal, auxiliando empresas na redução legal da carga tributária.', 0);

-- -----------------------------------------------------------------------
-- Tabela: duvidas
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS duvidas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(180) NOT NULL,
  duvida TEXT NOT NULL,
  status ENUM('pendente', 'respondida') NOT NULL DEFAULT 'pendente',
  resposta TEXT DEFAULT NULL,
  respondido_por VARCHAR(150) DEFAULT NULL,
  data_postagem DATETIME DEFAULT CURRENT_TIMESTAMP,
  data_resposta DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO duvidas (nome, email, duvida, status, resposta, respondido_por, data_postagem, data_resposta) VALUES
('Juliana Marques', 'juliana.marques@email.com',
 'Fui demitida sem justa causa e não recebi as verbas rescisórias no prazo. O que posso fazer?',
 'respondida',
 'Juliana, a empresa tem até 10 dias corridos após o desligamento para efetuar o pagamento das verbas rescisórias. Passado esse prazo, incide multa em seu favor. Recomendo agendar uma consulta para avaliarmos o cálculo correto e, se necessário, ingressar com reclamação trabalhista.',
 'Dra. Renata Azevedo', '2026-07-10 09:00:00', '2026-07-11 14:20:00'),

('Roberto Lima', 'roberto.lima@email.com',
 'Quero abrir uma empresa com um sócio, mas tenho receio de conflitos futuros. É possível me proteger juridicamente desde o início?',
 'respondida',
 'Sim, Roberto. Um contrato social bem elaborado, com cláusulas claras sobre saída de sócio, divisão de lucros e resolução de conflitos (como cláusula de arbitragem), evita boa parte dos problemas futuros. Podemos elaborar esse contrato sob medida para o seu negócio.',
 'Dr. Eduardo Ribeiro', '2026-07-15 11:30:00', '2026-07-16 10:05:00'),

('Ana Beatriz Costa', 'ana.costa@email.com',
 'Estou em processo de divórcio e gostaria de saber como funciona a partilha de bens adquiridos antes do casamento.',
 'pendente', NULL, NULL, '2026-07-20 16:45:00', NULL),

('Carlos Eduardo Pires', 'carlos.pires@email.com',
 'Comprei um imóvel na planta e a construtora atrasou a entrega em mais de 8 meses. Tenho direito a indenização?',
 'pendente', NULL, NULL, '2026-07-22 08:15:00', NULL);

-- -----------------------------------------------------------------------
-- Tabela: mensagens (formulário "Fale Conosco")
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mensagens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  telefone VARCHAR(40) DEFAULT NULL,
  email VARCHAR(180) NOT NULL,
  mensagem TEXT NOT NULL,
  data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
  lida TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
