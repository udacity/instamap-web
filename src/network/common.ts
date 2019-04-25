export type Result = {
  success: boolean
  errorMessage?: string
}

export async function errorMsgFromRes(res: Response, topic: string | null = null) {
  const head = topic != null ? `${topic}:` : ''
  const text = await res.text()
  const statusText = res.statusText
  if (statusText.length === 0) return `${head} ${text}`
  if (text.length === 0) return `${head} ${statusText}`
  return `${head} ${text}; ${statusText}`
}

