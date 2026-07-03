package main

import "fmt"

func testTypeAssertion() {
	fmt.Println("=== 8. Type Assertion & Type Switch ===")

	fmt.Println("--- Type Assertion ---")

	var i interface{} = "hello"

	// Unsafe - panic nếu sai type
	s := i.(string)
	fmt.Printf("Value: %s\n", s)

	// Safe - check ok
	s, ok := i.(string)
	if ok {
		fmt.Printf("It's a string: %s\n", s)
	}

	// Check int - sẽ fail
	n, ok := i.(int)
	if !ok {
		fmt.Println("It's NOT an int")
	}
	fmt.Printf("n = %d (zero value vì không phải int)\n", n)

	fmt.Println()
	fmt.Println("--- Type Switch ---")

	describe("hello")
	describe(42)
	describe(3.14)
	describe(true)
	describe([]int{1, 2, 3})

	fmt.Println()
	fmt.Println("=== Bài học ===")
	fmt.Println("- Type assertion: i.(Type)")
	fmt.Println("- Safe assertion: value, ok := i.(Type)")
	fmt.Println("- Type switch: switch v := i.(type)")
}

func describe(i interface{}) {
	switch v := i.(type) {
	case int:
		fmt.Printf("int: %d\n", v)
	case string:
		fmt.Printf("string: %s\n", v)
	case float64:
		fmt.Printf("float64: %f\n", v)
	case bool:
		fmt.Printf("bool: %t\n", v)
	default:
		fmt.Printf("unknown type: %T = %v\n", v, v)
	}
}
