package main

import (
	"errors"
	"fmt"
)

// Sentinel errors - định nghĩa 1 lần
var (
	ErrNotFound     = errors.New("not found")
	ErrUnauthorized = errors.New("unauthorized")
	ErrInvalidInput = errors.New("invalid input")
)

type UserData struct {
	ID   int64
	Name string
}

func testErrorHandling() {
	fmt.Println("=== 5. Error Handling ===")

	// Basic error handling
	user, err := findUser(1)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Found user: %+v\n", user)
	}

	fmt.Println()

	// Not found error
	user, err = findUser(999)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	}

	fmt.Println()
	fmt.Println("--- errors.Is() - check sentinel error ---")

	_, err = findUser(999)
	if errors.Is(err, ErrNotFound) {
		fmt.Println("User not found - có thể return 404")
	}

	_, err = findUser(-1)
	if errors.Is(err, ErrInvalidInput) {
		fmt.Println("Invalid input - có thể return 400")
	}

	fmt.Println()
	fmt.Println("--- Error Wrapping với %w ---")

	err = processUser(999)
	fmt.Printf("Wrapped error: %v\n", err)

	// errors.Is vẫn work với wrapped error
	if errors.Is(err, ErrNotFound) {
		fmt.Println("Root cause is ErrNotFound")
	}

	fmt.Println()
	fmt.Println("=== Bài học ===")
	fmt.Println("- Luôn check: if err != nil")
	fmt.Println("- Sentinel errors: định nghĩa 1 lần, so sánh với errors.Is()")
	fmt.Println("- Wrap error: fmt.Errorf(\"context: %w\", err)")
	fmt.Println("- %w giữ chain, %v chỉ lấy message")
}

func findUser(id int64) (*UserData, error) {
	if id <= 0 {
		return nil, ErrInvalidInput
	}

	// Giả lập database
	if id == 1 {
		return &UserData{ID: 1, Name: "John"}, nil
	}

	return nil, ErrNotFound
}

func processUser(id int64) error {
	_, err := findUser(id)
	if err != nil {
		// Wrap error với context
		return fmt.Errorf("processUser failed for id %d: %w", id, err)
	}
	return nil
}
