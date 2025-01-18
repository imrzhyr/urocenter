async function uploadImage(file: File) {
    // ...existing code...
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    const contentType = response.headers.get('content-type');
    let responseBody;
    if (contentType && contentType.includes('application/json')) {
        responseBody = await response.json(); // Read the response body as JSON
    } else {
        responseBody = await response.text(); // Read the response body as text
    }
    
    // ...existing code...
    return responseBody; // Use the stored response body
}
