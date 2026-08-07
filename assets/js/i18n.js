function getNestedTranslation(obj, key) {

    return key
        .split(".")
        .reduce((value, part) => value && value[part], obj);

}



async function setLanguage(language) {

    try {


        const response = await fetch(
            `./locales/${language}.json`
        );


        const translations = await response.json();



        // Text content translation
        document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {


            const key = element.dataset.i18n;


            const text = getNestedTranslation(
                translations,
                key
            );


            if (text) {

                element.innerHTML = text;

            }


        });





        // Placeholder translation
        document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach(element => {


            const key = element.dataset.i18nPlaceholder;


            const text = getNestedTranslation(
                translations,
                key
            );


            if (text) {

                element.placeholder = text;

            }


        });





        /*
          Language Class
          Used by CSS
        */

        document.documentElement.lang = language;



        document.documentElement.classList.remove(
            "lang-en",
            "lang-ar",
            "lang-ml",
            "lang-hi",
            "lang-ta"
        );



        document.documentElement.classList.add(
            "lang-" + language
        );





        /*
          RTL / LTR
        */

        if(language === "ar") {

            document.documentElement.dir = "rtl";

        } 
        else {

            document.documentElement.dir = "ltr";

        }





        localStorage.setItem(
            "language",
            language
        );


    }

    catch(error) {

        console.error(error);

    }

}