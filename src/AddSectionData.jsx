import { useState } from "react";
import axios from "axios";

const AddProject = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    images: ["", "", ""], // At least 3 image URLs required
    techStack: "",
    liveDemo: "",
    githubLink: "",
  });

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...project.images];
    updatedImages[index] = value;
    setProject({ ...project, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/data/create", {
        ...project,
        techStack: project.techStack.split(",").map((tech) => tech.trim()), // Convert tech stack to array
      });

      alert("Project added successfully!");
      console.log(response.data);

      setProject({
        title: "",
        description: "",
        images: ["", "", ""],
        techStack: "",
        liveDemo: "",
        githubLink: "",
      });
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project.");
    }
  };

  return (
    <div>
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Project Title" value={project.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Project Description" value={project.description} onChange={handleChange} required />

        {/* Image Inputs */}
        {project.images.map((img, index) => (
          <input key={index} type="text" placeholder={`Image ${index + 1} URL`} value={img} onChange={(e) => handleImageChange(index, e.target.value)} required />
        ))}

        <input type="text" name="techStack" placeholder="Tech Stack (comma-separated)" value={project.techStack} onChange={handleChange} required />
        <input type="text" name="liveDemo" placeholder="Live Demo URL" value={project.liveDemo} onChange={handleChange} required />
        <input type="text" name="githubLink" placeholder="GitHub Repo URL" value={project.githubLink} onChange={handleChange} required />

        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default AddProject;