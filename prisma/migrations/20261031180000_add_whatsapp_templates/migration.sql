CREATE TYPE "WhatsappTemplateCategory" AS ENUM ('NORMAL', 'AUCTION');

CREATE TABLE "WhatsappTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hint" TEXT,
    "body" TEXT NOT NULL,
    "category" "WhatsappTemplateCategory" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsappTemplate_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WhatsappTemplate_category_sortOrder_idx" ON "WhatsappTemplate"("category", "sortOrder");

INSERT INTO "WhatsappTemplate" ("id", "name", "hint", "body", "category", "sortOrder", "createdAt", "updatedAt") VALUES
('first-contact', 'Primeiro contato', 'Apresentação rápida + pedido de retorno', 'Olá {{leadFirstName}}, aqui é o {{brokerName}}, corretor de imóveis em Palmas. Recebi seu contato e gostaria de entender melhor o que você procura para te enviar opções alinhadas. Qual o melhor horário para conversarmos?', 'NORMAL', 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('options-shared', 'Enviei opções', 'Confirma que mandou imóveis e pede feedback', '{{leadFirstName}}, separei algumas opções que combinam com o que você me passou. Começo por esta: {{propertyTitle}}. {{propertyUrl}}\n\nMe diz se faz sentido para irmos para a próxima ou se quer ajustar algum critério.', 'NORMAL', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('schedule-visit', 'Agendar visita', 'Propõe horário para visita', '{{leadFirstName}}, consigo agendar uma visita no {{propertyTitle}} nesta semana. Você tem disponibilidade amanhã à tarde ou prefere outro dia?', 'NORMAL', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('confirm-visit', 'Confirmar visita', 'Lembrete antes da visita', '{{leadFirstName}}, passando para confirmar nossa visita no {{propertyTitle}} em {{visitDate}}. Continua de pé? Me avise para eu organizar o acesso.', 'NORMAL', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('post-visit', 'Pós-visita', 'Pede a impressão após a visita', 'Obrigado pela visita, {{leadFirstName}}! Qual foi sua impressão do {{propertyTitle}}? Se quiser, posso preparar uma proposta hoje mesmo ou te mostrar outras opções na mesma faixa.', 'NORMAL', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('proposal-followup', 'Follow-up de proposta', 'Acompanha uma proposta enviada', '{{leadFirstName}}, tudo bem? Passando para saber sua decisão sobre a proposta que te enviei. Posso ajudar com alguma dúvida, simulação de financiamento ou ajuste no valor?', 'NORMAL', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('warm-up', 'Reaproximação (frio)', 'Reativa um lead que esfriou', 'Oi {{leadFirstName}}, fazem alguns dias que não falamos. Tenho novas oportunidades na sua faixa ({{budgetRange}}) que podem te interessar. Posso te enviar?', 'NORMAL', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('auction-first-contact', 'Leilão: primeiro contato', 'Entende o perfil antes de enviar oportunidades', 'Olá {{leadFirstName}}, aqui é o {{brokerName}}. Vi que você tem interesse em oportunidades de leilão. Quero entender seu perfil, faixa de investimento e região de interesse para te enviar lotes compatíveis. Podemos conversar?', 'AUCTION', 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('auction-lot-shared', 'Leilão: enviar lote', 'Apresenta o imóvel e o edital', '{{leadFirstName}}, encontrei uma oportunidade de leilão que pode fazer sentido para o seu perfil: {{propertyTitle}}. {{propertyUrl}} Posso te enviar o edital e os próximos pontos para análise.', 'AUCTION', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('auction-analysis', 'Leilão: análise', 'Confirma se o cliente quer analisar o lote', '{{leadFirstName}}, você conseguiu avaliar o lote {{propertyTitle}}? Se quiser, organizo com você os principais pontos do edital, ocupação, débitos e riscos antes de qualquer decisão.', 'AUCTION', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('auction-deadline', 'Leilão: prazo', 'Lembra o cliente de avaliar a oportunidade', '{{leadFirstName}}, passando para lembrar da oportunidade em {{propertyTitle}}. Quer que eu confira com você a data, o lance mínimo e os documentos antes do prazo?', 'AUCTION', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('auction-followup', 'Leilão: follow-up', 'Reaproxima após envio do material', '{{leadFirstName}}, tudo bem? Você conseguiu analisar o material do leilão? Se ainda fizer sentido, posso te ajudar a comparar essa oportunidade com outras antes de avançarmos.', 'AUCTION', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
