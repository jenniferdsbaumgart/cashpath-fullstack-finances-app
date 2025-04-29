import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SummaryCard from "./summary-card";
import { db } from "../../_lib/prisma";

interface SummaryCardsProps {
  month: string;
}

const SummaryCards = async ({ month }: SummaryCardsProps) => {
  const where = {
    date: {
      gte: new Date(`2025-${month}-01`),
      lte: new Date(`2025-${month}-31`),
    },
  };

  const depositsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "DEPOSIT" },
        _sum: { amount: true },
      })
    )?._sum.amount,
  );
  const investmentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "INVESTMENT" },
        _sum: { amount: true },
      })
    )?._sum.amount,
  );
  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      })
    )?._sum.amount,
  );
  const balance = depositsTotal - expensesTotal - investmentsTotal;
  return (
    <div className="space-y-6">
      {/* FIRST CARD */}
      <SummaryCard
        icon={<WalletIcon />}
        title="Balance"
        amount={balance}
        size="large"
      />

      {/* OTHER CARDS */}
      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          icon={<PiggyBankIcon />}
          title="Investments"
          amount={investmentsTotal}
        />
        <SummaryCard
          icon={<TrendingUpIcon className="text-primary" />}
          title="Deposits"
          amount={depositsTotal}
        />
        <SummaryCard
          icon={<TrendingDownIcon className="text-red-500" />}
          title="Expenses"
          amount={expensesTotal}
        />
      </div>
    </div>
  );
};

export default SummaryCards;
