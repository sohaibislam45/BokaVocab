const loadLesson=()=>{
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then(res=>res.json())
    .then(json=>{
        // console.log(json);
        displayLessons(json.data);
    })
}
const displayLessons=(lessons)=>{
    console.log(lessons);
}
loadLesson();