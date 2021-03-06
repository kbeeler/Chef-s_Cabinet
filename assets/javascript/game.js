$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCHsse5do5Cb1VtRfdPxmAmiYmn_mE2XY4",
        authDomain: "chef-s-cabinet.firebaseapp.com",
        databaseURL: "https://chef-s-cabinet.firebaseio.com",
        projectId: "chef-s-cabinet",
        $storageBucket: "",
        messagingSenderId: "117249764862"
    };
    firebase.initializeApp(config);

    //variable to rep the database
    var database = firebase.database();

    // Get users location
    var userLocation = getLocation();
    console.log(userLocation);
  // Get users location and center the map to it
  //  setMyLocation();
  // Note: This is not needed if GoogleMaps is called without a location specified.
  //       Its default is to utilize the user's current position.
  //  Left in the above commented out HTML5 Geolocation code, to show our work
  //  It probably needs to go into an OnLoad event hander just for the resteraunts ppge.

    // These handle the images
    $("#breakfast").on("click", function(event) { location.href = "recipe.html?q=breakfast" });
    $("#lunch").on("click", function(event) { location.href = "recipe.html?q=lunch" });
    $("#dinner").on("click", function(event) { location.href = "recipe.html?q=dinner" });
    $("#fish-meals").on("click", function(event) { location.href = "recipe.html?q=fish" });
    $("#vegan").on("click", function(event) { location.href = "recipe.html?q=vegan" });
    $("#dessert").on("click", function(event) { location.href = "recipe.html?q=dessert" });

    // These handle the search box
    function getUrlVars() {
        var vars = [],
            hash;
        var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split("=");
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    if (getUrlVars()["q"]) {
        searchRecipes(getUrlVars()["q"]);
    }
    else if (getUrlVars()["r"]) {
//        let searchTerm = $("resteraunt-input").text();
//        console.log(searchTerm);
        setRestuarantSearch(getUrlVars()["r"]);
        console.log(getUrlVars()["r"]);
    }

    function searchRecipes(recipe) {
        //queryURL for food API
        var APIKey = "1e354f8c049c83ba15960786f9b9d70c";
        var queryURL = "https://cors-anywhere.herokuapp.com/food2fork.com/api/search?key=" + APIKey + "&q=" + recipe;
        console.log(queryURL)

        //ajax request
        $.ajax({
            url: queryURL,
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            dataType: "json"
        }).then(function(result) {
            console.log(result)

            $("#results").empty();

            for (var i = 0; i < Math.min(30, result.recipes.length); i++) {
                console.log(result.recipes[i].image_url);

                var searchTitle = $("<a>");
                var publisher = $("<a>");
                var recipeLink = $("<a>");
                var img = $("<img>");

                searchTitle.attr("href", result.recipes[i].source_url);
                $(searchTitle).append("<h3>" + result.recipes[i].title + "</h3>");
                $("#results").append(searchTitle);

                publisher.attr("href", result.recipes[i].publisher_url);
                $(publisher).append("<h4>(" + result.recipes[i].publisher + ")</h4>");
                $("#results").append(publisher);

                recipeLink.attr("href", result.recipes[i].source_url);
                $("#results").append(recipeLink);

                img.attr("src", result.recipes[i].image_url);
                $(recipeLink).html(img);

            }

        })
    }

    $("#search-locations").on("click", function(event) {
        console.log("Working!")
        event.preventDefault()
        // $.ajax{
        //     header: get,
        //     url: asdfalsdjfj
        // }
        const params = $.param({
            "query": $("#place-input").val() + " in " + $("#zipCode").val(),
            "key": "AIzaSyDOotByZwSbRmyaQlyEIjGbr8nZNG_kb44"
        })

        fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?" + params)
            .then(response => response.json())
            .then(data => {
                console.log(data)

                $(".panel-place").empty();

                for (var i = 0; i < Math.min(10, data.results.length); i++) {

                    var formcnt = $("<form>").attr("class", "restuarant-list-form" );
                    formcnt.attr("action", "resteraunts.html");
                    formcnt.attr("method", "GET");
                    var namecnt = $("<div>").attr("class", "placeName");
                    namecnt.text(data.results[i].name);
                    formcnt.append(namecnt);
                    var inputcon = $("<input>").attr("id","goto-map-location" );
                    inputcon.attr("type", "submit");
                    inputcon.attr("name", "r");
                    inputcon.attr("class", "placeAddress");
                    inputcon.attr("value", data.results[i].formatted_address);
                    formcnt.append(inputcon);
                    $(".panel-place").append(formcnt);
                }

                $("#place-input").val("");
                $("#zipCode").val("");

                photos = data.results[0].icon
                console.log(photos)
                $("#photos").html("<img src=" + photos + ">")
            })
    });

  function setMyLocation() {
      if (navigator.geolocation)
          navigator.geolocation.getCurrentPosition(setPosition);
    }
    function setPosition(position) {
       var latlon = position.coords.latitude + "," + position.coords.longitude;
       let queryGEO  = "https://www.google.com/maps/embed/v1/place?key=AIzaSyBiqzJxSgSz6f4LGXMnfIC3VEC-NQe3d_g&q=restaurant,&center=" + latlon;
       console.log(queryGEO);
       $("#map").attr("src", queryGEO);
    }
   
    function getLocation() {
        //queryURL for food API
        //    var Key = "AIzaSyCn2ZDoCa4-0SJWmCM3l_BGiB16qMZjK8c";
        var key = "AIzaSyAowfvSBIR3IYnM0IuMk-hfbbntZaLpuo4";
        var query = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + key;
        console.log(query);
        var whereiam = "";
        //ajax request
        $.ajax({
            url: query,
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            dataType: "json"
        }).then(function(result) {
            console.log(result);
            whereiam = result;
        });
        return whereiam;
    }

    function setRestuarantSearch(search) {
       let queryMAP  = "https://www.google.com/maps/embed/v1/place?key=AIzaSyBiqzJxSgSz6f4LGXMnfIC3VEC-NQe3d_g&q=restaurant+" + search;
      console.log(queryMAP);
      $("#map").attr("src", queryMAP);
   }


   //Scroll to top button
    if ($("#back-to-top").length) {
    var scrollTrigger = 100,
        backToTop = function () {
            var scrollTop = $(window).scrollTop();
            if (scrollTop > scrollTrigger) {
                $("#back-to-top").addClass("show");
            } else {
                $("#back-to-top").removeClass("show");
            }
        };

    backToTop();
    
    $(window).on("scroll", function () {
        backToTop();
    });

    $("#back-to-top").on("click", function (e) {
        e.preventDefault();
        $("html,body").animate({
            scrollTop: 0
        }, 700);
      });
    }


});