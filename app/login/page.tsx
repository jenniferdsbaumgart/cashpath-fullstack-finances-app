import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const LoginPage = async () => {
  const { userId } = await auth();
  if (userId) {
    redirect("/");
  }
  return (
    <div className="grid h-full grid-cols-2">
      {/* LEFT */}
      <div className="mx-auto flex h-full max-w-[550px] flex-col justify-center p-8">
        <Image
          src="/monicount-logo.png"
          width={173}
          height={39}
          alt={"logo"}
          className="mb-8"
        />
        <h1 className="mb-3 text-4xl font-bold">Welcome!</h1>
        <p className="mb-8 text-muted-foreground">
          Monicount is a financial management platform that allows you to
          monitor your transactions and receive personalized insights, making it
          easier to control your budget.
        </p>
        <SignInButton>
          <Button variant="default">
            <LogInIcon className="mr-2" />
            Login or Create Account
          </Button>
        </SignInButton>
      </div>

      {/* RIGHT */}
      <div className="relative h-full w-full">
        <Image
          src="/monicount-login.svg"
          alt={"faça login"}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
