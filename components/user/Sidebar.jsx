import { useRouter } from 'next/router';
import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext';

const Sidebar = ({user}) => {
  const { refreshUser, logout } = useContext(AuthContext); 
  const router = useRouter();

  const logoutUser = async (e) => {
      e.preventDefault();
      await logout();
      await refreshUser();
      router.push('/login');
    }
  return (
    <>
        <aside className="orders-sidebar">
            <div className="osb-user">
                <div className="osb-avatar">{user?.username?.toUpperCase()?.slice(0,1)}</div>
                <div>
                <h3>{user?.username?.slice(0, 25)}{user?.username?.length > 25 && "..."}</h3>
                <p>{user?.email}</p>
                </div>
            </div>

            <nav className="osb-menu">
                <a href="/orders">My Orders</a>
                <a href="/delivery-address">Address</a>
                <a href="#">Profile</a>
                <a href="/confirm-pay">Billing</a>
                <a href="#" onClick={(e) => logoutUser(e)} className="logout">Logout</a>
            </nav>
        </aside>
    </>
  )
}

export default Sidebar