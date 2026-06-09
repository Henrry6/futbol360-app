import api from "./api";

export async function login(username: string, password: string, code: string) {
  const { data } = await api.post("/auth/login", {
    username,
    password,
    code,
  });

  return data;
}
