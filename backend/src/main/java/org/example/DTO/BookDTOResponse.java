package org.example.DTO;

import lombok.Data;

@Data
public class BookDTOResponse {
    private Long id;
    private String title;
    private String author;
    private String category;
    private Boolean available;
}
