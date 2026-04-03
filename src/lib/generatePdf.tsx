import React from "react";
import { Document, Page, Text, View, StyleSheet, renderToBuffer, Image } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { RegistrationData } from "./validations";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 10,
    color: "#475569",
  },
  ticketIdBox: {
    marginTop: 8,
    marginBottom: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
  },
  ticketIdLabel: {
    fontSize: 9,
    color: "#64748B",
    marginBottom: 4,
  },
  ticketIdValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7F0000",
    letterSpacing: 1,
  },
  infoRow: {
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 9,
    color: "#64748B",
  },
  infoValue: {
    fontSize: 11,
    color: "#0F172A",
    marginTop: 1,
  },
  qrWrap: {
    marginTop: 14,
    alignItems: "center",
  },
  qrImage: {
    width: 100,
    height: 100,
  },
  footer: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.5,
  },
});

function safeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

const TicketDocument = ({
  data,
  ticketId,
  qrCodeUrl,
}: {
  data: RegistrationData;
  ticketId: string;
  qrCodeUrl: string;
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>অন্তরীপ ২১ Farewell Concert 2026</Text>
          <Text style={styles.subtitle}>MIST Central Field - April 09, 2026</Text>
        </View>

        <View style={styles.ticketIdBox}>
          <Text style={styles.ticketIdLabel}>Ticket ID</Text>
          <Text style={styles.ticketIdValue}>{safeText(ticketId)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{safeText(data.fullName)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{safeText(data.email)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{safeText(data.phone)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Institution</Text>
          <Text style={styles.infoValue}>{safeText(data.university)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Student ID</Text>
          <Text style={styles.infoValue}>{safeText(data.studentId)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Gender</Text>
          <Text style={styles.infoValue}>{safeText(data.gender)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Blood Group</Text>
          <Text style={styles.infoValue}>{safeText(data.bloodGroup)}</Text>
        </View>

        <View style={styles.qrWrap}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={qrCodeUrl} style={styles.qrImage} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Gates open at 1:00 PM. Carry your original student ID for entry verification.</Text>
        </View>
      </Page>
    </Document>
  );
};

const FallbackDocument = ({ ticketId }: { ticketId: string }) => (
  <Document>
    <Page size="A4" style={{ padding: 32, fontFamily: "Helvetica" }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Ticket</Text>
      <Text style={{ fontSize: 12 }}>Ticket ID: {ticketId}</Text>
      <Text style={{ fontSize: 11, marginTop: 12 }}>
        Your registration is successful. Please contact support if this PDF looks incomplete.
      </Text>
    </Page>
  </Document>
);

export async function generateTicketPdf(data: RegistrationData, ticketId: string) {
  try {
    const qrCodeUrl = await QRCode.toDataURL(ticketId, { width: 200, margin: 1 });
    return await renderToBuffer(<TicketDocument data={data} ticketId={ticketId} qrCodeUrl={qrCodeUrl} />);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error generating rich PDF, falling back:", message);
    return await renderToBuffer(<FallbackDocument ticketId={ticketId} />);
  }
}
