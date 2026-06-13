import api from "./api";

export async function login(username: string, password: string, code: string) {
  const { data } = await api.post("/auth/login", {
    username,
    password,
    code,
  });

  return data;
}
export async function adminLogin(username: string, password: string) {
  const { data } = await api.post("/auth/admin/login", {
    username,
    password,
  });

  return data;
}
