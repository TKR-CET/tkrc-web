import React, { useState, useEffect } from 'react';
import './Homepage.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Homepage = () => {
    const navigate = useNavigate();

    // Image Carousel Data
    const imagesLoader = [
        "./images/campus.webp",
        "./images/collage4.jpg",
        "./images/collage2.jpg",
        "./images/collage1.jpg"
    ];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Delegate Info Data
    const delegateInfo = {
        chairman: {
            name: "Sri Teegala Krishna Reddy",
            photo: "./images/tkrcet-chairman.webp",
            description: "The newsletter which is being rolled out today..."
        },
        secretary: {
            name: "Dr. T. Harinath Reddy",
            photo: "./images/tkrcet-secretary.webp",
            description: "Engineers play the most vital and important role..."
        },
        principal: {
            name: "Dr. D. V. Ravi Shankar",
            photo: "./images/tkr-principal.webp",
            description: "Dr. D. V. Ravi Shankar, Principal, TKR College of Engineering & Technology..."
        }
    };

    const delegateKeys = Object.keys(delegateInfo);
    const [currentDelegateIndex, setCurrentDelegateIndex] = useState(0);

    // Carousel Effect for Images
    useEffect(() => {
        const imageInterval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesLoader.length);
        }, 5000);
        return () => clearInterval(imageInterval);
    }, []);

    // Carousel Effect for Delegates
    useEffect(() => {
        const delegateInterval = setInterval(() => {
            setCurrentDelegateIndex((prevIndex) => (prevIndex + 1) % delegateKeys.length);
        }, 5000);
        return () => clearInterval(delegateInterval);
    }, []);

    const currentDelegate = delegateInfo[delegateKeys[currentDelegateIndex]];
    const currentImage = imagesLoader[currentImageIndex];

    // Login Handling
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            console.log("Attempting Faculty Login...");
            let facultyResponse = await axios.post('https://tkrcet-backend-g3zu.onrender.com/faculty/login', {
                username,
                password,
            });

            if (facultyResponse.data.success) {
                const faculty = facultyResponse.data.faculty;
                console.log("Faculty Login Success:", faculty);

                localStorage.setItem("facultyId", faculty.id);
                alert(`Login successful!\nName: ${faculty.name}\nRole: ${faculty.designation}\nDepartment: ${faculty.department}`);
                navigate('/index');
                return;
            }
        } catch (err) {
            console.warn("Faculty Login Failed. Trying Student Login...");
        }

        try {
            let studentResponse = await axios.post('https://tkrcet-backend-g3zu.onrender.com/Section/login', {
                rollNumber: username,
                password,
            });

            console.log("Student Response:", studentResponse.data);

            if (studentResponse.data.success) {
                const student = studentResponse.data.student;
                
                if (student && student.id) {
                    try {
                        localStorage.setItem("studentId", JSON.stringify(student.id));
                        alert("Stored Student ID:", localStorage.getItem("studentId"));
                    } catch (error) {
                        console.error("Error storing Student ID:", error);
                    }
                } else {
                    console.error("Student ID is undefined.");
                }

                alert(`Login successful!\nName: ${student.name}`);
                navigate('/index');
                return;
            }
        } catch (err) {
            console.error("Student Login Failed:", err);
            setError("Invalid credentials. Please check your username/roll number and password.");
        }
    };

    return (
        <div>
            <header className="header1">
                <div className="marquee-container">
                    <img id="logo" src="./images/logo.png" alt="TKRCET Logo" />
                    <h3 id="space" className="text-reveal">T.K.R COLLEGE OF ENGINEERING & TECHNOLOGY</h3>
                </div>
            </header>

            <div className="main-content">
                <div className="left-section">
                    <div className="campus-image">
                        <img src={currentImage} alt={`Campus ${currentImageIndex + 1}`} />
                    </div>
                    <div className="about-campus">
                        <h3 className="typing">About TKRCET Campus</h3>
                        <p>TKR College of Engineering and Technology is a premier institution...</p>
                    </div>
                </div>

                <div className="right-section">
                    <div className="delegates">
                        <h3 className="typing">Our Magnificent Delegates</h3>
                        <img src={currentDelegate.photo} alt={currentDelegate.name} />
                        <h4 className="text-reveal1">{currentDelegate.name}</h4>
                        <p>{currentDelegate.description}</p>
                        <div className="quick-links">
                            {delegateKeys.map((key, index) => (
                                <button
                                    key={key}
                                    onClick={() => setCurrentDelegateIndex(index)}
                                    style={{
                                        backgroundColor: currentDelegateIndex === index ? "#ddd" : "#fff"
                                    }}
                                >
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="vision-mission">
                        <div className="vision">
                            <h4 className="typing">Institution Vision</h4>
                            <p>The Institution strives to impart quality education with ethical values...</p>
                        </div>
                        <div className="mission">
                            <h4 className="typing">Institution Mission</h4>
                            <ul>
                                <li>Ensuring excellent branch-wise infrastructural facilities...</li>
                                <li>Making the institute a research/resource centre...</li>
                            </ul>
                        </div>
                    </div>

                    <div className="login">
                        <h3>Login</h3>
                        <input
                            type="text"
                            placeholder="Username / Roll Number"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <button id="menu" onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <p>Copyright © 2024 TKR College of Engineering & Technology. All Rights Reserved.</p>
                <p>Designer, Developer & Maintenance - Mr. Md. Shakeel (TKRES)</p>
            </footer>
        </div>
    );
};

export default Homepage;