"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { LoginForm } from "./_components/login-form";
import { SignUpForm } from "./_components/sigin-up-form";

export default function AuthPage() {
  const [tab, setTab] = useState("login");

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-between gradient-hero text-white p-10">
        <div className="text-xl font-bold">BeautyPro</div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">
            Gerencie seu salão com facilidade
          </h1>
          <p className="text-zinc-300">
            Agendamentos, clientes e faturamento em um só lugar.
          </p>
        </div>

        <p className="text-sm text-zinc-400">© 2026 BeautyPro</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-300">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Criar conta</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <LoginForm key="login" />
            </TabsContent>

            {/* REGISTER */}
            <TabsContent value="register">
              <SignUpForm key="register" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
