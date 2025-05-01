import { ref, set } from "firebase/database";
import { db } from "./firebase";

export const writeUserData = async (userId, firstName, lastName, email) => {
  const userRef = ref(db, 'users/' + userId);
  await set(userRef, {
      firstName,
      lastName,
      email,
  });
}