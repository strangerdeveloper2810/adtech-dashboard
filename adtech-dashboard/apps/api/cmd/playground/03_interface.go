package main

import "fmt"

// Interface definition
type Speaker interface {
	Speak() string
}

// Dog với VALUE receiver
type Dog struct {
	Name string
}

func (d Dog) Speak() string {
	return d.Name + " says Woof!"
}

// Cat với POINTER receiver
type Cat struct {
	Name string
}

func (c *Cat) Speak() string {
	return c.Name + " says Meow!"
}

func testInterface() {
	fmt.Println("=== 3. Interface ===")

	// Dog - value receiver
	// Cả Dog và *Dog đều implement Speaker
	var s1 Speaker = Dog{Name: "Buddy"}
	var s2 Speaker = &Dog{Name: "Max"}
	fmt.Println(s1.Speak())
	fmt.Println(s2.Speak())

	fmt.Println()

	// Cat - pointer receiver
	// CHỈ *Cat implement Speaker, Cat thì KHÔNG
	// var s3 Speaker = Cat{Name: "Whiskers"}  // COMPILE ERROR!
	var s3 Speaker = &Cat{Name: "Whiskers"} // OK
	fmt.Println(s3.Speak())

	fmt.Println()
	fmt.Println("--- Implicit Implementation ---")

	// Go không cần keyword "implements"
	// Struct tự động implement nếu có đủ methods
	dog := Dog{Name: "Rex"}
	printSpeaker(dog)  // Dog implements Speaker
	printSpeaker(&dog) // *Dog cũng implements Speaker

	cat := Cat{Name: "Luna"}
	// printSpeaker(cat)   // ERROR: Cat không implement
	printSpeaker(&cat) // OK: *Cat implements Speaker

	fmt.Println()
	fmt.Println("=== Bài học ===")
	fmt.Println("- Value receiver: T và *T đều implement")
	fmt.Println("- Pointer receiver: CHỈ *T implement")
	fmt.Println("- Interface trong Go là implicit (không cần implements)")
}

func printSpeaker(s Speaker) {
	fmt.Printf("Speaker says: %s\n", s.Speak())
}
