package gradude.springVision.global.util;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Component
public class S3Provider {

    private final AmazonS3 amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * S3에 파일 업로드하고 업로드된 파일 URL 반환 메서드
     */
    public String uploadFile(MultipartFile file, Long userId, String dirName) {
        String originalFilename = file.getOriginalFilename();
        String extension = "";

        // 파일 확장자 추출
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        }

        // TODO: 파일 확장자 유효성 검사

        // 저장할 파일 경로와 파일명 생성
        String fileName = dirName + "/" + userId + "/" + UUID.randomUUID() + extension; // dirName/userId/랜덤UUID.확장자

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        try {
            amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, file.getInputStream(), metadata));
        } catch (IOException e) {
            throw new GeneralException(ErrorCode.FILE_UPLOAD_FAILED);
        }

        return amazonS3Client.getUrl(bucket, fileName).toString();
    }
}
