import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { PLACA_SIZES, type PlacaSize, mmToPt, purposeToCTA } from "@/lib/placa/templates";

const BG = "#0a0a0a";
const GOLD = "#d89a3b";
const GOLD_SOFT = "rgba(216, 154, 59, 0.35)";
const WHITE = "#ffffff";
const WHITE_MUTE = "rgba(255, 255, 255, 0.65)";

type Specs = {
  bedrooms: number | null;
  suites: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  areaM2: number | null;
  landAreaM2: number | null;
};

export type PlacaProperty = Specs & {
  title: string;
  type: string;
  purpose: string;
  city: string;
  district: string;
  priceFormatted: string | null;
};

export type PlacaCorretor = {
  name: string;
  creci: string | null;
  phone: string | null;
  instagramHandle: string | null;
  site: string;
};

type PlacaProps = {
  size: PlacaSize;
  property: PlacaProperty;
  corretor: PlacaCorretor;
  logoSrc: Buffer | string;
  corretorPhotoSrc: Buffer | string | null;
  qrSrc: string;
};

function formatSpec(label: string, value: number | null) {
  if (value === null || value === undefined) return null;
  return { label, value: String(value) };
}

export function Placa({ size, property, corretor, logoSrc, corretorPhotoSrc, qrSrc }: PlacaProps) {
  const meta = PLACA_SIZES[size];
  const widthPt = mmToPt(meta.widthMm);
  const heightPt = mmToPt(meta.heightMm);

  // Proportional unit anchored on residencial width.
  const u = widthPt / 600;

  const styles = StyleSheet.create({
    page: {
      width: widthPt,
      height: heightPt,
      backgroundColor: BG,
      padding: 28 * u,
      flexDirection: "column",
      fontFamily: "Helvetica",
      color: WHITE
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 14 * u,
      borderBottomWidth: 1,
      borderBottomColor: GOLD_SOFT
    },
    logo: {
      height: 56 * u,
      width: "auto",
      objectFit: "contain"
    },
    qrBlock: {
      alignItems: "center"
    },
    qr: {
      width: 96 * u,
      height: 96 * u,
      // White padding around the QR so the scanner reads cleanly on a black bg.
      padding: 4 * u,
      backgroundColor: WHITE,
      borderRadius: 4 * u
    },
    qrCaption: {
      marginTop: 5 * u,
      fontSize: 8 * u,
      color: GOLD,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 1
    },
    body: {
      flexDirection: "row",
      flexGrow: 1,
      marginTop: 18 * u,
      gap: 24 * u
    },
    bodyLeft: {
      flex: 1,
      justifyContent: "space-between"
    },
    cta: {
      fontSize: 140 * u,
      fontFamily: "Helvetica-Bold",
      color: GOLD,
      letterSpacing: 4 * u,
      lineHeight: 1
    },
    title: {
      marginTop: 18 * u,
      color: WHITE,
      fontSize: 28 * u,
      fontFamily: "Helvetica-Bold",
      lineHeight: 1.15
    },
    location: {
      marginTop: 6 * u,
      color: WHITE_MUTE,
      fontSize: 14 * u,
      letterSpacing: 0.8
    },
    specsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 22 * u,
      marginTop: 22 * u
    },
    specItem: {
      flexDirection: "column"
    },
    specValue: {
      fontFamily: "Helvetica-Bold",
      fontSize: 26 * u,
      color: WHITE,
      lineHeight: 1
    },
    specLabel: {
      marginTop: 4 * u,
      fontSize: 9 * u,
      color: GOLD,
      textTransform: "uppercase",
      letterSpacing: 1.2
    },
    price: {
      marginTop: 18 * u,
      fontSize: 30 * u,
      fontFamily: "Helvetica-Bold",
      color: GOLD
    },
    bodyRight: {
      width: 220 * u,
      alignItems: "center",
      justifyContent: "flex-end"
    },
    corretorPhoto: {
      width: 220 * u,
      height: 320 * u,
      objectFit: "contain"
    },
    footer: {
      marginTop: 18 * u,
      paddingTop: 14 * u,
      borderTopWidth: 2,
      borderTopColor: GOLD,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end"
    },
    footerName: {
      fontFamily: "Helvetica-Bold",
      fontSize: 16 * u,
      color: WHITE
    },
    footerCreci: {
      marginTop: 3 * u,
      fontSize: 11 * u,
      color: GOLD,
      letterSpacing: 0.8
    },
    contactCol: {
      alignItems: "flex-end"
    },
    contactLine: {
      fontSize: 11 * u,
      color: WHITE_MUTE,
      marginTop: 2 * u
    },
    contactSite: {
      fontSize: 11 * u,
      color: GOLD,
      marginTop: 2 * u,
      fontFamily: "Helvetica-Bold"
    }
  });

  const specs = [
    formatSpec("dorm.", property.bedrooms),
    formatSpec("suítes", property.suites),
    formatSpec("banh.", property.bathrooms),
    formatSpec("vagas", property.parkingSpaces),
    property.areaM2 ? { label: "área", value: `${property.areaM2}m²` } : null,
    property.landAreaM2 ? { label: "terreno", value: `${property.landAreaM2}m²` } : null
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Document>
      <Page size={[widthPt, heightPt]} style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logoSrc} />
          <View style={styles.qrBlock}>
            <Image style={styles.qr} src={qrSrc} />
            <Text style={styles.qrCaption}>APONTE A CÂMERA</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.bodyLeft}>
            <View>
              <Text style={styles.cta}>{purposeToCTA(property.purpose)}</Text>
              <Text style={styles.title}>{property.title}</Text>
              <Text style={styles.location}>
                {property.district} · {property.city}
              </Text>

              {specs.length ? (
                <View style={styles.specsRow}>
                  {specs.map((spec) => (
                    <View key={spec.label} style={styles.specItem}>
                      <Text style={styles.specValue}>{spec.value}</Text>
                      <Text style={styles.specLabel}>{spec.label}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              <Text style={styles.price}>{property.priceFormatted ?? "Consulte valor"}</Text>
            </View>
          </View>

          <View style={styles.bodyRight}>
            {corretorPhotoSrc ? <Image style={styles.corretorPhoto} src={corretorPhotoSrc} /> : null}
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.footerName}>{corretor.name}</Text>
            {corretor.creci ? <Text style={styles.footerCreci}>CRECI {corretor.creci}</Text> : null}
          </View>
          <View style={styles.contactCol}>
            {corretor.phone ? <Text style={styles.contactLine}>WhatsApp {corretor.phone}</Text> : null}
            {corretor.instagramHandle ? (
              <Text style={styles.contactLine}>@{corretor.instagramHandle}</Text>
            ) : null}
            <Text style={styles.contactSite}>{corretor.site}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
