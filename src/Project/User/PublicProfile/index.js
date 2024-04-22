import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as fClient from "../Follows/followClient";
import * as client from "../client"


export default function PublicProfile() {
  const { profileId } = useParams();
  const { currentUser } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [follows, setFollows] = useState([]);
  const [foNumber, setFoNumber] = useState(0);
  const [ferNumber, setFerNumber] = useState(0);

  const fetchFollows = async () => {
    try {
      if (currentUser) {
      const fos = await fClient.findFollowsOfAUser(currentUser._id);
      const follows = await fClient.followsNumber(profileId);
      const followers = await fClient.followersNumber(profileId);
      setFoNumber(follows)
      setFerNumber(followers)
      setFollows(fos);
    } else {
      navigate("/User/Profile")
    }
    } catch (err) {
      navigate("/User/Profile")
    }
  }

  const fetchUser = async () => {
    try {
      if (currentUser && profileId === currentUser._id) {
        navigate("/User/Profile");
        return;
      }
      const cur = await client.findUserById(profileId);
      setUser(cur);
    } catch (err) {
      console.error(err.response.data.message);
      navigate("/User/Profile");
    }
  }

  const following = () => {
    if (!currentUser || !follows) return false;
    return follows.some(fo => fo.follows?._id === profileId);
  }
  
  const followUser = async () => {
    if (!currentUser) {
      alert("Sign in to follow user")
      navigate("/User/Signin")
      return;
    }
    if (user && user.role === "ADMIN") {
      alert("Cannot follow admin")
      navigate("/User/Profile")
      return;
    }
    const status = await fClient.followsUser(profileId);
    fetchFollows();
  }

  const unfollowUser = async () => {
    if (!currentUser) {
      alert("Sign in first")
      navigate("/User/Signin")
      return;
    }
    const status = await fClient.unfollowsUser(profileId);
    fetchFollows();
  }

  useEffect(() => {
    fetchUser();
    fetchFollows();
  }, [profileId]);

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h3>{user.username}'s Profile</h3>
          {currentUser &&
            <div className="d-flex justify-content-end align-items-center">
            <Link to={`/User/Profile/${profileId}/follows`} className="badge bg-success-subtle text-dark p-2 fs-6 me-2 text-decoration-none">
              Followers 
              <span className="badge bg-light text-dark ms-1">{ferNumber}</span>
            </Link>
            <Link to={`/User/Profile/${profileId}/follows`} className="badge bg-secondary p-2 fs-6 text-decoration-none">
              Follows 
              <span className="badge bg-light text-dark ms-1">{foNumber}</span>
            </Link>
          </div>
          }
        </div>

        <div className="card-body">
        {following() && (currentUser._id !== user._id) ? (
            <button onClick={unfollowUser} className="btn bg-danger-subtle form-control">
              Unfollow
            </button>
            ):(
            <button onClick={followUser} className="btn bg-warning-subtle form-control">
              Follow
            </button>
          )}
        </div>
      </div>  
    </div>
  )

}
