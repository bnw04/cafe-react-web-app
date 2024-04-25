import React, { useEffect, useState } from 'react';
import * as admin from './home';
import * as service from '../Details/service';
import { useSelector } from 'react-redux';
import { ProjectState } from '../store';
import axios from "axios";
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import UsrHome from './user';
import GuestHome from './guest';
import AdminHome from './admin';
axios.defaults.withCredentials = true;


function Home() {
  const {currentUser} = useSelector((state: ProjectState) => state.userReducer)
  const {pathname} = useLocation()
  

  const greetings = () => {
    if (pathname.includes("Home")) {
      if (!currentUser) {
        window.alert(`Hello Guest ! Welcome to Our Website !`)
      }
      if (currentUser && currentUser.role === 'ADMIN') {
        window.alert(`Welcome ${currentUser.firstName} ! I hope you Enjoy Working here !`)
      }
      if (currentUser && currentUser.role === 'USER') {
        window.alert(`Welcome ${currentUser.firstName} ! Feel Free to Play here!`)
      }
      if (currentUser && currentUser.role === 'OWNER') {
        window.alert(`Hello ${currentUser.firstName} ! you have some breweries here!`)
      }
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

  
  useEffect(() => {
    addOwnerBrews()
    greetings();
  }, [currentUser]);


  return (
    <>
    {/* <div className='d-flex mx-4'> */}
      {/* <Trending trend = {"Likes"}/> */}
      <div className='d-flex mx-4'>
          <Routes>
              <Route path="/" element={<Navigate to="Guest" />} />
              <Route path="Guest" element={<GuestHome/>} />
              <Route path="User" element={<GuestHome/>} />
              <Route path="User/:usrId" element={<UsrHome/>} />
              <Route path="Admin/*" element={<AdminHome/>} />
          </Routes>
      </div>
    {/* </div> */}
    </>
  );
}
export default Home;


