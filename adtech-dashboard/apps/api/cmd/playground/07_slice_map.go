package main

import "fmt"

func testSliceMap() {
	fmt.Println("=== 7. Slice & Map ===")

	fmt.Println("--- Slice ---")

	// Tạo slice
	s1 := []int{1, 2, 3}
	s2 := make([]int, 3)      // len=3, cap=3
	s3 := make([]int, 0, 10)  // len=0, cap=10

	fmt.Printf("s1 = %v, len=%d, cap=%d\n", s1, len(s1), cap(s1))
	fmt.Printf("s2 = %v, len=%d, cap=%d\n", s2, len(s2), cap(s2))
	fmt.Printf("s3 = %v, len=%d, cap=%d\n", s3, len(s3), cap(s3))

	// Append
	s3 = append(s3, 1, 2, 3)
	fmt.Printf("s3 after append = %v\n", s3)

	fmt.Println()
	fmt.Println("--- Slice là Reference ---")

	original := []int{1, 2, 3}
	copy1 := original // KHÔNG copy data, share underlying array

	copy1[0] = 999
	fmt.Printf("original = %v\n", original) // [999 2 3] - bị thay đổi!
	fmt.Printf("copy1 = %v\n", copy1)

	// Muốn copy thực sự:
	original2 := []int{1, 2, 3}
	copy2 := make([]int, len(original2))
	copy(copy2, original2) // Deep copy

	copy2[0] = 999
	fmt.Printf("original2 = %v\n", original2) // [1 2 3] - không đổi
	fmt.Printf("copy2 = %v\n", copy2)

	fmt.Println()
	fmt.Println("--- Map ---")

	// Tạo map
	m1 := map[string]int{"a": 1, "b": 2}
	m2 := make(map[string]int)

	m2["key"] = 100

	fmt.Printf("m1 = %v\n", m1)
	fmt.Printf("m2 = %v\n", m2)

	// Check key exists
	value, ok := m1["c"]
	if !ok {
		fmt.Println("Key 'c' does not exist")
	}
	fmt.Printf("m1[\"c\"] = %d, exists = %t\n", value, ok)

	// Delete key
	delete(m1, "a")
	fmt.Printf("m1 after delete = %v\n", m1)

	fmt.Println()
	fmt.Println("--- Iterate ---")

	for i, v := range []string{"a", "b", "c"} {
		fmt.Printf("index=%d, value=%s\n", i, v)
	}

	for k, v := range map[string]int{"x": 1, "y": 2} {
		fmt.Printf("key=%s, value=%d\n", k, v)
	}

	fmt.Println()
	fmt.Println("=== Bài học ===")
	fmt.Println("- Slice: reference type, append() an toàn")
	fmt.Println("- Map: phải make() trước khi write")
	fmt.Println("- Check key: value, ok := m[key]")
	fmt.Println("- Copy slice: dùng copy(), không phải =")
}
