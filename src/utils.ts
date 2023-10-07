export async function hash(s: string): Promise<string> {
  // hash string using SHA-1 in Deno
  const data = new TextEncoder().encode(s)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}
