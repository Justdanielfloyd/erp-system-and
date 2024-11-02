import z from "zod";
export const loginSchema = z.object({
  email: z
    .string()
    .min(5, {
      message: "El correo electrónico debe contener al menos 5 caracteres.",
    })
    .email(
      "Este correo electrónico no es válido. Asegúrate de que esté escrito como ejemplo@correo.com."
    ),
  password: z
    .string()
    .min(2, { message: "La contraseña debe contener al menos 8 caracteres." }),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
