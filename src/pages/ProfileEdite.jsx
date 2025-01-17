import axios from "axios";
import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/authContext";
import uploadIcon from "../img/upload.png";

const ProfileEdite = () => {
  const { editUser, currentUser } = useContext(AuthContext);
  const userId = useLocation().state;
  const [username, setUsername] = useState(userId?.username || "");
  const [email, setEmail] = useState(userId?.email || "");
  const [password, setPassword] = useState("");
  const [fileImg, setFileImg] = useState(
    userId?.img ||
      "https://res.cloudinary.com/dpnotxpqf/image/upload/v1665885592/blog/userDefault_c8cxqu.png"
  );

  const uploadPrest = process.env.REACT_APP_UPLOAD_PRESET;
  const cloudinaryRequest = process.env.REACT_APP_CLOUDINARY_REQUEST;

  const navigate = useNavigate();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", fileImg);
      formData.append("upload_preset", uploadPrest);
      const response = await axios.post(cloudinaryRequest, formData);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (event) => {
    event.preventDefault();
    let urlImage = await upload();
    try {
      userId &&
        (await editUser({
          username,
          email,
          password,
          img: fileImg ? urlImage.secure_url : "",
        }));
      navigate(`/profile/${currentUser.id}`);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/users/${userId.id}`);
        setUsername(res.data.username);
        setEmail(res.data.email);
        setFileImg(res.data.img);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userId]);

  return (
    <div className="editContainer">
      <motion.div
        className="profileImg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2.7 }}
      >
        <img
          className="avatar"
          src={userId.img ? userId.img : fileImg}
          value={fileImg}
          alt={"Avatar"}
        />
        <input
          style={{ display: "none" }}
          type="file"
          id="file"
          onChange={(e) => setFileImg(e.target.files[0])}
        />
        <label className="file" htmlFor="file">
          <img
            className="upload"
            htmlFor="file"
            src={uploadIcon}
            alt={"télécharger"}
          />
        </label>
      </motion.div>
      <motion.div
        className="profileInfo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2.7 }}
      >
        <span>
          <h1>Modifier votre compte</h1>
        </span>
        <span>
          <h3>Identifiant</h3>
          <span>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </span>
        </span>
        <span>
          <h3>Email</h3>
          <span>
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </span>
        </span>
        <span>
          <h3>Mot de passe</h3>
          <span>
            <input
              required
              type="text"
              placeholder="Nouveau mot de passe"
              onChange={(e) => setPassword(e.target.value)}
            />
          </span>
        </span>
        <span>
          {password ? (
            <button className="confirmBtn" onClick={handleClick}>
              Valider
            </button>
          ) : (
            <p>Nouveau mot de passe obligatoire</p>
          )}
        </span>
      </motion.div>
    </div>
  );
};

export default ProfileEdite;
