package org.example.Service;

import org.example.DTO.BookDTO;
import org.example.DTO.BookDTOResponse;
import org.example.Entity.Book;
import org.example.Exception.ResourceNotFoundException;
import org.example.Mapper.BookMapper;
import org.example.Repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    public BookServiceImpl(BookRepository bookRepository, BookMapper bookMapper) {
        this.bookRepository = bookRepository;
        this.bookMapper = bookMapper;
    }

    @Override
    public List<BookDTOResponse> getBooks() {
        List<Book> books =  bookRepository.findAll();

        return bookMapper.toResponseList(books);
    }

    @Override
    public BookDTOResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Book not found"));

        return bookMapper.toDTOResponse(book);
    }

    @Override
    public List<BookDTOResponse> getBooksByTitle(String title) {
        List<Book> books = bookRepository.findByTitleContainingIgnoreCase(title);
        return bookMapper.toResponseList(books);
    }

    @Override
    public BookDTOResponse createBook(BookDTO bookDTO) {
        Book book = bookMapper.toEntity(bookDTO);
        book = bookRepository.save(book);

        return bookMapper.toDTOResponse(book);
    }

    @Override
    public BookDTOResponse updateBook(BookDTO bookDTO, Long id) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Book not found"));

        Book bookToUpdate = bookMapper.toEntity(bookDTO);
        bookToUpdate.setId(existingBook.getId());

        return bookMapper.toDTOResponse(bookRepository.save(bookToUpdate));
    }

    @Override
    public BookDTOResponse deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Book not found"));

        BookDTOResponse response = bookMapper.toDTOResponse(book);

        bookRepository.delete(book);

        return response;
    }
}
