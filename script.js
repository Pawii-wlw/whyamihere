document.addEventListener('DOMContentLoaded', function () {

  // Elements
  const hiLigaya = document.getElementById('hi-ligaya');
  const hiLigayaNextBtn = document.getElementById('hiLigayaNextBtn');
  const story = document.getElementById('story');
  const storyContent = document.getElementById('storyContent');
  const storyBackBtn = document.getElementById('storyBackBtn');
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
  const openEditorBtn = document.getElementById('openEditorBtn');
  const letterEditor = document.getElementById('letterEditor');
  const editorBackBtn = document.getElementById('editorBackBtn'); 
  const colorPicker = document.getElementById('colorPicker');
  const flapColorPicker = document.getElementById('flapColorPicker'); 
  const previewEnvelope = document.getElementById('previewEnvelope');
  const canvas = document.getElementById('doodleCanvas');
  const penColorPicker = document.getElementById('penColorPicker');
  const writeLetterBtn = document.getElementById('writeLetterBtn');
  const writingDesk = document.getElementById('writingDesk');
  const writingBackBtn = document.getElementById('writingBackBtn');
  const sendLetterBtn = document.getElementById('sendLetterBtn');
  const letterText = document.getElementById('letterText');

  // --- NEW ELEMENTS FOR SENT LETTERS ---
  const sentLettersBtn = document.getElementById('sentLettersBtn');
  const sentLettersSection = document.getElementById('sentLettersSection');
  const storageBackBtn = document.getElementById('storageBackBtn');
  const lettersStorageList = document.getElementById('lettersStorageList');

  // --- SIGNATURE PAD & CANVAS FIX ---
  let signaturePad;

  function resizeCanvas() {
    if (!canvas) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    
    if (signaturePad) {
      signaturePad.clear(); 
    }
  }

  if (typeof SignaturePad !== 'undefined' && canvas) {
    signaturePad = new SignaturePad(canvas);
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  }

  // --- LOCAL STORAGE LOGIC ---
  function saveLetterLocally(content) {
    let saved = JSON.parse(localStorage.getItem('joys_letters')) || [];
    saved.push({
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: content
    });
    localStorage.setItem('joys_letters', JSON.stringify(saved));
  }

  // --- ENVELOPE PILE UI ---
  function updateLettersStorageUI() {
    let saved = JSON.parse(localStorage.getItem('joys_letters')) || [];
    if (saved.length === 0) {
      lettersStorageList.innerHTML = `<p style="opacity: 0.5; padding: 20px; grid-column: 1/-1;">Wala ka pang sinesend na sulat, tomboy!</p>`;
      return;
    }

    lettersStorageList.innerHTML = saved.map((letter) => `
      <div class="envelope stored-envelope" style="cursor: pointer;">
        <div class="envelope-top"></div>
        <div class="letter">
          <p style="display: none;">${letter.text}</p>
          <span style="font-size: 0.5em; position: absolute; bottom: 5px; right: 5px; color: #ff69b4;">
            ${letter.date}
          </span>
        </div>
      </div>
    `).reverse().join(''); 

    const storedEnvs = lettersStorageList.querySelectorAll('.stored-envelope');
    storedEnvs.forEach(env => {
      env.addEventListener('click', () => {
        const text = env.querySelector('.letter p').textContent;
        letterContent.textContent = text;
        letterOverlay.classList.add('active');
      });
    });
  }

  // --- NAVIGATION LOGIC ---
  writeLetterBtn.addEventListener('click', () => showSection(writingDesk));
  writingBackBtn.addEventListener('click', () => showSection(letterEditor));

  if (editorBackBtn) {
    editorBackBtn.addEventListener('click', () => showSection(moreSection));
  }

  if (openEditorBtn) {
    openEditorBtn.addEventListener('click', () => {
      showSection(letterEditor);
      setTimeout(resizeCanvas, 10); 
    });
  }

  sentLettersBtn.addEventListener('click', () => {
    updateLettersStorageUI();
    showSection(sentLettersSection);
  });

  storageBackBtn.addEventListener('click', () => showSection(moreSection));
  moreBtn.addEventListener('click', () => showSection(moreSection));
  moreBackBtn.addEventListener('click', () => showSection(hiLigaya));
  hiLigayaNextBtn.addEventListener('click', () => showSection(story));
  storyBackBtn.addEventListener('click', () => showSection(hiLigaya));

  // --- EDITOR CONTROLS ---
  if (penColorPicker && signaturePad) {
    penColorPicker.addEventListener('input', (e) => {
      signaturePad.penColor = e.target.value;
    });
  }

  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn && signaturePad) {
    clearBtn.addEventListener('click', () => signaturePad.clear());
  }

  if (colorPicker && previewEnvelope) {
    colorPicker.addEventListener('input', (e) => {
      previewEnvelope.style.backgroundColor = e.target.value;
    });
  }

  if (flapColorPicker && previewEnvelope) {
    const flap = previewEnvelope.querySelector('.envelope-top');
    flapColorPicker.addEventListener('input', (e) => {
      if (flap) flap.style.backgroundColor = e.target.value;
    });
  }

  envelopes.forEach((env) => {
    env.addEventListener('click', () => {
      const text = env.querySelector('.letter p').textContent;
      letterContent.textContent = text;
      letterOverlay.classList.add('active');
    });
  });

  closeLetterBtn.addEventListener('click', () => letterOverlay.classList.remove('active'));

  function showSection(section) {
    if (!section) return;
    const allSections = [
        hiLigaya, story, last, funnyQuestions, 
        finalQuestion, moreSection, letterEditor, writingDesk, sentLettersSection
    ];
    allSections.forEach(s => {
        if(s) s.classList.remove('active');
    });
    section.classList.add('active');
  }

  // --- STORY SCROLL LOGIC ---
  storyNextBtn.disabled = true;
  storyNextBtn.style.opacity = "0.5";

  function checkIfLikeUVisible() {
    const text = storyContent.innerText.toLowerCase();
    if (!text.includes("i like u")) return;

    const range = document.createRange();
    const walker = document.createTreeWalker(storyContent, NodeFilter.SHOW_TEXT);
    let currentNode, found = false;
    while (walker.nextNode()) {
      currentNode = walker.currentNode;
      if (currentNode.textContent.toLowerCase().includes("i like u")) {
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

  ['scroll', 'touchmove', 'wheel'].forEach(ev => {
    storyContent.addEventListener(ev, () => setTimeout(checkIfLikeUVisible, 50), { passive: true });
  });

  storyNextBtn.addEventListener('click', () => {
    if (!storyNextBtn.disabled) showSection(last);
  });

  lastButton.addEventListener('click', startFunnyQuestions);

  // --- FUNNY QUESTIONS LOGIC ---
  const messages = [
    "so what do u think of that", "okay ba yon??? kung hindi",
    "wag na wag na, i delete na to", "HAHAHHA baliw yan",
    "gusto ko lang talaga iyabang website ko sayo", "emerut",
    "i made this website for u talaga",
    "i dont have the guts to ask u in person e, so dito nalang HAHHAHA",
    "ummm", "uhhhhhhhhh", "jusko po", "parang matatae ako HAHHAHA",
    "pasko naba? merry christmas tomboy, or new year na? happy new year tombits",
    "yon", "hmmm", "sooooo", "may graham ba kayo? padala nalang if meron:)))",
    "okay last na talaga", "last next na to...", "engk HAHHAHA", "okay serious time",
    "serious ako ah HAHAHHA", "idk if its too early",
    "but i really wanna know u better, di ko alam limitations ko pag ganto set up e",
    "idk how to act", "and maybe this would turn out great diba", "and dun din naman sya papunta",
    "anyway happy new year, i hope this year, u would prioritize yourself more, u would take care of yourself more and please no more self harm ah, thank u for making half of the year interesting",
    "so heres my question", "simple question lang naman i2 ", "umm...",
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

  // --- EMAILJS & SEND LOGIC ---
  if (typeof emailjs !== 'undefined') {
    emailjs.init("D9TvNzlXQBfPCCqFy");
  }

  const loadingOverlay = document.createElement("div");
  loadingOverlay.className = "loading-overlay";
  loadingOverlay.textContent = "wait lang tomboy...";
  document.body.appendChild(loadingOverlay);

  function showLoading() { loadingOverlay.classList.add("active"); }
  function hideLoading() { loadingOverlay.classList.remove("active"); }

  // --- FIXED: REDIRECT TO MORE SECTION AFTER SENDING ---
  sendLetterBtn.addEventListener('click', function() {
    const messageContent = letterText.value;
    if (!messageContent.trim()) {
        const paper = document.querySelector('.stationery-paper');
        if(paper) paper.classList.add('shake');
        setTimeout(() => paper.classList.remove('shake'), 300);
        alert("oy sulat ka muna!");
        return;
    }

    showLoading();
    emailjs.send("service_oj58kby", "template_1v79j7h", {
      name: "Ligaya (Custom Letter)",
      time: new Date().toLocaleString(),
      message: messageContent
    }).then(function() {
      saveLetterLocally(messageContent); 
      hideLoading();
      alert("Sent! ❤️ Mapupunta na 'to sa collection mo.");
      
      // Clear inputs
      letterText.value = "";
      if (signaturePad) signaturePad.clear();
      
      // FIX: Go back to moreSection instead of 'last'
      showSection(moreSection); 
    }, function(error) {
      hideLoading();
      alert("Failed to send letter. Check connection!");
    });
  });

  yesBtn.addEventListener('click', function() {
    showLoading();
    emailjs.send("service_oj58kby", "template_1v79j7h", {
      name: "Ligaya",
      time: new Date().toLocaleString(),
      message: "Ligaya clicked YES!"
    }).then(function() {
      hideLoading();
      finalQuestion.innerHTML = `<h1>oh dang</h1><img src="wow.jpg" alt="pic" class="reaction-pic"><p>happy new year:))</p><p>dw about your answer, nakasend na sakin yan:)))</p>`;
    }, function() {
      hideLoading();
      alert("something went wrong, try again");
    });
  });

  noBtn.addEventListener('click', function() {
    showLoading();
    emailjs.send("service_oj58kby", "template_1v79j7h", {
      name: "Ligaya",
      time: new Date().toLocaleString(),
      message: "Ligaya clicked NO..."
    }).then(function() {
      hideLoading();
      finalQuestion.innerHTML = `<h1>aww</h1><img src="sad.jpg" alt="pic" class="reaction-pic"><p>its okay po</p>`;
    }, function() {
      hideLoading();
      alert("something went wrong, try again");
    });
  });

  window.showSection = showSection;
  window.startFunnyQuestions = startFunnyQuestions;
});
