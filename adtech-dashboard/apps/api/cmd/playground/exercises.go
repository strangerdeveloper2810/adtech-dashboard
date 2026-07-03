package main

import (
	"errors"
	"fmt"
	"math"
)

// ============================
// GO CORE EXERCISES
// Tự code từng function, chạy go run . để test
// ============================

// ----------------------------
// Exercise 1: Zero Values & Make
// ----------------------------
// Tạo 1 map lưu tên + tuổi, thêm 3 người, in ra
func exercise1() {
	fmt.Println("=== Exercise 1: Map ===")
	// TODO: Tạo map[string]int
	// TODO: Thêm "John" -> 25, "Alice" -> 30, "Bob" -> 28
	// TODO: In ra map
	// TODO: Check xem "Charlie" có trong map không, dùng value, ok pattern

	// solution 1:
	// person := make(map[string]int, 3)
	// person["John"] = 25
	// person["Alice"] = 30
	// person["Bob"] = 28

	// Solution 2:
	var person = map[string]int{
		"John":  25,
		"Alice": 30,
		"Bob":   28,
	}

	fmt.Println(person)
	age, oke := person["Charlie"]
	if oke {
		fmt.Printf("Charlie is %d years old\n", age)
	} else {
		fmt.Println("Charlie is not in the map")
	}

}

// ----------------------------
// Exercise 2: Struct & Method
// ----------------------------
// Tạo struct BankAccount với balance
// Implement Deposit (cộng tiền) và Withdraw (trừ tiền, return error nếu không đủ)
func exercise2() {
	fmt.Println("=== Exercise 2: BankAccount ===")
	// TODO: Tạo account với balance 1000
	// TODO: Deposit 500 (balance = 1500)
	// TODO: Withdraw 200 (balance = 1300)
	// TODO: Withdraw 2000 (error: insufficient funds)
	// TODO: In balance sau mỗi operation

	var account BankAccount
	account.Deposit(1000)
	fmt.Printf("Balance after deposit: %.2f\n", account.GetBalance())

	account.Deposit(500)
	fmt.Printf("Balance after deposit: %.2f\n", account.GetBalance())

	err := account.Withdraw(200)
	if err != nil {
		fmt.Println("Withdraw error:", err)
	} else {
		fmt.Printf("Balance after withdraw: %.2f\n", account.GetBalance())
	}

	err = account.Withdraw(2000)
	if err != nil {
		fmt.Println("Withdraw error:", err)
	} else {
		fmt.Printf("Balance after withdraw: %.2f\n", account.GetBalance())
	}
}

// Định nghĩa struct và methods ở đây:
// type BankAccount struct { ... }
type BankAccount struct {
	balance float64
}

func (b *BankAccount) Deposit(amount float64) {
	b.balance += amount

}

func (b *BankAccount) Withdraw(amount float64) error {
	if b.balance < amount {
		return fmt.Errorf("insufficient funds: balance=%.2f, withdraw=%.2f", b.balance, amount)
	}
	b.balance -= amount
	return nil

}

func (b *BankAccount) GetBalance() float64 {
	return b.balance
}

// func (b ...) Deposit(amount float64) { ... }
// func (b ...) Withdraw(amount float64) error { ... }
// func (b ...) GetBalance() float64 { ... }

// ----------------------------
// Exercise 3: Interface
// ----------------------------
// Tạo interface Shape với method Area() float64
// Implement cho Circle và Rectangle
func exercise3() {
	fmt.Println("=== Exercise 3: Interface ===")
	// TODO: Tạo Circle{Radius: 5} và Rectangle{Width: 4, Height: 6}
	// TODO: Gọi printArea cho cả 2
	// TODO: Thử tạo slice []Shape chứa cả Circle và Rectangle

	circle := Cricle{Radius: 5}
	rectangle := Rectangle{Width: 4, Height: 6}

	printArea(circle)
	printArea(rectangle)

	shapes := []Shape{circle, rectangle}
	for _, shape := range shapes {
		printArea(shape)
	}

}

// Định nghĩa ở đây:
// type Shape interface { ... }
// type Circle struct { ... }
// type Rectangle struct { ... }
// func printArea(s Shape) { fmt.Printf("Area: %.2f\n", s.Area()) }

type Shape interface {
	Area() float64
}

type Cricle struct {
	Radius float64
}

type Rectangle struct {
	Width  float64
	Height float64
}

func (c Cricle) Area() float64 {
	return math.Pi * c.Radius * c.Radius
}

func (r Rectangle) Area() float64 {
	return r.Height * r.Width
}

func printArea(s Shape) {
	fmt.Printf("Area: %.2f\n", s.Area())
}

// ----------------------------
// Exercise 4: Error Handling
// ----------------------------
// Tạo function divide(a, b float64) (float64, error)
// Return error khi b = 0
func exercise4() {
	fmt.Println("=== Exercise 4: Error Handling ===")
	// TODO: Gọi divide(10, 3) -> in kết quả
	// TODO: Gọi divide(10, 0) -> in error
	// TODO: Dùng sentinel error ErrDivideByZero
	result, err := divide(10, 3)
	if err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Printf("Result: %.2f\n", result)
	}

	result, err = divide(10, 0)
	if err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Printf("Result: %.2f\n", result)
	}

}

// Định nghĩa ở đây:
// var ErrDivideByZero = errors.New(...)
// func divide(a, b float64) (float64, error) { ... }

var ErrDivideByZero = errors.New("divide by zero")

func divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, ErrDivideByZero
	}
	return a / b, nil
}

// ----------------------------
// Exercise 5: Slice operations
// ----------------------------
// Implement các functions:
// - filter: lọc slice theo điều kiện
// - transform: biến đổi từng element
func exercise5() {
	fmt.Println("=== Exercise 5: Slice ===")
	nums := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
	result := []int{}

	for _, num := range nums {
		if num%2 == 0 {
			num = num * 2
			fmt.Printf("Even number: %d, after transform: %d\n", num/2, num)
			result = append(result, num)
		}
	}
	fmt.Println(result)

}

// TODO: Lọc số chẵn -> [2, 4, 6, 8, 10]
// TODO: Nhân đôi mỗi số -> [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
// TODO: In kết quả

// ----------------------------
// Exercise 6: Pointer
// ----------------------------
// Tạo function swap(a, b *int) hoán đổi giá trị 2 biến
func exercise6() {
	fmt.Println("=== Exercise 6: Pointer ===")
	a, b := 10, 20
	fmt.Printf("Before: a=%d, b=%d\n", a, b)
	swap(&a, &b)
	fmt.Printf("After: a=%d, b=%d\n", a, b)
	// TODO: Gọi swap(&a, &b)
	// TODO: In ra a, b sau swap -> a=20, b=10
}

// Định nghĩa ở đây:
// func swap(a, b *int) { ... }

func swap(a, b *int) {
	*a, *b = *b, *a
}

// ----------------------------
// Exercise 7: Defer
// ----------------------------
// Viết function đếm ngược từ 5 -> 1 dùng defer
func exercise7() {
	fmt.Println("=== Exercise 7: Defer ===")
	// TODO: Dùng loop + defer để in 5, 4, 3, 2, 1
	// Hint: defer chạy LIFO
	for i := 1; i <= 5; i++ {
		defer fmt.Printf("%d ", i)
	}
	fmt.Println()
}
