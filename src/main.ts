import { Hono } from 'https://deno.land/x/hono@v3.8.0-rc.2/mod.ts'
import { z } from 'https://deno.land/x/zod@v3.20.5/mod.ts'

import { RetrievalQAChain } from 'npm:langchain/chains'
import { ChatOpenAI } from 'npm:langchain/chat_models/openai'
import { OpenAIEmbeddings } from 'npm:langchain/embeddings/openai'
import { PineconeStore } from 'npm:langchain/vectorstores/pinecone'
import { loadPDF } from './loaders/pdf.ts'
import { hash } from './utils.ts'
import { createIndex, getIndexForSource } from './vectors/pinecone.ts'

const app = new Hono()

const PDFSchema = z.object({
  source: z.string(),
  openAIAPIKey: z.string(),
  pineconeAPIKey: z.string(),
})

const QuestionSchema = z.object({
  openAIAPIKey: z.string(),
  pineconeAPIKey: z.string(),
  question: z.string(),
  source: z.string(),
})

app.get('/', () => Response.json({ hello: 'world' }))

app.post('/pdf', async (c) => {
  const { source, openAIAPIKey, pineconeAPIKey } = PDFSchema.parse(
    await c.req.json(),
  )

  console.log('loading pdf')
  const documents = await loadPDF(source)

  // openai has a specific # vector dimensions, so we need to
  // match that up with pinecone
  console.log('creating new pinecone index')
  const index = await createIndex(
    pineconeAPIKey,
    `pdf-${await hash(source)}`,
    'openai',
  )

  // lets use OpenAI to generate the embeddings and feed that
  // into the pinecone index we created
  const embeddings = new OpenAIEmbeddings({
    modelName: 'text-embedding-ada-002',
    openAIApiKey: openAIAPIKey,
  })
  const pineconeStore = new PineconeStore(embeddings, {
    pineconeIndex: index,
  })
  console.log('adding documents to pinecone')
  const documentIDs = await pineconeStore.addDocuments(documents)

  return Response.json({ source, documentIDs })
})

app.post('/question', async (c) => {
  const { question, source, pineconeAPIKey, openAIAPIKey } =
    QuestionSchema.parse(await c.req.json())

  // we use the same OpenAI model to generate embeddings for
  // the query, which lets us lookup using the pinecone db
  const embeddings = new OpenAIEmbeddings({
    modelName: 'text-embedding-ada-002',
    openAIApiKey: openAIAPIKey,
  })
  const index = await getIndexForSource(pineconeAPIKey, source)
  const store = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  })

  const chat = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    openAIApiKey: openAIAPIKey,
    temperature: 0.0,
  })
  const qa = RetrievalQAChain.fromLLM(chat, store.asRetriever())
  const answer = await qa.run(question)
  return Response.json({
    answer,
  })
})

export default Deno.serve(app.fetch)
