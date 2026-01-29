export function extractGithubFallback(text: string): string | null {
  const match = text.match(
    /(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_-]+/i
  );
  return match ? match[0] : null;
}