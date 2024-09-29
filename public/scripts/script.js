document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const textInputContainer = document.getElementById('textInputContainer');
    const fileInfo = document.getElementById('fileInfo');
    const scanOptionsContainer = document.getElementById('scanOptionsContainer');

    // Show or hide input fields based on file type selection
    document.querySelectorAll('input[name="fileType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'text') {
                fileInput.style.display = 'none';
                textInputContainer.style.display = 'block';
                scanOptionsContainer.style.display = 'none'; // Hide scan options
                fileInput.value = ''; // clear file input when switching to text
            } else if (this.value === 'image') {
                fileInput.style.display = 'block';
                textInputContainer.style.display = 'none';
                scanOptionsContainer.style.display = 'block'; // Show scan options
                fileInput.accept = 'image/*'; // Set accepted file types to image
            } else {
                textInputContainer.style.display = 'none';
                fileInput.style.display = 'block';
                scanOptionsContainer.style.display = 'none'; // Hide scan options
                fileInput.accept = '.pdf'; // Set accepted file types to PDF
            }
            fileInfo.textContent = ''; // Clear file info on switch
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
        const fileType = document.querySelector('input[name="fileType"]:checked').value;

        if (fileType === 'text') {
            const textInput = document.getElementById('textInput').value.trim();
            if (textInput === '') {
                alert('Please enter some text.');
                e.preventDefault(); // Prevent form submission
            }
        } else {
            if (fileInput.files.length === 0) {
                alert('Please select a file to upload.');
                e.preventDefault(); // Prevent form submission
            } else {
                const scanType = document.querySelector('input[name="scanType"]:checked');
                if (fileType === 'image' && scanType === null) {
                    alert('Please select a scan type for the image.');
                    e.preventDefault(); // Prevent form submission
                }
            }
        }

        // Only prevent default if there was a validation error
        // If all checks pass, the form will submit normally
    });
});
