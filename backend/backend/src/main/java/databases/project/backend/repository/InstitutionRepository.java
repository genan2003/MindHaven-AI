package databases.project.backend.repository;

import databases.project.backend.entity.Institution;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstitutionRepository extends JpaRepository<Institution, Long> {
}
