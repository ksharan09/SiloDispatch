import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserForm = ({ selectedUser, fetchUsers }) => {
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    if (selectedUser) setForm(selectedUser);
  }, [selectedUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.id) {
      await axios.put(`http://localhost:5000/api/users/${form.id}`, form);
    } else {
      await axios.post('http://localhost:5000/api/users', form);
    }
    setForm({ name: '', email: '' });
    fetchUsers();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <button type="submit">{form.id ? 'Update' : 'Add'} User</button>
    </form>
  );
};

export default UserForm;
