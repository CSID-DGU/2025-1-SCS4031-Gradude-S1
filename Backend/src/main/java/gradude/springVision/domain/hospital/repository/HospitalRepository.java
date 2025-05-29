package gradude.springVision.domain.hospital.repository;

import gradude.springVision.domain.hospital.entity.Hospital;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    Page<Hospital> findByNameContaining(String keyword, Pageable pageable);

    @Query(value = """
    SELECT 
        h.id,
        h.name,
        h.latitude,
        h.longitude,
        (
            6371 * acos(
                cos(radians(:lat)) * cos(radians(h.latitude)) *
                cos(radians(h.longitude) - radians(:lng)) +
                sin(radians(:lat)) * sin(radians(h.latitude))
            )
        ) AS distance
    FROM hospital h
    WHERE (
        6371 * acos(
            cos(radians(:lat)) * cos(radians(h.latitude)) *
            cos(radians(h.longitude) - radians(:lng)) +
            sin(radians(:lat)) * sin(radians(h.latitude))
        )
    ) <= :radius
    ORDER BY distance
    """, nativeQuery = true)
    List<Object[]> findHospitalsWithinRadius(@Param("lat") double lat, @Param("lng") double lng, @Param("radius") double radius);

    @Query(value = """
    SELECT h.id, h.latitude, h.longitude, h.stroke_center    
    FROM hospital h
    WHERE h.latitude BETWEEN :swLat AND :neLat
      AND h.longitude BETWEEN :swLng AND :neLng
    """, nativeQuery = true)
    List<Object[]> findHospitalsWithinBounds(@Param("neLat") double neLat, @Param("neLng") double neLng, @Param("swLat") double swLat, @Param("swLng") double swLng);
}
