const loadLesson = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => {
            displayLessons(json.data);
        })
}

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN";
    window.speechSynthesis.speak(utterance);
}
const removeActive = () => {
    const lessonBtn = document.querySelectorAll(".lesson-btn");
    lessonBtn.forEach(btn => btn.classList.remove("active"));
}
const loadLevelWord = (id) => {
    manageLoading(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok: ' + res.status);
            return res.json();
        })
        .then(json => {
            const data = Array.isArray(json.data) ? json.data : [];

            // reset search box after lesson clicked
            const searchInput = document.getElementById("input-search");
            if (searchInput) searchInput.value = "";

            // reset lesson-section display
            const lessonSection = document.getElementById("lesson-section");
            if (lessonSection) lessonSection.style.display = "block";

            // hide the lesson message placeholder
            const messageDiv = document.getElementById("lesson-message");
            if (messageDiv) messageDiv.style.display = "none";

            // clear old results
            const wordContainer = document.getElementById("word-container");
            if (wordContainer) wordContainer.innerHTML = "";

            // Active button styling
            removeActive();
            const lessonBtn = document.getElementById(`lesson-btn-${id}`);
            if (lessonBtn) lessonBtn.classList.add("active");

            // show lesson words
            displayLevelWord(data);
        })
        .catch(err => {
            console.error("Error loading lesson:", err);
            const wordContainer = document.getElementById("word-container");
            if (wordContainer) {
                wordContainer.innerHTML = `
                <div class="col-span-full flex justify-center">
                  <div class="w-full max-w-[800px] bg-[#fff1f0] rounded-2xl text-center p-6">
                    <p class="text-base text-[#7a2a2a]">Failed to load lesson. Please try again.</p>
                    <p class="text-sm text-[#666] mt-2">${err.message}</p>
                  </div>
                </div>`;
            }
        })
        .finally(() => {
            manageLoading(false);
        });
};


// for loading spinner
const manageLoading = (status) => {
    if (status) {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    } else {
        document.getElementById('word-container').classList.remove('hidden');
        document.getElementById('spinner').classList.add('hidden');
    }
}

// for synonyms creation
const createElement = (arr) => {
    const htmlElement = arr.map(el => `<button class="btn font-normal bg-[#D7E4EF]">${el}</button>`);
    return htmlElement.join(" ");
}

// for word details pop up modal
const loadWordDetail = (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    fetch(url)
        .then(res => res.json())
        .then(data => displayWordDetails(data.data))
};


const displayWordDetails = (word) => {
    const detailsBox = document.getElementById('details-container');
    detailsBox.innerHTML = `
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

const displayLevelWord = (words, container = document.getElementById('word-container')) => {
    container.innerHTML = '';

    if (words.length === 0) {
        container.innerHTML = `
        <div class="col-span-full flex justify-center">
          <div class="w-full max-w-[800px] bg-[#f8f8f8] rounded-2xl text-center p-6">
            <img src="assets/alert-error.png" alt="">
            <p class="text-base mt-4 text-[#79716b] bangla-font">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <p class="text-4xl font-medium bangla-font mt-3">নেক্সট Lesson এ যান</p>
          </div>
        </div>`;
        return;
    }

    for (let word of words) {
        const card = document.createElement("div");
        card.innerHTML = `
        <div class="card max-w-[545px] min-h-[370px] shadow-md">
            <div class="text-center pt-14">
                <h1 class="text-4xl font-semibold mb-5">${word.word || 'শব্দ পাওয়া যায় নি'}</h1>
                <p class="text-lg font-normal mb-7">Meaning / Pronunciation</p>
                <h1 class="text-4xl font-semibold bangla-font">${word.meaning || 'শব্দের অর্থ পাওয়া যায় নি'} / ${word.pronunciation || 'শব্দের উচ্চারণ পাওয়া যায় নি'}</h1>
            </div>
            <div class="flex justify-between items-center px-14 pt-9">
                <button onclick="loadWordDetail(${word.id})" class="btn w-[60px] h-[60px] bg-[#1a91ff1a] hover:bg-[#1a91ff70]">
                    <i class="fa-solid fa-circle-info text-[30px]"></i>
                </button>
                <button class="btn w-[60px] h-[60px] bg-[#1a91ff1a] hover:bg-[#1a91ff70]">
                    <i class="fa-solid fa-volume-low text-[30px]"></i>
                </button>
            </div>
        </div>`;
        container.appendChild(card);
    }
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
document.getElementById('btn-search').addEventListener('click', () => {
    const inputEl = document.getElementById('input-search');
    const inputWord = inputEl.value.toLowerCase().trim();

    // block empty search
    if (!inputWord) {
        alert("Please type a word to search!");
        return;
    }

    // show spinner while searching
    manageLoading(true);

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json())
        .then(data => {
            const allwords = data.data || [];
            const filterword = allwords.filter(word =>
                word.word.toLowerCase().includes(inputWord)
            );

            // hide lesson section, show search section
            document.getElementById('lesson-section').style.display = "none";
            document.getElementById('search-section').style.display = "block";

            const searchContainer = document.getElementById('search-container');
            searchContainer.innerHTML = "";

            if (filterword.length === 0) {
                searchContainer.innerHTML = `
                <div class="col-span-full flex justify-center">
                  <div class="w-full max-w-[800px] bg-[#f8f8f8] rounded-2xl text-center p-6">
                    <img src="assets/alert-error.png" alt="">
                    <p class="text-base mt-4 text-[#79716b] bangla-font">কোন ফলাফল পাওয়া যায় নি।</p>
                    <p class="text-4xl font-medium bangla-font mt-3">অন্য শব্দ দিয়ে চেষ্টা করুন</p>
                  </div>
                </div>`;
            } else {
                displayLevelWord(filterword, searchContainer);
            }

            // clear search input after successful search
            inputEl.value = "";
        })
        .finally(() => {
            manageLoading(false);
        });
});


document.getElementById('login-btn').addEventListener('click', () => {
    alert("Unfortunately, we have no database. Login feature not workable for now!!");
})
