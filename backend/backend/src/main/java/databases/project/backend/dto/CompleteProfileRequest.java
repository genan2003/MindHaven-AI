package databases.project.backend.dto;

public class CompleteProfileRequest {
    private String firstName;
    private String lastName;
    private String mentalHealthDisorder;
    private Integer age;


    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getMentalHealthDisorder() {
        return this.mentalHealthDisorder;
    }

    public void setMentalHealthDisorder(String mentalHealthDisorder) {
        this.mentalHealthDisorder = mentalHealthDisorder;
    }

    public Integer getAge() {
        return this.age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    
}