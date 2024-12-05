import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Backgroundvid from '../Backgroundvid/Backgroundvid';
import Navigation from "../Navigation/Navigation";
import Tlanka from '../Tlanka/Tlanka';
import Cardslider from '../Cardslider/Cardslider';
import Festivals from '../Festivals/Festivals';
import Footer from '../Footer/Footer';

function Home(){
    const location=useLocation()

    return (
        <div className="homep">
            <Navigation/>
            <Backgroundvid/>
            <Tlanka/>
            <Cardslider/>
            <Festivals/> 
            <Footer/>
        </div>
    )
}

export default Home 