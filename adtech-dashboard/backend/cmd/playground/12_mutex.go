package main

import (
	"fmt"
	"sync"
)

type SafeCounter struct {
	mu    sync.Mutex
	count int
}

func (c *SafeCounter) Increment() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.count++
}

func (c *SafeCounter) GetCount() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.count
}

// RWMutex - multiple readers OR one writer
type SafeCache struct {
	mu   sync.RWMutex
	data map[string]string
}

func (c *SafeCache) Get(key string) string {
	c.mu.RLock() // Read lock - nhiều goroutine có thể đọc cùng lúc
	defer c.mu.RUnlock()
	return c.data[key]
}

func (c *SafeCache) Set(key, value string) {
	c.mu.Lock() // Write lock - chỉ 1 goroutine được write
	defer c.mu.Unlock()
	c.data[key] = value
}

func testMutex() {
	fmt.Println("=== 12. Mutex ===")

	fmt.Println("--- Race Condition (không có mutex) ---")

	// BUG: Race condition
	unsafeCount := 0
	var wg sync.WaitGroup

	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			unsafeCount++ // DATA RACE!
		}()
	}
	wg.Wait()
	fmt.Printf("Unsafe count (expected 1000): %d\n", unsafeCount)
	// Có thể < 1000 do race condition!

	fmt.Println()
	fmt.Println("--- Với Mutex (safe) ---")

	counter := &SafeCounter{}

	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			counter.Increment()
		}()
	}
	wg.Wait()
	fmt.Printf("Safe count (expected 1000): %d\n", counter.GetCount())
	// Luôn = 1000

	fmt.Println()
	fmt.Println("--- RWMutex (read heavy) ---")

	cache := &SafeCache{data: make(map[string]string)}

	// Writer
	wg.Add(1)
	go func() {
		defer wg.Done()
		cache.Set("key", "value")
		fmt.Println("Writer: set key=value")
	}()

	// Multiple readers
	for i := 0; i < 3; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			value := cache.Get("key")
			fmt.Printf("Reader %d: key=%s\n", id, value)
		}(i)
	}

	wg.Wait()

	fmt.Println()
	fmt.Println("=== Bài học ===")
	fmt.Println("- Mutex: protect shared state")
	fmt.Println("- Lock() trước, Unlock() sau (dùng defer)")
	fmt.Println("- RWMutex: RLock cho read, Lock cho write")
	fmt.Println("- RWMutex tốt khi read nhiều hơn write")
}
