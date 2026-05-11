package org.example.Controller;

import jakarta.validation.Valid;
import org.example.DTO.BookDTO;
import org.example.DTO.BookDTOResponse;
import org.example.Service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@Validated
public class BookController {
    private final BookService bookService;
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<List<BookDTOResponse>> findAll() {
        List<BookDTOResponse> result = bookService.getBooks();
        return ResponseEntity.ok(result);
    }


    @GetMapping("/{id}")
    public ResponseEntity<BookDTOResponse> findById(@PathVariable Long id) {
        BookDTOResponse response = bookService.getBookById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<BookDTOResponse>> findByTitle(@RequestParam String title) {
        List<BookDTOResponse> result = bookService.getBooksByTitle(title);
        return ResponseEntity.ok(result);
    }



    @PostMapping
    public ResponseEntity<BookDTOResponse> addBook(
            @RequestBody @Valid BookDTO dto
            ){
        BookDTOResponse response = bookService.createBook(dto);
        return ResponseEntity.status(201).body(response);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BookDTOResponse> deleteBook(@PathVariable Long id) {
        BookDTOResponse response = bookService.deleteBook(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDTOResponse> updateBook(
            @PathVariable Long id,
            @RequestBody @Valid BookDTO dto
    ){
        BookDTOResponse response = bookService.updateBook(dto, id);
        return ResponseEntity.ok(response);
    }
}
