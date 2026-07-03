package main

import (
	"fmt"
	"sync"
	"time"
)

func testGoroutine() {
	fmt.Println("=== 10. Goroutine ===")

	fmt.Println("--- Basic Goroutine ---")

	// Start goroutine với go keyword
	go func() {
		fmt.Println("Hello from goroutine!")
	}()

	// Main phải đợi, nếu không goroutine chưa kịp chạy
	time.Sleep(100 * time.Millisecond)

	fmt.Println()
	fmt.Println("--- WaitGroup ---")

	var wg sync.WaitGroup

	for i := 1; i <= 3; i++ {
		wg.Add(1) // TRƯỚC khi go

		go func(n int) {
			defer wg.Done() // Khi goroutine xong

			fmt.Printf("Worker %d starting\n", n)
			time.Sleep(time.Duration(n*100) * time.Millisecond)
			fmt.Printf("Worker %d done\n", n)
		}(i) // Pass i vào để tránh closure bug
	}

	wg.Wait() // Đợi tất cả Done()
	fmt.Println("All workers completed")

	fmt.Println()
	fmt.Println("--- Closure Bug ---")

	// BUG: Không pass i vào
	fmt.Println("Bug version:")
	for i := 1; i <= 3; i++ {
		go func() {
			fmt.Printf("i = %d\n", i) // Sẽ in 4, 4, 4 (hoặc random)
		}()
	}
	time.Sleep(100 * time.Millisecond)

	// FIX: Pass i vào function
	fmt.Println("Fixed version:")
	for i := 1; i <= 3; i++ {
		go func(n int) {
			fmt.Printf("n = %d\n", n) // Sẽ in 1, 2, 3 (random order)
		}(i)
	}
	time.Sleep(100 * time.Millisecond)

	fmt.Println()
	fmt.Println("=== Bài học ===")
	fmt.Println("- go func() {} - start goroutine")
	fmt.Println("- Goroutine nhẹ (~2KB stack)")
	fmt.Println("- WaitGroup: Add trước go, Done trong goroutine, Wait ở main")
	fmt.Println("- Loop + goroutine: pass variable vào function để tránh closure bug")
}
