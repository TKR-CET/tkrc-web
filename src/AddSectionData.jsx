import { useState } from "react";
import axios from "axios";

const AddProject = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    techStack: "",
    liveDemo: "",
    githubLink: "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]); // Store selected image files
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length < 3) {
      alert("Please upload at least 3 images.");
      return;
    }

    const formData = new FormData();
    formData.append("title", project.title);
    formData.append("description", project.description);
    formData.append("techStack", project.techStack);
    formData.append("liveDemo", project.liveDemo);
    formData.append("githubLink", project.githubLink);
    
    images.forEach((image) => {
      formData.append("images", image); // Append images to FormData
    });

    try {
      const response = await axios.post("http://localhost:5000/api/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Project added successfully!");
      console.log(response.data);

      setProject({
        title: "",
        description: "",
        techStack: "",
        liveDemo: "",
        githubLink: "",
      });

      setImages([]);
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project.");
    }
  };

  return (
    <div>
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" placeholder="Project Title" value={project.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Project Description" value={project.description} onChange={handleChange} required />

        {/* Image Upload Input */}
        <input type="file" multiple accept="image/*" onChange={handleImageChange} required />

        <input type="text" name="techStack" placeholder="Tech Stack (comma-separated)" value={project.techStack} onChange={handleChange} required />
        <input type="text" name="liveDemo" placeholder="Live Demo URL" value={project.liveDemo} onChange={handleChange} required />
        <input type="text" name="githubLink" placeholder="GitHub Repo URL" value={project.githubLink} onChange={handleChange} required />

        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default AddProject;