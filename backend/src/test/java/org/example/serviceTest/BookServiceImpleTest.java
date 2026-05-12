package org.example.serviceTest;

import org.example.DTO.BookDTO;
import org.example.DTO.BookDTOResponse;
import org.example.Entity.Book;
import org.example.Exception.ResourceNotFoundException;
import org.example.Mapper.BookMapper;
import org.example.Mapper.BookMapperImpl;
import org.example.Repository.BookRepository;
import org.example.Service.BookService;
import org.example.Service.BookServiceImpl;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
public class BookServiceImpleTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookServiceImpl bookService;
    @Mock
    private BookMapper  bookMapper;

    @Test
    void getBooks_returnAllBooks() {
        List<Book> mockBooks = List.of(
                new Book(1L, "Clean code", "Robert Martin", "Technology", true),
                new Book(2L, "The Habbit", "Tolkien", "Fiction", true)
        );

        List<BookDTOResponse> mockResponses = List.of(
                new BookDTOResponse(1L, "Clean code", "Robert Martin", "Technology",true),
                new BookDTOResponse(2L, "The Habbit", "Tolkien", "Fiction" ,true)
        );

        Mockito.when(bookRepository.findAll()).thenReturn(mockBooks);

        when(bookMapper.toResponseList(anyList()))
                .thenReturn(mockResponses);
        List<BookDTOResponse> result = bookService.getBooks();

        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0).getTitle()).isEqualTo("Clean code");
        assertThat(result.get(1).getTitle()).isEqualTo("The Habbit");
        verify(bookRepository, times(1)).findAll();
    }

    @Test
    void getBooks_returnEmptyList_whenNoBooksExist() {
        when(bookRepository.findAll())
                .thenReturn(Collections.emptyList());

        when(bookMapper.toResponseList(anyList()))
                .thenReturn(Collections.emptyList());

        List<BookDTOResponse> result = bookService.getBooks();

        assertThat(result).isEmpty();
    }

    @Test
    void getBooks_throwException_whenRepositoryFails() {
        when(bookRepository.findAll())
                .thenThrow(new RuntimeException("DB Error"));

        assertThrows(RuntimeException.class,
                () -> bookService.getBooks());
    }

    @Test
    void getBookById_returnBook_whenBookExists() {
        Long id = 1L;

        Book mockBook = new Book(
                1L,
                "Clean code",
                "Robert Martin",
                "Technology",
                true
        );

        BookDTOResponse mockResponse =
                new BookDTOResponse(
                        1L,
                        "Clean code",
                        "Robert Martin",
                        "Technology",
                        true
                );

        when(bookRepository.findById(id))
                .thenReturn(Optional.of(mockBook));

        when(bookMapper.toDTOResponse(mockBook))
                .thenReturn(mockResponse);

        BookDTOResponse result =
                bookService.getBookById(id);

        assertThat(result).isNotNull();

        assertThat(result.getTitle())
                .isEqualTo("Clean code");

        verify(bookRepository, times(1))
                .findById(id);

        verify(bookMapper, times(1))
                .toDTOResponse(mockBook);
    }

    @Test
    void getBookById_throwException_whenBookNotFound() {
        Long id = 99L;

        when(bookRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> bookService.getBookById(id)
        );

        verify(bookRepository, times(1))
                .findById(id);

        verify(bookMapper, never())
                .toDTOResponse(any());
    }

    @Test
    void getBookById_throwCorrectMessage_whenBookNotFound() {
        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> bookService.getBookById(99L)
                );

        assertThat(exception.getMessage())
                .isEqualTo("Book not found");
    }

    @Test
    void createBook_success() {
        BookDTO request = new BookDTO(
                "Clean Code",
                "Robert Martin",
                "Technology",
                true
        );

        Book entity = new Book(
                null,
                "Clean Code",
                "Robert Martin",
                "Technology",
                true
        );

        Book savedBook = new Book(
                1L,
                "Clean Code",
                "Robert Martin",
                "Technology",
                true
        );

        BookDTOResponse response =
                new BookDTOResponse(
                        1L,
                        "Clean Code",
                        "Robert Martin",
                        "Technology",
                        true
                );

        when(bookMapper.toEntity(request))
                .thenReturn(entity);

        when(bookRepository.save(entity))
                .thenReturn(savedBook);

        when(bookMapper.toDTOResponse(savedBook))
                .thenReturn(response);

        BookDTOResponse result =
                bookService.createBook(request);

        assertThat(result).isNotNull();

        assertThat(result.getId()).isEqualTo(1L);

        assertThat(result.getTitle())
                .isEqualTo("Clean Code");

        verify(bookMapper, times(1))
                .toEntity(request);

        verify(bookRepository, times(1))
                .save(entity);

        verify(bookMapper, times(1))
                .toDTOResponse(savedBook);
    }

    @Test
    void createBook_throwException_whenSaveFails() {

        BookDTO request = new BookDTO();

        Book entity = new Book();

        when(bookMapper.toEntity(request))
                .thenReturn(entity);

        when(bookRepository.save(entity))
                .thenThrow(new RuntimeException("DB Error"));

        assertThrows(
                RuntimeException.class,
                () -> bookService.createBook(request)
        );

        verify(bookMapper, never())
                .toDTOResponse(any());
    }

    @Test
    void deleteBook_success() {

        Long id = 1L;

        Book mockBook = new Book(
                1L,
                "Clean Code",
                "Robert Martin",
                "Technology",
                true
        );

        BookDTOResponse mockResponse =
                new BookDTOResponse(
                        1L,
                        "Clean Code",
                        "Robert Martin",
                        "Technology",
                        true
                );

        when(bookRepository.findById(id))
                .thenReturn(Optional.of(mockBook));

        when(bookMapper.toDTOResponse(mockBook))
                .thenReturn(mockResponse);

        BookDTOResponse result =
                bookService.deleteBook(id);

        assertThat(result).isNotNull();

        assertThat(result.getId()).isEqualTo(1L);

        assertThat(result.getTitle())
                .isEqualTo("Clean Code");

        verify(bookRepository, times(1))
                .findById(id);

        verify(bookMapper, times(1))
                .toDTOResponse(mockBook);

        verify(bookRepository, times(1))
                .delete(mockBook);
    }

    @Test
    void deleteBook_throwException_whenBookNotFound() {

        Long id = 99L;

        when(bookRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> bookService.deleteBook(id)
        );

        verify(bookRepository, times(1))
                .findById(id);

        verify(bookMapper, never())
                .toDTOResponse(any());

        verify(bookRepository, never())
                .delete(any());
    }

    @Test
    void deleteBook_throwCorrectMessage_whenBookNotFound() {
        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> bookService.deleteBook(99L)
                );

        assertThat(exception.getMessage())
                .isEqualTo("Book not found");
    }

    @Test
    void deleteBook_throwException_whenDeleteFails() {
        Long id = 1L;
        Book mockBook = new Book(1L, "Clean Code", "Robert Martin", "Technology", true);

        when(bookRepository.findById(id))
                .thenReturn(Optional.of(mockBook));

        doThrow(new RuntimeException("Delete Error"))
                .when(bookRepository)
                .delete(mockBook);

        assertThrows(
                RuntimeException.class,
                () -> bookService.deleteBook(id)
        );
    }

    @Test
    void getBooksByTitle_success() {

        String title = "Clean Code";

        List<Book> mockBooks = List.of(
                new Book(1L, "Clean Code", "Robert Martin", "Technology", true),
                new Book(2L, "Clean Code", "Robert Martin", "Technology", true)
        );

        List<BookDTOResponse> mockResponses = List.of(
                new BookDTOResponse(1L, "Clean Code", "Robert Martin", "Technology", true),
                new BookDTOResponse(2L, "Clean Code", "Robert Martin", "Technology", true)
        );

        when(bookRepository
                .findByTitleContainingIgnoreCase(title))
                .thenReturn(mockBooks);

        when(bookMapper.toResponseList(mockBooks))
                .thenReturn(mockResponses);

        List<BookDTOResponse> result =
                bookService.getBooksByTitle(title);

        assertThat(result).hasSize(2);

        assertThat(result.get(0).getTitle())
                .isEqualTo("Clean Code");

        verify(bookRepository, times(1))
                .findByTitleContainingIgnoreCase(title);

        verify(bookMapper, times(1))
                .toResponseList(mockBooks);
    }

    @Test
    void updateBook_success() {

        Long id = 1L;

        BookDTO request = new BookDTO(
                "Updated Title",
                "Updated Author",
                "Updated Category",
                true
        );

        Book existingBook = new Book(
                1L,
                "Old Title",
                "Old Author",
                "Old Category",
                false
        );

        Book mappedEntity = new Book(
                null,
                "Updated Title",
                "Updated Author",
                "Updated Category",
                true
        );

        Book savedBook = new Book(
                1L,
                "Updated Title",
                "Updated Author",
                "Updated Category",
                true
        );

        BookDTOResponse response = new BookDTOResponse(
                1L,
                "Updated Title",
                "Updated Author",
                "Updated Category",
                true
        );

        // mock findById
        when(bookRepository.findById(id))
                .thenReturn(Optional.of(existingBook));

        // mock mapper to entity
        when(bookMapper.toEntity(request))
                .thenReturn(mappedEntity);

        // mock save
        when(bookRepository.save(mappedEntity))
                .thenReturn(savedBook);

        // mock response mapper
        when(bookMapper.toDTOResponse(savedBook))
                .thenReturn(response);

        BookDTOResponse result =
                bookService.updateBook(request, id);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Updated Title");

        verify(bookRepository).findById(id);
        verify(bookMapper).toEntity(request);
        verify(bookRepository).save(mappedEntity);
        verify(bookMapper).toDTOResponse(savedBook);
    }

    @Test
    void updateBook_throwException_whenBookNotFound() {

        Long id = 99L;

        BookDTO request = new BookDTO();

        when(bookRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> bookService.updateBook(request, id)
        );

        verify(bookMapper, never()).toEntity(any());
        verify(bookRepository, never()).save(any());
    }

    @Test
    void updateBook_throwException_whenSaveFails() {
        Long id = 1L;
        Book existingBook = new Book(1L, "Clean Code", "Robert Martin", "Technology", true);
        when(bookRepository.findById(id))
                .thenReturn(Optional.of(existingBook));
        BookDTO request = new BookDTO("Updated Title", "Updated Author", "Updated Category", true);

        Book mappedEntity = new Book(1L, "Clean Code", "Robert Martin", "Technology", true);

        when(bookMapper.toEntity(request))
                .thenReturn(mappedEntity);

        when(bookRepository.save(any()))
                .thenThrow(new RuntimeException("DB Error"));

        assertThrows(
                RuntimeException.class,
                () -> bookService.updateBook(request, id)
        );
    }
}
