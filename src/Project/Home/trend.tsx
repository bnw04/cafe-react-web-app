
import React, { useEffect, useState } from 'react';
import * as admin from './home';
import {FaRocket,} from "react-icons/fa";
import axios from "axios";
axios.defaults.withCredentials = true;

function Trending({trend, brews} : {trend : string, brews : any[]}) {
    const [ranks, setRanks] = useState([]);


    useEffect(() => {
        fetchRankings();
    }, [brews, trend]);

    const fetchRankings = async () => {
        if (trend === 'Likes') {
            const rankings = await admin.sortBrewByLikes(5); 
            setRanks(rankings)
        }
        if (trend === 'Follows') {
            const rankings = await admin.sortBrewByFollowers(5); 
            setRanks(rankings)
        }
    }
        
    return (
        <>
        <ul className="list-group rounded-2 flex-grow-1"> 
            <span className='text-start text-primary  fs-3' > Today's Top <strong className='text-danger'>{trend}</strong></span>
            <br></br>
            {ranks && ranks.map((rank: any, index : number) => ( 
            <li key= {index} 
                className={ "list-group-item d-flex row rounded"} >
                <div className=' col-3 text-danger fs-2'>
                    {index +1}  
                </div>
                <div className='col-9 text-primary'>
                    {rank.name}
                    <div className=' text-success'>
                    Type : {rank.brewery_type}
                    </div>
                    <div className='col text-danger'>
                    <FaRocket className= "me-3 text-danger "/>
                        {trend} : {trend === 'Likes' && rank.likeCount}{trend === 'Follows' && rank.followCount}
                    </div>
                </div>
                    
            </li> 
            ))}
        </ul>
        
        </>
    );

}
export default Trending

