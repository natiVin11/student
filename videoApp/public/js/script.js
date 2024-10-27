document.addEventListener("DOMContentLoaded", () => {
    const videoList = document.getElementById("videoList");
    const searchInput = document.getElementById("searchInput");

    let videos = []; // משתנה לשמירת רשימת הסרטונים מהשרת

    // טעינת הסרטונים מהשרת
    fetch("/videos")
        .then(response => response.json())
        .then(data => {
            videos = data; // שמירת הנתונים במשתנה
            displayVideos(videos); // הצגת הסרטונים
        })
        .catch(console.error);

    // פונקציה להצגת הסרטונים
    function displayVideos(videoArray) {
        videoList.innerHTML = ""; // ניקוי הרשימה לפני הצגת סרטונים חדשים

        videoArray.forEach((video, index) => {
            const videoElement = document.createElement("div");
            videoElement.classList.add("video-item");

            videoElement.innerHTML = `
                <h3>${video.title}</h3>
                <p>${video.description}</p>
            `;

            if (video.youtubeUrl) {
                const youtubeEmbedUrl = video.youtubeUrl.replace("watch?v=", "embed/");
                videoElement.innerHTML += `
                    <iframe width="100%" height="315" src="${youtubeEmbedUrl}"
                            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                `;
            } else if (video.videoUrl) {
                videoElement.innerHTML += `
                    <video width="100%" height="315" controls>
                        <source src="${video.videoUrl}" type="video/mp4">
                        הדפדפן שלך לא תומך בנגן וידאו.
                    </video>
                `;
            }

            videoList.appendChild(videoElement);

            setTimeout(() => {
                videoElement.classList.add("show");
            }, index * 100); // השהייה של 100ms לכל סרטון
        });
    }

    // חיפוש סרטונים בזמן אמת
    searchInput.addEventListener("input", () => {
        const searchText = searchInput.value.toLowerCase();
        const filteredVideos = videos.filter(video =>
            video.title.toLowerCase().includes(searchText) ||
            video.description.toLowerCase().includes(searchText)
        );
        displayVideos(filteredVideos); // הצגת סרטונים מסוננים
    });

    // הוספת fade-in לכותרת ולפוטר
    document.querySelector("header h1").classList.add("fade-in");
    document.querySelector("footer p").classList.add("fade-in");

    // סינון סרטונים לפי קטגוריה
    window.filterVideos = (category) => {
        if (category === "כללי") {
            displayVideos(videos); // הצגת כל הסרטונים
        } else {
            const filteredVideos = videos.filter(video => video.category === category);
            displayVideos(filteredVideos); // הצגת סרטונים מסוננים
        }
    };

    // אפקט גלישה על הפוטר
    window.addEventListener("scroll", () => {
        const footer = document.querySelector("footer");
        const footerPosition = footer.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;

        if (footerPosition < screenPosition) {
            footer.classList.add("show");
        }
    });
});
