package org.example.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookDTOResponse {
    private Long id;
    private String title;
    private String author;
    private String category;
    private Boolean available;
}
