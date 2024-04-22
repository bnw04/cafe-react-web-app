import * as client from "./client";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "./reducer";
import axios from "axios";
import { FaRegStar } from "react-icons/fa6";
import FollowComponent from "./Follows/FollowComponent";
import { ProjectState } from "../store";
axios.defaults.withCredentials = true;

const formatDate = (date: any) => {
  if (!date) return "";
  const d = new Date(date);
  d.setDate(d.getDate() + 1); 
  
  let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
};

export default function Profile() {

  const { currentUser } = useSelector((state: ProjectState) => state.userReducer);
  const [profile, setProfile] = useState({ _id: "", username: "", password: "", 
    firstName: "", lastName: "", dob: "", email: "", role: "" });
  const [pmt, setPmt] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const [error, setError] = useState("");
  const [complete, setComplete] = useState("");

  const onChangeDate = (e: any) => {
    const inputDate = new Date(e.target.value);
    const formattedDate = formatDate(inputDate);
    setProfile({ ...profile, dob: formattedDate });
  };

  const auth = (profile: any) => {
    if (profile.role === "ADMIN") {
      setIsAdmin(true);
    } else if (profile.role === "OWNER") {
      setIsOwner(true);
    }
  }

  const fetchProfile = async () => {
    try {
      const account = await client.profile();
      const user = await client.findUserById(account._id);
      dispatch(setCurrentUser(user));
      auth(user);
      setProfile(user);
    } catch (err) {
      navigate("/User/Signin");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  
  const updateUser = async () => {
    try {
      const user = await client.updateUser(profile._id, profile);
      dispatch(setCurrentUser(user));
      setError("");
      setComplete("Profile successfully updated.")
    } catch (err: any) {
      setComplete("");
      setError(err.response.data.message)
    }
  };

  const updateRole = async () => {
    try {
      if (pmt) {
        const updated = { ...profile, role: "OWNER" };
        const user = await client.updateUser(profile._id, updated);
        dispatch(setCurrentUser(user));
        setProfile(updated);
        setError("");
        setComplete("User successfully upgraded.")
        setIsOwner(true);
      } else {
        setComplete("");
        setError("Please select your payment.")
      }
    } catch (err: any) {
      setComplete("");
      setError(err.response.data.message)
    }
  };


  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/User/Signin");

  };

  return (
    <div className="container-fluid">
      
      {isAdmin && 
      <>
        <Link to={`/User/Admin/${profile._id}/Users`} className="btn bg-warning-subtle w-100 mb-2">
          Users
        </Link>
        <Link to={`/User/Admin/${profile._id}/Review`} className="btn bg-success-subtle w-100 mb-2">
          Review Owner's Claims
        </Link>
      </>
      }

      {isOwner && 
        <Link to={`/User/Owner/${profile._id}/Claims`} className="btn bg-warning-subtle w-100 mb-2">
          Owner's Claim Request
        </Link>
      }

      {profile && (
        <div className="card">
          <div className="card-header">
            
            <h4>Welcome, {profile.username} 
              {isOwner && <FaRegStar className="text-warning ms-2 mb-1" />}
            </h4>
            {currentUser && <FollowComponent id={currentUser._id}/>}
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger my-1">{error}</div>}
            {complete && <div className="alert alert-success my-1">{complete}</div>}

            <label htmlFor="userUsername" className="form-label">Username: </label>
            <input
                type="text"
                className="form-control"
                value={profile.username}
                id="userUsername"
                onChange={(e) => setProfile({ ...profile, username: e.target.value })} required/>

            <label htmlFor="userPassword" className="form-label mt-2">Password: </label>
            <input
                type="password"
                className="form-control"
                value={profile.password}
                id="userPassword"
                onChange={(e) => setProfile({ ...profile, password: e.target.value })} required/>

            <label htmlFor="userEmail" className="form-label mt-2">Email: </label>
            <input
                type="email"
                className="form-control"
                value={profile.email}
                id="userEmail"
                onChange={(e) => setProfile({ ...profile, email: e.target.value })} required/>
            
            <label htmlFor="userFirstName" className="form-label mt-2">First Name: </label>
            <input
                type="text"
                className="form-control"
                value={profile.firstName}
                id="userFirstName"
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} required/>
            <label htmlFor="userLastName" className="form-label mt-2">Last Name: </label>
            <input
                type="text"
                className="form-control"
                id="userLastName"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} required/>
            <label htmlFor="userBirthday" className="form-label mt-2">Date of birth: </label>
            <input
                type="date"
                className="form-control"
                id="userBirthday"
                value={formatDate(profile.dob)}
                onChange={onChangeDate}
            />

            {!isAdmin && 
            <>
              <label htmlFor="userRole" className="form-label mt-2">User Type: </label>
              <select className="form-select mb-2" id="userRole" value={profile.role} 
                onChange={(e) => setProfile({...profile, role: e.target.value})}>
                <option value="USER">User</option>
                <option value="OWNER">BREWERY OWNER</option>
              </select>
            </>
            }

            {
              isAdmin && 
              <>
              <label htmlFor="userRole2" className="form-label mt-2">User Type: </label>
              <input className="form-control" value="Admin" disabled/>
              </>
            }

            <button onClick={updateUser} className="btn bg-primary-subtle form-control mt-3">
              Save
            </button>

            {!(isOwner) && (profile.role === "OWNER") &&
            <>
              <label htmlFor="patron" className="form-label">Become a Patron to upgrade as a brewery (Payment info): </label>
              <select className="form-select mb-2" id="patron" value={pmt} onChange={(e) =>
                setPmt(e.target.value)}>
                <option value="">Select a Payment Method</option>
                <option value="VISA">Visa</option>
                <option value="MASTERCARD">Master Card</option>
                <option value="AMEX">Amex</option>
                <option value="PAYPAL">PayPal</option>
              </select>
              <button onClick={updateRole} className="btn bg-primary-subtle form-control mt-3">
                Upgrade to brewery owner user
                <FaRegStar className="text-warning ms-2 mb-1" />
              </button>
            </>
            }

            <button onClick={signout} className="btn bg-danger-subtle form-control mt-3">
              Signout
            </button>

          </div>
        </div>  
      )}
    </div>
  );
}
