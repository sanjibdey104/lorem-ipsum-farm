// Fetching required element references from "form" block
const userInputForm = document.querySelector('.user-input-form');
const outputCount = document.querySelector('#output-count');
const generatorBtn = document.querySelector('.generator-btn');
const resetBtn = document.querySelector('.reset-btn');
const preference = document.querySelectorAll('input[type="radio"]');

// Fetching required element references for displaying output
const loremHarvestBlock = document.querySelector('.lorem-harvest-block');
const placeholderMsg = document.querySelector('.placeholder-msg');
const tractorIcon = document.querySelector('.fa-tractor');
const toggleDarkMode = document.querySelector('#toggle-dark-mode');

// our stock lorem ipsum string
const stockLoremString = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit eveniet dignissimos odio placeat repudiandae sapiente officiis perspiciatis veritatis aperiam facere necessitatibus, accusamus nemo enim ullam consequuntur beatae minima iste expedita! Saepe distinctio soluta hic facere nam animi error quisquam neque porro officiis. Omnis asperiores maiores blanditiis voluptate quaerat natus velit."

// coverting the string to an array, so we can easily run the word count as per user request
const loremArr = stockLoremString.split(' ');


// Reading the user request
userInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const count = Number(outputCount.value);

    // to make sure user has supplied "count" value
    if (count) {
        // iterate over the "radio type" input, validate "checked" status and "id"
        for (pref of preference) {
            if (pref.checked === true  && pref.id === "word-count") {
                generateWords(count);
                return;  
                // observed weird behaviour without "return" keyword
                // even when this "if" statement was evaluating to be true, it was getting bypassed, and instead of invoking "generateWords", "generateParas" was getting invoked
            }
            else {
                generateParas(count);
            }
        }
    }

    // do nothing when no "count" input has been supplied by user
    else return; 
})




// Generating words as per user request 
function generateWords(count) {
    let extra = Math.floor(count % loremArr.length);


    // when count is less than our stock word count (50)
    if (extra === count) {
        let bulkString = loremArr.slice(0,extra).join(' ');
        unloadHarvest(bulkString);
    }

    
    // when count is a multiple of stock word count
    // eg. count = 100, then it is  (50 * 2)
    else if (extra === 0) {
        let rep = count / loremArr.length;
        let bulkString = loremArr.join(' ').repeat(rep);
        unloadHarvest(bulkString);     
    }


    // when count is greater than stock word count
    // eg. count = 128, then it is (100 + 28)
    else {
        let rep = (count - extra) / loremArr.length;
        let bulkString = loremArr.join(' ').repeat(rep);
        let extraString = loremArr.slice(0,extra).join(' ');
        let finalString = bulkString.concat(extraString);
        unloadHarvest(finalString);
    }
}



// Generating paragraphs as per user request
function generateParas(count) {
    let bulkParas = loremArr.join(' ').concat('<br>').repeat(count);  
    // concat('<br>') adds a line break to each paragraph
    unloadHarvest(bulkParas);
}



// Displaying the final lorem ipsum string for the user to use
function unloadHarvest(loremString) {
    const loremHarvest = document.createElement('div');
    loremHarvest.classList.add('lorem-harvest');
    loremHarvest.innerHTML = `
    <p class="lorem-text">${loremString}</p>
    <button class="copy-text-btn">Copy Text</button>`;
    loremHarvestBlock.innerHTML = "";
    loremHarvestBlock.appendChild(loremHarvest);
}



// Copy text to clipboard (although as per MDN, "execCommand" is getting deprecated)
loremHarvestBlock.addEventListener('click', (e) => {
    
    if (e.target.classList[0] === "copy-text-btn"){

        let tempInputElement = document.createElement("input");
        tempInputElement.type = "text";
        tempInputElement.value = loremHarvestBlock.children[0].children[0].innerText;
    
        document.body.appendChild(tempInputElement);
        tempInputElement.select();
        document.execCommand("Copy");
        
        document.body.removeChild(tempInputElement);
        console.log("text copied");
        copyConfirmation();
    }
})


// display a short confirmation message once the text has been copied
function copyConfirmation() {
    loremHarvestBlock.children[0].children[1].classList.add('alert');
}


// resets not only the "form", but also the "lorem output" display block
resetBtn.addEventListener('click', (e)  => {
    if (loremHarvestBlock.children[0].classList[0] === "lorem-harvest"){
        const ref = loremHarvestBlock.querySelector('.lorem-harvest');
        loremHarvestBlock.replaceChild(placeholderMsg, ref);   
    }
    else return;
})





// little tractor icon animation
window.addEventListener('DOMContentLoaded', () => {
    tractorIcon.classList.add('move');
})


// toggle dark mode (using local storage to save user theme preference)

let isDarkMode = localStorage.getItem("dark-mode");

const enableDarkMode = () => {
    document.body.classList.add("dark-mode");
    localStorage.setItem("dark-mode", "enabled");
}

const disableDarkMode = () => {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("dark-mode", "disabled");
}

window.addEventListener('DOMContentLoaded', () => {
    let darkModeStatus = localStorage.getItem("dark-mode");
    if (darkModeStatus === "enabled") {
        enableDarkMode();
    }
    else {
        disableDarkMode();
    }
})


toggleDarkMode.addEventListener('click', (e) => {
    let darkMode = localStorage.getItem("dark-mode");
    if(darkMode === "disabled") {
        enableDarkMode();
    }
    else {
        disableDarkMode();
    }
})
