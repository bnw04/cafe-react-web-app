import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ProjectState } from "../store";

function Nav() {
  
  const { pathname } = useLocation();

  const { currentUser } = useSelector((state: ProjectState) => state.userReducer);

  return (
    <div className="navbar navbar-expand-lg fixed-top bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to={"/Home"}><img src={`/images/three.png`} style={{width: '55px', height: '55px' }}/></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerTarget" aria-controls="navbarTogglerTarget" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between bg-light" id="navbarTogglerTarget">
            <ul className="navbar-nav me-3 mb-2 mb-lg-0">
              <li className="nav-item" key={0}>
                  <Link className={`nav-link ${pathname.includes("Home") && "active fw-bold"}`} to={currentUser ? "/Home/User" : "/Home"}>
                      Home
                  </Link>
              </li>
              <li className="nav-item" key={1}>
                  <Link className={`nav-link ${pathname.includes("Search") && !pathname.includes("User") && "active fw-bold"}`} to={"/Search"}>
                      Search
                  </Link>
              </li>
              <li className="nav-item" key={2}>
                  <Link className={`nav-link ${pathname.includes("Details") && !pathname.includes("User") && "active fw-bold"}`} to={"/Details"}>
                      Details
                  </Link>
              </li>
              {!currentUser && (
                <>
                  <li className="nav-item" key={3}>
                      <Link className={`nav-link ${pathname.includes("Signin") && "active fw-bold"}`} to={"/User/Signin"}>
                          Signin
                      </Link>
                  </li>
                  <li className="nav-item" key={4}>
                      <Link className={`nav-link ${pathname.includes("Signup") && "active fw-bold"}`} to={"/User/Signup"}>
                          Signup
                      </Link>
                  </li>
                </>
              )}

              {currentUser && (
                <>
                  <li className="nav-item" key={5}>
                    <Link className={`nav-link ${pathname.includes("Profile") && "active fw-bold"}`} to={"/User/Profile"}>
                        Profile
                    </Link>
                  </li>
                </>
                )}
            </ul>

            {currentUser &&
              <span className="navbar-text">
                Welcome, {currentUser.firstName}
              </span> 
            }
        </div>
      </div>
    </div >
  )
}

export default Nav;