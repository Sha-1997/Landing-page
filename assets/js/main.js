document.addEventListener(
"DOMContentLoaded",
function(){


    const language =
    localStorage.getItem("language")
    || "en";


    setLanguage(language);



    const select =
    document.getElementById(
        "languageSelect"
    );


    if(select){


        select.value =
        language;


        select.addEventListener(
        "change",
        function(){


            setLanguage(
                this.value
            );


        });


    }


});