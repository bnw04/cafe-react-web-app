import React, { useEffect, useState } from 'react';
import * as client from "../User/client";
import { useNavigate } from 'react-router';
import * as common from './home';
import { useSelector } from 'react-redux';
import { ProjectState } from '../store';
import axios from "axios";
import { FaEarlybirds, FaSmile } from 'react-icons/fa';
import { Link } from 'react-router-dom';
axios.defaults.withCredentials = true;

function UsrHome() {

  const [brews, setBrews] = useState<any[]>([]);
  const {currentUser} = useSelector((state: ProjectState) => state.userReducer)
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate()

  const searchBrewsUserCared = async () =>{
    if (!currentUser) {
      alert('You are not authorized, please Sign In/Up!')
      return
    } 
    const brewsFromUser = await common.findBrewsUserCared(currentUser._id)
    if (brewsFromUser.length === 0) {
      alert('you have never liked/followed/commented on any brewery')
    } else {
      setBrews(brewsFromUser)
    }
  }

  const fetchUsers = async () => {
    try {
      const users = await client.findAllUsers();
      setUsers(users);
    } catch (error: any) {
      console.error(error.response.data);
    }
  };

  
  useEffect(() => {
    searchBrewsUserCared()
    fetchUsers()
  }, []);


  const checkComment = (id : any) => {
    if (!currentUser) {
      alert('you need to sign in')
      navigate(`/User/Signin`)
    } else {
      navigate(`/User/Profile/${id}`)
    }
  }

  const [name, setName] = useState("")
  const findUsrName = (id : any) =>{
    try {
      const nameU = users.find((i) => i._id === id).username
      return nameU
    } catch (error) {

    }
  }

  
  return (
    <div >
      <div className='px-5 fs-4' > Welcome  <strong className='text-danger'>@ {findUsrName(currentUser._id)}</strong></div>
      <div className='px-5 fs-4' > Breweries You ever <strong className='text-danger'>Liked/Followed/Commented</strong></div>
        {/* <div className='d-flex justify-content-end'>
          <input placeholder="search brewery I Liked...." value={""}
              className="border rounded-4 p-2 me-3"
              onChange={(e) => searchAllBrews(e.target.value)}/>   
      </div> */}
      {/* <pre>{JSON.stringify(brews,null,2)}</pre> */}
      {/* <pre>{JSON.stringify(users,null,2)}</pre> */}

      <ul className="list-group rounded-5 d-flex flex-grow-1 ps-5"> 
          <li className="list-group-item border-2 " >
          <div className='row text-primary '>
                  <div className= "col-2" >
                    <strong className='fs-5'> <FaEarlybirds/> Brewery </strong>   
                  </div>
                  <div className='col-2'>
                  <strong className='fs-5'> 
                  Website  
                  </strong>   
                  </div>
                  <div className='col'>
                  <strong className='fs-5'> 
                      Beer Type
                  </strong>   
                  </div>
                  <div className='col'>
                  <strong className='fs-5'> 
                    Contact
                  </strong>   
                  </div>
                  <div  className='col'>
                  <strong className='fs-5'> 
                    Likers
                  </strong>   
                  </div>
                  <div className='col'>
                  <strong className='fs-5'>  
                    Followers
                    </strong>   
                  </div>
                  <div className='col-2'>
                  <strong className='fs-5'>
                    Comments
                    </strong>   
                  </div>
                </div>  

          </li>
          {brews && brews.map((br: any) => 
          ( 
            <li 
              className="list-group-item border-2 " >
                <div className='row text-primary'>
                  <div 
                    className= "col-2 fs-5" >
                      {br.name} 
                  </div>
                  <div className='col-2'>
                     <Link to = {`${br.website_url}`}> {br.website_url}</Link>
                  </div>
                  <div className='col'>
                      {br.beer_types && br.beer_types.map((cm : any) => <li className='ms-4'> <strong>{cm}</strong> </li>)} 
                  </div>
                  <div className='col-2'>
                    Tel : {br.phone || "null"}<br></br>

                      {br.address && Object.entries(br.address).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {value as React.ReactNode}
                        </div>
                      ))}

                  </div>
                  <div  className='col'>
                    {br.likers && br.likers.map((cm : any) => 
                        <div
                          className={cm._id === currentUser._id ? 'py-2 text-danger':'py-2 text-primary'} >
                          <FaSmile/> {findUsrName(cm._id) }
                        </div>
                      )}
                  </div>
                  <div className='col'>
                    {br.followers && br.followers.map((cm : any) => 
                      <div
                          className={cm._id === currentUser._id? 'py-2 text-danger':'py-2 text-primary'} >
                          <FaSmile/> {findUsrName(cm._id) } </div>
                      )} 
                  </div>
                  <div className='col-2'>
                    {br.reviews && br.reviews.map((cm : any) => 
                        <div className='py-2 text-warning'> 
                          {cm.comments} 
                          <button className='btn btn-outline-light text-danger' 
                          onClick={() => checkComment(findUsrName(cm.userId))}
                            > @ {findUsrName(cm.userId)} </button>
                        </div>
                      )}     
                  </div>
                </div>            
            </li>))
            }  
            <span className={ brews.length == 0 ? "text-danger m-5" : "d-none"}>
              ----------- No Result -----------</span>
      </ul>
       
    </div>

  );
}
export default UsrHome;


