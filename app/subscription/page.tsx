import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import { Card, CardContent, CardHeader } from "../_components/ui/card";
import { CheckIcon, XIcon } from "lucide-react";
import AcquirePlanButton from "./_components/acquire-plan-button";

const SubscriptionPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />;
      <div className="space-y-6 p-6">
        <h1 className="fon-bold text-2xl">Subscription</h1>
        <div className="flex gap-6">
          <Card className="w-[450px]">
            <CardHeader className="border-slid border-b py-8">
              <h2 className="text-center text-2xl font-semibold">Basic Plan</h2>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">$</span>
                <span className="text-6xl font-semibold">0</span>
                <span className="text-moted-foreground text-2xl">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 py-8">
              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary" />
                <p>Just 10 transactions per month</p>
                <div className="flex items-center gap-3">
                  <XIcon />
                  <p>AI Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-[450px]">
            <CardHeader className="border-slid border-b py-8">
              <h2 className="text-center text-2xl font-semibold">
                Premium Plan
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">$</span>
                <span className="text-6xl font-semibold">5</span>
                <span className="text-moted-foreground text-2xl">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 py-8">
              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary" />
                <p>Ilimitaded transactions</p>
                <div className="flex items-center gap-3">
                  <CheckIcon className="text-primary" />
                  <p>AI Reports</p>
                </div>
              </div>
              <AcquirePlanButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
