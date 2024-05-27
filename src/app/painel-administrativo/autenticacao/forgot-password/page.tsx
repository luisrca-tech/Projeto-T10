"use client";
import {
  Container,
  Form,
  ButtonText,
  ButtonsTextContainer,
  OthersRegisterContainer,
} from "./styles";
import { useRouter } from "next/navigation";
import Input, {
  InputProps,
  InputSchema,
} from "@/app/components/AuthenticationUp";
import Button from "@/app/components/Button";
import GoogleImage from "../../../../../public/google img.svg";
import LinkedinImage from "../../../../../public/linkedin img.svg";
import Image from "next/image";
import { roboto } from "@/app/fonts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ForgotPassword() {
  const {
    handleSubmit,
    formState: { isSubmitting, isSubmitted },
  } = useForm<InputProps>({
    resolver: zodResolver(InputSchema),
  });
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleBackupPassword(e: SubmitEvent) {
    e.preventDefault();

    setLoading(isSubmitting && !loading)
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit(() => handleBackupPassword)}>
        <Input
          label="E-MAIL"
          id="email"
          type="email"
          placeholder="email@exemplo.com"
          autoComplete="useremail"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required={isSubmitted}
        />
        <Input
          label="Password"
          isPassword={true}
          id="password"
          type="password"
          placeholder="Nova senha"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required={isSubmitted}
        />
        <Input
          label="NewPassword"
          isPassword={true}
          id="Newpassword"
          type="password"
          placeholder="Confirme a nova senha"
          autoComplete="new-password"
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          required={isSubmitted}
        />
        <Button
          className={roboto.className}
          type="submit"
          text="Confirmar"
          loading={loading}
        />

        <OthersRegisterContainer>
          <div>
            <span className={roboto.className}>Entre com sua conta</span>
          </div>

          <div>
            <Image src={GoogleImage} alt="" width={50} height={50} />
            <Image src={LinkedinImage} alt="" width={50} height={50} />
          </div>
        </OthersRegisterContainer>
      </Form>
    </Container>
  );
}
