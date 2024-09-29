document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const textInputContainer = document.getElementById('textInputContainer');
    const fileInfo = document.getElementById('fileInfo');

    // Show or hide input fields based on file type selection
    document.querySelectorAll('input[name="fileType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'text') {
                fileInput.style.display = 'none';
                textInputContainer.style.display = 'block';
                fileInput.value = ''; // clear file input when switching to text
            } else {
                textInputContainer.style.display = 'none';
                fileInput.style.display = 'block';
                fileInput.accept = this.value === 'image' ? 'image/*' : '.pdf'; // change accepted file types
            }
            fileInfo.textContent = ''; // clear file info on switch
        });
    });

    // Display selected file information
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
            fileInfo.textContent = `Selected file: ${fileInput.files[0].name}`;
        } else {
            fileInfo.textContent = '';
        }
    });

    // Handle form submission
    document.getElementById('uploadForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form submission for demo purposes
        const fileType = document.querySelector('input[name="fileType"]:checked').value;

        if (fileType === 'text') {
            const textInput = document.getElementById('textInput').value.trim();
            if (textInput === '') {
                alert('Please enter some text.');
            } else {
                alert('Text submitted successfully.');
            }
        } else {
            if (fileInput.files.length === 0) {
                alert('Please select a file to upload.');
            } else {
                alert('File uploaded successfully.');
            }
        }
    });
});