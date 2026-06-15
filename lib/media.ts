export type MediaType = "image" | "video" | "embed" | "link";

/** Classify a pasted URL so we know how to render it. */
export function detectMediaTypeFromUrl(url: string): MediaType {
  const u = (url || "").trim();
  if (!u) return "link";
  if (/\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(u)) return "video";
  if (/\.(jpe?g|png|gif|webp|avif|svg)(\?|#|$)/i.test(u)) return "image";
  if (buildEmbedUrl(u)) return "embed";
  return "link";
}

/** Map a content URL to an iframe-embeddable URL, or null if not embeddable. */
export function buildEmbedUrl(url: string): string | null {
  const u = (url || "").trim();
  let m: RegExpMatchArray | null;

  if ((m = u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/i)))
    return `https://www.youtube-nocookie.com/embed/${m[1]}`;

  if ((m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i)))
    return `https://player.vimeo.com/video/${m[1]}`;

  if ((m = u.match(/instagram\.com\/(p|reel|tv)\/([\w-]+)/i)))
    return `https://www.instagram.com/${m[1]}/${m[2]}/embed`;

  if ((m = u.match(/(?:x|twitter)\.com\/\w+\/status\/(\d+)/i)))
    return `https://platform.twitter.com/embed/Tweet.html?id=${m[1]}`;

  if ((m = u.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/i)))
    return `https://www.tiktok.com/embed/v2/${m[1]}`;

  return null;
}

/** Portrait-oriented embeds (reels/shorts) look best in a tall frame. */
export function isPortraitEmbed(url: string): boolean {
  return /instagram\.com|tiktok\.com|shorts\//i.test(url || "");
}

/** Pick a media type from an uploaded file's MIME type. */
export function mediaTypeFromMime(mime: string): MediaType {
  if (mime.startsWith("video/")) return "video";
  return "image";
}
