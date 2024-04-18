import React, { useState, useEffect, useRef,useMemo } from 'react';
import axios from 'axios';
import './MainCompile.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Questionf from '../components/Questionf';

const MainCompile = () => {
  const [formData, setFormData] = useState({
    title: '',
    visibility: 'public', // Default to public
    folder: 'Your Quiz Folder',
    posterImg: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [questionType, setQuestionType] = useState(null); // State to store the selected question type
  const [questionCards, setQuestionCards] = useState([]); // State to store the question cards

  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleSettingOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsSettingModalOpen(false);
      }
    };

    if (isSettingModalOpen) {
      document.addEventListener('mousedown', handleSettingOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleSettingOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleSettingOutsideClick);
    };
  }, [isSettingModalOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;

    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAddQuestion = (type) => {
    setQuestionType(type); // Set the selected question type
    setIsModalOpen(false);

    // Add the new question type to the questionCards state
    setQuestionCards([...questionCards, type]);
  };

  const handleToggleModalSetting = () => {

    setIsSettingModalOpen(!isSettingModalOpen);
    
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('User'));
  
      if (!user || !user._id) {
        console.error('User ID not found in local storage or user object is invalid');
        return;
      }
  
      const formDataWithUser = {
        ...formData,
        userId: user._id
      };
  
      let uploadedImagePath = ''; // Initialize imagePath
  
      // Check if an image is uploaded
      if (formData.posterImg) {
        const formDataWithImage = new FormData();
        formDataWithImage.append('image', formData.posterImg);
  
        // Upload the image to the server
        const uploadResponse = await axios.post('http://localhost:5000/api/upload', formDataWithImage);
  
        // Get the path to the uploaded image from the server response
        uploadedImagePath = uploadResponse.data.imagePath;
      }
  
      // If imagePath is empty, no image was uploaded, so no need to update formDataWithUser
      if (uploadedImagePath) {
        formDataWithUser.posterImg = uploadedImagePath;
      }
      console.log(formDataWithUser);
  
      const response = await axios.post('http://localhost:5000/api/quizzes', formDataWithUser);
      console.log('Quiz created successfully!', response.data);
  
      const createdQuizId = response.data._id;
      console.log('Created Quiz ID:', createdQuizId); // Log the created quiz ID
  
      localStorage.setItem('createdQuizId', createdQuizId);
  
      setIsSettingModalOpen(false);
  
      // Clear form fields after successful submission
      setFormData({
        title: '',
        visibility: 'public',
        folder: 'Your Quiz Folder',
        posterImg: uploadedImagePath
      });
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };
  
  


  // Memoize the component rendering to prevent unnecessary re-renders
  const memoizedComponent = useMemo(() => (
    <div className='main'>
      <div className="wrapper">
        <div className='spacer'>
          <Header handleToggleModalSetting={handleToggleModalSetting} />
        </div>
        <div className='overflowsidebar'>
          <Sidebar 
            isModalOpen={isModalOpen} 
            handleToggleModal={handleToggleModal} 
            addQuestion={handleAddQuestion} 
            questionCards={questionCards} 
            setQuestionCards={setQuestionCards} // Pass setQuestionCards as a prop
          />
        </div>
        <div className='maincountainer'>
          <Questionf questionType={questionType} /> {/* Pass down the selected question type */}
        </div>
      </div>
   


   

{isSettingModalOpen && (
  <div className="modalsetting" ref={modalRef}>
    <div className="modalinside">
      <form>
        <label>
          Title:
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </label>
        <label>
          Visibility:
          <select name="visibility" value={formData.visibility} onChange={handleChange}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>
        <label>
          Folder:
          <select name="folder" value={formData.folder} onChange={handleChange}>
            <option value="Your Quiz Folder">Your Quiz Folder</option>
          </select>
        </label>
        <label>
          Poster Image:
          <input type="file" name="posterImg" accept="image/*" onChange={handleChange} />
        </label>
      </form>
      <button onClick={handleSubmit}>Create Quiz</button>
    </div>
  </div>
)}

{isModalOpen && (
  <div className="modalsetting1" ref={modalRef}>
    <div className="modalinside">
      <div className="modalagaininside">
        <div className="modalmainheader ">
          <div className="modalheader">
            <div className="modalheadertext">Select Question Type</div>
          </div>
        </div>
        <div className="mma">
          <div className="modalmainarea">
            <div className="modalmainareainside">
              <div className="modalmainareainsideinsdie">
                <div className="modallsidequestionlist">
                  <div className="modalquestiontyep">
                    <div className="testknowtitle">True/False</div>
                    <div className="questionlist">
                      <button
                        className="modalbuttons"
                        onClick={() => handleAddQuestion("True/False")}
                      >
                        True/False
                      </button>
                      <button
                        className="modalbuttons"
                        onClick={() => handleAddQuestion("MCQ")}
                      >
                        MCQ
                      </button>
                      <button
                        className="modalbuttons"
                        onClick={() => handleAddQuestion("MSQ")}
                      >
                        MSQ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}






    </div>
  ), [isModalOpen, isSettingModalOpen, questionType, questionCards]);

  return memoizedComponent;
};

export default MainCompile;
