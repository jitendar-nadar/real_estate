import bcrypt from "bcryptjs";
import { StoredUser } from "./auth-types";
import { getUserByEmail } from "./db/users";

export async function verifyCredentials(
  email: string,
  password: string
): Promise<StoredUser | null> {
  try {
    const user = await getUserByEmail(email);
    if (!user?.passwordHash) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : null;
  } catch (err) {
    console.error("verifyCredentials error:", err);
    return null;
  }
}
