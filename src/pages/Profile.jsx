import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import Page404 from "./Page404";
import { motion } from "framer-motion";

const Profile = () => {
  const userId = useLocation().state;
  const [username, setUsername] = useState(userId?.username);
  const [email, setEmail] = useState(userId?.email);
  const [userImg, setUserImg] = useState(userId?.img);
  const [posts, setPosts] = useState([]);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/users/${userId.id}`);
        setUsername(res.data.username);
        setEmail(res.data.email);
        setUserImg(res.data.img);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userId]);

  //

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/posts/`);
        setPosts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  let numberOfPosts = 0;
  for (let i = 0; i < posts.length; i++) {
    if (currentUser.id === posts[i].userid) numberOfPosts++;
  }

  return userId === null ? (
    <Page404 />
  ) : (
    <motion.div
      className="profile"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.7 }}
    >
      <div className="info">
        <motion.div
          className="profileImg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.7 }}
        >
          <img src={userImg} alt="Profile img" />
        </motion.div>
        <motion.div
          className="infoUser"
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -200 }}
          transition={{ duration: 2.7 }}
        >
          <span>
            <h1>Informations du compte</h1>
          </span>
          <span>
            <h3>Identifiant</h3>
            <span className="spanInfo">{username}</span>
          </span>
          <span>
            <h3>Email</h3>
            <span className="spanInfo">{email}</span>
          </span>
          <span>
            <h3>Nombre d'articles crée</h3>
            <span className="spanInfo">{numberOfPosts}</span>
          </span>
          <span>
            <h3>Mot de passe</h3>
            <span className="spanInfo">********</span>
          </span>
        </motion.div>
      </div>
      <motion.div
        className="posts"
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -200 }}
        transition={{ duration: 2.7 }}
      >
        <h1>Vos articles</h1>
        {posts.map(
          (post) =>
            currentUser.id === post.userid && (
              <div className="post" key={post.id}>
                <img src={post?.img} alt="img" />
                <h2>{post.title}</h2>
                <Link className="link" to={`/post/${post.id}`}>
                  <button className="btn">Lisez l'article</button>
                </Link>
              </div>
            )
        )}
      </motion.div>
    </motion.div>
  );
};

export default Profile;
