import { draftMode } from 'next/headers'
import { client } from './client'
import { draftClient } from './draft'

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  const isDraft = (await draftMode()).isEnabled
  const sanityClient = isDraft ? draftClient : client
  return sanityClient.fetch<T>(query, params)
}
