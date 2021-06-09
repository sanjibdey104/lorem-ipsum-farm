// Set target blank attribute to all links on the pge
const links = document.querySelectorAll('a');
links.forEach(link => link.setAttribute('target', '_blank'));


// Fetching required element references from "form" block
const userInputForm = document.querySelector('.user-input-form');
const outputCount = document.querySelector('#output-count');
const generatorBtn = document.querySelector('.generator-btn');
const resetBtn = document.querySelector('.reset-btn');
const preference = document.querySelectorAll('input[type="radio"]');
const loremTypeMenu = document.querySelector('#lorem-type-menu');

// Fetching required element references for displaying output
const loremHarvestBlock = document.querySelector('.lorem-harvest-block');
const placeholderMsg = document.querySelector('.placeholder-msg');
const tractorIcon = document.querySelector('.fa-tractor');
const toggleDarkMode = document.querySelector('#toggle-dark-mode');

const loremStock = [
    {
        loremType: "lorem",
        string: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit eveniet dignissimos odio placeat repudiandae sapiente officiis perspiciatis veritatis aperiam facere necessitatibus, accusamus nemo enim ullam consequuntur beatae minima iste expedita! Saepe distinctio soluta hic facere nam animi error quisquam neque porro officiis. Omnis asperiores maiores blanditiis voluptate quaerat natus velit."
    },
    {
        loremType: "hipster",
        string: "Tousled taiyaki craft beer, leggings mixtape enamel pin thundercats. Leggings humblebrag neutra sustainable, tbh hexagon edison bulb synth skateboard austin meggings cliche. Fingerstache wolf squid, hoodie organic farm-to-table tousled meditation pour-over art party mlkshk asymmetrical. Kogi hella deep next level YOLO disrupt ethical echo park fashion axe synth af mixtape."
    },
    {
        loremType: "zombie",
        string: "Zombie ipsum reversus ab viral inferno, nam grimes malum cerebro. De lumbering animata corpora quaeritis. Summus brains​​, vel maleficia? De apocalypsi omero undead survivor dictum mauris. Hi mindless mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus comedat cerebella viventium. Qui animated corpse, cricket bat terribilem incessu zomby."
    },
    {
        loremType: "bacon",
        string: "Bacon ipsum dolor amet chicken tail andouille. Ribeye pork chop jowl sirloin sausage, meatball brisket venison beef ribs boudin tenderloin. Boudin frankfurter fatback, short ribs biltong jowl andouille ribs picanha chuck leberkas meatball pastrami porchetta ground round.Ham hock drumstick alcatra, pastrami beef ribs corned beef rump tenderloin strip steak burgdoggen."
    }

];

// our stock lorem ipsum string
// const stockLoremString = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit eveniet dignissimos odio placeat repudiandae sapiente officiis perspiciatis veritatis aperiam facere necessitatibus, accusamus nemo enim ullam consequuntur beatae minima iste expedita! Saepe distinctio soluta hic facere nam animi error quisquam neque porro officiis. Omnis asperiores maiores blanditiis voluptate quaerat natus velit."

// coverting the string to an array, so we can easily run the word count as per user request
// const loremArr = stockLoremString.split(' ');

// Reading the user request
userInputForm.addEventListener('submit', (e) => {
    e.preventDefault();


    // check the lorem preference
    loremStock.forEach(item => {
        if(item.loremType === loremTypeMenu.value) {
            setLoremArr(item.string);
        }
    })


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


let loremArr = [];
const setLoremArr = (loremString) => {
    loremArr = loremString.split(' ');
}


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
        let repetitionCount = count / loremArr.length;
        let bulkString = loremArr.join(' ').repeat(repetitionCount);
        unloadHarvest(bulkString);     
    }


    // when count is greater than stock word count
    // eg. count = 128, then it is (100 + 28)
    else {
        let repetitionCount = (count - extra) / loremArr.length;
        let bulkString = loremArr.join(' ').repeat(repetitionCount);
        let extraString = loremArr.slice(0,extra).join(' ');
        let finalString = bulkString.concat(extraString);
        unloadHarvest(finalString);
    }
}



// Generating paragraphs as per user request
function generateParas(count) {
    let bulkParas = loremArr.join(' ').concat('<br><br>').repeat(count);  
    // concat('<br><br>') adds two line break to each paragraph
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