package org.example.serviceTest;

import org.example.DTO.BookDTOResponse;
import org.example.Entity.Book;
import org.example.Exception.ResourceNotFoundException;
import org.example.Mapper.BookMapper;
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

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
public class BookServiceImpleTest {

    @Mock //Just create virtual object
    private BookRepository bookRepository;

    @InjectMocks //Init blockservice and auto inject @mock annotation into object
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

        Mockito.when(bookRepository.findAll()).thenReturn(mockBooks); // when findAll is called, then they should be return mockBooks
        when(bookMapper.toResponseList(anyList()))
                .thenReturn(mockResponses); //When transfer any List, they shoudd be return mockResponse

        List<BookDTOResponse> result = bookService.getBooks();
        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0).getTitle()).isEqualTo("Clean code");
        assertThat(result.get(1).getTitle()).isEqualTo("The Habbit");
        verify(bookRepository, times(1)).findAll(); //Verify method just run 1 time
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
}
