document.addEventListener('DOMContentLoaded', function () {

  // elements
  const hiLigaya = document.getElementById('hi-ligaya');
  const hiLigayaNextBtn = document.getElementById('hiLigayaNextBtn');
  const story = document.getElementById('story');
  const storyContent = document.getElementById('storyContent');
  const storyNextBtn = document.getElementById('storyNextBtn');
  const last = document.getElementById('last');
  const lastButton = document.getElementById('lastButton');
  const funnyQuestions = document.getElementById('funnyQuestions');
  const finalQuestion = document.getElementById('finalQuestionSection');
  const funnyQuestionText = document.getElementById('funnyQuestionText');
  const nextBtn = document.getElementById('nextBtn');
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const moreBtn = document.getElementById('moreBtn');
  const moreSection = document.getElementById('moreSection');
  const moreBackBtn = document.getElementById('moreBackBtn');
  const envelopes = document.querySelectorAll('.envelope');
  const letterOverlay = document.getElementById('letterOverlay');
  const letterContent = document.getElementById('letterContent');
  const closeLetterBtn = document.querySelector('.close-letter');

  envelopes.forEach((env) => {
    env.addEventListener('click', () => {
      const letterText = env.querySelector('.letter p').textContent; // Get the content from the HTML
      letterContent.textContent = letterText; // Set it in the overlay
      letterOverlay.classList.add('active');
    });
  });

  closeLetterBtn.addEventListener('click', () => {
    letterOverlay.classList.remove('active');
  });

  // show section helper
  function showSection(section) {
    [hiLigaya, story, last, funnyQuestions, finalQuestion, moreSection].forEach(s => s.classList.remove('active'));
    section.classList.add('active');
  }

  moreBtn.addEventListener('click', function() {
    showSection(moreSection);
  });

  moreBackBtn.addEventListener('click', function (){
    showSection(hiLigaya);
  });

  // navigation for each Next button
  hiLigayaNextBtn.addEventListener('click', function() {
    showSection(story);
  });

  storyNextBtn.disabled = true;
  storyNextBtn.style.opacity = "0.5";

  // STORY SCROLL CHECK
  function checkIfLikeUVisible() {
    const text = storyContent.innerText.toLowerCase();
    const likeUIndex = text.indexOf("i like u");
    if (likeUIndex === -1) return; // no match found

    const range = document.createRange();

    // Find "i like u" inside the storyContent
    const walker = document.createTreeWalker(storyContent, NodeFilter.SHOW_TEXT);
    let currentNode, found = false;
    while (walker.nextNode()) {
      currentNode = walker.currentNode;
      const nodeIndex = currentNode.textContent.toLowerCase().indexOf("i like u");
      if (nodeIndex !== -1) {
        found = true;
        range.selectNodeContents(currentNode);
        break;
      }
    }

    if (!found) return;

    const rect = range.getBoundingClientRect();
    const containerRect = storyContent.getBoundingClientRect();

    if (rect.top < containerRect.bottom - 50) {
      storyNextBtn.disabled = false;
      storyNextBtn.style.opacity = "1";
    }
  }

  // watch scrolling
  ['scroll', 'touchmove', 'wheel'].forEach(ev => {
    storyContent.addEventListener(ev, () => setTimeout(checkIfLikeUVisible, 50), { passive: true });
  });

  storyNextBtn.addEventListener('click', function() {
    if (!storyNextBtn.disabled) showSection(last);
  });

  lastButton.addEventListener('click', function() {
    startFunnyQuestions();
  });

  // PROGRESSIVE MESSAGES (FIXED: all commas present!)
  const messages = [
    "so what do u think of that", 
    "okay ba yon??? kung hindi",
    "wag na wag na, i delete na to",
    "HAHAHHA baliw yan",
    "gusto ko lang talaga iyabang website ko sayo",
    "emerut",
    "i made this website for u talaga",
    "i dont have the guts to ask u in person e, so dito nalang HAHHAHA",
    "ummm",
    "uhhhhhhhhh",
    "jusko po",
    "parang matatae ako HAHHAHA",
    "pasko naba? merry christmas tomboy, or new year na? happy new year tombits",
    "yon",
    "hmmm",
    "sooooo",
    "may graham ba kayo? padala nalang if meron:)))",
    "okay last na talaga",
    "last next na to...",
    "engk HAHHAHA",
    "okay serious time",
    "serious ako ah HAHAHHA",
    "idk if its too early",
    "but i really wanna know u better, di ko alam limitations ko pag ganto set up e",
    "idk how to act",
    "and maybe this would turn out great diba",
    "and dun din naman sya papunta",
    "anyway happy new year, i hope this year, u would prioritize yourself more, u would take care of yourself more and please no more self harm ah, thank u for making half of the year interesting",
    "so heres my question",
    "simple question lang naman i2 ",
    "umm...",
  ];
  let currentMessage = 0;

  function startFunnyQuestions() {
    currentMessage = 0;
    showSection(funnyQuestions);
    funnyQuestionText.textContent = messages[currentMessage];
  }

  nextBtn.addEventListener('click', function() {
    currentMessage++;
    if (currentMessage < messages.length) {
      funnyQuestionText.textContent = messages[currentMessage];
    } else {
      showSection(finalQuestion);
    }
  });

  // FINAL QUESTION BUTTONS
  emailjs.init("D9TvNzlXQBfPCCqFy"); // your public key

  // create loading overlay
  const loadingOverlay = document.createElement("div");
  loadingOverlay.className = "loading-overlay";
  loadingOverlay.textContent = "wait lang tomboy...";
  document.body.appendChild(loadingOverlay);

  function showLoading() {
    loadingOverlay.classList.add("active");
  }

  function hideLoading() {
    loadingOverlay.classList.remove("active");
  }

  yesBtn.addEventListener('click', function() {
    showLoading();

    emailjs.send("service_oj58kby", "template_1v79j7h", {
      name: "Ligaya",
      time: new Date().toLocaleString(),
      message: "Ligaya clicked YES!"
    }).then(
      function(response) {
        hideLoading();
        finalQuestion.innerHTML = `
          <h1>oh dang</h1>
          <img src="wow.jpg" alt="pic" class="reaction-pic">
          <p>happy new year:))</p>
          <p>dw about your answer, nakasend na sakin yan:)))</p>
        `;
      },
      function(error) {
        hideLoading();
        alert("something went wrong, try again");
      }
    );
  });

  noBtn.addEventListener('click', function() {
    showLoading();

    emailjs.send("service_oj58kby", "template_1v79j7h", {
      name: "Ligaya",
      time: new Date().toLocaleString(),
      message: "Ligaya clicked NO..."
    }).then(
      function(response) {
        hideLoading();
        finalQuestion.innerHTML = `
          <h1>aww</h1>
          <img src="sad.jpg" alt="pic" class="reaction-pic">
          <p>its okay po</p>
        `;
      },
      function(error) {
        hideLoading();
        alert("something went wrong, try again");
      }
    );
  });

  window.showSection = showSection;
  window.startFunnyQuestions = startFunnyQuestions;
});
