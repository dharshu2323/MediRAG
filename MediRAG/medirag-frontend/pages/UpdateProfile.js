import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    medicalHistory: "",
    email: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setFormData({
        name: storedUser.name || "",
        age: storedUser.age || "",
        dateOfBirth: storedUser.dateOfBirth || "",
        gender: storedUser.gender || "",
        bloodGroup: storedUser.bloodGroup || "",
        medicalHistory: typeof storedUser.medicalHistory === "string" ? storedUser.medicalHistory : "",
        email: storedUser.email || "",
      });
    }
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Updating:", name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        formData
      );
      localStorage.setItem("user", JSON.stringify(res.data));
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <h3 className="text-center mb-3">Update Profile</h3>

        <div className="row g-3">
          <div className="col-md-6">
            <label>Name</label>
            <input
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label>Age</label>
            <input
              name="age"
              type="number"
              className="form-control"
              value={formData.age}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label>Date of Birth</label>
            <input
              name="dateOfBirth"
              type="date"
              className="form-control"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label>Gender</label>
            <select
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="col-md-6">
            <label>Blood Group</label>
            <select
              name="bloodGroup"
              className="form-select"
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>
          <div className="col-md-6">
            <label>Medical History</label>
            <textarea
              name="medicalHistory"
              className="form-control"
              rows="3"
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="Enter any past or ongoing medical conditions"
            />
          </div>
          <div className="col-md-6">
            <label>Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={formData.email}
              disabled
            />
          </div>
        </div>

        <div className="mt-4 d-grid">
          <button className="btn btn-success" onClick={handleUpdate}>
            Update
          </button>
        </div>

        {message && (
          <div className="alert alert-info mt-3 text-center">{message}</div>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;
