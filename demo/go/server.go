package main

import (
  "log"
  "net/http"
)

func main() {
	// Create the file servers
	fsShared := http.FileServer(http.Dir("../shared"))
	fsDist := http.FileServer(http.Dir("../../dist"))

	// Bind the routes to the file servers
	http.Handle("/dist/", http.StripPrefix("/dist/", fsDist))
	http.Handle("/", fsShared)

	// Listen on port 3500
	log.Println("Listening on :3500...")	
	err := http.ListenAndServe(":3500", nil)

	// Log the error that caused the starting problem
	if err != nil {
		log.Fatal(err)
	}
}