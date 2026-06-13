"use client";

import { Button, Card, Form, Input } from "antd";
import { login } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/services/store";
import { useShowError } from "@/components/utils/ShowError";

export default function LoginPage() {
  const router = useRouter();
  const showError = useShowError();

  async function onFinish(values: {
    username: string;
    password: string;
    code: string;
  }) {
    try {
      const response = await login(
        values.username,
        values.password,
        values.code,
      );
      useAuthStore.getState().setAuth(response.token, response.user, "user");
      router.push("/dashboard/leagues");
    } catch (e) {
      await showError(e);
    }
  }

  return (
    <Card
      className="w-full max-w-md rounded-4x"
      style={{ backgroundColor: "black" }}
    >
      <div className="mb-8 text-center">
        <div className="mb-3 text-5xl">⚽</div>

        <h1 className="text-3xl font-bold text-white">Futbol App</h1>

        <p className="mt-2 text-sm text-gray-400">
          Gestión profesional de ligas y equipos
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={<span className="text-white">Código de liga</span>}
          name="code"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            placeholder="Ingrese el código de liga"
            className="!bg-green-100 !text-black !border-zinc-700"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-300">Usuario</span>}
          name="username"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            placeholder="Ingrese su usuario"
            className="!bg-green-100 !text-black !border-zinc-700"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-300">Contraseña</span>}
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password
            size="large"
            placeholder="Ingrese su contraseña"
            className="!bg-green-100 !text-black !border-zinc-700"
          />
        </Form.Item>

        <Button
          htmlType="submit"
          block
          size="large"
          className="
                !h-12
                !bg-zinc-600
                hover:!bg-zinc-500
                !border-none
                !text-white
                !font-semibold
                !rounded-lg
              "
        >
          Ingresar
        </Button>
      </Form>
    </Card>
    // </div>
  );
}
