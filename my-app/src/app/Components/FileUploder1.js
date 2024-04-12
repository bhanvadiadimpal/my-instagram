"use client";
import React, { useState } from "react";
// import DefaultImage from '../Images/blueback.jpg';
// import Dropzone from "react-dropzone";
import axios from "axios";
import { v4 as uuid } from "uuid";
import './FileUploder.css';

const FileUploder = ({ onSubmit, setLoading }) => {

  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  //  const handleDrop = (acceptedFiles) => {
  //   const selectedFile = acceptedFiles[0];
  //   if (selectedFile) {
  //       setFile(selectedFile);
  //   }
  //  };

  const getUserId = () => {
    const idFromStorage = sessionStorage.getItem("ID_KEY");
    if (idFromStorage) {
      return idFromStorage;
    } else {
      const id = uuid(); // generate unique UUID
      sessionStorage.setItem("ID_KEY", id);
      return id;
    }
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true)
    const formData = new FormData();
    formData.append('source', file);
    formData.append('description', description);
    formData.append('key', '6d207e02198a847aa98d0a2a901485a5');

    // const response = await fetch("http://localhost:3000/api/upload", {
    //     method: "post",
    //     body: formData
    // });

    // if (response.status === 201) {
    //   const data = await response.json();
    //   setFile(data?.location);
    // }


    try {
      const response = await axios.post('https://freeimage.host/api/1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/from-data'
        }
      });
      console.log('File Uploaded:', response.data)
      onSubmit({
        imageUrl: response?.data?.image?.url,
        description: description,
        id: Date.now(),
        likes: 0,
        comments: [],
        userId: getUserId()
      })
      // console.log('File uploded:', file);
      // console.log('Description:', description);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      {/* <Dropzone onDrop={handleDrop} maxSize={5242880}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drag a drop your photo here, or click to select files</p>
          </div>
        )}
      </Dropzone> */}

      <input type="file" onChange={handleFileChange} />

      <textarea
        style={{marginTop: 1}}
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Add a description..."
      />

      <button onClick={handleSubmit}>Upload</button>
    </div>
  );
};

export default FileUploder;
