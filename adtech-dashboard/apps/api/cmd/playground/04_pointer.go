package main

import "fmt"

type Person struct {
	Name string
	Age  int
}

func testPointer() {
	fmt.Println("=== 4. Pointer ===")

	// Basic pointer
	x := 10
	p := &x     // p = pointer to x (address của x)
	fmt.Printf("x = %d\n", x)
	fmt.Printf("p = %p (address)\n", p)
	fmt.Printf("*p = %d (value at address)\n", *p)

	*p = 20 // Thay đổi giá trị tại address
	fmt.Printf("After *p = 20: x = %d\n", x)

	fmt.Println()
	fmt.Println("--- Pointer trong Function ---")

	// Không dùng pointer - không thay đổi được
	person := Person{Name: "John", Age: 25}
	updateAgeWrong(person, 30)
	fmt.Printf("After updateAgeWrong: %+v\n", person) // Age vẫn 25

	// Dùng pointer - thay đổi được
	updateAgeRight(&person, 30)
	fmt.Printf("After updateAgeRight: %+v\n", person) // Age = 30

	fmt.Println()
	fmt.Println("--- Optional Field (nil = chưa set) ---")

	type Campaign struct {
		Name        string
		Budget      float64
		DailyBudget *float64 // Optional - có thể nil
	}

	c1 := Campaign{Name: "Campaign 1", Budget: 1000}
	fmt.Printf("c1.DailyBudget = %v (nil = chưa set)\n", c1.DailyBudget)

	daily := 100.0
	c2 := Campaign{Name: "Campaign 2", Budget: 1000, DailyBudget: &daily}
	fmt.Printf("c2.DailyBudget = %v\n", *c2.DailyBudget)

	fmt.Println()
	fmt.Println("=== Bài học ===")
	fmt.Println("- &x = lấy address")
	fmt.Println("- *p = lấy value tại address")
	fmt.Println("- Dùng pointer để modify trong function")
	fmt.Println("- Dùng *Type cho optional fields")
}

func updateAgeWrong(p Person, age int) {
	p.Age = age // Modify COPY
}

func updateAgeRight(p *Person, age int) {
	p.Age = age // Modify ORIGINAL
}
