import { Pinecone } from 'npm:@pinecone-database/pinecone'
import { hash } from '../utils.ts'

const dimensions = {
  openai: 1536,
  cohere: 768,
}

export async function createIndex(
  apiKey: string,
  name: string,
  embeddings: 'openai' | 'cohere',
) {
  const pinecone = new Pinecone({
    apiKey,
    environment: 'gcp-starter',
  })

  const dimensions = {
    openai: 1536,
    cohere: 768,
  }
  await pinecone.createIndex({
    name,
    metric: 'cosine',
    dimension: dimensions[embeddings],
    waitUntilReady: true,
  })
  return pinecone.index(name)
}

export async function getIndexForSource(apiKey: string, source: string) {
  const pinecone = new Pinecone({
    apiKey,
    environment: 'gcp-starter',
  })

  const name = `pdf-${await hash(source)}`
  return pinecone.index(name)
}
