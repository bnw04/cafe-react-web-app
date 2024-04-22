import { Routes, Route } from 'react-router';
import { Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import Nav from './Nav';
import store from './store';
import Home from './Home';
import Search from './Search';
import Signup from './User/Signup';
import Signin from './User/Signin';
import Logging from './User/Logging';
import Profile from './User/Profile';
import UserTable from './User/Table';
import Details from './Details';
import DetailBrewery from './Details/DetailBrewery';
import PublicProfile from './User/PublicProfile';
import FollowDetails from './User/Follows/FollowDetails';
import OwnerClaim from './Details/DetailBrewery/OwnClaim';
import Claims from './User/Claims';
import Reviews from './User/Reviews';

function Project() {

  return (
    <Provider store={store}>
        <Logging>
          <div className='d-flex flex-column'>
              <Nav />
              <div className='flex-grow-1 mt-5 pt-5' >
                  <Routes>
                      <Route path="/" element={<Navigate to="Home" />} />
                      <Route path="Home" element={<Home />} />
                      <Route path="Search" element={<Search />} />
                      <Route path="Details" element={<Details />} />
                      <Route path="Details/:detailId" element={<DetailBrewery />} />
                      <Route path="User/Signin" element={<Signin />} />
                      <Route path="User/Signup" element={<Signup />} />
                      <Route path="User/Profile" element={<Profile />} />
                      <Route path="User/Profile/:profileId" element={<PublicProfile />} />
                      <Route path="User/Profile/:profileId/follows" element={<FollowDetails />} />
                      <Route path="User/Owner/:ownerId/Claims" element={<Claims />} />
                      <Route path="User/Admin/:adminId/Users" element={<UserTable />} />
                      <Route path="User/Admin/:adminId/Review" element={<Reviews />} />
                      <Route path="Details/:detailId/claim" element={<OwnerClaim />} />
                  </Routes>
              </div>
          </div>
        </Logging>
    </Provider>

    )
}

export default Project;