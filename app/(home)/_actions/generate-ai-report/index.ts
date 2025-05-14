"use server";
import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { GenerateAiReportSchema, generateAiReportSchema } from "./schema";

export const generateAiReport = async ({ month }: GenerateAiReportSchema) => {
  generateAiReportSchema.parse({ month });
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const user = await clerkClient().users.getUser(userId);
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";
  if (!hasPremiumPlan) {
    throw new Error("You need a premium plan to use this feature");
  }

  const openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  // get the monthly transactions for the user
  const transactions = await db.transaction.findMany({
    where: {
      date: {
        gte: new Date(`2025-${month}-01`),
        lte: new Date(`2025-${month}-31`),
      },
    },
  });
  // send to chatgpt and as to generate the report with insights
  const content = `Generate a report of my following finance transactions with insights and suggestions for improve my finance management. The transactions are divided by dot and comma. The structure of each transaction is {DATE}--{TYPE}--{VALUE}--{CATEGORY}. The transactions are: ${transactions.map((transaction) => `${transaction.date.toLocaleDateString("pt-BR")}--${transaction.type}--US$${transaction.amount}--${transaction.category}`).join(";")}. Please do not include a table in the report.`;
  const response = await openAi.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a financial advisor. You are very good at generating reports and giving insights about finance management.",
      },
      {
        role: "user",
        content,
      },
    ],
  });
  // return the report
  return response.choices[0].message.content;
};
