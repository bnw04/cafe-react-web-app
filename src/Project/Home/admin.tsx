import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate} from 'react-router';
import { useSelector } from 'react-redux';
import { ProjectState } from '../store';
import * as admin from './home';
import * as client from "../User/client";
import axios from "axios";
import { Link } from 'react-router-dom';
import { FaDeleteLeft } from 'react-icons/fa6';
import Trending from './trend';
axios.defaults.withCredentials = true;

function AdminHome() {
    const {pathname} = useLocation()
    const [brews, setBrews] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const {currentUser} = useSelector((state: ProjectState) => state.userReducer)
    const [val, setVal] = useState('Likes')
    
    
    const fetchBrews = async () => {
      try {
        const bre = await admin.findAllBrews();
        if (val === "Likes") {
            admin.sortBrewByLikes(bre.length).then((brews) => setBrews(brews));   
        } else {
            admin.sortBrewByFollowers(bre.length).then((brews) => setBrews(brews));   
        }
            
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
  
  
 
  const handleDeleteBrew = (bid: any) =>{
    const rest = brews.filter((m) => m._id !== bid)
    admin.deleteBrew(bid).then((status) => setBrews(rest));
  }

  const findUsrName = (id : any) =>{
    try {
      const nameU = users.find((i) => i._id === id).username
      return nameU
    } catch (error) {

    }
  }


const [ownerBrews, setOwnerBrews] = useState<any[]>([]);
const checkOwnerBrews = async () => {
    console.log('-----find one');
    const ownerCls = await admin.findAllProvedCls(); 
    // const ols = ownerCls.filter((m: any) => m.approved == true && m.completed == true);
    setOwnerBrews(ownerCls);
};

useEffect(() => {
    fetchUsers();
    checkOwnerBrews();
}, []);

useEffect(() => {
    fetchBrews();
}, [val]);

  return (
    <>
    <div className='col-3'>
        <input placeholder="search brewery name...." defaultValue={val}
            className="border rounded-2 d-flex"
            onChange={(e) => setVal(e.target.value)}/>  
       
        <Trending trend = {val} brews = {brews}/>
    </div>
    <div className='col-9 flex-grow-1 me-2 my-4 px-5 ms-2'>
        <div className='px-5 mb-3' > 
            <strong className='text-primary fs-5'> Welcome !</strong>
            <strong className='text-danger fs-5'> @ {  currentUser && currentUser.username }</strong>
            <Link to = {`/Home/User`}
                className='btn btn-outline-danger ms-3 rounded-4'> Home </Link>
            <Link to ={`./Edit`} className="btn btn-outline-danger rounded-4 mx-2"> Delete Edit </Link>
            <Link to ={`./`}
                className={pathname.includes(`Edit`)? "btn btn-outline-warning ms-3 rounded-4 " : "d-none"}>
            Publish </Link>
        </div>
                
      <ul className="mx-2 list-group rounded-2 mt-4"> 
            {!brews && "there is no result ~~"}
            {brews && brews.map((br: any, index : number) => 
            ( 
                <li className= "list-group-item border-2 d-flex flex-grow-1" >

                        <div 
                            className= "col-4 text-primary " >
                            Brewery : <br></br><strong>{br.name}</strong> 
                            <button onClick={() => handleDeleteBrew(br._id)} 
                                className={ pathname.includes('Edit') && !ownerBrews.filter((i) => i.brewery_ref == br.id)[0] ? 'btn btn-light btn-sm ms-2 fs-2 text-danger': 'd-none'}
                                ><FaDeleteLeft /> </button>  
                        </div>
                        <div className='col-2 text-primary'>
                            Beer Type:  {br.beer_types && br.beer_types.map((cm : any) => <li className='ms-4'> <strong>{cm}</strong> </li>)} 
                        </div>
                        <div className='col-4 text-primary'>
                            Contact: 
                                <li><strong>Tel :</strong> {br.phone}</li>
                                {br.address && Object.entries(br.address).map(([key, value]) => (
                                    <li key={key}>
                                    <strong>{key}:</strong> {value as React.ReactNode}
                                    </li>
                                ))}
                        </div>
                        <div className='col text-danger'>
                            Claimed Status : <br></br>{ ownerBrews && ownerBrews.filter((i) => i.brewery_ref == br.id)[0] 
                            && findUsrName(ownerBrews.filter((i) => i.brewery_ref == br.id)[0].owner) || "Not Claimed"}
                        </div> 
    
                </li>))
                }  
                <span className={ brews.length == 0 ? "text-danger m-5" : "d-none"}>
                ----------- No Result -----------</span>
        </ul>  
    </div>
    </>

  );
}
export default AdminHome;
