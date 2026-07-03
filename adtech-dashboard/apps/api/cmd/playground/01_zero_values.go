package main

import "fmt"

func testZeroValues() {
	fmt.Println("=== 1. Zero Values ===")

	// Mọi biến đều có zero value
	var i int
	var f float64
	var s string
	var b bool
	var p *int

	fmt.Printf("int: %d\n", i)       // 0
	fmt.Printf("float64: %f\n", f)   // 0.000000
	fmt.Printf("string: %q\n", s)    // "" (empty)
	fmt.Printf("bool: %t\n", b)      // false
	fmt.Printf("pointer: %v\n", p)   // <nil>

	fmt.Println()

	// Slice - nil nhưng append OK
	var slice []int
	fmt.Printf("slice nil? %t\n", slice == nil) // true
	slice = append(slice, 1, 2, 3)              // OK!
	fmt.Printf("slice after append: %v\n", slice)

	fmt.Println()

	// Map - nil và PANIC khi write
	var m map[string]int
	fmt.Printf("map nil? %t\n", m == nil) // true

	// ĐỌC từ nil map thì OK (trả zero value)
	fmt.Printf("read nil map: %d\n", m["key"]) // 0

	// WRITE vào nil map thì PANIC!
	// Uncomment dòng dưới để thấy panic:
	// m["key"] = 1  // panic: assignment to entry in nil map

	// Fix: dùng make()
	m = make(map[string]int)
	m["key"] = 1 // OK
	fmt.Printf("map after make: %v\n", m)

	fmt.Println()
	fmt.Println("=== Bài học ===")
	fmt.Println("- slice: append() OK với nil")
	fmt.Println("- map: PHẢI make() trước khi write")
}
