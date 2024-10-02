document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const fileSelectButton = document.getElementById('fileSelectButton');
    const textInputContainer = document.getElementById('textInputContainer');
    const fileInfo = document.getElementById('fileInfo');
    const scanOptionsContainer = document.getElementById('scanOptionsContainer');
    const modal = document.getElementById('resultModal');
    const cancerTypeSpan = document.getElementById('cancerType');
    const closeBtn = document.querySelector('.close');
    const uploadForm = document.getElementById('uploadForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const documentPreview = document.getElementById('documentPreview');
    const imagePreview = document.getElementById('imagePreview');
    const pdfPreview = document.getElementById('pdfPreview');

    // Function to handle file type changes
    function handleFileTypeChange() {
        const selectedFileType = document.querySelector('input[name="fileType"]:checked').value;
        
        if (selectedFileType === 'text') {
            toggleElementDisplay(fileInput, false);
            toggleElementDisplay(fileSelectButton, false);
            toggleElementDisplay(textInputContainer, true);
            toggleElementDisplay(scanOptionsContainer, false);
            clearFileInput();
        } else {
            toggleElementDisplay(textInputContainer, false);
            toggleElementDisplay(fileSelectButton, true);
            toggleElementDisplay(fileInput, false);
            
            if (selectedFileType === 'image') {
                toggleElementDisplay(scanOptionsContainer, true);
                fileInput.accept = 'image/*';
            } else {
                toggleElementDisplay(scanOptionsContainer, false);
                fileInput.accept = '.pdf';
            }
        }
        fileInfo.textContent = '';
    }

    // Function to handle file selection button click
    function handleFileSelectClick() {
        fileInput.click();
    }

    // Function to display selected file information
    function displayFileInfo() {
        fileInfo.textContent = fileInput.files.length > 0 ? `Selected file: ${fileInput.files[0].name}` : '';
    }

    // Function to validate the form before submission
    function validateForm() {
        const fileType = document.querySelector('input[name="fileType"]:checked').value;

        if (fileType === 'text') {
            const textInput = document.getElementById('textInput').value.trim();
            if (!textInput) {
                alert('Please enter some text.');
                return false;
            }
        } else {
            if (fileInput.files.length === 0) {
                alert('Please select a file to upload.');
                return false;
            } else if (fileType === 'image' && !document.querySelector('input[name="scanType"]:checked')) {
                alert('Please select a scan type for the image.');
                return false;
            }
        }
        return true;
    }

    // Function to display document preview
   // Function to display document preview
function displayDocumentPreview(fileType, filePath) {
    // Reset all preview elements
    imagePreview.style.display = 'none';
    pdfPreview.style.display = 'none';
    documentPreview.style.display = 'none';

    if (fileType === 'text') {
        return; // No preview for text input
    }

    documentPreview.style.display = 'block';

    if (fileType === 'image') {
        imagePreview.onload = function() {
            // Adjust container height after image loads
            imagePreview.style.display = 'block';
        };
        imagePreview.src = filePath;
    } else if (fileType === 'pdf') {
        pdfPreview.src = filePath;
        pdfPreview.style.display = 'block';
    }
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData(uploadForm);
    const fileType = document.querySelector('input[name="fileType"]:checked').value;

    toggleElementDisplay(loadingSpinner, true);

    fetch('/scan', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        toggleElementDisplay(loadingSpinner, false);

        if (data.success) {
            // Set the cancer type text first
            cancerTypeSpan.textContent = data.cancerClass[0];
            
            // Then handle the preview if available
            if (data.filePath && fileType !== 'text') {
                displayDocumentPreview(fileType, data.filePath);
            }
            
            // Finally show the modal
            toggleModal(true);
        } else {
            alert('Error uploading data. Please try again.');
        }
    })
    .catch(error => {
        toggleElementDisplay(loadingSpinner, false);
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

// Helper function to toggle modal visibility with scroll handling
function toggleModal(show) {
    modal.style.display = show ? 'block' : 'none';
    if (show) {
        document.body.style.overflow = 'hidden'; 
    } else {
        document.body.style.overflow = ''; 
}

    // Helper function to toggle element display
    function toggleElementDisplay(element, show) {
        element.style.display = show ? 'block' : 'none';
    }

    // Helper function to clear file input
    function clearFileInput() {
        fileInput.value = '';
    }

    // Initialize event listeners
    function initEventListeners() {
        document.querySelectorAll('input[name="fileType"]').forEach(radio => {
            radio.addEventListener('change', handleFileTypeChange);
        });
        
        fileSelectButton.addEventListener('click', handleFileSelectClick);
        fileInput.addEventListener('change', displayFileInfo);
        uploadForm.addEventListener('submit', handleFormSubmit);

        closeBtn.addEventListener('click', () => toggleModal(false));

        window.addEventListener('click', event => {
            if (event.target === modal) toggleModal(false);
        });
    }

    // Initialize the page
    function init() {
        initEventListeners();
    }

    // Run init on DOMContentLoaded
    init();
});