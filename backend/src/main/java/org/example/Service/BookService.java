package org.example.Service;

import org.example.DTO.BookDTO;
import org.example.DTO.BookDTOResponse;
import org.example.Entity.Cursor;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface BookService {
    List<BookDTOResponse> getBooks();
    Cursor<BookDTOResponse> getBooksCursor(String cursor, int size);

    BookDTOResponse getBookById(Long id);
    List<BookDTOResponse> getBooksByTitle(String title);
    BookDTOResponse createBook(BookDTO bookDTO);

    BookDTOResponse updateBook(BookDTO bookDTO, Long id);

    BookDTOResponse deleteBook(Long id);
}
