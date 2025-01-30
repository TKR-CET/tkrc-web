import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Homepage.css';

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
                    photo: "../images/tkrcet-chairman.webp",
                    description: "The newsletter which is being rolled out today marks the launch of an effervescent activity that would enable the management to bring out to the eyes of the competitive world, the academic achievements of our prestigious institution. Teegala Krishna Reddy Engineering College has grown in leaps and bounds, hurtling across barriers along the way. This has been made possible with the collaborative effort of the Management, the Staff and the Students. I congratulate everyone for their commitment.Together, let's continue to strive for excellence and shape a brighter future."
                },
                secretary: {
                    name: "Dr. T. Harinath Reddy",
                    photo: "../images/tkrcet-secretary.webp",
                    description: "Engineers play the most vital and important role in nation building.In modern times, nations which have rich engineering and experienced management domains are flourishing economically and are providing better lives to their people.The essence of Engineering and Management education which has spread in India is a very positive sign not only to cater domestic needs but provide manpower to the entire world and become biggest technically trained community. TEEGALA KRISHNA REDDY EDUCATIONAL SOCIETY is a venture contributing to this Endeavour."
                },
                treasurer: {
                    name: "Sri. T. Amaranath Reddy",
                    photo: "../images/tkres-treasurer1.webp",
                    description: "The motive of TKRES is to develop a global perspective to cope - up with the fast changing technology scenario. In addition to this, values with discipline are the hallmark of our college, besides, ensuring quality of the students; here the emphasis is not only on academic excellence but the development of the overall total personality of a student.We take special care to ensure that new ideas are not merely discussed here but executed.We are confident that in due course, promises will become 'Achievements' in their respective fields. I am delighted that TKRES has published the College Souvenir-2011."
                },
                principal: {
                    name: "Dr. D. V. Ravi Shankar",
                    photo: "../images/tkr-principal.webp",
                    description: "Dr. D. V. Ravi Shankar, Principal, TKR College of Engineering & Technology had obtained his AMIE from Institution of Engineers in the year 1987. He completed his M.Tech in Materials Engineering from Regional Engineering College (REC) presently NIT, Suratkal in the year 1994. He presented his M.Tech thesis paper at ISRO, Bangalore. He obtained is Ph.D in the branch of Mechanical Engineering in the year 2010 from JNT University, Hyderabad under the guidance of Dr.P. Rami Reddy, former Registrar, JNTUH. He has totally 23 years of experience which."
                },
                dean: {
                    name: "Dr. A. Suresh Rao",
                    photo: "../images/suresh_cse.webp",
                    description: "Dr. A. Suresh Rao, Vice-Principal, TKR College of Engineering & Technology is a Professor in the Department of Computer Science & Engineering and was conferred with the PhD Degree in Computer Science & Engineering from NIT Warangal, in the year 2015. He is currently the Vice Principal, Dean of Academics and Head of the Department of Computer Science and Engineering at TKRCET. His experience spans across a period of 20 years; 02 years in the Industry and 18 Years in Teaching. Apart from teaching he is also a discerning administrator."
                },
                coe: {
                    name: "Dr. D.Nageshwar Rao C",
                    photo: "../images/coe.webp",
                    description: "He is a distinguished academician with 20 Years of teaching experience. He pursued Masters from JNTU Hyderabad and Ph.D in VLSI from GITAM University, Vishakhapatnam. He published several research papers in National and International journals.Presently he is guiding two research scholars. He attended as well as organized several workshops and seminars. He is also been invited as guest lecture and resource person for various reputed institutions. He has been awarded Certificate of Merit in NIET for two consecutive years of 2007 and 2008."
                }
            };
    const delegateKeys = Object.keys(delegateInfo);
    const [currentDelegateIndex, setCurrentDelegateIndex] = useState(0);

    // Auto Image Carousel Effect
    useEffect(() => {
        const imageInterval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesLoader.length);
        }, 5000);
        return () => clearInterval(imageInterval);
    }, []);

    // Auto Delegate Carousel Effect
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
            console.log("Attempting Student Login...");
            let studentResponse = await axios.post('https://tkrcet-backend-g3zu.onrender.com/Section/login', {
                rollNumber: username,
                password,
            });

            if (studentResponse.data.success) {
                const student = studentResponse.data.student;

                if (student && student.id) {
                    localStorage.setItem("studentId", student.id);
                    alert(`Login successful!\nName: ${student.name}\nStored Student ID: ${localStorage.getItem("studentId")}`);
                } else {
                    console.error("Student ID is undefined.");
                }

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
            {/* Header */}
            <header className="header1">
                <div className="marquee-container">
                    <img id="logo" src="./images/logo.png" alt="TKRCET Logo" />
                    <h3 id="space" className="text-reveal">T.K.R COLLEGE OF ENGINEERING & TECHNOLOGY</h3>
                </div>
            </header>

            {/* Main Content */}
            <div className="main-content">
                {/* Left Section */}
                <div className="left-section">
                    <div className="campus-image">
                        <img src={currentImage} alt={`Campus ${currentImageIndex + 1}`} />
                    </div>
                    <div className="about-campus">
                        <h3 className="typing">About TKRCET Campus</h3>
                        <p>TKR College of Engineering and Technology - a modern temple of learning, an off shoot of the TKR Educational Society was established in the year 2002 in a sprawling, lush green 20 acre campus at Meerpet, Hyderabad. The college provides a serene and tranquil environment to the students, boosting their mental potential and preparing them in all aspects to face the cut- throat global competition with a smile on the face and emerge victorious.

                    Sri Teegala Krishna Reddy, the Mayor of Hyderabad, is the founder chairman of TKR Educational Society. A Philanthropist by nature, "the friend of man, to vice alone of foe", and an urge to see our students excelling themselves in all fields prompted him to start the educational society; making it easy for education to be within arm's length of even a rural student and providing them with an independent and easy in the for pursuing their dreams and making them come true and in the process upholding moral and ethical values.
                    
                    The person puts in all his efforts to see the students excelling themselves and takes great pride in watching them carve out a niche for themselves is none other than Dr. T. Harinath Reddy, the Secretary of the college. A calm and serene countenance with sharp, twinkling eyes, he is the pivotal of encouragement and is always on the look out for avenues, which would provide the wherewithal for developing a cutting edge to their capabilities and potentialities.
                    
                    The college is headed by eminent principal Dr. D. V. Ravi Shankar. He obtained his AMIE in Mechanical Engineering, M.Tech and Ph.D from JNT University, Hyderabad. He published various research papers in national and international journals.
                    
                    The College is affiliated to Jawaharlal Nehru Technological University Kukatpally, Hyderabd. It has been approved by AICTE, New Delhi and the State Government of Telangana and has been sanctioned seven UG courses - Civil Engineering, Electrical & Electronics Engineering, Computer Science & Engineering, Electronics & Communication Engineering, Mechanical Engineering and PG Courses - M.Tech in CSE, PE & MBA. In addition the College is running second shift Polytechnic in the branches - CIVIL, EEE, MECH, ECE & CSE.</p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="right-section">
                    {/* Delegates Section */}
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

                    {/* Vision & Mission */}
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

                    {/* Login Section */}
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

            {/* Footer */}
            <footer className="footer">
                <p>Copyright © 2024 TKR College of Engineering & Technology. All Rights Reserved.</p>
                <p>Designer, Developer & Maintenance - Mr. Md. Shakeel (TKRES)</p>
            </footer>
        </div>
    );
};

export default Homepage;