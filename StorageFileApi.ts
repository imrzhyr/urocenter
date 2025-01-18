async function uploadFile(file) {
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: file,
            headers: {
                'Content-Type': file.type // Set the correct content type
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Handle the response appropriately without converting it to JSON
        const data = await response.text(); // Read the response as text or other appropriate format
        return data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}
