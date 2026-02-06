CREATE TABLE depense (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,

  category ENUM('besoins','envies') NOT NULL,

  sub_category ENUM(
    'logement',
    'factures_abonnements',
    'alimentation',
    'transport',
    'sante',
    'famille',
    'dette',
    'animaux',
    'détente'
  ) DEFAULT('détente'),

  is_automatique BOOLEAN DEFAULT FALSE,

  name VARCHAR(250) NOT NULL,         -- sous-sous-catégorie libre (ex: "loyer", "mutuelle", "essence")
  price DECIMAL(10,2) NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_depense_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

/*
Logement (loyer/charges/assurance)
factures & abonnements  (electricité, gaz, eau, internet, taxes)
alimentation (courses, hygième, ménage)
transport (pass, carburant, assurance auto, entretien, parking)
santée (mutuelle/assurance, medecin/pharmacie, soins, traitements)
famille (pension, garde enfant, depense scolaires)
dette (rembourssement de prets, impots)
animaux (nourriture vétérinaire)
*/