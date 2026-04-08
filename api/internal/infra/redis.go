package infra

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisService struct {
	client *redis.Client
}

func NewRedisService(addr string, password string) *RedisService {
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       0,
	})

	return &RedisService{client: rdb}
}

func (r *RedisService) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	return r.client.Set(ctx, key, value, expiration).Err()
}

func (r *RedisService) Get(ctx context.Context, key string) (string, error) {
	return r.client.Get(ctx, key).Result()
}

func (r *RedisService) Delete(ctx context.Context, key string) error {
	return r.client.Del(ctx, key).Err()
}

// DeleteByPrefix adalah fungsi krusial untuk sinkronisasi pagination.
// Ini akan mencari semua key dengan prefix tertentu (misal: registrations_*) dan menghapusnya.
func (r *RedisService) DeleteByPrefix(ctx context.Context, prefix string) error {
	var cursor uint64
	pattern := prefix + "*"

	for {
		// Gunakan SCAN bukan KEYS agar tidak membebani CPU/RAM secara mendadak
		keys, nextCursor, err := r.client.Scan(ctx, cursor, pattern, 10).Result()
		if err != nil {
			return err
		}

		if len(keys) > 0 {
			if err := r.client.Del(ctx, keys...).Err(); err != nil {
				return err
			}
		}

		cursor = nextCursor
		if cursor == 0 {
			break
		}
	}

	return nil
}