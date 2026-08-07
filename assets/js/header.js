document.addEventListener("DOMContentLoaded",()=>{


const toggle =
document.querySelector("[data-nav-toggle]");


const nav =
document.querySelector(".header__nav");



if(toggle && nav){


toggle.addEventListener("click",()=>{


const opened =
toggle.getAttribute("aria-expanded") === "true";



toggle.setAttribute(
"aria-expanded",
!opened
);



nav.classList.toggle(
"header__nav--open",
!opened
);



});



/* Close menu when link clicked */

document
.querySelectorAll(".header__menu-link")
.forEach(link=>{


link.addEventListener("click",()=>{


toggle.setAttribute(
"aria-expanded",
"false"
);


nav.classList.remove(
"header__nav--open"
);


});


});



}



});