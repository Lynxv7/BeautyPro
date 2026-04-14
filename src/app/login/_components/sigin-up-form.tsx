"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

//
// SCHEMA
//
const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Nome é obrigatório"),

    email: z
      .string()
      .trim()
      .min(1, "E-mail é obrigatório")
      .email("E-mail inválido"),

    password: z
      .string()
      .trim()
      .min(8, "A senha deve ter pelo menos 8 caracteres"),

    confirmPassword: z.string().trim().min(8, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof registerSchema>;

//
// COMPONENT
//
export function SignUpForm() {
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  //
  // SUBMIT
  //
  const handleSubmit = async (values: SignUpFormValues) => {
    await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          toast.success("Conta criada com sucesso 🚀");
          router.push("/dashboard");
        },

        onError: (ctx) => {
          const code = ctx?.error?.code;

          if (code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
            toast.error("Esse e-mail já está em uso.");
            return;
          }

          if (code === "USER_ALREADY_EXISTS") {
            toast.error("Esse e-mail já está cadastrado.");
            return;
          }

          if (code === "INVALID_EMAIL") {
            toast.error("E-mail inválido.");
            return;
          }

          if (code === "PASSWORD_TOO_SHORT") {
            toast.error("Senha muito curta (mínimo 8 caracteres).");
            return;
          }

          toast.error("Erro ao criar conta.");
        },
      },
    );
  };

  return (
    <Card className="rounded-2xl shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>
              Crie sua conta para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PASSWORD */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CONFIRM PASSWORD */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Criar conta"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
