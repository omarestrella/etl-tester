import { PDFLoader } from 'npm:langchain/document_loaders/fs/pdf'

export async function loadPDF(url: string) {
  const req = await fetch(url)
  const blob = await req.blob()
  const loader = new PDFLoader(blob)
  const documents = await loader.load()
  documents.forEach((document) => {
    delete document.metadata.pdf
    document.metadata.source = url
  })
  return documents
}
