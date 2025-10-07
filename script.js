document.addEventListener('DOMContentLoaded', function () {

  // elements
  const hiLigaya = document.getElementById('hi-ligaya');
  const story = document.getElementById('story');
  const last = document.getElementById('last');
  const funnyQuestions = document.getElementById('funnyQuestions');
  const finalQuestion = document.getElementById('finalQuestionSection');
  const storyContent = document.getElementById('storyContent');
  const storyNextBtn = document.getElementById('storyNextBtn');
  const lastButton = document.getElementById('lastButton');
  const funnyQuestionText = document.getElementById('funnyQuestionText');
  const nextBtn = document.getElementById('nextBtn');
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');

  // show section helper
  function showSection(section) {
    [hiLigaya, story, last, funnyQuestions, finalQuestion].forEach(s => s.classList.remove('active'));
    section.classList.add('active');
  }

  // navigation
  window.goToStory = () => showSection(story);
  window.goToLast = () => showSection(last);

  // ---------- STORY SCROLL CHECK ----------
  storyNextBtn.disabled = true;
  storyNextBtn.style.opacity = "0.5";

  function checkIfLikeUVisible() {
    const text = storyContent.innerText.toLowerCase();
    const likeUIndex = text.indexOf("i like u");
    if (likeUIndex === -1) return; // no match found

    const range = document.createRange();
    const selection = window.getSelection();
    selection.removeAllRanges();

    // create range around the text "i like u"
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

  // story next button
  storyNextBtn.addEventListener('click', function() {
    if (!storyNextBtn.disabled) showSection(last);
  });

  // ---------- PROGRESSIVE MESSAGES ----------
  const messages = [
    "so what do u think of that", 
    "was it good?",
    "i made this to test my coding skills",
    "nah js kidding",
    "i made this website for u",
    "i dont have the courage to ask u in person, but i'll ask u in a way im passionate about",
    "ummm",
    "uhhhhhhhhh",
    "jusko po",
    "parang matatae ako HAHHAHA",
    "hmmm",
    "sooooo",
    "last next na to...",
    "engk HAHHAHA",
    "okay serious time",
    "i wanna make u MY special someone..",
    "would...",
    "u...."
  ];
  let currentMessage = 0;

  window.startFunnyQuestions = function () {
    currentMessage = 0;
    showSection(funnyQuestions);
    funnyQuestionText.textContent = messages[currentMessage];
  };

  nextBtn.addEventListener('click', function() {
    currentMessage++;
    if (currentMessage < messages.length) {
      funnyQuestionText.textContent = messages[currentMessage];
    } else {
      showSection(finalQuestion);
    }
  });

// ---------- FINAL QUESTION BUTTONS ----------
emailjs.init("D9TvNzlXQBfPCCqFy"); // your public key

yesBtn.addEventListener('click', function() {
  // send email first
  emailjs.send("service_oj58kby", "template_1v79j7h", {
    name: "Ligaya",
    time: new Date().toLocaleString(),
    message: "Ligaya clicked YES!"
  }).then(
    function(response) {
      console.log("SUCCESS!", response.status, response.text);

      // update the UI after success
      finalQuestion.innerHTML = `
        <h1>oh u clicked yes?</h1>
        <img src="wow.jpg" alt="pic" class="reaction-pic">
        <p>i wish i could hug u rn:))))</p>
        <p>dw about your answer, its sent</p>
      `;
    },
    function(error) {
      console.log("FAILED...", error);
      alert("something went wrong, try again"); // optional
    }
  );
});

noBtn.addEventListener('click', function() {
  // send email first
  emailjs.send("service_oj58kby", "template_1v79j7h", {
    name: "Ligaya",
    time: new Date().toLocaleString(),
    message: "Ligaya clicked NO..."
  }).then(
    function(response) {
      console.log("SUCCESS!", response.status, response.text);

      // update the UI after success
      finalQuestion.innerHTML = `
        <h1>dang</h1>
        <img src="sad.jpg" alt="pic" class="reaction-pic">
      `;
    },
    function(error) {
      console.log("FAILED...", error);
      alert("something went wrong, try again"); // optional
    }
  );
});
});
