package databases.project.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import databases.project.backend.entity.TherapeuticApp;

public interface TherapeuticalAppRepository extends JpaRepository<TherapeuticApp, Long> {
    List<TherapeuticApp> findByResearcherUsername(String researcherUsername);

    public TherapeuticalAppRepository save(TherapeuticalAppRepository app);
}
