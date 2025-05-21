"use client";

import React, { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { BotIcon, Loader2Icon } from "lucide-react";
import { generateAiReport } from "../_actions/generate-ai-report";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import Markdown from "react-markdown";
import Link from "next/link";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12, fontFamily: "Helvetica" },
  section: { marginBottom: 10 },
  bold: { fontWeight: "bold" },
  listItem: { marginLeft: 12, marginBottom: 4 },
  paragraph: { marginBottom: 6, lineHeight: 1.4 },
  titleH3: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  titleH4: { fontSize: 14, fontWeight: "bold", marginBottom: 6 },
});

function parseMarkdownToPDFComponents(markdown: string) {
  const lines = markdown.split("\n");
  const components = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Títulos
    if (line.startsWith("### ")) {
      components.push(
        <Text key={i} style={styles.titleH3}>
          {line.replace(/^### /, "")}
        </Text>,
      );
      continue;
    }
    if (line.startsWith("#### ")) {
      components.push(
        <Text key={i} style={styles.titleH4}>
          {line.replace(/^#### /, "")}
        </Text>,
      );
      continue;
    }

    if (/^\d+\. /.test(line) || /^- /.test(line)) {
      const text = line.replace(/^\d+\. |- /, "");

      const parts = text.split(/(\*\*.*?\*\*)/g);

      components.push(
        <Text key={i} style={styles.listItem}>
          {parts.map((part, idx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <Text key={idx} style={styles.bold}>
                  {part.slice(2, -2)}
                </Text>
              );
            }
            return part;
          })}
        </Text>,
      );
      continue;
    }

    if (line.includes("**")) {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      components.push(
        <Text key={i} style={styles.paragraph}>
          {parts.map((part, idx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <Text key={idx} style={styles.bold}>
                  {part.slice(2, -2)}
                </Text>
              );
            }
            return part;
          })}
        </Text>,
      );
      continue;
    }

    components.push(
      <Text key={i} style={styles.paragraph}>
        {line}
      </Text>,
    );
  }

  return components;
}

const AiReportDocument = ({ report }: { report: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>{parseMarkdownToPDFComponents(report)}</View>
    </Page>
  </Document>
);

interface AiReportButtonProps {
  hasPremiumPlan: boolean;
  month: string;
}

const AiReportButton = ({ month, hasPremiumPlan }: AiReportButtonProps) => {
  const [report, setReport] = useState<string | null>(null);
  const [reportIsLoading, setReportIsLoading] = useState(false);

  const handleGenerateReportClick = async () => {
    try {
      setReportIsLoading(true);
      const aiReport = await generateAiReport({ month });
      setReport(aiReport);
    } catch (error) {
      console.error(error);
    } finally {
      setReportIsLoading(false);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setReport(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-xl border-[1px]">
          AI Report
          <BotIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        {hasPremiumPlan ? (
          <>
            <DialogHeader>
              <DialogTitle>AI Report</DialogTitle>
              <DialogDescription>
                Use artificial intelligence to generate a report with insights
                about your finances.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="prose max-h-[450px] text-white prose-h3:text-white prose-h4:text-white prose-strong:text-white">
              <Markdown>{report ?? ""}</Markdown>
            </ScrollArea>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              {!report ? (
                <Button
                  onClick={handleGenerateReportClick}
                  disabled={reportIsLoading}
                >
                  {reportIsLoading && <Loader2Icon className="animate-spin" />}
                  Generate Report
                </Button>
              ) : (
                <PDFDownloadLink
                  document={<AiReportDocument report={report} />}
                  fileName="ai-report.pdf"
                  style={{
                    textDecoration: "none",
                    padding: "8px 16px",
                    color: "#03826F",
                    border: "1px solid #03826F",
                    borderRadius: 6,
                    marginLeft: 8,
                    display: "inline-block",
                  }}
                >
                  {({ loading }) =>
                    loading ? "Preparing document..." : "Export PDF"
                  }
                </PDFDownloadLink>
              )}
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>AI Report</DialogTitle>
              <DialogDescription>
                You need a premium plan to generate AI reports.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button asChild>
                <Link href="/subscription">Subscribe to premium plan</Link>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AiReportButton;
