// Add your Gemini API key here
const GEMINI_API_KEY = 'AIzaSyDPxBi3BuBSxfnPAOzYDPKAMl-pyElle4E';

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('capture-btn');
    const resultContainer = document.getElementById('result');
    const detectionText = document.getElementById('detection-text');
    const instructions = document.getElementById('instructions');
    
    // We're not speaking instructions on page load as per user request
    // The text-to-speech functionality is still available for detection results
    
    // Initialize camera
    async function initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });
            video.srcObject = stream;
            
            // Wait for video to be ready
            video.addEventListener('loadedmetadata', () => {
                // Set canvas dimensions to match video
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            });
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Could not access the camera. Please ensure you have granted camera permissions.');
        }
    }
    
    // Capture image from video stream
    function captureImage() {
        const context = canvas.getContext('2d');
        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to base64 image
        return canvas.toDataURL('image/jpeg');
    }
    
    // Send image to Gemini API for analysis
    async function analyzeImage(imageData) {
        try {
            // Show loading state
            detectionText.textContent = 'Analyzing image...';
            resultContainer.style.display = 'block';
            
            console.log('Starting image analysis process');
            
            // Remove the data URL prefix to get just the base64 data
            const base64Image = imageData.split(',')[1];
            console.log('Image data extracted, length:', base64Image.length);
            
            // Check if image data is valid
            if (!base64Image || base64Image.length < 100) {
                throw new Error('Invalid image data: Image data is too short or empty');
            }
            
            // Prepare the request to Gemini API
            // Use the API key defined at the top of the file
            if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY') {
                throw new Error('Please add your Gemini API key at the top of the camera.js file');
            }
            
            console.log('Preparing API request to Gemini');
            
            // Read the context file
            const contextResponse = await fetch('context.txt');
            if (!contextResponse.ok) {
                throw new Error('Failed to load context file: ' + contextResponse.statusText);
            }
            const contextText = await contextResponse.text();
            console.log('Successfully loaded context file');
            
            // Create request payload with proper Content and Part structure
            const generationConfig = {
                temperature: 0.7,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 65536
            };

            const requestPayload = {
                generationConfig,
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: contextText + '\ndetermine if the object is recycable or not only say "Recyable" or "Not Recycable". If its a "depends" answer write a short 1 sentence reponse' },
                            {
                                inline_data: {
                                    mime_type: 'image/jpeg',
                                    data: base64Image
                                }
                            }
                        ]
                    }
                ]
            };
            
            console.log('Sending request to Gemini API...');
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestPayload)
            });
            
            console.log('Response received, status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API error response:', errorText);
                throw new Error(`API request failed with status ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            
            // Log the response structure to help with debugging
            console.log('Gemini API response:', data);
            
            // Check if the response has the expected structure
            if (!data.candidates || !data.candidates[0]) {
                throw new Error('No candidates in API response: ' + JSON.stringify(data));
            }
            
            if (!data.candidates[0].content) {
                throw new Error('No content in first candidate: ' + JSON.stringify(data.candidates[0]));
            }
            
            if (!data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
                throw new Error('No parts in candidate content: ' + JSON.stringify(data.candidates[0].content));
            }
            
            // Extract the description from the response
            const description = data.candidates[0].content.parts[0].text;
            console.log('Successfully extracted description:', description.substring(0, 50) + '...');
            
            // Display the result
            detectionText.textContent = description;
            
            // Optional: Convert text to speech
            speakDescription(description);
            
        } catch (error) {
            console.error('Error analyzing image:', error);
            detectionText.textContent = 'Error analyzing image: ' + error.message;
        }
    }
    
    // Text-to-speech function
    function speakDescription(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    }
    
    // Event listeners
    captureBtn.addEventListener('click', () => {
        const imageData = captureImage();
        analyzeImage(imageData);
    });
    
    // Allow tapping anywhere on the video to capture
    video.addEventListener('click', () => {
        const imageData = captureImage();
        analyzeImage(imageData);
    });
    
    // Initialize camera on page load
    initCamera();
});