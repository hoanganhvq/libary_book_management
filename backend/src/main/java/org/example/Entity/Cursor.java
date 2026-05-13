package org.example.Entity;

import lombok.Builder;
import lombok.Data;
import org.example.DTO.BookDTOResponse;

import java.util.List;


@Data
@Builder
public class Cursor<T> {
    List<T>data;
    String nextCursor;
    boolean hasNext = false;

}
