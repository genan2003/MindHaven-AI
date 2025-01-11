package databases.project.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "therapeutical_app")
public class TherapeuticApp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String ageGroup;
    private String mentalHealthDisorder;
    private String researcherUsername;
    private int views;
    private Boolean recommended;
    private Double probability = 0.0;

    public void setViews(int views){
        this.views = views;
    }
    public int getViews(){
        return views;
    }

    public boolean isRecommended() {
        return recommended;
    }

    public void setRecommended(boolean recommended) {
        this.recommended = recommended;
    }

    public double getProbability() {
        return probability;
    }

    public void setProbability(double probability) {
        this.probability = probability;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public String getMentalHealthDisorder() {
        return mentalHealthDisorder;
    }

    public void setMentalHealthDisorder(String mentalHealthDisorder) {
        this.mentalHealthDisorder = mentalHealthDisorder;
    }

    public void setResearcherUsername(String researcherName){
        this.researcherUsername = researcherName;
    }

    public String getResearcherUsername(){
        return researcherUsername;
    }
}
