import { ref, set } from "firebase/database";
import { db } from "./firebase";

export function writeUserData(userId, firstName, lastName, email) {
  set(ref(db, 'users/' + userId), {
      firstName,
      lastName,
      email,
  });
}