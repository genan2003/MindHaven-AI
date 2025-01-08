package databases.project.backend.service;

import org.springframework.stereotype.Service;

import databases.project.backend.repository.TherapeuticalAppRepository;

@Service
public class TherapeuticAppService {

    private final TherapeuticalAppRepository therapeuticAppRepository;

    public TherapeuticAppService(TherapeuticalAppRepository therapeuticAppRepository) {
        this.therapeuticAppRepository = therapeuticAppRepository;
    }

    public TherapeuticalAppRepository addTherapeuticApp(TherapeuticalAppRepository app) {
        return therapeuticAppRepository.save(app);
    }
}
