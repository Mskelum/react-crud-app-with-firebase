import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, getDoc, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../Firebase';
import { uploadBytesResumable, ref, deleteObject, getDownloadURL } from 'firebase/storage';
import './Home.css'; 
import Navbar from '../../Components/Navbar/Navbar';

const Home = () => {

  const [userDetails, setUserDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [degree, setDegree] = useState('');
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState('');
  const [fileupload, setFileupload] = useState(null);
  const [image, setImage] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);

  const navigate = useNavigate();

  const userCollectionRef = collection(db, 'users');

  useEffect(() => {
    // Check if the user is logged in
    if (!auth.currentUser) {
      navigate('/');
      return;
    }

    // Fetch user details
    const getUserDetails = async () => {
      try {
        const querySnapshot = await getDocs(userCollectionRef);
        const userDoc = querySnapshot.docs.find(doc => doc.data().email === auth.currentUser.email);
        if (userDoc) {
          setUserDetails(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user details: ', error);
      }
    };

    getUserDetails();
  }, [navigate]);

  const handleAddDetails = async () => {
    try {
      await addDoc(userCollectionRef, {
        name,
        age,
        degree,
        address,
        birthday,
        email: auth.currentUser.email
      });
      setUserDetails({ name, age, degree, address, birthday });
      setName('');
      setAge('');
      setDegree('');
      setAddress('');
      setBirthday('');
      setEditing(false);
    } catch (error) {
      console.error('Error adding user details: ', error);
    }
  };

  const handleUpdateDetails = async () => {
    try {
      const userDoc = await getDocs(userCollectionRef);
      const userToUpdate = userDoc.docs.find(doc => doc.data().email === auth.currentUser.email);
      if (userToUpdate) {
        await updateDoc(doc(db, 'users', userToUpdate.id), {
          name,
          age,
          degree,
          address,
          birthday
        });
        setUserDetails({ name, age, degree, address, birthday });
        setName('');
        setAge('');
        setDegree('');
        setAddress('');
        setBirthday('');
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating user details: ', error);
    }
  };

  const handleEditClick = () => {
    if (userDetails) {
      setName(userDetails.name);
      setAge(userDetails.age);
      setDegree(userDetails.degree);
      setAddress(userDetails.address);
      setBirthday(userDetails.birthday);
    }
    setEditing(true);
  };


  const uploadFile = async () => {
    if (!fileupload) return;

    const fileFolderRef = ref(storage, `projectFiles/${fileupload.name}`);

    try {
      // Upload file
      const snapshot = await uploadBytesResumable(fileFolderRef, fileupload);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log(downloadURL);

      // Get the current user's email
      const userEmail = auth.currentUser ? auth.currentUser.email : null;

      // Update Firestore database with download URL and user email
      const valRef = collection(db, "users");
      await addDoc(valRef, { downloadURL, userEmail });

      // Set file upload status to true
      setFileUploaded(true);

      alert("File successfully uploaded");
    } catch (err) {
      console.error(err);
    }
  };

  const editFile = async () => {
    if (!fileupload) return;

    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.error('No user document found!');
        return;
      }

      const userData = userDoc.data();

      // Check if there's an existing file URL
      if (userData.downloadURL) {
        const oldFileRef = ref(storage, `projectFiles/${userData.downloadURL.split('/').pop()}`);
        await deleteObject(oldFileRef);
      }

      // Upload the new file
      const fileFolderRef = ref(storage, `projectFiles/${fileupload.name}`);
      const snapshot = await uploadBytesResumable(fileFolderRef, fileupload);

      // Get download URL for the new file
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update Firestore with the new download URL
      await updateDoc(userDocRef, { downloadURL });

      // Reset the file input and image preview
      setFileupload(null);
      setFileUploaded(false); 

      alert("File successfully updated");
    } catch (err) {
      console.error('Error updating file:', err);
      alert("Error updating file. Please try again.");
    }
  };

  const getImage = async () => {
    try {
      const valRef = collection(db, "users");
      const datadb = await getDocs(valRef);
      const allData = datadb.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setImage(allData);
    } catch (error) {
      console.error("Error getting images:", error);
    }
  };

  useEffect(() => {
    getImage();
  }, []);


  return (
    <div>
      <Navbar />
      <div className="home-container">
        <div className="header">
          <div>
            {image.map((value, index) => (
              <div key={index}>
                {auth.currentUser.email === value.userEmail && (
                  <div className="profile-image-container">
                    <img src={value.downloadURL} alt="User" className="profile-image" />
                  </div>

                )}
              </div>
            ))}
          </div>
          <h1>User Details</h1>
          <h2>{auth.currentUser?.email}</h2>
          {userDetails ? (
            <button className="edit-button" onClick={handleEditClick}>Edit</button>
          ) : (
            <div className="add-details-container">
              <p>Please add your account details:</p>
              <button className="add-button" onClick={() => setEditing(true)}>+</button>
            </div>
          )}
        </div>
        {editing && (
          <div className="details-form">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <input
              type="text"
              placeholder="Degree"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="date"
              placeholder="Birthday"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
            <div>
              <input type="file" onChange={(e) => setFileupload(e.target.files[0])} />
              {!fileUploaded && (
                <button onClick={uploadFile}>Add image</button>
              )}
              {fileUploaded && (
                <button onClick={editFile}>Edit image</button>
              )}
            </div>
            <button onClick={userDetails ? handleUpdateDetails : handleAddDetails}>
              {userDetails ? 'Update Details' : 'Add Details'}
            </button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        )}
        {userDetails && !editing && (
          <div className="user-details" style={{ alignItems: 'center' }}>
            <h2>User Information</h2>
            <table>
              <tbody>
                <tr>
                  <td>Name:</td>
                  <td>{userDetails.name}</td>
                </tr>
                <tr>
                  <td>Age:</td>
                  <td>{userDetails.age}</td>
                </tr>
                <tr>
                  <td>Degree:</td>
                  <td>{userDetails.degree}</td>
                </tr>
                <tr>
                  <td>Address:</td>
                  <td>{userDetails.address}</td>
                </tr>
                <tr>
                  <td>Birthday:</td>
                  <td>{userDetails.birthday}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};



export default Home;
