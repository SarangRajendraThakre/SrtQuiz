// ImageUpload.js

import React from "react";

import { BsPlusLg } from "react-icons/bs";

const ImageUpload = ({ imagePath, onImageChange, onUploadClick }) => {
  return (
    <div className="uploadinnercontent">
      {!imagePath && (
        <>
          <div className="uploadimg">
            <div className="uploadimgurl">
              {imagePath && <img src={`http://localhost:5000${imagePath}`} alt="Uploaded" />}
            </div>
            {/* Trigger file input field click on icon click */}
            <label htmlFor="fileInput" className="uploadbtn">
              <div className="uploadbtninner">
                <span className="spanicon">
                  <BsPlusLg fontSize="25px" />
                </span>
              </div>
            </label>
            {/* Hidden file input field */}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              style={{ display: "none" }}
            />
            <button onClick={onUploadClick}>Select Image</button>
          </div>
          <div className="uploadingmessage">
            <p className="uploaddrag">
              <button className="buttonupload">Upload file</button> or drag here to upload
            </p>
          </div>
        </>
      )}
      {imagePath && (
        <div className="uploadedImage">
          <img src={`http://localhost:5000${imagePath}`} alt="Uploaded" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
