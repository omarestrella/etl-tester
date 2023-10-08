# ETL + embeddings


## Getting started

1. Install deno
1. Run dev server: `deno task dev`

See routes in `src/index.ts`

## Example

Generate embeddings for a PDF:
```bash
 curl --request POST \
  --url http://localhost:8000/pdf \
  --header 'content-type: application/json' \
  --data \
    '{
        "openAIAPIKey": "<openai api key>",
        "pineconeAPIKey": "<pinecone api key>",
        "source": "https://steamcdn-a.akamaihd.net/apps/valve/Valve_NewEmployeeHandbook.pdf"
    }'
```
Try to keep it < 50 pages or so for now.

Once done, you can chat with your data by passing the source you used (this is used to find your vector index for you) and a question:

```bash
curl --request POST \
  --url http://localhost:8000/question \
  --header 'content-type: application/json' \
  --data \
    '{
        "openAIAPIKey": "<openai api key>",
        "pineconeAPIKey": "<pinecone api key>",
        "source": "https://steamcdn-a.akamaihd.net/apps/valve/Valve_NewEmployeeHandbook.pdf",
        "question": "who founded valve?"
    }'
```

