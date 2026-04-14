# Running KalviKonnect Backend in Docker

## Build the image
docker build -t kalvikonnect-backend .

## Run the container
docker run --env-file ../.env -p 3000:3000 kalvikonnect-backend

## Verify it's running
curl http://localhost:3000/health

## Expected response
{"status":"ok","service":"kalvikonnect-backend","timestamp":"..."}
