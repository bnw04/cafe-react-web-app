import React, { useEffect, useState } from 'react';
import * as admin from './home';
import * as service from '../Details/service';
import {FaEarlybirds, FaPeopleArrows, FaRocket, FaSmile, FaStar,} from "react-icons/fa";
import { useSelector } from 'react-redux';
import { ProjectState } from '../store';
import * as client from "../User/client";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import Trending from './trend';
axios.defaults.withCredentials = true;


function GuestHome() {
    const [brews, setBrews] = useState<any[]>([]);
    const [brew, setBrew] = useState({ _id: "", name : ""});
    const [limitedBrews, setLimits] = useState<any[]>([]);
    const [page, setPage] = useState(-1)
    const {currentUser} = useSelector((state: ProjectState) => state.userReducer)
    const [users, setUsers] = useState<any[]>([]);
    const navigate = useNavigate()
    const [done, setDone] = useState(false)
    const [val, setVal] = useState("Likes")
    
    
    const fetchBrews = async () => {
      try {
        const breweries = await admin.findAllBrews();
        setBrews(breweries);
      } catch (error: any) {
        console.error(error.response.data);
      }
    };

    const fetchUsers = async () => {
      try {
        const users = await client.findAllUsers();
        setUsers(users);
      } catch (error: any) {
        console.error(error.response.data);
      }
    };
  
    useEffect(() => {
      fetchBrews();
      fetchUsers();
      setPage(0)
    }, []);
  
  
    const updateLikes = async (brew : any) =>{
      if (!currentUser) {
        alert('You are not authorized, please Sign In/Up!')
        return
      } 
      const index = await admin.findUserFromLikers(brew._id, currentUser._id)
      if (index) {
        alert('you already liked')
        return
      } else {
        const newBrew = {...brew, likeCount : brew.likeCount + 1, likers : [...brew.likers, currentUser]};
        const newBrews = brews.map((i:any)=> i._id === brew._id? newBrew : i);
        admin.updateBrew(brew._id, newBrew).then((status) => setBrews(newBrews));
      }
      alert(`hey, ${currentUser.username} just liked!`)
    }
    
    const updateFollowers = async (brew : any) => {
      if (!currentUser) {
        alert('You are not authorized, please Sign In/Up!')
        return
      }
      const index = await admin.findUserFromFollowers(brew._id, currentUser._id)
      if (index) {
        alert('You are already a follower!')
        return
      } else {
        const newBrew = {...brew, followers : [...brew.followers, currentUser], followCount : brew.followCount + 1};
        const newBrews = brews.map((i:any)=> i._id === brew._id? newBrew : i);
        admin.updateBrew(brew._id, newBrew).then((status) => setBrews(newBrews));
      }
      alert(`Hey, ${currentUser.username} just followed!`)
    }
    
    const [review, setReview] = useState({userId : "", comments: ""})
    const [currentID, setCurrent] = useState(" ")
    const updateReviews = async (brew: any, currentComment : any) =>{
      const reviewedBrew = brews.find((i :any) => i._id === brew._id)
      const newReview = [...reviewedBrew.reviews, currentComment]
      const newBrew = {...brew, reviews : newReview}
      const newBrews = brews.map((i:any)=> i._id === brew._id? newBrew : i);
      admin.updateBrew(brew._id, newBrew).then((status) => setBrews(newBrews));
      setCurrent(" ")
    }
  
    const getLikeBrews = (num : Number) => {
      setPage(-1)
      admin.sortBrewByLikes(num).then((brews) => setLimits(brews));    
    }
    
    const getFollowBrews =  (num : Number) => {
      setPage(-1)
      admin.sortBrewByFollowers(num).then((brews) => setLimits(brews));    
    }
    
    const getRandomBrews = (num : Number) => {
      setPage(-1)
      admin.findRandomBrews(num).then((brews) => setLimits(brews));    
    }
  
  
    const searchBrew = async (name : string) => {
      if (name.length > 0) {
        setBrew({...brew, name : name})
        try {
          const namebrews = await admin.findBrewsByName(name)
          setLimits(namebrews)
        } catch (error: any) {
          console.error(error.response.data);
        }
      } else {
        setLimits(brews.slice(page * 10 , page * 10 + 10))
      }
    }
  

   
    const [ownerBrews, setOwnerBrews] = useState<any[]>([])
    const addOwnerBrews = async () => {
      if (currentUser && currentUser.role === "OWNER") {
        try {
          const ownerCls = await admin.findBrewForOwner(currentUser);
          const ownerIds = ownerCls.filter((brewery: any) => brewery.completed && brewery.approved).map((i : any) => i.brewery_ref);     
          // owner automatically like and follow his/her own brewery
          const importBrews = await service.getBreweryFromAPIs(ownerIds, currentUser._id);
          setOwnerBrews([...importBrews])
        } catch (error: any) {
          console.error(error.response.data);
        }
      }
    }
    
    const highLightOwner  = () => {
      if (ownerBrews.length > 0) {
        const updatedBrews = ownerBrews.map((brew : any) => ({ ...brew,  name: `${brew.name} -- Owner`})) 
        setLimits([...updatedBrews, ...limitedBrews])
      } else {
        alert('you have not claimed any breweries yet!')
      }
    }
  
    const checkComment = (id : any) => {
      if (!currentUser) {
        navigate(`/User/Profile`)
      } else {
        navigate(`/User/Profile/${id}`)
      }
    }
    
  
  
    useEffect(() => {
      setLimits(brews.slice(page * 10 , page * 10 + 10))
    }, [page, brews]);

    
    const myActivities = () => {
        if (!currentUser) {
            alert('Please Log In')
            navigate(`../../User/Signin`)
        } else {
            navigate(`../User/${currentUser._id}`)
        }
    }

    const switchTrend = () => {
      if (done) {
        setVal("Follows")
      } else {
        setVal("Likes")
      }

    }

    useEffect(() => {
      addOwnerBrews()
      switchTrend()
    }, [currentUser, done]);
  
  return (
    <>
    <div className='col-3 d-none d-lg-block'>
      <button className='btn btn-light btn-sm' onClick={() => setDone(!done)}> Switch </button>
      <Trending trend = {val} brews = {brews}/>
    </div>
    <div className="col-9 flex-grow-1 me-2 my-4 ">
        <div className='d-flex ms-5 mb-3'>
            <button onClick={() => highLightOwner()}
              className={currentUser && currentUser.role === "OWNER"? "btn btn-warning  me-2 " : "d-none"}
              type="button">My Breweries </button>

            {/* <button onClick={() => findNeighbors()}
            className={currentUser && currentUser.role === "OWNER"? "btn btn-danger  me-2" : "d-none"}
            type="button">Neighborhood </button> */}

            <Link to ={ `../Admin`}
            className={currentUser && currentUser.role === "ADMIN"? "btn btn-secondary me-2" : "d-none"} >
                Settings </Link>
            <button onClick={() => myActivities()}
                className="btn btn-info me-2 "
            type="button"> My Activities </button>
            
            <input placeholder="search brewery name...." defaultValue={brew.name}
                className="border rounded-4 p-2 me-3 d-none d-sm-block"
                onChange={(e) => searchBrew(e.target.value)}/>   
            <button className="dropdown btn btn-success me-2 dropdown-toggle " type="button"
                    id="dd" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Views 
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a className="dropdown-item btn" onClick={() => getLikeBrews(10)}>Top 10 Likes</a>
                <a className="dropdown-item btn" onClick={() => getFollowBrews(10)}>Top 10 Followers</a>
                <a className="dropdown-item btn" onClick={() => getRandomBrews(10)}>Random 10</a>
            </div>
            <button onClick={() => setPage(page -1)}
                className={limitedBrews.length >= 0 && page > 0?"btn btn-outline-secondary me-2 ": "d-none"}  type="button"
            > {"<< Prev"} </button>
            <button onClick={() => setPage(page +1)}
            className={limitedBrews.length > 0 && page >= 0?"btn btn-outline-secondary me-2 ": "d-none"} type="button"
            > {"Next >>"}       
            </button>
            <button onClick={() => setPage(0)}
            className={limitedBrews.length === 0 || page === -1?"btn btn-outline-secondary ": "d-none"} type="button"
            > {">> Front"}          
            </button>
        </div>

        <ul className="list-group rounded-2 d-flex flex-grow-1 ps-5 mt-2 "> 
            {!limitedBrews && "there is no result ~~"}
            {limitedBrews && limitedBrews.map((br: any, index : number) => 
            ( 
                <li 
                className={br.name.includes('Owner')? "list-group-item border-info border-4" : "list-group-item border-2"} >
                    <div className='row d-flex flex-grow-1'>
                    <div 
                        className={br.name.includes('Owner')? "col-3 text-primary text-danger flex-fill fs-5" : "col-3 text-primary fs-5"} >
                        <FaEarlybirds/> Brewery  <br></br>{br.name} 
                    </div>
                    <div className='col-1 text-success d-none d-md-block'>
                        Type : {br.brewery_type}
                    </div>
                    <div className='col-2 text-primary d-none d-md-block'>
                        Beer Type:  
                        {br.beer_types && br.beer_types.map((cm : any) => <li className='ms-4'> <strong>{cm}</strong> </li>)} 
                    </div>
                    <div className='col-4 d-none d-sm-block'>
                        Tel : {br.phone}<br></br>
                        <ul className='d-none d-sm-block '>
                        {br.address && Object.entries(br.address).map(([key, value]) => (
                            <li key={key}>
                            <strong>{key}:</strong> {value as React.ReactNode}
                            </li>
                        ))}
                        </ul>
                    </div>
                    <div className='col-2 flex-fill'>
                            <button onClick={() => updateLikes(br)}
                                className= "mb-2 btn btn-sm btn-warning form-control">
                                    <FaStar/> like : {br.likeCount} 
                                </button> <br></br>
                                <button onClick={() => updateFollowers(br)}
                                className= "btn btn-sm btn-primary form-control">
                                    <FaPeopleArrows/> follow : {br.followCount}
                                </button>

                                <button onClick={() => setCurrent(br._id)}
                                className={currentUser && !br.name.includes('Owner')? "btn btn-sm btn-secondary float-end my-2" : "d-none"}>
                                    Add Comment
                                </button>

                                <Link to = {`/Details/Owner/${br.id}`}
                                className={br.name.includes('Owner')? "btn btn-info float-end my-2" : "d-none"}>
                                    Manage Details
                                </Link>
                                <textarea placeholder='add comments....' value={review.comments} 
                                className={br._id == currentID? "border form-control" : "d-none"}
                                onChange={(e) => setReview({userId : currentUser._id, comments: e.target.value})}
                                />
                                <button onClick={() => setCurrent(" ")}
                                className={br._id == currentID? "btn btn-sm btn-danger float-end my-2 ms-2" : "d-none"}>
                                    Cancel
                                </button>
                                <button onClick={() => updateReviews(br, review)}
                                className={br._id == currentID? "btn btn-sm btn-success float-end my-2" : "d-none"}>
                                    Submit
                                </button>
                    </div>   
                    </div>
                    {br.reviews && br.reviews.map((cm : any) => {
                    const usr = users.find((i)=>i._id === cm.userId)
                    if(usr) {
                        return (
                        <span className='py-2 text-warning me-2 p-2'><FaSmile/> {cm.comments} 
                        <button className='btn btn-outline-light rounded- 5 text-danger text-decoration-none' 
                        onClick={() => checkComment(usr._id)}
                            > @ {usr.username}</button></span>
                        );}})   
                        }       
                </li>))
                }  
                <span className={ limitedBrews.length == 0 ? "text-danger m-5" : "d-none"}>
                ----------- No Result -----------</span>
        </ul>
        </div>

    </>
  );
}
export default GuestHome;


