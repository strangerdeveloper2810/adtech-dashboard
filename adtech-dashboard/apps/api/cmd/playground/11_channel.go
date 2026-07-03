package main

import (
	"fmt"
	"time"
)

func testChannel() {
	fmt.Println("=== 11. Channel ===")

	fmt.Println("--- Unbuffered Channel ---")

	ch := make(chan string) // Unbuffered

	go func() {
		ch <- "Hello" // Send - block cho đến khi có receiver
	}()

	msg := <-ch // Receive - block cho đến khi có data
	fmt.Printf("Received: %s\n", msg)

	fmt.Println()
	fmt.Println("--- Buffered Channel ---")

	bufCh := make(chan int, 3) // Buffer size 3

	bufCh <- 1 // Không block (có buffer)
	bufCh <- 2
	bufCh <- 3
	// bufCh <- 4  // Sẽ block vì buffer đầy!

	fmt.Printf("Received: %d, %d, %d\n", <-bufCh, <-bufCh, <-bufCh)

	fmt.Println()
	fmt.Println("--- Close & Range ---")

	jobs := make(chan int, 5)

	// Send jobs
	go func() {
		for i := 1; i <= 5; i++ {
			jobs <- i
			fmt.Printf("Sent job %d\n", i)
		}
		close(jobs) // Close khi done sending
	}()

	// Receive với range (tự dừng khi channel closed)
	for job := range jobs {
		fmt.Printf("Processing job %d\n", job)
	}
	fmt.Println("All jobs processed")

	fmt.Println()
	fmt.Println("--- Select ---")

	ch1 := make(chan string)
	ch2 := make(chan string)

	go func() {
		time.Sleep(100 * time.Millisecond)
		ch1 <- "from ch1"
	}()

	go func() {
		time.Sleep(50 * time.Millisecond)
		ch2 <- "from ch2"
	}()

	// Select - nhận từ channel nào ready trước
	for i := 0; i < 2; i++ {
		select {
		case msg := <-ch1:
			fmt.Printf("Received: %s\n", msg)
		case msg := <-ch2:
			fmt.Printf("Received: %s\n", msg)
		}
	}

	fmt.Println()
	fmt.Println("--- Select với Timeout ---")

	slowCh := make(chan string)

	go func() {
		time.Sleep(2 * time.Second) // Quá lâu
		slowCh <- "finally"
	}()

	select {
	case msg := <-slowCh:
		fmt.Printf("Received: %s\n", msg)
	case <-time.After(500 * time.Millisecond):
		fmt.Println("Timeout!")
	}

	fmt.Println()
	fmt.Println("=== Bài học ===")
	fmt.Println("- Unbuffered: send block cho đến khi có receiver")
	fmt.Println("- Buffered: send không block nếu buffer chưa đầy")
	fmt.Println("- close(ch): signal không còn data")
	fmt.Println("- for range ch: tự dừng khi channel closed")
	fmt.Println("- select: multiplexing nhiều channels")
}
