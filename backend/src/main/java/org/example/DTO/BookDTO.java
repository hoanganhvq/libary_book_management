package org.example.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookDTO {
    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(min = 2, max = 100, message = "Tiêu đề phải từ 2 đến 100 ký tự")
    private String title;

    @NotBlank(message = "Tác giả không được để trống")
    private String author;

    private String category;

    private Boolean available;

    private LocalDateTime createdAt =  LocalDateTime.now();
}
