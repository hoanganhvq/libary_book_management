package org.example.Repository;

import org.example.Entity.Book;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findAllByTitle(String title);
    List<Book> findByTitleContainingIgnoreCase(String title);

    // Query cho trang đầu tiên (Cursor null)
    @Query("SELECT b FROM Book b ORDER BY b.createdAt DESC, b.id DESC")
    List<Book> findFirstPage(Pageable pageable);

    // Query cho các trang sau (Cursor có giá trị)
    @Query("""
    SELECT b FROM Book b
    WHERE (b.createdAt < :lastCreatedAt) OR 
          (b.createdAt = :lastCreatedAt AND b.id < :lastId)
    ORDER BY b.createdAt DESC, b.id DESC
""")
    List<Book> findNextPage(
            @Param("lastCreatedAt") LocalDateTime lastCreatedAt,
            @Param("lastId") Long lastId,
            Pageable pageable);
}
