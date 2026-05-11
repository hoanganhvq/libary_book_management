package org.example.Mapper;

import org.example.DTO.BookDTO;
import org.example.DTO.BookDTOResponse;
import org.example.Entity.Book;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BookMapper {
    BookDTOResponse toDTOResponse(Book book);

    @Mapping(target = "id", ignore = true)
    Book toEntity(BookDTO bookDTO);

    List<BookDTOResponse> toResponseList(List<Book> books);
}
