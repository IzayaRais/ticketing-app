import React from "react";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { RegistrationData } from "./validations";

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  container: {
    margin: 40,
    border: "1pt solid #E5E7EB",
    height: "90%",
    position: "relative",
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 8,
    height: "100%",
    backgroundColor: "#800000",
  },
  header: {
    padding: "50 50 20 50",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    textAlign: "right",
  },
  title: {
    fontSize: 32,
    fontWeight: "black",
    color: "#111827",
    letterSpacing: -1,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 10,
    color: "#800000",
    letterSpacing: 4,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  venueDate: {
    fontSize: 9,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "bold",
  },
  content: {
    padding: "0 50",
    marginTop: 40,
  },
  idBox: {
    backgroundColor: "#F9FAFB",
    padding: 30,
    borderRadius: 12,
    border: "0.5pt solid #E5E7EB",
    marginBottom: 50,
  },
  idLabel: {
    fontSize: 8,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 3,
    marginBottom: 10,
    textAlign: "center",
  },
  idValue: {
    fontSize: 48,
    color: "#800000",
    fontWeight: "black",
    textAlign: "center",
    letterSpacing: 10,
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    borderTop: "0.5pt solid #F3F4F6",
    paddingTop: 30,
  },
  gridItem: {
    width: "50%",
    marginBottom: 30,
  },
  label: {
    fontSize: 8,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 5,
    fontWeight: "bold",
  },
  value: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    left: 50,
    right: 50,
    borderTop: "1pt solid #E5E7EB",
    paddingTop: 30,
  },
  footerTop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  instruction: {
    fontSize: 8,
    color: "#6B7280",
    lineHeight: 1.6,
    maxWidth: "70%",
  },
  seal: {
    width: 60,
    height: 60,
    border: "1.5pt solid #800000",
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.15,
  },
  sealText: {
    fontSize: 7,
    color: "#800000",
    fontWeight: "black",
    textAlign: "center",
    textTransform: "uppercase",
  },
  copyright: {
    fontSize: 7,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 20,
    textTransform: "uppercase",
    letterSpacing: 2,
  }
});

const TicketDocument = ({ data, ticketId }: { data: RegistrationData; ticketId: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <View style={styles.accentBar} />
        
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.subtitle}>Antorip 2026 Presents</Text>
            <Text style={styles.title}>The Farewell</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.venueDate}>April 09 // 2026</Text>
            <Text style={styles.venueDate}>MIST Central Field</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.idBox}>
            <Text style={styles.idLabel}>Gate Authentication Pass</Text>
            <Text style={styles.idValue}>{ticketId}</Text>
          </View>

          <View style={styles.grid}>
            {[
              { label: "Attendee", value: data.fullName },
              { label: "Institutional Identity", value: data.university },
              { label: "Student Credential", value: data.studentId },
              { label: "Gender / Identity", value: data.gender },
              { label: "Medical Info", value: `Blood Group: ${data.bloodGroup}` },
              { label: "Contact Reference", value: data.phone },
              { label: "Digital Registry", value: data.email },
            ].map((item, i) => (
              <View key={i} style={styles.gridItem}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerTop}>
            <View style={styles.instruction}>
              <Text style={{ fontWeight: "bold", color: "#111827", marginBottom: 5, fontSize: 9 }}>Official Admission Protocol</Text>
              <Text>• Original institutional ID card is mandatory for venue ingress.</Text>
              <Text>• This digital pass is unique and non-transferable.</Text>
              <Text>• Unauthorized duplication is strictly prohibited and traceable.</Text>
              <Text>• Gate opens precisely at 18:00 HRS. Late arrivals may be restricted.</Text>
            </View>
            <View style={styles.seal}>
               <Text style={styles.sealText}>Verified</Text>
               <Text style={styles.sealText}>Antorip</Text>
               <Text style={styles.sealText}>2026</Text>
            </View>
          </View>
          <Text style={styles.copyright}>MIST Central Field, Mirpur Cantonment, Dhaka · 2026</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function generateTicketPdf(data: RegistrationData, ticketId: string) {
  try {
    const buffer = await renderToBuffer(<TicketDocument data={data} ticketId={ticketId} />);
    return buffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
