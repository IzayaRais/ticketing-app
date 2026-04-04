import React from "react";
import path from "path";
import fs from "fs";
import { Document, Page, Text, View, StyleSheet, renderToBuffer, Image, Font } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { RegistrationData } from "./validations";

const anekBanglaPath = path.join(process.cwd(), "public", "fonts", "AnekBangla.ttf");
const hasAnekBangla = fs.existsSync(anekBanglaPath);

if (hasAnekBangla) {
  Font.register({
    family: "AnekBangla",
    src: anekBanglaPath,
  });
}

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: "#FAFAFA",
    fontFamily: hasAnekBangla ? "AnekBangla" : "Helvetica",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  mainContent: {
    flex: 1,
  },
  topSection: {
    backgroundColor: "#1A1A2E",
    padding: "40 50 35 50",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  eventTag: {
    fontSize: 7,
    color: "#E94560",
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: "#A0AEC0",
    fontWeight: "medium",
  },
  dateBox: {
    backgroundColor: "#E94560",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 9,
    color: "#FFFFFF",
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  venueText: {
    fontSize: 9,
    color: "#A0AEC0",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  ticketIdSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 30,
    marginTop: -25,
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  ticketIdHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  ticketLabel: {
    fontSize: 7,
    color: "#718096",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "bold",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  verifiedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#48BB78",
  },
  verifiedText: {
    fontSize: 7,
    color: "#48BB78",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  ticketIdValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#E94560",
    letterSpacing: 6,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 20,
  },
  infoSection: {
    padding: "15 50",
  },
  sectionTitle: {
    fontSize: 9,
    color: "#A0AEC0",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "bold",
    marginBottom: 15,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoCard: {
    width: "33.33%",
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 7,
    color: "#718096",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 12,
    color: "#1A1A2E",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  infoValueSmall: {
    fontSize: 10,
    color: "#4A5568",
    fontWeight: "medium",
  },
  genderBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  genderMale: {
    backgroundColor: "#EBF8FF",
  },
  genderFemale: {
    backgroundColor: "#FFF5F5",
  },
  genderOther: {
    backgroundColor: "#FAF5FF",
  },
  genderText: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  genderTextMale: {
    color: "#3182CE",
  },
  genderTextFemale: {
    color: "#E53E3E",
  },
  genderTextOther: {
    color: "#805AD5",
  },
  footer: {
    backgroundColor: "#1A1A2E",
    padding: "20 50",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 8,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  instructionText: {
    fontSize: 7,
    color: "#A0AEC0",
    lineHeight: 1.8,
  },
  footerRight: {
    alignItems: "center",
    marginLeft: 30,
  },
  qrPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  qrText: {
    fontSize: 6,
    color: "#718096",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  logoSection: {
    alignItems: "center",
  },
  logoText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E94560",
    marginBottom: 2,
  },
  logoSubtext: {
    fontSize: 6,
    color: "#718096",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  bottomBarcode: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
    backgroundColor: "#1A1A2E",
    borderTopWidth: 1,
    borderTopColor: "#2D3152",
  },
  barcodeLine: {
    height: 30,
    width: 2,
    backgroundColor: "#1A1A2E",
    marginHorizontal: 2,
  },
  copyright: {
    fontSize: 7,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 12,
  },
  decorativeCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#E94560",
    opacity: 0.03,
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#1A1A2E",
    opacity: 0.05,
    bottom: 100,
    left: -30,
  },
  qrSection: {
    padding: "10 50",
    alignItems: "center",
    justifyContent: "center",
  },
  sponsorLine: {
    width: "100%",
    textAlign: "center",
    marginBottom: 8,
    fontSize: 6.2,
    color: "#475569",
    lineHeight: 1.25,
  },
  sponsorBrand: {
    color: "#1E293B",
    fontWeight: "bold",
  },
  sponsorEvent: {
    color: "#800000",
    fontSize: 8.2,
    fontWeight: "bold",
  },
  sponsorAccent: {
    color: "#334155",
    fontWeight: "bold",
  },
  qrImage: {
    width: 70,
    height: 70,
  },
});

const TicketDocument = ({ data, ticketId, qrCodeUrl }: { data: RegistrationData; ticketId: string; qrCodeUrl: string }) => {
  const getGenderStyle = (gender: string) => {
    switch (gender) {
      case "Male":
        return { badge: styles.genderMale, text: styles.genderTextMale };
      case "Female":
        return { badge: styles.genderFemale, text: styles.genderTextFemale };
      default:
        return { badge: styles.genderOther, text: styles.genderTextOther };
    }
  };
  
  const genderStyle = getGenderStyle(data.gender);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.mainContent}>
          <View style={styles.topSection}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.eventTag}>The Farewel Ceremony</Text>
                <Text style={styles.title}>অন্তরীপ-২১</Text>
                <Text style={styles.subtitle}>A Memorable Musical Experience</Text>
              </View>
              <View style={styles.headerRight}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateText}>April 09, 2026</Text>
                </View>
                <Text style={styles.venueText}>MIST Central Field</Text>
                <Text style={styles.venueText}>Dhaka, Bangladesh</Text>
              </View>
            </View>
          </View>

          <View style={styles.ticketIdSection}>
            <View style={styles.ticketIdHeader}>
              <Text style={styles.ticketLabel}>Gate Authentication Pass</Text>
              <View style={styles.verifiedBadge}>
                <View style={styles.verifiedDot} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <Text style={styles.ticketIdValue}>{ticketId}</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Attendee Information</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{data.fullName}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValueSmall}>{data.email}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValueSmall}>{data.phone}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>University / Institution</Text>
                <Text style={styles.infoValue}>{data.university}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Student ID</Text>
                <Text style={styles.infoValue}>{data.studentId}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Gender</Text>
                <View style={[styles.genderBadge, genderStyle.badge]}>
                  <Text style={[styles.genderText, genderStyle.text]}>{data.gender}</Text>
                </View>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Blood Group</Text>
                <Text style={styles.infoValue}>{data.bloodGroup}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Registration Date</Text>
                <Text style={styles.infoValueSmall}>N/A</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={[styles.infoValue, { color: "#48BB78" }]}>Confirmed</Text>
              </View>
            </View>
          </View>

          <View style={styles.qrSection}>
            <Text style={styles.sponsorLine}>
              <Text style={styles.sponsorBrand}>Trust Bank PLC presents </Text>
              <Text style={styles.sponsorEvent}>{"\u0985\u09A8\u09CD\u09A4\u09B0\u09C0\u09AA-\u09E8\u09E7"}</Text>
              <Text style={styles.sponsorAccent}> Co-powered by Taha Group.</Text>
              <Text>{" Organized By: Directorate of Student Welfare,MIST. Food Partner: "}</Text>
              <Text style={styles.sponsorAccent}>{"\u0985\u09A8\u09CD\u09A8"}</Text>
            </Text>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={qrCodeUrl} style={styles.qrImage} />
          </View>
          </View>

          <View style={styles.footer}>
            <View>
              <Text style={styles.instructionTitle}>Entry Requirements</Text>
              <Text style={styles.instructionText}>
                • Present original student ID{'\n'}
                • This pass is non-transferable and tied to your identity{'\n'}
                • Gate opens at 1:00 PM - please arrive early{'\n'}
                • No outside food or beverages allowed{'\n'}
                • Follow venue staff instructions at all times
              </Text>
            </View>
            <View style={styles.bottomBarcode}>
              <Text style={styles.copyright}>
                MIST Central Field, Mirpur Cantonment, Dhaka • 2026 • অন্তরীপ ২১ Farewell Concert
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export async function generateTicketPdf(data: RegistrationData, ticketId: string) {
  try {
    const qrData = ticketId;
    const qrCodeUrl = await QRCode.toDataURL(qrData, { width: 200, margin: 1 });
    const buffer = await renderToBuffer(<TicketDocument data={data} ticketId={ticketId} qrCodeUrl={qrCodeUrl} />);
    return buffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
