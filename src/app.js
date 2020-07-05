// Components
Vue.component('navbar', {
    props: ['data'],
    template: 
`<nav class="navbar navbar-expand-xl navbar-dark" style="background-color: hsl(198, 100%, 28%);">
    <a class="navbar-brand" href="#">Jeremy Robert Anderson</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsingNav">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="navbar-collapse collapse" id="collapsingNav">
        <ul class="navbar-nav">
            <li id="home-nav" class="nav-item active">
                <a class="nav-link" href="#home">Home</a>
            </li>
            <li id="professional-nav" class="nav-item">
                <a class="nav-link" href="#professional">Professional Projects</a>
            </li>
            <li id="personal-nav" class="nav-item">
                <a class="nav-link" href="#personal">Personal Projects</a>
            </li>
            <li id="birbs-nav" class="nav-item">
                <a class="nav-link" href="#birbs">Birbs</a>
            </li>
            <li id="resume-nav" class="nav-item">
                <a class="nav-link" href="#resume">Resume</a>
            </li>
            <li id="contact-nav" class="nav-item">
                <a class="nav-link" href="#contact">Contact</a>
            </li>
        </ul>
    </div>
</nav>`
});

Vue.component('home', {
    props: ['data'],
    template: 
`
<div class="card-body">
    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Oh… Hello there! You’ve come to my portfolio, so you must want to
        know more about me. I am Jeremy Anderson and I am a game developer, multiskilled problem solver, and
        lots of other things. I am a true generalist software engineer and I am comfortable fitting into any
        role: gameplay, sdks, engine features, servers, server/client communication, tools, websites, and
        the
        list goes on. Check out my resume to see what else I’ve done.
    </p>
    <div class="float-left" style="padding: 10px;">
        <div class="card">
            <img class="card-img-top rounded about" src="res/mighty.jpg" />
            <div class="card-body" style="text-align: center;">
                <small>Mighty the Cockatiel</small>
            </div>
        </div>
    </div>
    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In March 2020 I joined Rewardify working on casual, reward
        driven,
        mobile games. Before that, I was at Backflip Studios where I worked on DragonVale World, 3rd party
        SDK
        integration, mentored Junior Developers, and I led the game server development of a cool,
        unannounced
        Transformers game until the studio closed in October of 2019. In 2013, I made the big decision to
        move
        from Portland, Or to Denver, Co to work at Medical Simulations Corporations building endovascular
        simulations to train doctors. Previous to that, I worked at a Downstream where I implemented large
        scale, multi-touch, interactive designs in C++ and OpenGL.
    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I am always open to a conversation about new opportunities in the
        game industry, my past projects, or anything you’d like.</p>
    </p>
</div>`
});

Vue.component('contact', {
    props: ['data'],
    template: 
`
<div class="card-body">
<div>Email: <a href="mailto:#">jbluepolarbear@gmail.com</a></div>
<div>Linkedin: <a href="https://www.linkedin.com/in/jeremy-robert-anderson">www.linkedin.com/in/jeremy-robert-anderson</a></div>
</div>`
});

Vue.component('resume', {
    props: ['data'],
    template: 
`
<div class="card-body">
    <div id="google-doc"></div>
</div>`
});

//App class
export class App {
    constructor() {
        this.app = new Vue({
            el: '#app',
            data: function() {
                return {
                    copywriteYear: new Date().getFullYear()
                };
            },
            methods: {
            }
        });

        let homeElm = document.getElementById("home-page");
        let homeNavElm = document.getElementById("home-nav");
        let professionalElm = document.getElementById("professional-page");
        let professionalNavElm = document.getElementById("professional-nav");
        let personalElm = document.getElementById("personal-page");
        let personalNavElm = document.getElementById("personal-nav");
        let birbsElm = document.getElementById("birbs-page");
        let birbsNavElm = document.getElementById("birbs-nav");
        let resumeElm = document.getElementById("resume-page");
        let resumeNavElm = document.getElementById("resume-nav");
        this.resumeAcquired = false;
        let contectElm = document.getElementById("contact-page");
        let contactNavElm = document.getElementById("contact-nav");

        this.collapsingNavElm = document.getElementById("collapsingNav");

        this.pages = {
            "home-page": {
                page: homeElm,
                nav: homeNavElm
            },
            "professional-page": {
                page: professionalElm,
                nav: professionalNavElm
            },
            "personal-page": {
                page: personalElm,
                nav: personalNavElm
            },
            "birbs-page": {
                page: birbsElm,
                nav: birbsNavElm
            },
            "resume-page": {
                page: resumeElm,
                nav: resumeNavElm
            },
            "contact-page": {
                page: contectElm,
                nav: contactNavElm
            }
        };

        const hash = window.location.hash;
        this.handleHash(hash);
        window.onhashchange = () => {
            const hash = window.location.hash;
            this.handleHash(hash);
        }
    }

    handleHash(hash) {
        if (!!hash && hash.length > 0)
        {
            if (!hash.includes("-page")) {
                hash += "-page";
            }
            this.setActivePage(hash.substr(1, hash.length - 1));
        } else {
            window.location.hash = "#home-page";
            this.setActivePage("home-page");
        }
        this.collapsingNavElm.collapsed
    }

    fillResume() {
        if (this.resumeAcquired) {
            return;
        }
        this.resumeAcquired = false;
        const url = "https://docs.google.com/document/d/e/2PACX-1vRpyDxxtPJi1TXLMuaymfd4bu3gn2cCxKjtGvIrgBQkbTfV8BOInHSmAmb_WqWX8DjjbfWlMRaHBkIw/pub?embedded=true";
        let request = new XMLHttpRequest();
        request.open("GET", url);
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == "200") {
                let googleDocElm = document.getElementById("google-doc");
                googleDocElm.innerHTML = request.responseText;
            }
        };
        request.send(null);
    }

    setActivePage(pageIdToActivate) {
        for (const [pageId, pageElm] of Object.entries(this.pages)) {
            if (pageIdToActivate === pageId) {
                pageElm.page.hidden = false;
                if (!pageElm.nav.className.includes('active')) {
                    pageElm.nav.className += ' active';
                }
                this.activePage = pageId;
                if (pageId === "resume-page") {
                    this.fillResume();
                }
            } else {
                pageElm.page.hidden = true;
                pageElm.nav.classList.remove("active");
            }
        }
    }
}