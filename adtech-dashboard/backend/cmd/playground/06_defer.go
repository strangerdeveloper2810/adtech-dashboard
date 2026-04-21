package main

import "fmt"

func testDefer() {
	fmt.Println("=== 6. Defer ===")

	// Basic defer
	fmt.Println("--- Basic ---")
	fmt.Println("Start")
	defer fmt.Println("Deferred 1") // Chạy khi function return
	fmt.Println("End")
	// Output: Start, End, Deferred 1

	fmt.Println()
	fmt.Println("--- Multiple Defer (LIFO) ---")
	deferOrder()

	fmt.Println()
	fmt.Println("--- Defer với Resource Cleanup ---")
	result := readAndProcess()
	fmt.Printf("Result: %s\n", result)

	fmt.Println()
	fmt.Println("--- Defer Argument Evaluation ---")
	deferArgument()

	fmt.Println()
	fmt.Println("=== Bài học ===")
	fmt.Println("- defer chạy khi function return")
	fmt.Println("- Multiple defer: LIFO (stack)")
	fmt.Println("- Dùng cho: close file, unlock mutex, cleanup")
	fmt.Println("- Argument được evaluate ngay khi defer, không phải khi chạy")
}

func deferOrder() {
	defer fmt.Println("First defer")
	defer fmt.Println("Second defer")
	defer fmt.Println("Third defer")
	fmt.Println("Function body")
	// Output:
	// Function body
	// Third defer
	// Second defer
	// First defer
}

func readAndProcess() string {
	// Giả lập open file
	fmt.Println("Opening file...")

	// defer close ngay sau open (dù chưa dùng)
	defer fmt.Println("Closing file...")

	fmt.Println("Reading file...")
	fmt.Println("Processing data...")

	return "processed data"
}

func deferArgument() {
	x := 10
	defer fmt.Printf("Deferred x = %d\n", x) // x được evaluate ngay = 10

	x = 20
	fmt.Printf("Current x = %d\n", x) // 20
	// Output:
	// Current x = 20
	// Deferred x = 10 (không phải 20!)
}
