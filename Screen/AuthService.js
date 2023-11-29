import { users } from "./UserData";

export const authenticateUser = (username, password) => {
  console.log('Received username:', username);
  console.log('Received password:', password);
  const user = users.find(
    (u) => u.username === username && u.password.toLowerCase() === password.toLowerCase()
  );
  return Boolean(user);
};