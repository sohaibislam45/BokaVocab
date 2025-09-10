const loadLesson = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => {
            displayLessons(json.data);
        })
}

const removeActive=()=>{
    const lessonBtn=document.querySelectorAll(".lesson-btn");
    lessonBtn.forEach(btn=>btn.classList.remove("active"));
}
const loadLevelWord = (id) => {
    manageLoading(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(json => {
            // hide only the lesson message part
            const messageDiv = document.getElementById('lesson-message');
            if (messageDiv) {
                messageDiv.style.display = 'none';
            }
            // class add for button active effect
            removeActive();
            const lessonBtn=document.getElementById(`lesson-btn-${id}`)
            lessonBtn.classList.add('active');
            displayLevelWord(json.data);
        });
};
// for loading spinner
const manageLoading=(status)=>{
    if(status){
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    } else{
        document.getElementById('word-container').classList.remove('hidden');
        document.getElementById('spinner').classList.add('hidden');
    }
}

// for synonyms creation
const createElement=(arr)=>{
    const htmlElement=arr.map(el=>`<button class="btn font-normal bg-[#D7E4EF]">${el}</button>`);
    return htmlElement.join(" ");
}

// for word details pop up modal
const loadWordDetail=(id)=>{
    const url=`https://openapi.programming-hero.com/api/word/${id}`
    fetch(url)
    .then(res=>res.json())
    .then(data=>displayWordDetails(data.data))
};


// "word": "Cautious",
//     "meaning": "সতর্ক",
//     "pronunciation": "কশাস",
//     "level": 2,
//     "sentence": "Be cautious while crossing the road.",
//     "points": 2,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//       "careful",
//       "alert",
//       "watchful"
//     ],
//     "id": 3
const displayWordDetails=(word)=>{
    const detailsBox=document.getElementById('details-container');
    detailsBox.innerHTML=`
    <div class="modal-box shadow-none p-2">
        <h1 class=" text-2xl font-semibold">${word.word} ( <i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})</h1>
        <p class="mt-8 mb-4 font-normal">Meaning:</p>
        <p class="bangla-font text-2xl font-semibold mb-8">${word.meaning}</p>
        <p class="font-semibold">Example:</p>
        <p class="mb-8">${word.sentence}</p>
        <p class="bangla-font font-medium">সমার্থক শব্দগুলো:</p>
        <div class="mt-4">
            ${createElement(word.synonyms)}
        </div>
    </div>
    `
    document.getElementById('show_modal').showModal();
}

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';

    // if wordcontainer have no content
    if (words.length === 0) {
        wordContainer.innerHTML = `
        <div class="col-span-full justify-self-center max-w-[1760px] mx-auto bg-[#f8f8f8] rounded-2xl flex flex-col justify-center items-center text-center min-h-[340px] p-6">
        <img src="assets/alert-error.png" alt="">
            <p class="text-base mt-4 text-[#79716b] bangla-font">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <p class="text-4xl font-medium bangla-font mt-3">নেক্সট Lesson এ যান</p>
        </div>
        `;
        manageLoading(false);
        return;
    }

    for (let word of words) {
        const card = document.createElement("div");
        card.innerHTML = `
        <!-- card design -->
        <div class="card max-w-[545px] min-h-[370px] shadow-md">
            <div class="text-center pt-14">
                <h1 class="text-4xl font-semibold mb-5">${word.word?word.word:'শব্দ পাওয়া যায় নি'}</h1>
                <p class="text-lg font-normal mb-7">Meaning / Pronunciation</p>
                <h1 class="text-4xl font-semibold bangla-font">${word.meaning?word.meaning:'শব্দের অর্থ পাওয়া যায় নি'}/ ${word.pronunciation?word.pronunciation:'শব্দের উচ্চারণ পাওয়া যায় নি'}</h1>
            </div>
            <div class="flex justify-between items-center px-14 pt-9">
                <button onclick="loadWordDetail(${word.id})" class="btn w-[60px] h-[60px] bg-[#1a91ff1a] hover:bg-[#1a91ff70]">
                    <i class="fa-solid fa-circle-info text-[30px]"></i>
                </button>
                <button class="btn w-[60px] h-[60px] bg-[#1a91ff1a] hover:bg-[#1a91ff70]">
                    <i class="fa-solid fa-volume-low text-[30px]"></i>
                </button>
            </div>
        </div>
        `;
        wordContainer.appendChild(card);
    }
    manageLoading(false);
};


const displayLessons = (lessons) => {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = '';

    for (let lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
                <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
            </button>
        `;
        levelContainer.appendChild(btnDiv);
    }
};

loadLesson();