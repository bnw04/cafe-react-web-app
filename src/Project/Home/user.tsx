import React, { useEffect, useState } from 'react';
import * as client from "../User/client";
import { useNavigate, useParams} from 'react-router';
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
  }, [currentUser]);


  const checkComment = (id : any) => {
    if (!currentUser) {
      alert('you need to sign in')
      navigate(`/User/Signin`)
    } else {
      navigate(`/User/Profile/${id}`)
    }
  }

  const findUsrName = (id : any) =>{
    try {
      const nameU = users.find((i) => i._id === id).username
      return nameU
    } catch (error) {

    }
  }


  return (
    <div className='mt-3' >
      <div className='px-5 fs-4 mb-4' > 
        Welcome  <strong className='text-danger'> @ {  currentUser && currentUser.username }</strong>
        <Link to = {`/Home/User`}
        className='btn btn-outline-danger ms-3 rounded-4'> Home </Link>
      </div>
      <div className='px-5 fs-4 mb-3' > Breweries You ever <strong className='text-danger'>Liked/Followed/Commented</strong></div>
      <ul className="list-group d-flex flex-grow-1 ps-5"> 
          {brews && brews.map((br: any) => 
          ( 
            <li 
              className="list-group-item " >
                <div className='row'>
                  <div 
                    className= "col text-primary" >
                      <strong className='fs-5'> <FaEarlybirds/> Brewery :  </strong>  <br></br>
                      <strong className='fs-5 text-danger'>  {br.name}   </strong> 
                     
                  </div>
                  <div className='col text-primary d-none d-md-block'>
                  <strong className='fs-5'> Website  </strong> <br></br>
                     <Link to = {`${br.website_url}`} > {br.website_url || 'None'}</Link>
                  </div>
                  {/* <div className='col'>
                      {br.beer_types && br.beer_types.map((cm : any) => <li className='ms-4'> <strong>{cm }</strong> </li>)} 
                      {! br.beer_types && 'None'}
                  </div> */}
                  <div className='col text-primary d-none d-md-block'>
                  <strong className='fs-5'> 
                    Contact
                  </strong>  <br></br>
                  <strong>Tel :</strong>  {br.phone || "null"}<br></br>
                      {br.address && Object.entries(br.address).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {value as React.ReactNode}
                        </div>
                      ))}

                  </div>
                  <div  className='col text-primary'>
                  <strong className='fs-5'> 
                    Likers
                  </strong>  
                    {br.likers && br.likers.map((cm : any) => 
                        <div
                          className={cm._id === currentUser._id ? 'py-2 text-danger':'py-2 text-warning'} >
                          <FaSmile/> 
                          <button 
                    className={cm._id === currentUser._id? 'btn btn-outline-light btn-sm py-2 text-danger':'btn btn-outline-light text-warning'} 
                          onClick={() => checkComment(findUsrName(cm._id))}
                            > @ {findUsrName(cm._id)} </button>
                        </div>
                      )}
                  </div>
                  <div className='col text-primary'>
                  <strong className='fs-5'>  
                    Followers
                    </strong>  
                    {br.followers && br.followers.map((cm : any) => 
                      <div
                          className={cm._id === currentUser._id? 'py-2 text-danger':'py-2 text-warning'} >
                          <FaSmile/> 
                          <button 
                          className={cm._id === currentUser._id? 'btn btn-outline-light text-danger':'btn btn-outline-light text-warning'} 
                          onClick={() => checkComment(findUsrName(cm._id))}>
                             @ {findUsrName(cm._id)} </button>
                          </div>
                      )} 
                  </div>
                  <div className='col text-primary'>
                  <strong className='fs-5'>
                    Comments
                    </strong>   
                    {br.reviews && br.reviews.map((cm : any) => 
                        <div className='py-2 text-warning'> 
                          {cm.comments} 
                        <button  
                        className={cm.userId === currentUser._id? 'btn btn-outline-light text-danger':'btn btn-outline-light text-warning'} 
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


