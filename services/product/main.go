package main
import (
  "fmt"
  "net/http"
)
func handler(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintf(w, "Hello from Product Service (Go)")
}
func main() {
  http.HandleFunc("/", handler)
  fmt.Println("Product service running on :4002")
  http.ListenAndServe(":4002", nil)
}
