
// what we need to do is .. there will be a lot of mysongs ..and we can play whichever one we want 
// Idea behind it is that : there will be mysongs name ki directory in public directory


// await is only valid in async functions --> and async func always return promise ..

// function that returns all mysongs from our mysongs directory 
// we are doing this because we r not using any backend
// ideally hum server se  lekar aayenge sarre mysongs using API as.....we are making a client side project

// async function getmySongs(){
// //     How It Works
// // mysongs.html acts like an API that stores the song URLs
// // fetch("mysongs.html") retrieves the page contents
// // JavaScript extracts <a> tags and gets MP3 file paths dynamically
// // The returned array contains all available mysongs, so you don’t need to hardcode them


// alert("JS file loaded on mobile!");  

console.log('Lets write JavaScript');


let currentSong = new Audio();
let mysongs = [];
let songIndex = 0;
let currFolder;

// Fetch songs dynamically from the `mysongs` folder
async function getmySongs(folder) {
    currFolder = folder;
    console.log(currFolder)
    let a = await fetch(`/${folder}/`); // Fetch the song list HTML
    let response = await a.text(); // Convert response to text
    
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a"); // Get all anchor tags
    mysongs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // let fileName = element.href.split("/").pop(); // Extract filename from URL
            mysongs.push(element.href.split(`/${folder}/`)[1]);
        }
    }


    // show all the songs in the playlist
    let songUL = document.querySelector(".songList ul");
    if (!songUL) return console.error("Error: .songList not found!");

    songUL.innerHTML = "";

    mysongs.forEach((song, index) => {
        let songName = song.replace(".mp3", "").replace(/%20/g, " ");
        songUL.innerHTML += `
            <li data-index="${index}">
                <img class="invert" src="img/music.svg" alt="">
                <div class="info">
                    <div>${songName}.mp3</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="img/play.svg" alt="">
                </div>
            </li>`;
    });


    // Attach an event listener on each song
    document.querySelectorAll(".songList li").forEach((e) => {
        e.addEventListener("click", (event) => {
            songIndex = event.currentTarget.getAttribute("data-index");
            playMusic(mysongs[songIndex]);

            console.log(mysongs[songIndex].replace(".mp3", "").replace(/%20/g, " "));
        });
    });
}





// Convert seconds to MM:SS format
function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}




// Play selected song
const playMusic = (track, pause = false) => {
    console.log("track = " , track)
    if (!track) return console.error("Error: No track found!");

    currentSong.src = `${currFolder}/${track}`; // // Keep %20 as it is
    // Ensure correct path 

    if (!pause) {
        currentSong.play().catch(err => console.error("Playback Error:", err));
        play.src = "img/pause.svg";
    }

    let songName = track.replace(".mp3", "").replace(/%20/g, " ");
    document.querySelector(".songinfo").innerHTML = songName;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    currentSong.addEventListener("loadedmetadata", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
    });
}




// async function displayAlbums(){
//     let a = await fetch(`/mysongs/`); // Fetch the song list HTML
//     let response = await a.text(); // Convert response to text
    
//     let div = document.createElement("div");
//     div.innerHTML = response;

//     let anchors = div.getElementsByTagName("a")
//     let cardContainer = document.querySelector(".cardContainer")
//     // Array.from(anchors).forEach(async e=>{   --> async func's work  in background .. so our event listener for getting playlist of that clicked card is not working .... so using traditional forLoop
//     let array = Array.from(anchors)
//     // now working synchronously
//         for (let index = 0; index < array.length; index++) {      
//             const e = array[index];

// // so we have htaccess file in mysongs folder(needed while hosting), so that our mysongs folder don't consider it as a song folder, therefore we have to add this line in 'if' condition ...that href should contain mysongs but not htaccess ..as htaccess is a file 
//         if(e.href.includes("/mysongs/")){
//             let folder = e.href.split("/").slice(-1)[0]   // give folder name
//             // Get the metadata of the folder
//           let a = await fetch(`/mysongs/${folder}/info.json`) // Fetch the song list HTML
//           let response = await a.json();  // Parse JSON if valid
//           console.log(response)    // giving that json info of particular folders

//           // populating card container
//           cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}"  class="card">
//                         <img  src="/mysongs/${folder}/cover.jpg" alt="">
//                         <h3>${response.title}</h3>
//                         <p>${response.description}</p>
//                     </div>`
//         }
//     }



//  My above 'displayAlbum' causing error while deploying code ....cause not able to get right folder name.so not able to fetch json file in mysongs folder ...
// So using chapGPT code ..so running fine now

async function displayAlbums() {
    let a = await fetch(`/mysongs/`); // Fetch the song list HTML
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    let array = Array.from(anchors);
    
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.toLowerCase().includes("/mysongs/") && !e.href.toLowerCase().includes(".htaccess")) {
            let urlParts = e.href.split("/").filter(part => part !== ""); // Remove empty parts
            let folder = urlParts[urlParts.length - 1]; // Get last valid folder name

            if (!folder) {
                console.warn(`Skipping invalid folder: ${e.href}`);
                continue;
            }

            let jsonFile = `/mysongs/${folder}/info.json`; // Default file name
            
            try {
                let infoResponse = await fetch(jsonFile);
                
                if (!infoResponse.ok) {
                    jsonFile = `/mysongs/${folder}/Info.json`; // Try capitalized version
                    infoResponse = await fetch(jsonFile);
                }

                if (!infoResponse.ok) {
                    console.warn(`Warning: info.json not found for ${folder}`);
                    continue; // Skip this folder if info.json is missing
                }

                let response = await infoResponse.json();
                console.log(response); // Log JSON data

                // Populate card container
                cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <img src="/mysongs/${folder}/cover.jpg" alt="">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`;
            } catch (error) {
                console.error(`Error fetching info.json for ${folder}:`, error);
            }
        }
    }











    // If i click on any of the album/playlist ...then its playlist as well as it's first song should play
         // Load the playlist whenever card is clicked 
         // this gives a collection .. so we have to convert it to array ..to apply foreach ...otherwise foreach not works on collection
    //   Array.from(document.getElementsByClassName("card")).forEach(e=>{
    //     // console.log(e)
    //     e.addEventListener("click", async item=>{
    //         // console.log(item.currentTarget.dataset)
    //         //get the list of all the songs
    //          await getmySongs(`mysongs/${item.currentTarget.dataset.folder}`);
    //          playMusic(mysongs[0])
    //         })


    //   })




// After adding Left Bar Functionality ( when screen-width <= 1200px)
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            await getmySongs(`mysongs/${item.currentTarget.dataset.folder}`);
            playMusic(mysongs[0]);
    
            // Show sidebar only when screen width is ≤ 1200px
            if (window.innerWidth <= 1200) {
                document.querySelector(".left").style.left = "0";
                document.querySelector(".close").style.display = "block";
            }
        });
    });
    



}




// Main function to initialize songs
async function main() {

    //get the list of all the songs
    await getmySongs("mysongs/coolSongs");
    // ✅ Set the first song by default (without playing)
    songIndex = 0;
    playMusic(mysongs[0], true);

    // Display all the albums on the page
    displayAlbums()


    // if (mysongs.length === 0) return console.error("No songs found in mysongs/ folder!");

   

    // Event Listeners for Play, Next, Previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    previous.addEventListener("click", () => {
        if (songIndex > 0) {
            songIndex--;
            playMusic(mysongs[songIndex]);
        }
    });

    next.addEventListener("click", () => {
        if (songIndex < mysongs.length - 1) {
            songIndex++;
            playMusic(mysongs[songIndex]);
        }
    });


    // Seekbar Update
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });


    // Volume Control
        document.querySelector(".range input").addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100;
           // Restore the volume icon if volume is increased after mute
          // Change the volume icon back if volume is greater than 0
                let volumeIcon = document.querySelector(".volume>img");
                if (currentSong.volume > 0 && volumeIcon.src.includes("mute.svg")) {
                    volumeIcon.src = volumeIcon.src.replace("mute.svg", "volume.svg");
                  }

    });



    // Sidebar Toggle
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
        document.querySelector(".close").style.display = "block";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });


    // Add event listener to mute the audio/track
    // to immediate img in volume div
    document.querySelector(".volume>img").addEventListener("click", e=>{
        console.log(e.target)
        console.log("changing", e.target.src)  // e.target.src = Gives a full url ... so we just need to know ..does it include volume/mute svg .

        let volumeSlider = document.querySelector(".range input")

        if(e.target.src.includes("volume.svg")){
            // strings are immutable
            e.target.src = e.target.src.replace("volume.svg" , "mute.svg")
            currentSong.volume = 0 ;
            volumeSlider.value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg" , "volume.svg")
            currentSong.volume = .10 ;
            volumeSlider.value = 10 ;
        }

    })





    
    //  Playing Particular Searched Song ....-> Functionality Added by ME Itself

    document.getElementById("searchBtn").addEventListener("click", async () => {
        let query = document.getElementById("searchBar").value.toLowerCase().trim();
        if (query.length < 2) return alert("Type at least 2 characters to search!");
    
        let found = false;
    
        for (let folder of ["coolSongs", "hardSongs"]) { // Add all your song folders
            await getmySongs(`mysongs/${folder}`);
    
            // Normalize song names (replace "%20" with space for proper matching)
            let matchedSong = mysongs.find(song => 
                decodeURIComponent(song.toLowerCase()).startsWith(query) // ✅ Checks only the **starting** characters
            );
    
            if (matchedSong) {
                found = true;
                playMusic(matchedSong);
    
                // Open sidebar if screen width is <= 1200px
                if (window.innerWidth <= 1200) {
                    document.querySelector(".left").style.left = "0";
                    document.querySelector(".close").style.display = "block";
                }
                break; // Stop searching after the first match
            }
        }
    
        if (!found) alert("Song not found!");
    });
    
    
    



}


// Initialize
main();


