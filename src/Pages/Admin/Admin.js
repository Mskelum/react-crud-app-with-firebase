import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '../../Firebase';
import './Admin.css';
import NavbarAdmin from '../../Components/Navbar/NavbarAdmin';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    age: '',
    degree: '',
    address: '',
    birthday: ''
  });

  useEffect(() => {
    // Fetch all user details
    const getUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    getUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      await addDoc(collection(db, 'users'), newUser);
      setNewUser({ name: '', age: '', degree: '', address: '', birthday: '' });
      setShowForm(false);
      // Fetch updated user list
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    } catch (error) {
      console.error('Error adding user: ', error);
    }
  };

  return (
    <div className="admin-container">
      <NavbarAdmin />
      
      <h1>All Users</h1>

      <div className="add-user-container">
        <button onClick={() => setShowForm(!showForm)} className="add-user-button">+</button>
        {showForm && (
          <div className="add-user-form">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newUser.name}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={newUser.age}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="degree"
              placeholder="Degree"
              value={newUser.degree}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newUser.address}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="birthday"
              placeholder="Birthday"
              value={newUser.birthday}
              onChange={handleInputChange}
            />
            <button onClick={handleAddUser} className="save-user-button">Save</button>
          </div>
        )}
      </div>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Degree</th>
              <th>Address</th>
              <th>Birthday</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.degree}</td>
                <td>{user.address}</td>
                <td>{user.birthday}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default Admin;
