import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import wordsData from './mydata.json';

const videoConstraints = {
    width: window.innerWidth, // Adjust width as needed
    height: window.innerWidth, // Adjust height as needed
    facingMode: 'user',
};

const Camera = () => {
    const webcamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [detectedText, setDetectedText] = useState('');

    const captureAndDetectText = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc); // Set the captured image src
        const text = await detectText(imageSrc);
        setDetectedText(text);
        matchWordInText(text, 'specific word');
    };

    const detectText = async (imageSrc) => {
        try {
            const { data: { text } } = await Tesseract.recognize(imageSrc, 'eng', { logger: m => console.log(m) });
            console.log('Detected text:', text); // Print detected text to console
            return text;
        } catch (error) {
            console.error('Error detecting text:', error);
            return '';
        }
    };
    const matchWordInText = (text) => {
        // Clean the detected text: remove leading/trailing whitespace and punctuation, convert to lowercase
        const cleanedText = text.trim().replace(/[^\w\s]/g, '').toLowerCase();

        // Iterate over the entries in the JSON data
        const matchedWords = wordsData.filter(word => {
            // Clean the word from JSON data: remove leading/trailing whitespace and punctuation, convert to lowercase
            const cleanedWord = word.name.trim().replace(/[^\w\s]/g, '').toLowerCase();

            // Check if the cleaned word exists in the cleaned detected text
            return cleanedText.includes(cleanedWord);
        });

        // Check if any matching word was found
        if (matchedWords.length > 0) {
            console.log('Matched words:', matchedWords); // Log matched words if found in JSON data
        } else {
            console.log('No matching words found in JSON data'); // Log a message if no matching word is found in the JSON data
        }
    };


    return (
        <>
            <div className="webcam-container">
                <Webcam
                    className="myphoto"
                    audio={false}
                    height={videoConstraints.height}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={videoConstraints.width}
                    videoConstraints={videoConstraints}
                    onClick={captureAndDetectText}
                />
            </div>
            {capturedImage && <img src={capturedImage} alt="Captured" />}
            {detectedText && <div>Detected Text: {detectedText}</div>}
        </>
    );
};

export default Camera;