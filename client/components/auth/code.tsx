"use client";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { handleSignUpConfirmation } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";

export function Code() {
  const [code, setCode] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const handleVerify = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // use email and code directly
    try {
      const result = await handleSignUpConfirmation({
        username: email,
        confirmationCode: code,
      });
      if (result === true) {
        router.push("/login");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-4" variant="outline">
          Verify your account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Code</DialogTitle>
          <DialogDescription>
            Enter the code you received in your email
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              email
            </Label>
            <Input
              id="code"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              className="col-span-3"
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              code
            </Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              type="text"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleVerify}>
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
