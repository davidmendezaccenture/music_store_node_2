const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Ruta absoluta al archivo users.json
const usersFilePath = path.resolve(__dirname, '../../backend/data/users.json');
// Leer y parsear el archivo users.json
let users = JSON.parse(fs.readFileSync(usersFilePath));

// Encriptar contraseñas si no están encriptadas aún
users = users.map(user => {
  if (!user.password.startsWith('$2')) {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    return { ...user, password: hashedPassword };
  }
  return user;
});

// Guardar el archivo actualizado
fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

console.log('✅ Contraseñas encriptadas correctamente.');
