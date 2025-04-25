package gradude.springVision.domain.diary.repository;

import gradude.springVision.domain.diary.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    boolean existsByUserIdAndCreatedAtBetween(Long userId, LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<Diary> findAllByUserIdAndCreatedAtBetween(Long userId, LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<Diary> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);
}
