package org.example.Util;



import lombok.AllArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;

@AllArgsConstructor
@Component
public class CursorUtil {
    public static  String encode(LocalDateTime createdAt, Long id) {
        var raw = createdAt.toString() + "|" + id.toString();
        return Base64.getUrlEncoder().withoutPadding().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }

    public  static Pair<LocalDateTime, String> decode(String cursor){
        var raw = new String(Base64.getUrlDecoder().decode(cursor), StandardCharsets.UTF_8);
        var parts = raw.split("\\|", 2);
        return Pair.of(LocalDateTime.parse(parts[0]), parts[1]);
    }
}
