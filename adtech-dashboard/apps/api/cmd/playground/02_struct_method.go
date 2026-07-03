package main

import "fmt"

// Struct definition với json tags
type User struct {
	ID    int64  `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

// Counter để demo value vs pointer receiver
type Counter struct {
	count int
}

// VALUE receiver - nhận COPY
func (c Counter) IncrementWrong() {
	c.count++ // Tăng COPY, original không đổi!
}

// POINTER receiver - nhận ADDRESS
func (c *Counter) IncrementRight() {
	c.count++ // Tăng ORIGINAL
}

// Value receiver OK cho read-only
func (c Counter) GetCount() int {
	return c.count
}

func testStructMethod() {
	fmt.Println("=== 2. Struct & Method ===")

	// Tạo struct
	user := User{
		ID:    1,
		Name:  "John",
		Email: "john@example.com",
	}
	fmt.Printf("User: %+v\n", user)

	fmt.Println()
	fmt.Println("--- Value vs Pointer Receiver ---")

	counter := Counter{count: 0}
	fmt.Printf("Initial: %d\n", counter.count)

	// Value receiver - KHÔNG thay đổi
	counter.IncrementWrong()
	counter.IncrementWrong()
	counter.IncrementWrong()
	fmt.Printf("After IncrementWrong x3: %d\n", counter.count) // Vẫn 0!

	// Pointer receiver - CÓ thay đổi
	counter.IncrementRight()
	counter.IncrementRight()
	counter.IncrementRight()
	fmt.Printf("After IncrementRight x3: %d\n", counter.count) // 3

	fmt.Println()
	fmt.Println("=== Bài học ===")
	fmt.Println("- Value receiver (c Counter): chỉ đọc, nhận copy")
	fmt.Println("- Pointer receiver (c *Counter): modify được, nhận address")
	fmt.Println("- Rule: Muốn thay đổi → dùng pointer *")
}
