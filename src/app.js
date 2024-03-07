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
<div class="card">
    <div class="card-body">
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to my portfolio! I'm Jeremy Anderson, a versatile game 
        developer and software engineer with a knack for problem-solving. My expertise spans across various domains 
        including architecture, gameplay, SDKs, engine features, multiplayer, servers, server/client communication, 
        tools, and websites, to name a few. For a detailed overview of my skills and experiences, feel free to explore my resume.
        </p>
        <div class="float-left" style="padding: 10px;">
            <div class="card">
                <img class="card-img-top rounded about" src="img/mighty.jpg" />
                <div class="card-body" style="text-align: center;">
                    <small>Mighty the Cockatiel</small>
                </div>
            </div>
        </div>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;My most recent project was <a href="https://www.hellokittyislandadventure.com/">Hello Kitty Island Adventure</a>, where I played a pivotal 
        role from its inception to release. I developed class-based RPC targeting on our custom managed RPC system and built core 
        systems such as Inventory, Conditions, AI Blackboard, and User State Management. I also designed the AI system for NPCs, 
        backed by an AI Blackboard variable store and a conditional system. Additionally, I implemented various multiplayer gameplay 
        features and network features.
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I'm always eager to discuss new opportunities in the game industry, delve into my past 
        projects, or chat about anything else that piques your interest. Let's connect!</p>
        </p>
    </div>
</div>`
});

Vue.component('professional', {
    props: ['data'],
    template:
        `
<div>
    <div class="card">
        <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item card-img-top" src="https://www.youtube.com/embed/JCL5ZW-cv_s"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
        </div>
        <div class="card-body">
            <h5 class="card-title">Professional Portfolio</h5>
            <p class="card-text">
            <ol>
                <li>
                    <h6>JCI Tables: Downstream 2011</h6>
                    <ul>
                        <li>Developed the media UI, text rendering, and various engine features in C++.</li>
                    </ul>
                </li>
                <li>
                    <h6>Northeastern Global wall: Downstream 2012</h6>
                    <ul>
                        <li>See below</li>
                    </ul>
                </li>
                <li>
                    <h6>Juniper TerraStream: Downstream 2013</h6>
                    <ul>
                        <li>Led development of application, developed in C++ on custom engine (ds_cinder), application
                            kiosk
                            placed in 2 location sharing control of a central light display in the shape of the world
                            map.
                        </li>
                    </ul>
                </li>
                <li>
                    <h6>Deloitte CEO virtual address: Downstream 2011</h6>
                    <ul>
                        <li>Took over video renderer built with C++ and Nvidia Cuda and built in support for alpha h264
                            videos that could be played seamlessly across multiple computers.</li>
                    </ul>
                </li>
                <li>
                    <h6>Verizon DNA Wall: Downstream 2012</h6>
                    <ul>
                        <li>Showcased at CES 2012.</li>
                        <li>I supported a contracting team that used our inhouse engine by adding features, fixing bugs,
                            and
                            providing ready-made solutions for common multimedia functionality.</li>
                        <li>Application was built by two contractors (Nick Hogle and my brother Nathan Anderson)</li>
                    </ul>
                </li>
                <li>
                    <h6>MSC Compass A.T.: Medical Simulation Corporation 2013 - 2015</h6>
                    <ul>
                        <li>See below</li>
                    </ul>
                </li>
                <li>
                    <h6>DragonVale World: Backflip Studios 2015 - 2017</h6>
                    <ul>
                        <li>See below</li>
                    </ul>
                </li>
                <li>
                    <h6>Cancelled Transformers Game: Backflip Studios 2017-2019</h6>
                    <ul>
                        <li>Co-developed data streaming tool chain to allow designers to use excel for data entry, but
                            also
                            easy enough to get into the game.</li>
                        <li>Led development of Authoritative Game Server written in golang.</li>
                        <li>Built the client server communication layer for the game in Unity.</li>
                        <li>Built various touch input systems.</li>
                    </ul>
                </li>
            </ol>
            </p>
        </div>
    </div>
    <div style="margin-top: 100px;"></div>
    <div class="card">
        <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item card-img-top" src="https://www.youtube.com/embed/mSAo6PNh4Pg"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
        </div>
        <div class="card-body">
            <h5 class="card-title">DragonVale World: Backflip Studios 2015 - 2017</h5>
            <p class="card-text">
            <ul>
                <li>Developed 3rd party SDK abstraction in C++, C#, Obj-C, and Java that was shared between Unity 3D and
                    custom C++ engines.</li>
                <li>Worked closely with UA and Marketing for advertisements and promotional content.</li>
                <li>Built Postcard and Mailbox feature working closely with designers and writers.</li>
                <li>Built Zodia habit and all the logic and functionality around.</li>
                <li>Created various CG shader effects for dragons and habitats; including the very popular Sumi-E
                    Dragon.
                </li>
                <li>Managed 3rd party integrations into DVW</li>
                <li>Built Dragon Promo Modal system that allowed dynamic promotional content without Marketing needing
                    to
                    make the content.</li>
                <li>Built many features</li>
            </ul>
            </p>
        </div>
    </div>
    <div style="margin-top: 100px;"></div>
    <div class="card">
        <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item card-img-top" src="https://player.vimeo.com/video/71025341"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
        </div>
        <div class="card-body">
            <h5 class="card-title">MSC Compass A.T.: Medical Simulation Corporation 2013 - 2015</h5>
            <p class="card-text">
            <ul>
                <li>Built Endovascular simulations for testing medical devices.</li>
                <li>Contributed extensive performance improvements, rendering features, and hardware interface drivers
                    for
                    Windows.</li>
                <li>Led development and design on an web service for hardware management and over the air updates for
                    Compass units in the field. Previously they had to be physically sent in to be updated and get
                    diagnostics.</li>
            </ul>
            </p>
        </div>
    </div>
    <div style="margin-top: 100px;"></div>
    <div class="card">
        <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item card-img-top" src="https://www.youtube.com/embed/2-8KG8tWYQk"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
        </div>
        <div class="card-body">
            <h5 class="card-title">Northeastern Global wall: Downstream 2012</h5>
            <p class="card-text">
            <ul>
                <li>Global Wall is a creative interactive for Northeastern University that educates prospective students
                    about Northeastern's global programs.</li>
                <li>Led development of application and developed in C++ on custom engine (ds_cinder) I co-developed on
                    top
                    of the C++ framework cinder.</li>
            </ul>
            </p>
        </div>
    </div>
</div>`
});

Vue.component('personal', {
    props: ['data'],
    template:
`
<div>
    <div class="card">
        <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item card-img-top" src="https://www.youtube.com/embed/7zcp_8j1nzc"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
        </div>
        <div class="card-body">
            <h5 class="card-title"><a href="https://jbluepolarbear.itch.io/not-responsive">Not Responsive</a></h5>
            <p class="card-text">
            <ul>
                <li>A game built in Unity for the <a href="https://itch.io/jam/gmtk-2020">GMTK Game Jame 2020</a>.</li>
            </ul>
            </p>
        </div>
    </div>
    <div style="margin-top: 100px;"></div>
    <div class="card">
        <div style="width: 100%;text-align: center;">
            <div style="display: inline-block;">
                <embed width="740" height="500" class="embed-responsive-item" src="https://www.jeremyiscool.com/Bumble-Asteroids/index.html"></embed>
            </div>
        </div>
        <div class="card-body">
            <h5 class="card-title">Bumble-Asteroids</h5>
            <p class="card-text">
            <ul>
                <li><a href="https://github.com/jbluepolarbear/Bumble-Asteroids">Asteroids</a> game built in the <a href="https://github.com/jbluepolarbear/Bumble">Bumble</a> game framework I made in JavaScript.</li>
            </ul>
            </p>
        </div>
    </div>
    <div style="margin-top: 100px;"></div>
</div>
`});

Vue.component('contact', {
    props: ['data'],
    template:
        `
<div class="card">
    <div class="card-body">
        <div>Email: <a href="mailto:#">jbluepolarbear@gmail.com</a></div>
        <div>Linkedin: <a href="https://www.linkedin.com/in/jeremy-robert-anderson">www.linkedin.com/in/jeremy-robert-anderson</a></div>
    </div>
</div>`
});

Vue.component('resume', {
    props: ['data'],
    template:
        `
<div class="card">
    <div class="card-body">
        <div id="google-doc"></div>
    </div>
</div>`
});

//App class
export class App {
    constructor() {
        this.app = new Vue({
            el: '#app',
            data: function () {
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
        if (!!hash && hash.length > 0) {
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
        this.resumeAcquired = true;
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