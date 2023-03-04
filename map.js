// const leafletImage = require("leaflet-image");

var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',).addTo(map);
L.marker([51.5, -0.09]).addTo(map)
    .openPopup();


    document.getElementById("getLocation").addEventListener("click", function(event){
        if(!navigator.geolocation){
            console.log("No geolocation.");
        }

        navigator.geolocation.getCurrentPosition(position =>{
            console.log(position);
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            map.setView([lat, lon]);
            L.marker([lat, lon]).addTo(map);

            let location = document.getElementById("locationPoint");
            location.textContent += lat + " " + lon;
        }, positionError => {
            console.log(positionError);
        });
    });

    document.getElementById("saveButton").addEventListener("click", function(){
        leafletImage(map, function(err, canvas){
            document.getElementById("mapHolder").appendChild(canvas);
            document.getElementById("mapHolder").addEventListener("click", function(){
                slicePuzzle(canvas);
            });

            document.getElementById("info").textContent += "Kliknij rastrową mapę aby zacząć układać puzzle";
        });
    });

    let arr = [];
    let goodPuzzle = [];
    function slicePuzzle(image){
        let puzzles = [];
        let columns = 4;
        let rows = 4;
        let puzzleSize = columns * rows;
        let puzzleHeight = image.offsetHeight / columns - 4;
        let puzzleWidth = image.offsetWidth / rows - 4;

        for(let i = 0; i<columns; i++){
            for(let j = 0; j<rows; j++){
                let canvas = document.createElement("canvas");
                canvas.height = puzzleHeight;
                canvas.width = puzzleWidth;
                canvas.getContext('2d').drawImage(image, j * puzzleWidth, i * puzzleHeight, puzzleWidth, puzzleHeight, 0, 0, puzzleHeight, puzzleWidth);
                puzzles.push(canvas);
            }
        }

        for(let i = 0; i<puzzleSize; i++){
            let element = document.createElement("div");
            element.style.height = puzzleHeight + "px";
            element.style.width = puzzleWidth + "px";
            element.style.backgroundImage = "url('" + puzzles[i].toDataURL() + "')";
            element.style.backgroundColor = "red";
            element.classList.add("puzzle");
            element.setAttribute("id",i);
            element.setAttribute("draggable","true");
            element.classList.add("drag-target");
            goodPuzzle.push(element);
        }

        while(arr.length<puzzleSize){
            let rand = Math.floor(Math.random()*puzzleSize);
            if(arr.indexOf(rand)=== -1){
                arr.push(rand);
            }
        }
        console.log(arr);

        for(let i = 0; i<arr.length; i++){
            document.getElementById("puzzleHolder").appendChild(goodPuzzle[arr[i]]);
        }
        createLitener();
    }

    function createLitener(){
        let puzzle = document.querySelectorAll(".puzzle");
        for(let item of puzzle){
            item.addEventListener("dragstart", function(event){
                event.dataTransfer.setData("text", this.id);
            });
        }

        let targets = document.querySelectorAll(".drag-target");
        for(let target of targets){
            target.addEventListener("dragover", function(event){
                event.preventDefault();
            });

            target.addEventListener("drop", function(event){
                let a = event.dataTransfer.getData("text");
                let b = event.target.id;
                let indexA = arr.indexOf(parseInt(a));
                let indexB = arr.indexOf(parseInt(b));
                
                let tmp = arr[indexA];
                arr[indexA] = arr[indexB];
                arr[indexB] = tmp;

                document.getElementById("puzzleHolder").textContent = "";
                for(let i = 0; i<arr.length; i++){
                    document.getElementById("puzzleHolder").appendChild(goodPuzzle[arr[i]]);
                }
                checkWin();
            }, false);
        }
    }

    function checkWin(){
        let cnt = 0;
        for(let i = 0; i<goodPuzzle.length; i++){
            if(parseInt(goodPuzzle[i].id)=== parseInt(arr[i])){
                cnt++;
            }
        }
        if(cnt === goodPuzzle.length){
            alert("Ułożyłeś poprawnie puzzle!");
        }
    }