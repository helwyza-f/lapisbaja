# Dockerfile untuk API Go
FROM alpine:latest
RUN apk add --no-cache ca-certificates

WORKDIR /app

# Copy the binary we built in GitHub Actions
COPY main .
# Copy migrations for the Go app to run them on startup
COPY migrations ./migrations
# Copy the .env created by the Action
COPY .env .

RUN chmod +x main

EXPOSE 8080
CMD ["./main"]