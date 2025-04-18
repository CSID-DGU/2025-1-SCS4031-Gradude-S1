package gradude.springVision.domain.user.repository;

import gradude.springVision.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByKakaoId(Long kakaoId);

    Boolean existsByKakaoId(Long kakaoId);
}
