import React, { useEffect, useState } from 'react';
import * as admin from './home';
import {FaEarlybirds, FaPeopleArrows, FaRocket, FaSmile, FaStar,} from "react-icons/fa";
import { useSelector } from 'react-redux';
import { ProjectState } from '../store';
import * as client from "../User/client";
import axios from "axios";
import { Link } from 'react-router-dom';
axios.defaults.withCredentials = true;


function Home() {
  const [brews, setBrews] = useState<any[]>([]);
  const [brew, setBrew] = useState({ _id: "", name : ""});
  const [likeBrews, setLRanks] = useState([]);
  const [limitedBrews, setLimits] = useState<any[]>([]);
  const [page, setPage] = useState(-1)
  const {currentUser} = useSelector((state: ProjectState) => state.userReducer)
  const [users, setUsers] = useState<any[]>([]);
  
  
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

  const fetLikeRankings = async () => {
    const likeRankings = await admin.sortBrewByLikes(5); 
    setLRanks(likeRankings)
  }

  const [selectedId, setSelectedId] = useState('')
  const updateLikes = async (brew : any) =>{
    if (!currentUser) {
      alert('You are not authorized, please Sign In/Up!')
      return
    } 
    const index = await admin.findUserFromLikers(brew._id, currentUser._id)
    if (index) {
      alert('you already liked')
    } else {
      const newBrew = {...brew, likeCount : brew.likeCount + 1, likers : [...brew.likers, currentUser]};
      setSelectedId(newBrew._id);
      const newBrews = brews.map((i:any)=> i._id === brew._id? newBrew : i);
      admin.updateBrew(brew._id, newBrew).then((status) => setBrews(newBrews));

    }
  }
  
  const updateFollowers = async (brew : any) => {
    if (!currentUser) {
      alert('You are not authorized, please Sign In/Up!')
      return
    }
    const index = await admin.findUserFromFollowers(brew._id, currentUser._id)
    if (index) {
      alert('You are already a follower!')
    } else {
      const newBrew = {...brew, followers : [...brew.followers, currentUser], followCount : brew.followCount + 1};
      const newBrews = brews.map((i:any)=> i._id === brew._id? newBrew : i);
      admin.updateBrew(brew._id, newBrew).then((status) => setBrews(newBrews));
    }
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

  // not done !!!!!!
  const findNeighbors = () => {
    
  }

  // not done !!!!!!
  const findAllStores = () => {
  }

  const ownerPage = async () => {
    if (currentUser && currentUser.role === "OWNER") {
      try {
        const ownerCls = await admin.findBrewForOwner(currentUser);
        const ownerBr = ownerCls.filter((brewery: any) => brewery.completed && brewery.approved);     
        if (ownerBr.length > 0) { 
          const updatedBreweries = ownerBr.map((brewery: any) => ({
            ...brewery,
            name: `${brewery.brewery_name} -- Owner`  
                    }));
          setLimits([... updatedBreweries, ...brews]) }
        
      } catch (error: any) {
        console.error(error.response.data);
      }
    }
  }

  
  useEffect(() => {
    setLimits(brews.slice(page * 10 , page * 10 + 10))
  }, [page, brews]);
  
  useEffect(() => {
    fetLikeRankings();
  }, [limitedBrews]);
  
 
  return (
    <>
    <div className='d-flex mx-4'>
      <div className='col text-start text-primary my-3 fs-4' > Today's Top <strong className='text-danger'>Likes</strong></div>
      <div className="col p-3 ">
        <div className='d-flex justify-content-end'>
          <input placeholder="search brewery name...." defaultValue={brew.name}
              className="border rounded-4 p-2 me-3"
              onChange={(e) => searchBrew(e.target.value)}/>   
          <button onClick={() => ownerPage()}
            className={currentUser && currentUser.role === "OWNER"? "btn btn-info form-control me-2 " : "d-none"}
            type="button">My Brewery </button>
          <button onClick={() => findNeighbors()}
            className={currentUser && currentUser.role === "OWNER"? "btn btn-danger form-control me-2" : "d-none"}
            type="button">Neighborhood </button>
          <button onClick={() => findAllStores()}
            className={currentUser && currentUser.role === "OWNER"? "btn btn-warning form-control  me-2 " : "d-none"}
            type="button">Stores </button> 
          <button 
            className={currentUser && currentUser.role === "ADMIN"? "btn btn-secondary me-2 " : "d-none"}
            type="button">Settings </button>
          <button className="dropdown btn btn-success me-2 dropdown-toggle" type="button"
                  id="dd" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Views 
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a className="dropdown-item btn" onClick={() => getLikeBrews(10)}>Top 10 Likes</a>
              <a className="dropdown-item btn" onClick={() => getFollowBrews(10)}>Top 10 Followers</a>
              <a className="dropdown-item btn" onClick={() => getRandomBrews(10)}>Random 10</a>
          </div>
        </div>
          <div className='d-flex justify-content-end mt-2'>
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
      </div>
    </div>   

    <div className='d-flex mx-4'>
      <ul className="list-group rounded-5 col-2 "> 
          {likeBrews && likeBrews.map((rank: any, index) => ( 
          <li key= {index} 
              className={selectedId === rank._id? "list-group-item d-flex row border-primary border-3" : "list-group-item d-flex row"} >
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
                      Likes : {rank.likeCount}
                </div>
              </div>
                
          </li> 
          ))}
      </ul>
      <ul className="list-group rounded-5 col-10 flex-grow-1 ps-5"> 
          {!limitedBrews && "there is no result ~~"}
          {limitedBrews && limitedBrews.map((br: any, index : number) => 
          ( 
            <li 
              className={br.name.includes('Owner')? "list-group-item border-info border-4" : "list-group-item border-2"} >
                <div className='row d-flex flex-grow-1'>
                  <div 
                    className={br.name.includes('Owner')? "col-3 text-primary fs-5 text-danger" : "col-3 text-primary fs-5"} >
                      <FaEarlybirds/> Brewery <br></br>{br.name} 
                  </div>
                  <div className='col-1 text-success'>
                      Type : {br.brewery_type}
                  </div>
                  <div className='col-2 text-primary'>
                      Beer Type:  
                      {br.beer_types && br.beer_types.map((cm : any) => <li className='ms-4'> <strong>{cm}</strong> </li>)} 
                  </div>
                  <div className='col-4'>
                    Tel : {br.phone}<br></br>
                    <ul>
                      {br.address && Object.entries(br.address).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {value as React.ReactNode}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className='col-2'>
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
                            <Link to = {`../User/Profile`}
                              className={currentUser && br.name.includes('Owner')? "btn btn-info float-end my-2" : "d-none"}>
                                Manage Profile
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
                      <Link className='text-danger text-decoration-none' to = {`../User/Profile/${usr._id}`}> @ {usr.username}</Link></span>
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
export default Home;


