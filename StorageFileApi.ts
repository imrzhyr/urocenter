async function uploadFile(file) {
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: file
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json(); // Ensure this is the only place the body is read
        return data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}
