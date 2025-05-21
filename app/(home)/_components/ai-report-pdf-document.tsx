import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

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

const AiReportPdfDocument = ({ report }: { report: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>{parseMarkdownToPDFComponents(report)}</View>
    </Page>
  </Document>
);

export default AiReportPdfDocument;
