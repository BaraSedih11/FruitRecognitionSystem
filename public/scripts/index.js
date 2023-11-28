let trainingData = [];

function toggleDataInput() {
    const dataChoice = document.getElementById('data-choice');
    const dynamicData = document.getElementById('dynamic-data');
    const fileData = document.getElementById('file-data');

    if (dataChoice.value === 'dynamic') {
        dynamicData.style.display = 'block';
        fileData.style.display = 'none';
    } else {
        dynamicData.style.display = 'none';
        fileData.style.display = 'block';
    }
}


// Update the enterData function in your main.js file

function enterData() {
    const sweetness = parseFloat(document.getElementById('sweetness').value);
    const color = document.getElementById('color').value;

    if (isNaN(sweetness) || sweetness < 1 || sweetness > 10 || color.trim() === '') {
        alert('Please enter valid data.');
        return;
    }

    const fruitType = predictFruitType(sweetness, color); // Implement your prediction logic here

    // Create an image element for the entered data
    const img = document.createElement('img');
    img.src = `path/to/${fruitType}.jpg`; // Replace with the actual path to your images
    img.alt = fruitType;

    // Append the image to the input images container
    const inputImagesContainer = document.getElementById('input-images');
    inputImagesContainer.innerHTML = '';
    inputImagesContainer.appendChild(img);
}

// Example function to predict the fruit type (replace with your actual prediction logic)
function predictFruitType(sweetness, color) {
    if (color === 'red' && sweetness !== 0) {
        return 'apple';
    } else if (color === 'yellow') {
        return 'banana';
    } else if (color === 'purple') {
        return 'grape';
    } else if (color === 'orange'){
        return 'orange';
    }
}


// ... previous neural network and training functions ...

function testModel() {
    // Get values from test model fields
    const testSweetness = parseFloat(document.getElementById('test-sweetness').value);
    const testColor = document.getElementById('test-color').value;

    // Validate inputs
    if (isNaN(testSweetness) || testSweetness < 1 || testSweetness > 10 || testColor.trim() === '') {
        alert('Please enter valid test data.');
        return;
    }

    // Implement testing logic with the entered test data
    console.log('Testing model with:', { testSweetness, testColor });
    // Optionally, you can display the test results on the webpage.
}
