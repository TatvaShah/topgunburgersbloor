import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { igHandle, isRasterForOg, isServicePreset, resolveTheme, site } from "./site";

export async function localDataUrl(path?: string) {
  if (!isRasterForOg(path)) return null;
  try {
    const buf = await readFile(join(process.cwd(), "public", path!));
    const type = /\.png$/i.test(path!) ? "image/png" : "image/jpeg";
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

// 1200x630 share card built from the config: name, tagline, area, handle, optional photo and logo.
export async function shareImage() {
  const { colors } = resolveTheme();
  const photo = await localDataUrl(site.seo.ogPhoto);
  const logo = await localDataUrl(site.logo);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: colors.bg, color: colors.ink }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 56px 64px 72px" }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={96} height={96} style={{ borderRadius: 48, marginBottom: 28, objectFit: "cover" }} alt="" />
          ) : null}
          <div style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: colors.accent, fontWeight: 700 }}>
            {[site.category, site.area].filter(Boolean).join(" · ")}
          </div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 18 }}>{site.name}</div>
          <div style={{ fontSize: 32, lineHeight: 1.3, marginTop: 20, color: colors.muted }}>{site.tagline}</div>
          <div style={{ display: "flex", marginTop: 36 }}>
            <div style={{ background: colors.accent, color: colors.accentInk, fontSize: 26, padding: "14px 28px", borderRadius: 999, fontWeight: 700 }}>
              {`DM @${igHandle} to ${isServicePreset() ? "book" : "order"}`}
            </div>
          </div>
        </div>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} width={480} height={630} style={{ objectFit: "cover" }} alt="" />
        ) : (
          <div style={{ width: 360, display: "flex", background: colors.soft }} />
        )}
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

// Square icon: the logo when it is a PNG or JPG, otherwise a monogram on the accent color.
export async function iconImage(size: number) {
  const { colors } = resolveTheme();
  const logo = await localDataUrl(site.logo);
  return new ImageResponse(
    logo ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logo} width={size} height={size} style={{ objectFit: "cover", borderRadius: size / 2 }} alt="" />
    ) : (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.accent,
          color: colors.accentInk,
          fontSize: size * 0.6,
          fontWeight: 800,
          borderRadius: size / 5,
        }}
      >
        {site.name.trim().charAt(0).toUpperCase()}
      </div>
    ),
    { width: size, height: size },
  );
}
