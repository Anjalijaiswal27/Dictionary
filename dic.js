const input=document.getElementById('wordInput')
const btn=document.getElementById('searchButton')
const deleteBtn = document.getElementById('deleteButton');
const dictionaryArea=document.getElementById('dictionaryArea')
async function dictionaryfn(word){
    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!res.ok) throw new Error("Word not found"); // Error handling for non-existent words
        const data = await res.json();
        return data[0];
    } catch (error) {
        console.error("Error fetching data:", error);
        dictionaryArea.innerHTML = `<p style="color:white;">Word not found. Please try another word.</p>`;
        return null;
    }
}


btn.addEventListener('click' , fetchandCreatecard);

input.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {  // Check if the pressed key is "Enter"
        event.preventDefault();    // Prevent the default action (form submission)
        btn.click();               // Simulate a click on the search button
    }
});

input.addEventListener('keydown', function(event) {
    if (event.key === 'Delete') { // Detect 'Delete' or 'Backspace' key
        clearDictionaryArea(); // Call clear function
        
    }
});

const toggleBtn = document.getElementById("themeToggle");
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    // Update icon
    toggleBtn.textContent = document.body.classList.contains("light-theme") ? "☀️" : "🌙";
  });

async function fetchandCreatecard(){
    const word = input.value.trim();
    if (!word) {
        dictionaryArea.innerHTML = "<p>Please enter a word to search.</p>";
        return;
    }

    dictionaryArea.innerHTML = "<p>Loading...</p>";

    const data = await dictionaryfn(word);
    if (!data) return;


    // const partofSpeechArray = data.meanings.map((meaning) => meaning.partOfSpeech);
    const meaningsHTML = data.meanings.map((meaning) => {
        const definitions = meaning.definitions.map((def, index) => {
            // Collect synonyms and antonyms if available
            let synonyms = "";
            let antonyms = "";
            let example = "";

            if (def.synonyms && def.synonyms.length > 0) {  // **Conditionally add synonyms if present**
                synonyms = `<strong>Synonyms:</strong> ${def.synonyms.join(", ")} <br>`;
            }
            if (def.antonyms && def.antonyms.length > 0) {  // **Conditionally add antonyms if present**
                antonyms = `<strong>Antonyms:</strong> ${def.antonyms.join(", ")} <br>`;
            }
            if (def.example) {  // **Conditionally add example if present**
                example = `<em>Example:</em> ${def.example} <br>`;
            }
            return `
                <li>
                    <strong>Definition ${index + 1}:</strong> ${def.definition} <br>
                    ${example}  <!-- Example only if present -->
                    ${synonyms} <!-- Synonyms only if present -->
                    ${antonyms} <!-- Antonyms only if present -->
                </li>`;
        }).join("");

        return `
            <div class="meaning">
                <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
                <ul>${definitions}</ul>
            </div>`;
    }).join("");

    // Check for phonetics and audio
    const phoneticText = data.phonetics && data.phonetics.length > 0 && data.phonetics[0].text ? data.phonetics[0].text : "No phonetic available";
    const audioSource = data.phonetics && data.phonetics.find(phonetic => phonetic.audio)?.audio || null;
    


    dictionaryArea.innerHTML =`
    <div class="card">
                <div class="property">
                    <span>Word:</span>
                    <span>${data.word}</span>
                </div>

                <div class="property">
                    <span>Phonetics:</span>
                    <span>${phoneticText}</span>
                </div>

                <div class="property">
                    <span>Audio:</span>
                    ${audioSource ? `<audio controls src="${audioSource}"></audio>` : "<span>No audio available</span>"}
                </div>
                <div class="property">
                 <span>Meanings:</span>
                 ${meaningsHTML}
                </div>
                
                
            </div> `;
    
}

async function translateWord() {
    const word = document.getElementById("wordInput").value.trim();
    const lang = document.getElementById("languageSelect").value;
    const popup = document.getElementById("translationPopup");
    const output = document.getElementById("translatedText");

    if (!word) {
        alert("Please enter a word.");
        return;
    }

    popup.style.display = "block";
    output.textContent = "Translating...";

    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(word)}`);
        const data = await res.json();
        const translated = data[0][0][0];
        output.textContent = translated;
    } catch (err) {
        output.textContent = "Translation failed. Try again.";
    }
}

document.getElementById("closePopup").addEventListener("click", () => {
    document.getElementById("translationPopup").style.display = "none";
});

function clearDictionaryArea() {
    dictionaryArea.innerHTML = '';
    input.value = '';
}

deleteBtn.addEventListener('click', clearDictionaryArea);
