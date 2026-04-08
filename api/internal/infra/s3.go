package infra

import (
	"bytes"
	"context"
	"fmt"
	"sync"

	"github.com/helwiza/lapisbaja-api/internal/config"

	"github.com/aws/aws-sdk-go-v2/aws"
	s3Config "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type S3Service struct {
	client    *s3.Client
	bucket    string
	publicURL string
}

func NewS3Service(cfg config.R2Config) (*S3Service, error) {
	awsCfg, err := s3Config.LoadDefaultConfig(context.TODO(),
		s3Config.WithRegion("auto"),
		s3Config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			cfg.AccessKey,
			cfg.SecretKey,
			"",
		)),
	)
	if err != nil {
		return nil, err
	}

	client := s3.NewFromConfig(awsCfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(cfg.Endpoint)
	})

	return &S3Service{
		client:    client,
		bucket:    cfg.Bucket,
		publicURL: cfg.PublicURL,
	}, nil
}

// UploadSingle mengunggah satu file ke R2
func (s *S3Service) UploadSingle(ctx context.Context, fileName string, body []byte, contentType string) (string, error) {
	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(fileName),
		Body:        bytes.NewReader(body),
		ContentType: aws.String(contentType),
	})
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%s/%s", s.publicURL, fileName), nil
}

// UploadBulk mengunggah banyak file sekaligus menggunakan Goroutines agar "Kencang, Boy"
func (s *S3Service) UploadBulk(ctx context.Context, files map[string][]byte, contentType string) (map[string]string, error) {
	results := make(map[string]string)
	var mu sync.Mutex
	var wg sync.WaitGroup
	errChan := make(chan error, len(files))

	for name, body := range files {
		wg.Add(1)
		go func(n string, b []byte) {
			defer wg.Done()
			url, err := s.UploadSingle(ctx, n, b, contentType)
			if err != nil {
				errChan <- err
				return
			}
			mu.Lock()
			results[n] = url
			mu.Unlock()
		}(name, body)
	}

	wg.Wait()
	close(errChan)

	if len(errChan) > 0 {
		return nil, <-errChan
	}

	return results, nil
}