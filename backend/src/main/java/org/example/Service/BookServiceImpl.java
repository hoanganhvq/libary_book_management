package org.example.Service;

import org.example.DTO.BookDTO;
import org.example.DTO.BookDTOResponse;
import org.example.Entity.Book;
import org.example.Entity.Cursor;
import org.example.Exception.ResourceNotFoundException;
import org.example.Mapper.BookMapper;
import org.example.Repository.BookRepository;
import org.example.Util.CursorUtil;
import org.hibernate.mapping.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final CursorUtil cursorUtil;
    private final RestClient.Builder builder;

    public BookServiceImpl(BookRepository bookRepository, BookMapper bookMapper, CursorUtil cursorUtil, RestClient.Builder builder) {
        this.bookRepository = bookRepository;
        this.bookMapper = bookMapper;
        this.cursorUtil = cursorUtil;
        this.builder = builder;
    }

    @Override
    public List<BookDTOResponse> getBooks() {
        List<Book> books =  bookRepository.findAll();

        return bookMapper.toResponseList(books);
    }

    @Override
    public Cursor<BookDTOResponse> getBooksCursor(String cursor, int size) {
        Pageable pageable = PageRequest.of(0, size + 1);
        LocalDateTime lastCreatedAt = null;
        Long lastId = null;
        List<Book> books;

        if (cursor != null && !cursor.isEmpty()) {
            var decode = CursorUtil.decode(cursor);
            lastCreatedAt = decode.getFirst();
            lastId = Long.valueOf(decode.getSecond());
           books = bookRepository.findNextPage(lastCreatedAt, lastId, pageable);
        } else{
            books = bookRepository.findFirstPage(pageable);
        }
        boolean hasNext = books.size() > size;

        List<Book> effectiveList = hasNext ? books.subList(0, size) : books;
        List<BookDTOResponse> dtoResponses = bookMapper.toResponseList(effectiveList);

        String nextCursor = null;
        if (hasNext) {
            Book lastBook = effectiveList.get(effectiveList.size() - 1);
            nextCursor = CursorUtil.encode(lastBook.getCreatedAt(), lastBook.getId());
        }

        return Cursor.<BookDTOResponse>builder()
                .nextCursor(nextCursor)
                .hasNext(hasNext)
                .data(dtoResponses)
                .build();
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
