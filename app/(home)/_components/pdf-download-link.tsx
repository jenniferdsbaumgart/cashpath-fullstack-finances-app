import { PDFDownloadLink } from "@react-pdf/renderer";
import AiReportPdfDocument from "./ai-report-pdf-document";

export default function AiReportPdfDownloadLink({
  report,
}: {
  report: string;
}) {
  return (
    <PDFDownloadLink
      document={<AiReportPdfDocument report={report} />}
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
      {({ loading }) => (loading ? "Preparing document..." : "Export PDF")}
    </PDFDownloadLink>
  );
}
