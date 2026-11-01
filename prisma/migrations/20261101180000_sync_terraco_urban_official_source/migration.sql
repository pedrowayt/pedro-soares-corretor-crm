-- Refresh the Terraço Urban CRM record with the official folder and Urban Vendas data.
-- Prices remain intentionally hidden and are not populated here.
UPDATE "Development"
SET
  "summary" = 'Apartamentos de 3 quartos, 3 suítes plenas ou 4 suítes na Orla 14, com lazer resort, terraços amplos e vista para o Lago de Palmas.',
  "bedroomsTo" = 4,
  "availableUnits" = 1,
  "amenities" = ARRAY[
    'Piscina com borda infinita, deck molhado e raia de 25 m',
    'Piscina infantil, bangalôs e deck seco',
    'Academia, quadra de esportes e pista de corrida',
    'Brinquedoteca, playground e salão de jogos',
    'Espaços gourmet, churrasqueiras e redário',
    'Pet place, coworking e bike share',
    'Rooftop com dois espaços gourmet integráveis',
    'Vaga para carro elétrico, guarda-volumes e delivery room',
    'Wi-Fi nas áreas comuns, gerador, mercado e portaria 24 horas',
    'Espaço de ferramentas compartilhado'
  ],
  "projectText" = 'O Terraço Urban privilegia a integração dos ambientes, com grandes esquadrias, terraços e lazer resort para viver a Orla de Palmas. O material oficial apresenta opções de 3 quartos, 3 suítes plenas e 4 suítes.',
  "apartmentsText" = 'Plantas de 94,30 m² com 3 quartos, 113,51 m² com 3 suítes plenas e 149,29 m² com 4 suítes.',
  "mapEmbedUrl" = 'https://www.google.com/maps?q=Quadra+Orla+14+Avenida+Orla,+11,+Palmas+-+TO&output=embed',
  "seoDescription" = 'Conheça o Terraço Urban na Orla 14 de Palmas: plantas de 94,30 a 149,29 m², lazer resort e vista para o Lago de Palmas.',
  "showPrice" = false,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'terraco-urban';
