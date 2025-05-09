"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/app/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { TransactionType } from "@prisma/client";
import { TransactionPercentagePerType } from "@/app/_data/get-dashboard/types";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import PercentageItem from "./percentage-item";

const chartConfig = {
  [TransactionType.INVESTMENT]: {
    label: "Investments",
    color: "#CE8D00",
  },
  [TransactionType.DEPOSIT]: {
    label: "Deposits",
    color: "#55B02E",
  },
  [TransactionType.EXPENSE]: {
    label: "Expenses",
    color: "#E93030",
  },
} satisfies ChartConfig;

interface TransactionsPieChartProps {
  typesPercentage: TransactionPercentagePerType;
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
}

const TransactionsPieChart = ({
  depositsTotal,
  investmentsTotal,
  expensesTotal,
  typesPercentage,
}: TransactionsPieChartProps) => {
  const chartData = [
    {
      type: TransactionType.DEPOSIT,
      amount: depositsTotal,
      fill: "#03826F",
    },
    {
      type: TransactionType.EXPENSE,
      amount: expensesTotal,
      fill: "#BE1A1A",
    },
    {
      type: TransactionType.INVESTMENT,
      amount: investmentsTotal,
      fill: "#CE8D00",
    },
  ];
  return (
    <Card className="flex flex-col p-6">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="type"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>

        <div className="space-y-3">
          <PercentageItem
            icon={<TrendingUpIcon size={16} className="text-teal-500" />}
            title="Deposits"
            value={typesPercentage[TransactionType.DEPOSIT]}
          />
          <PercentageItem
            icon={<TrendingDownIcon size={16} className="text-red-600" />}
            title="Expenses"
            value={typesPercentage[TransactionType.EXPENSE]}
          />
          <PercentageItem
            icon={<PiggyBankIcon size={16} className="text-amber-500" />}
            title="Investments"
            value={typesPercentage[TransactionType.INVESTMENT]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsPieChart;
