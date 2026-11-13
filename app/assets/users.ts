/**
 * Un usuario con rol master solo puede ser editado o eliminado por él mismo.
 * Misma regla que la API (`assertCanModifyUser` en users.controller.ts).
 */
export function canModifyUser(
  target: { _id: string; roles?: string[] },
  myId?: string,
): boolean {
  if (!target.roles?.includes("master")) return true;
  return !!myId && String(target._id) === String(myId);
}
