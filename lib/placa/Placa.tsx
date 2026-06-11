import React from "react";
import { Document, Page, View, Text, Image, StyleSheet, Svg, Path, Circle, Rect, Font } from "@react-pdf/renderer";
import { PLACA_SIZES, type PlacaSize, mmToPt, purposeToCTA } from "@/lib/placa/templates";

// Keep multi-syllable words like "COMPRE" from being broken across lines.
Font.registerHyphenationCallback((word) => [word]);

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
  badges: string[];
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

type SpecIconName = "bed" | "shower" | "bath" | "car" | "area" | "land";

function formatSpec(icon: SpecIconName, value: number | null, suffix?: string) {
  if (value === null || value === undefined) return null;
  return { icon, value: suffix ? `${value}${suffix}` : String(value) };
}

/**
 * Lucide-style line icons rendered via @react-pdf/renderer's <Svg>.
 * Stroke colour is the gold accent so they pop on the black background.
 */
function SpecIcon({ name, size, color }: { name: SpecIconName; size: number; color: string }) {
  const stroke = color;
  const sw = Math.max(1.2, size * 0.07);
  switch (name) {
    case "bed":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M2 4v16" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M2 8h18a2 2 0 0 1 2 2v10" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M2 17h20" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M6 8v9" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    case "shower":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 4 17 17" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M10.5 4 17 4 17 10.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M7 21v.01" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M11 19v.01" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M15 21v.01" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M19 19v.01" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    case "bath":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path d="M2 12h20" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M7 19v2" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M17 19v2" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    case "car":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx={7} cy={17} r={2} stroke={stroke} strokeWidth={sw} />
          <Path d="M9 17h6" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Circle cx={17} cy={17} r={2} stroke={stroke} strokeWidth={sw} />
        </Svg>
      );
    case "area":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x={3} y={3} width={18} height={18} rx={2} stroke={stroke} strokeWidth={sw} />
          <Path d="M8 3v18" stroke={stroke} strokeWidth={sw * 0.7} strokeLinecap="round" />
          <Path d="M3 8h18" stroke={stroke} strokeWidth={sw * 0.7} strokeLinecap="round" />
        </Svg>
      );
    case "land":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 21h18" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M3 18l9-12 9 12" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    default:
      return null;
  }
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
      fontFamily: "Helvetica",
      color: WHITE,
      position: "relative"
    },
    // Backdrop: corretor photo bleeds from bottom to top, behind everything.
    photoLayer: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: widthPt * 0.38
    },
    photoFill: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      objectPositionX: "100%",
      objectPositionY: "100%"
    },
    content: {
      padding: 28 * u,
      paddingRight: widthPt * 0.41,
      flexDirection: "column",
      height: "100%",
      justifyContent: "space-between"
    },
    topSection: {
      flexDirection: "column",
      width: "100%"
    },
    badgesRow: {
      flexDirection: "row",
      gap: 6 * u,
      marginBottom: 10 * u,
      flexWrap: "wrap"
    },
    cta: {
      fontSize: 80 * u,
      fontFamily: "Helvetica-Bold",
      color: GOLD,
      letterSpacing: 1.5 * u,
      lineHeight: 1,
      maxLines: 1
    },
    badge: {
      paddingVertical: 5 * u,
      paddingHorizontal: 10 * u,
      backgroundColor: GOLD,
      borderRadius: 4 * u,
      color: BG,
      fontSize: 10 * u,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 1.2
    },
    middleSection: {
      flexDirection: "column",
      width: "100%",
      marginTop: 18 * u
    },
    title: {
      color: WHITE,
      fontSize: 22 * u,
      fontFamily: "Helvetica-Bold",
      lineHeight: 1.15,
      // Cap at 2 lines so very long titles do not push the rest down.
      maxLines: 2,
      textOverflow: "ellipsis"
    },
    location: {
      marginTop: 4 * u,
      color: WHITE_MUTE,
      fontSize: 11 * u,
      letterSpacing: 0.6,
      maxLines: 1,
      textOverflow: "ellipsis"
    },
    specsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 18 * u,
      marginTop: 14 * u,
      alignItems: "center"
    },
    specItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6 * u
    },
    specValue: {
      fontFamily: "Helvetica-Bold",
      fontSize: 16 * u,
      color: WHITE,
      lineHeight: 1
    },
    price: {
      marginTop: 12 * u,
      fontSize: 20 * u,
      fontFamily: "Helvetica-Bold",
      color: GOLD
    },
    // Bottom row: logo on the left, contacts in the middle, QR on the right.
    footer: {
      paddingTop: 12 * u,
      borderTopWidth: 1.5,
      borderTopColor: GOLD,
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 16 * u
    },
    footerLogoCol: {
      width: 105 * u,
      flexDirection: "column",
      alignItems: "flex-start"
    },
    logo: {
      height: 26 * u,
      width: "auto",
      objectFit: "contain",
      marginBottom: 4 * u
    },
    footerName: {
      fontFamily: "Helvetica-Bold",
      fontSize: 11 * u,
      color: WHITE,
      lineHeight: 1.1
    },
    footerCreci: {
      marginTop: 1 * u,
      fontSize: 8 * u,
      color: GOLD,
      letterSpacing: 0.6,
      lineHeight: 1.1
    },
    contactCol: {
      flex: 1,
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 3 * u,
      minWidth: 0
    },
    contactLine: {
      fontSize: 9 * u,
      color: WHITE_MUTE,
      maxLines: 1,
      textOverflow: "ellipsis"
    },
    qrBlock: {
      width: 60 * u,
      alignItems: "center"
    },
    qr: {
      width: 56 * u,
      height: 56 * u,
      padding: 3 * u,
      backgroundColor: WHITE,
      borderRadius: 4 * u
    },
    qrCaption: {
      marginTop: 3 * u,
      fontSize: 7 * u,
      color: GOLD,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 0.8,
      textAlign: "center"
    },
    // Centered site URL banner at the very bottom of the placa.
    siteBanner: {
      marginTop: 12 * u,
      paddingTop: 8 * u,
      borderTopWidth: 1,
      borderTopColor: GOLD_SOFT,
      alignItems: "center"
    },
    siteBannerText: {
      fontSize: 11 * u,
      color: GOLD,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 1
    }
  });

  const specs = [
    formatSpec("bed", property.bedrooms),
    formatSpec("shower", property.suites),
    formatSpec("bath", property.bathrooms),
    formatSpec("car", property.parkingSpaces),
    property.areaM2 ? { icon: "area" as SpecIconName, value: `${property.areaM2}m²` } : null,
    property.landAreaM2 ? { icon: "land" as SpecIconName, value: `${property.landAreaM2}m²` } : null
  ].filter(Boolean) as { icon: SpecIconName; value: string }[];

  const iconSize = 22 * u;

  return (
    <Document>
      <Page size={[widthPt, heightPt]} style={styles.page} wrap={false}>
        {/* Corretor photo as a full-height backdrop, anchored bottom-right. */}
        {corretorPhotoSrc ? (
          <View style={styles.photoLayer}>
            <Image style={styles.photoFill} src={corretorPhotoSrc} />
          </View>
        ) : null}

        {/* Foreground content. paddingRight reserves the photo column. */}
        <View style={styles.content}>
          {/* TOP: badges (if any) + COMPRE */}
          <View style={styles.topSection}>
            {property.badges.length ? (
              <View style={styles.badgesRow}>
                {property.badges.map((badge) => (
                  <Text key={badge} style={styles.badge}>
                    {badge}
                  </Text>
                ))}
              </View>
            ) : null}
            <Text style={styles.cta}>{purposeToCTA(property.purpose)}</Text>
          </View>

          {/* MIDDLE: title, location, specs with icons, price */}
          <View style={styles.middleSection}>
            <Text style={styles.title}>{property.title}</Text>
            <Text style={styles.location}>
              {property.district} · {property.city}
            </Text>

            {specs.length ? (
              <View style={styles.specsRow}>
                {specs.map((spec) => (
                  <View key={spec.icon} style={styles.specItem}>
                    <SpecIcon name={spec.icon} size={iconSize} color={GOLD} />
                    <Text style={styles.specValue}>{spec.value}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <Text style={styles.price}>{property.priceFormatted ?? "Consulte valor"}</Text>
          </View>

          {/* BOTTOM: logo + corretor info + QR code */}
          <View>
            <View style={styles.footer}>
              <View style={styles.footerLogoCol}>
                <Image style={styles.logo} src={logoSrc} />
                <Text style={styles.footerName}>{corretor.name}</Text>
                {corretor.creci ? <Text style={styles.footerCreci}>CRECI {corretor.creci}</Text> : null}
              </View>
              <View style={styles.contactCol}>
                {corretor.phone ? <Text style={styles.contactLine}>WhatsApp {corretor.phone}</Text> : null}
                {corretor.instagramHandle ? (
                  <Text style={styles.contactLine}>@{corretor.instagramHandle}</Text>
                ) : null}
              </View>
              <View style={styles.qrBlock}>
                <Image style={styles.qr} src={qrSrc} />
                <Text style={styles.qrCaption}>VEJA AS FOTOS</Text>
              </View>
            </View>

            {/* Site URL centered at the very bottom */}
            <View style={styles.siteBanner}>
              <Text style={styles.siteBannerText}>{corretor.site}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
