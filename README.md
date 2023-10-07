# ETL + embeddings


## Getting started

1. Install deno
1. Run dev server: `deno task dev`

See routes in `src/index.ts`

## Example

Generate embeddings for a PDF:
```
curl --request POST \
  --url http://localhost:8000/pdf \
  --header 'content-type: application/json' \
  --data '{"openAIAPIKey": "<your api key>", "pineconeAPIKey": "<your api key>", "source": "https://steamcdn-a.akamaihd.net/apps/valve/Valve_NewEmployeeHandbook.pdf"}'
```
Try to keep it < 50 pages or so for now.

Once done, you can chat with your data by passing the source you used (this is used to find your vector index for you) and a question:

```
curl --request POST \
  --url http://localhost:8000/question \
  --header 'content-type: application/json' \
  --data '{"openAIAPIKey": "<your api key>", "pineconeAPIKey": "<your api key>", "source": "https://steamcdn-a.akamaihd.net/apps/valve/Valve_NewEmployeeHandbook.pdf","question": "When was Valve founded?"}'
```

