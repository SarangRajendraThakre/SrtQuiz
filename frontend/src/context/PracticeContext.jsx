import React,{ Children, createContext, useState } from "react";

import axios from "axios";
import { baseUrl1 } from "../utils/services";

const PracticeContext = createContext();

export const PracticeContextProvider = ({Children}) =>{


     const [quizData , setQuizData] = useState({quiz:null,questions:[]});

     const [questionType , setQuestionType] = useState(null)

     const [questionIdd , setQuestionIdd] = useState(null)

     const [createdQuidId , setCreatedQuidId] = useState(null)

     const [isRigthsideVisible , setIsRightSideVisible] =useState(true);

     const toggleRightsideVisibility =() => {
        setIsRightSideVisible(!isRigthsideVisible);

     }

     const updateQuestionType = (type)=>{
        setQuestionType(type);
     }

     const updateQuestionIdd = (id) =>{
        setQuestionIdd(id);
     }


     const fetchQuizData = async ()=>{
        try {
            
            const quizId  = localStorage.getItem("createdQuizId");
            console.log("quiz Id",quizId);

            if(!quizId)
            {
                throw new Error("Quiz id not found in local storage")
            }

            const response = await axios.get(
                `${baseUrl1}/api/quizzes/quiz/${quizId}`

            );
            console.log("Response",response)

            setQuizData(response.data.quiz);
        } catch (error) {
            
            console.error("there is error in fetching the quiz",error);
            
        }
     }

     const updateQuestionId = async(questionId , updatedQuestionData)=>{

        try {
            const response = await axios.put(
                `${baseUrl1}/api/question/update/${questionId}`,updatedQuestionData
            );
            console.log("Quesition updated successfully",response.data);
            
            await fetchQuizData();
        } catch (error) {
            console.error("error updating question",error);
            
        }

     }


}

