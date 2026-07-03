package main

import "fmt"

func testControlFlow() {
	fmt.Println("=== 9. Control Flow ===")

	fmt.Println("--- For Loop (Go chỉ có for) ---")

	// Classic for
	fmt.Print("Classic: ")
	for i := 0; i < 5; i++ {
		fmt.Printf("%d ", i)
	}
	fmt.Println()

	// While style
	fmt.Print("While style: ")
	j := 0
	for j < 5 {
		fmt.Printf("%d ", j)
		j++
	}
	fmt.Println()

	// Range over slice
	fmt.Print("Range slice: ")
	nums := []int{10, 20, 30}
	for i, v := range nums {
		fmt.Printf("[%d]=%d ", i, v)
	}
	fmt.Println()

	// Range over map
	fmt.Print("Range map: ")
	m := map[string]int{"a": 1, "b": 2}
	for k, v := range m {
		fmt.Printf("%s=%d ", k, v)
	}
	fmt.Println()

	// Bỏ qua index
	fmt.Print("Ignore index: ")
	for _, v := range nums {
		fmt.Printf("%d ", v)
	}
	fmt.Println()

	fmt.Println()
	fmt.Println("--- If với Short Statement ---")

	// Short statement - err chỉ tồn tại trong if block
	if err := doSomething(); err != nil {
		fmt.Printf("Error: %v\n", err)
	}
	// err không tồn tại ở đây

	fmt.Println()
	fmt.Println("--- Switch (auto break) ---")

	status := "active"
	switch status {
	case "active":
		fmt.Println("Campaign is active")
	case "paused", "draft": // Multiple values
		fmt.Println("Campaign is paused or draft")
	default:
		fmt.Println("Unknown status")
	}

	// Switch không có expression
	x := 10
	switch {
	case x < 0:
		fmt.Println("Negative")
	case x == 0:
		fmt.Println("Zero")
	case x > 0:
		fmt.Println("Positive")
	}

	fmt.Println()
	fmt.Println("=== Bài học ===")
	fmt.Println("- Go chỉ có for (không có while)")
	fmt.Println("- for range: dùng _ bỏ qua index/value")
	fmt.Println("- if short statement: biến chỉ tồn tại trong block")
	fmt.Println("- switch: auto break, không cần break")
}

func doSomething() error {
	return nil
}
