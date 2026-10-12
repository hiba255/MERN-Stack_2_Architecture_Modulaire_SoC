const { estNonVide, estEmailValide } = require('../utils/validators');

// Données isolées dans le contrôleur
let users = [
  {
    id: 1,
    name: 'Aya',
    email: 'aya@gmail.com',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Foufou',
    email: 'foufou@gmail.com',
    role: 'user'
  }
];

let prochainId = 3;

// 1. Récupérer tous les utilisateurs avec filtre optionnel ?role=...

const getAllUsers = (req, res) => {
  const { role } = req.query;

  let resultat = users;

  if (role) {
    resultat = users.filter(u => u.role === role);
  }

  res.status(200).json({
    total: resultat.length,
    users: resultat
  });
};

// 2. Récupérer un utilisateur par son ID

const getUserById = (req, res) => {
  const id = Number(req.params.id);

  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      error: `Utilisateur ${id} introuvable`
    });
  }

  res.status(200).json(user);
};

// 3. Créer un nouvel utilisateur

const createUser = (req, res) => {
  const { name, email, role } = req.body;

  if (!estNonVide(name) || !estEmailValide(email) || !estNonVide(role)) {
    return res.status(400).json({
      error: 'Le nom, l’email et le rôle sont obligatoires'
    });
  }

  const nouvelUser = {
    id: prochainId++,
    name,
    email,
    role: role || 'user'
  };

  users.push(nouvelUser);

  res.status(201).json({
    message: 'Utilisateur créé',
    user: nouvelUser
  });
};

// 4. Supprimer un utilisateur

const deleteUser = (req, res) => {
  const id = Number(req.params.id);

  const userExiste = users.some(u => u.id === id);

  if (!userExiste) {
    return res.status(404).json({
      error: `Impossible de supprimer : utilisateur ${id} introuvable`
    });
  }

  users = users.filter(u => u.id !== id);

  res.status(200).json({
    message: `Utilisateur ${id} supprimé avec succès`
  });
};

// Exportation CommonJS

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser
};