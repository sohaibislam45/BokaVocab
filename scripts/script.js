const loadLesson = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => {
            // console.log(json);
            displayLessons(json.data);
        })
}

const loadLevelWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(json => {
            // hide only the lesson message part
            const messageDiv = document.getElementById('lesson-message');
            if (messageDiv) {
                messageDiv.style.display = 'none';
            }

            displayLevelWord(json.data);
        });
};


const displayLevelWord = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';

    for (let word of words) {
        const card = document.createElement("div");
        card.innerHTML = `
        <!-- card design -->
        <div class="card max-w-[545px] min-h-[370px] shadow-md">
            <div class="text-center pt-14">
                <h1 class="text-4xl font-semibold mb-5">${word.word}</h1>
                <p class="text-lg font-normal mb-7">Meaning / Pronunciation</p>
                <h1 class="text-4xl font-semibold bangla-font">${word.meaning}/ ${word.pronunciation}</h1>
            </div>
            <div class="flex justify-between items-center px-14 pt-9">
                <button class="btn w-[60px] h-[60px] bg-[#1a91ff1a] hover:bg-[#1a91ff70]">
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
}


const displayLessons = (lessons) => {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = '';

    for (let lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary">
                <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
            </button>
        `;
        levelContainer.appendChild(btnDiv);
    }
}

loadLesson();