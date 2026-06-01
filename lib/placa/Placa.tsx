import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { PLACA_SIZES, type PlacaSize, mmToPt, purposeToCTA } from "@/lib/placa/templates";

const GOLD = "#d89a3b";
const NAVY = "#0f223d";
const PAPER = "#ffffff";
const INK_SOFT = "#3a4a66";

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
  // Either Buffer or remote URL — react-pdf accepts both.
  logoSrc: Buffer | string;
  photoSrc: Buffer | string | null;
  corretorPhotoSrc: Buffer | string | null;
  qrSrc: string;
};

function formatSpec(label: string, value: number | null) {
  if (value === null || value === undefined) return null;
  return { label, value: String(value) };
}

export function Placa({ size, property, corretor, logoSrc, photoSrc, corretorPhotoSrc, qrSrc }: PlacaProps) {
  const meta = PLACA_SIZES[size];
  const widthPt = mmToPt(meta.widthMm);
  const heightPt = mmToPt(meta.heightMm);

  // Relative scale based on width — keeps proportions across the 3 sizes.
  const u = widthPt / 600; // 1u = 1pt at residencial width

  const styles = StyleSheet.create({
    page: {
      width: widthPt,
      height: heightPt,
      backgroundColor: PAPER,
      padding: 28 * u,
      flexDirection: "column",
      fontFamily: "Helvetica",
      color: NAVY
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14 * u
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
      height: 96 * u
    },
    qrCaption: {
      marginTop: 4 * u,
      fontSize: 8 * u,
      color: INK_SOFT,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 1
    },
    cta: {
      fontSize: 130 * u,
      fontFamily: "Helvetica-Bold",
      color: GOLD,
      letterSpacing: 4 * u,
      lineHeight: 1
    },
    titleCard: {
      marginTop: 10 * u,
      paddingVertical: 14 * u,
      paddingHorizontal: 18 * u,
      backgroundColor: NAVY,
      borderRadius: 8 * u,
      maxWidth: "85%"
    },
    title: {
      color: PAPER,
      fontSize: 22 * u,
      fontFamily: "Helvetica-Bold",
      lineHeight: 1.15
    },
    location: {
      color: PAPER,
      fontSize: 12 * u,
      marginTop: 4 * u,
      opacity: 0.85
    },
    mediaRow: {
      flexDirection: "row",
      gap: 14 * u,
      marginTop: 16 * u,
      flexGrow: 1
    },
    photo: {
      flex: 1,
      borderRadius: 10 * u,
      backgroundColor: "#e7ecf3",
      objectFit: "cover"
    },
    photoPlaceholder: {
      flex: 1,
      borderRadius: 10 * u,
      backgroundColor: "#e7ecf3",
      alignItems: "center",
      justifyContent: "center"
    },
    photoPlaceholderText: {
      fontSize: 14 * u,
      color: INK_SOFT
    },
    corretorBlock: {
      width: 170 * u,
      alignItems: "center",
      justifyContent: "flex-end"
    },
    corretorPhoto: {
      width: 170 * u,
      height: 220 * u,
      objectFit: "contain"
    },
    specsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 18 * u,
      marginTop: 14 * u
    },
    specItem: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 6 * u
    },
    specValue: {
      fontFamily: "Helvetica-Bold",
      fontSize: 18 * u,
      color: NAVY
    },
    specLabel: {
      fontSize: 10 * u,
      color: INK_SOFT,
      textTransform: "uppercase",
      letterSpacing: 0.6
    },
    price: {
      marginTop: 10 * u,
      fontSize: 24 * u,
      fontFamily: "Helvetica-Bold",
      color: GOLD
    },
    footer: {
      marginTop: 14 * u,
      paddingTop: 12 * u,
      borderTopWidth: 2,
      borderTopColor: GOLD,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end"
    },
    footerName: {
      fontFamily: "Helvetica-Bold",
      fontSize: 14 * u,
      color: NAVY
    },
    footerLine: {
      fontSize: 11 * u,
      color: INK_SOFT,
      marginTop: 2 * u
    },
    contactCol: {
      alignItems: "flex-end"
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

        <Text style={styles.cta}>{purposeToCTA(property.purpose)}</Text>

        <View style={styles.titleCard}>
          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.location}>
            {property.district} · {property.city}
          </Text>
        </View>

        <View style={styles.mediaRow}>
          {photoSrc ? (
            <Image style={styles.photo} src={photoSrc} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>Foto do imóvel</Text>
            </View>
          )}
          <View style={styles.corretorBlock}>
            {corretorPhotoSrc ? <Image style={styles.corretorPhoto} src={corretorPhotoSrc} /> : null}
          </View>
        </View>

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

        <View style={styles.footer}>
          <View>
            <Text style={styles.footerName}>{corretor.name}</Text>
            {corretor.creci ? <Text style={styles.footerLine}>CRECI {corretor.creci}</Text> : null}
          </View>
          <View style={styles.contactCol}>
            {corretor.phone ? <Text style={styles.footerLine}>WhatsApp {corretor.phone}</Text> : null}
            {corretor.instagramHandle ? (
              <Text style={styles.footerLine}>@{corretor.instagramHandle}</Text>
            ) : null}
            <Text style={styles.footerLine}>{corretor.site}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
