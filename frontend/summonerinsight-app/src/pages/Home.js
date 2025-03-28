import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import SearchSummonerBar from "../components/SearchSummonerBar";
import "../assets/css/pages/Home.css";

import lol_splash from "../assets/img/pages/home/lol_splash.jpg";
import noe from "../assets/img/team/noe.jpg";
import { clearSummonerData } from "../redux/summonerSlice";

import { CiMail } from "react-icons/ci";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoMdPlanet } from "react-icons/io";

function TeamMember({name, img, description, linkedinUrl, githubUrl, websiteUrl, mail}){
    return(
        <div className="team-member">
            <figure className="team-member-img">
                <img src={img} alt={name}/>
            </figure>
            <figcaption>
                <h5>{name}</h5>
                <p>{description}</p>
                <div className="social">
                    {websiteUrl && (
                        <a href={websiteUrl} target="_blank" rel="noreferrer">
                            <IoMdPlanet />
                        </a>
                    )}
                    {mail && (
                        <a href={`mailto:${mail}`} target="_blank" rel="noreferrer">
                            <CiMail />
                        </a>
                    )}
                    {githubUrl && (
                        <a href={githubUrl} target="_blank" rel="noreferrer">
                            <FaGithub />
                        </a>
                    )}
                    {linkedinUrl && (
                        <a href={linkedinUrl} target="_blank" rel="noreferrer">
                            <FaLinkedin />
                        </a>
                    )}
                </div>
            </figcaption>
        </div>
    );
}

export default function Home() {
    const dispatch = useDispatch();
    useEffect(() => {
        document.title = "Summoner Insight";
        dispatch(clearSummonerData());
    }, [dispatch]);

    return (
        <div id="home" className="page">
            <div className="section">
                <div className="home-intro">
                    <div className="splash_art">
                        <img src={lol_splash} alt="Summoner Insight Logo" />
                    </div>
                    <div className="title">
                        <h1>Welcome to Summoner Insight</h1>
                    </div>
                    <SearchSummonerBar isSmall={false}/>
                </div>
            </div>
            <div className="section" style={{boxShadow: "none"}}>
                <div className="home-about-us">
                    <div className="title">
                        <h2>About Us</h2>
                    </div>
                    <div className="content">
                        <p>
                            We are a small team of university students who enjoy this game, our passions pushing us to collaborate and create this website.
                            We aim at sharing our passion by providing a platform for players to learn more about their gameplay,
                            as well as using latest technologies to provide advices, and help players get insights about their gameplay.
                            We hope you enjoy our website!
                        </p>
                        <div className="team">
                            <TeamMember
                                name="Noe Jager"
                                img={noe}
                                description="Master student in Computer Science at University of Montréal"
                                linkedinUrl="https://www.linkedin.com/in/no%C3%A9-jager-2b4866236/"
                                githubUrl="https://github.com/elnukakujo"
                                mail="noe.p.jager@gmail.com"
                                websiteUrl="https://elnukakujo.github.io/"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}