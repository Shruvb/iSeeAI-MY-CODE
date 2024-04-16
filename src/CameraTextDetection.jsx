import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import wordsData from './mydata.json';

const videoConstraints = {
    width: window.innerWidth, // Adjust width as needed
    height: window.innerWidth, // Adjust height as needed
    facingMode: 'user',
};

const CameraTextDetection = () => {
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
    const matchWordInText = (text, wordToMatch) => {
        // Split the detected text into words
        const words = text.split(' ');
        // Check if the specific word exists in the detected text
        if (words.includes(wordToMatch)) {
            // Check if the word is present in the JSON data
            if (wordsData.includes(wordToMatch)) {
                console.log('Present'); // Log "Present" if the word is found in the JSON data
            } else {
                console.log('Not found in JSON data'); // Log a message if the word is not found in the JSON data
            }
        } else {
            console.log('Word not detected in the text'); // Log a message if the word is not found in the detected text
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

export default CameraTextDetection;