"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

interface AddTransactionButtonProps {
  userCanAddTransaction?: boolean;
}

const AddTransactionButton = ({
  userCanAddTransaction,
}: AddTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full font-bold"
              onClick={() => setDialogIsOpen(true)}
              disabled={!userCanAddTransaction}
            >
              Adicionar transação
              <ArrowDownUpIcon />
            </Button>
            <UpsertTransactionDialog
              isOpen={dialogIsOpen}
              setIsOpen={setDialogIsOpen}
            />
          </TooltipTrigger>
          <TooltipContent>
            {!userCanAddTransaction &&
              "You have reached the limit of transactions for this month. Please upgrade to a premium plan."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default AddTransactionButton;
