import { Badge } from "@/app/_components/ui/badge";
import { Transaction, TransactionType } from "@prisma/client";
import { CircleIcon } from "lucide-react";
interface TransactionTypeBadgeProps {
  transaction: Transaction;
}
const TransactionTypeBadge = ({ transaction }: TransactionTypeBadgeProps) => {
  if (transaction.type === TransactionType.DEPOSIT) {
    return (
      <Badge className="bg-teal-500 bg-opacity-10 font-bold text-teal-500 hover:bg-muted">
        <CircleIcon className="mr-2 fill-teal-500" size={10} />
        Deposit
      </Badge>
    );
  }
  if (transaction.type === TransactionType.EXPENSE) {
    return (
      <Badge className="font bold bg-danger bg-opacity-10 text-red-500 hover:bg-muted">
        <CircleIcon className="mr-2 fill-danger" size={10} />
        Expense
      </Badge>
    );
  }
  return (
    <Badge className="font bold bg-amber-500 bg-opacity-10 text-amber-500 hover:bg-muted">
      <CircleIcon className="mr-2 fill-amber-500" size={10} />
      Investment
    </Badge>
  );
};
export default TransactionTypeBadge;
