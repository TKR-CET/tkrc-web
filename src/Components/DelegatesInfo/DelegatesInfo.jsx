import React, { useState, useEffect } from 'react';
import './DelegatesInfo.css';

const DelegatesInfo = () => {
    const delegateInfo = {
        chairman: {
            name: "Sri Teegala Krishna Reddy",
            photo: "./images/tkrcet-chairman.webp",
            description: "The newsletter which is being rolled out today marks the launch of an effervescent activity that would enable the management to bring out to the eyes of the competitive world, the academic achievements of our prestigious institution. Teegala Krishna Reddy Engineering College has grown in leaps and bounds, hurtling across barriers along the way. This has been made possible with the collaborative effort of the Management, the Staff and the Students. I congratulate everyone for their commitment.Together, let's continue to strive for excellence and shape a brighter future."
        },
        secretary: {
            name: "Dr. T. Harinath Reddy",
            photo: "./images/tkrcet-secretary.webp",
            description: "Engineers play the most vital and important role in nation building.In modern times, nations which have rich engineering and experienced management domains are flourishing economically and are providing better lives to their people.The essence of Engineering and Management education which has spread in India is a very positive sign not only to cater domestic needs but provide manpower to the entire world and become biggest technically trained community. TEEGALA KRISHNA REDDY EDUCATIONAL SOCIETY is a venture contributing to this Endeavour."
        },
        treasurer: {
            name: "Sri. T. Amaranath Reddy",
            photo: "./images/tkres-treasurer1.webp",
            description: "The motive of TKRES is to develop a global perspective to cope - up with the fast changing technology scenario. In addition to this, values with discipline are the hallmark of our college, besides, ensuring quality of the students; here the emphasis is not only on academic excellence but the development of the overall total personality of a student.We take special care to ensure that new ideas are not merely discussed here but executed.We are confident that in due course, promises will become 'Achievements' in their respective fields. I am delighted that TKRES has published the College Souvenir-2011."
        },
        principal: {
            name: "Dr. D. V. Ravi Shankar",
            photo: "./images/tkr-principal.webp",
            description: "Dr. D. V. Ravi Shankar, Principal, TKR College of Engineering & Technology had obtained his AMIE from Institution of Engineers in the year 1987. He completed his M.Tech in Materials Engineering from Regional Engineering College (REC) presently NIT, Suratkal in the year 1994. He presented his M.Tech thesis paper at ISRO, Bangalore. He obtained is Ph.D in the branch of Mechanical Engineering in the year 2010 from JNT University, Hyderabad under the guidance of Dr.P. Rami Reddy, former Registrar, JNTUH. He has totally 23 years of experience which."
        },
        dean: {
            name: "   Dr. A. Suresh Rao",
            photo: "./images/suresh_cse.webp",
            description: "Dr. A. Suresh Rao, Vice-Principal, TKR College of Engineering & Technology is a Professor in the Department of Computer Science & Engineering and was conferred with the PhD Degree in Computer Science & Engineering from NIT Warangal, in the year 2015. He is currently the Vice Principal, Dean of Academics and Head of the Department of Computer Science and Engineering at TKRCET. His experience spans across a period of 20 years; 02 years in the Industry and 18 Years in Teaching. Apart from teaching he is also a discerning administrator."
        },
        coe: {
            name: "Dr. D.Nageshwar Rao C",
            photo: "./images/coe.webp",
            description: "He is a distinguished academician with 20 Years of teaching experience. He pursued Masters from JNTU Hyderabad and Ph.D in VLSI from GITAM University, Vishakhapatnam. He published several research papers in National and International journals.Presently he is guiding two research scholars. He attended as well as organized several workshops and seminars. He is also been invited as guest lecture and resource person for various reputed institutions. He has been awarded Certificate of Merit in NIET for two consecutive years of 2007 and 2008."
        }
    };

    const delegateKeys = Object.keys(delegateInfo);
    const [currentDelegateIndex, setCurrentDelegateIndex] = useState(0);

    useEffect(() => {
        const delegateInterval = setInterval(() => {
            setCurrentDelegateIndex((prevIndex) => (prevIndex + 1) % delegateKeys.length);
        }, 5000);

        return () => clearInterval(delegateInterval);
    }, [delegateKeys.length]);

    const currentDelegate = delegateInfo[delegateKeys[currentDelegateIndex]];

    return (
        <div className="delegates-container">
          
            <div className="delegates-navigation">
                {delegateKeys.map((key, index) => (
                    <button
                        key={key}
                        onClick={() => setCurrentDelegateIndex(index)}
                        className={`nav-button ${currentDelegateIndex === index ? 'active' : ''}`}
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                ))}
            </div>
            <div className="delegate-details">
                <img
                    src={currentDelegate.photo}
                    alt={currentDelegate.name}
                    className="delegate-photo"
                />
                <h4 className="delegate-name">{currentDelegate.name}</h4>
                <p className="delegate-description">{currentDelegate.description}</p>
            </div>
        </div>
    );
};

export default DelegatesInfo;