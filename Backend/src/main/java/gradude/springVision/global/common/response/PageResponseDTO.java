package gradude.springVision.global.common.response;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
@Builder
public class PageResponseDTO<T> {

    private List<T> content;
    private int page;
    private int size;
    private int totalPages;
    private long totalElements;

    public static <T> PageResponseDTO<T> of(Page<T> page) {
        return PageResponseDTO.<T>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .build();
    }
}
