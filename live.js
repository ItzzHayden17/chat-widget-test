(function () {
  "use strict";

  const NS = "afcw-v-1.16";
  const ID = (x) => `${NS}-${x}`;
  const ROOT_ID = ID("root");

  // Remove old instance so console paste + redeploy works
  const old = document.getElementById(ROOT_ID);
  if (old) old.remove();

  // helper: reliably scroll INSIDE the chatMessages container to a child by id
  function scrollToMessageId(chatMessagesEl, targetId) {
    const target = chatMessagesEl.querySelector(`#${CSS.escape(targetId)}`);
    if (!target) return;

    // Make sure there is enough "extra" scroll space so block:start can actually land where you want.
    // (Without this, the last item can't be aligned at the top.)
    if (!chatMessagesEl.dataset.afcwPadApplied) {
      const currentPadBottom =
        parseInt(getComputedStyle(chatMessagesEl).paddingBottom, 10) || 0;
      if (currentPadBottom < 160) chatMessagesEl.style.paddingBottom = "20px";
      chatMessagesEl.dataset.afcwPadApplied = "1";
    }

    // Offset the snap point so it starts below your header (tweak if needed)
    target.style.scrollMarginTop = "80px";

    // Scroll so the target starts at the top of the scroll area
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const style = document.createElement("style");
  style.textContent = `
@keyframes afcw-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
  document.head.appendChild(style);

  const widgetHTML = `
  <div id="${ROOT_ID}" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: Arial, sans-serif; box-sizing: border-box; text-size-adjust:none; -webkit-text-size-adjust:none;">
  
    <div id="${ID("popup")}"
         style="position:absolute; right:0; bottom:70px; width:300px;
                display:none; opacity:0; transform:translateY(10px);
                pointer-events:none; box-sizing:border-box;">
      <div style="display:flex; align-items:flex-start; gap:10px;">
        <img
          src="https://amplifin.zendesk.com/embeddable/avatars/20322948535964"
          width="34" height="34" alt="Jessica"
          style="display:block; width:34px !important; height:34px !important;
                 border-radius:999px; object-fit:cover; flex-shrink:0; border:0;">
        <div style="position:relative; background:#ffffff; color:#323345; border-radius:14px;
                    box-shadow:0 10px 30px rgba(0,0,0,0.15);
                    padding:12px 14px; font-size:13px; line-height:1.25; box-sizing:border-box;">
          <div id="${ID("popupText")}" style="position:relative">
          
            Selecting the correct collection and payment solution is essential to your business success, I am happy to answer any questions you may have and guide you through our solutions, or alternatively make contact with you telephonically.
          </div>
          <p id= "closePopupX" style="
          position:absolute;
          right:0;
          top:0;
          margin-top: -20px;
          cursor:pointer;
          ">x</p>
          <div style="position:absolute; left:-7px; top:16px; width:14px; height:14px; background:#fff;
                      transform:rotate(45deg); box-shadow:-6px 6px 18px rgba(0,0,0,0.06);"></div>
        </div>
      </div>
    </div>

    <button id="${ID("chatToggle")}" type="button"
      style="width:60px;height:60px;border-radius:50%;border:none;background:#FBC100;
             display:flex;align-items:center;justify-content:center;
             cursor:pointer;box-shadow:0 4px 12px rgba(138, 243, 0, 0.2)tline:none;">
      <svg xmlns="http://www.w3.org/2000/svg"
           width="28" height="28"
           viewBox="0 0 24 24"
           fill="none"
           aria-hidden="true"
           role="button"
           tabindex="0"
           style="cursor:pointer;">
        <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7"
              stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>

    <div id="${ID("chatBox")}"
         style="width: 320px; height: 620px; background: white; border-radius: 14px;
                box-shadow: 0 4px 18px rgba(0,0,0,0.15); position: absolute; bottom: 70px; right: 0;
                display: none; overflow: hidden; font-family: Arial, sans-serif; box-sizing:border-box;">

      <div style="background: #323345; color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; box-sizing:border-box;">
        <div style="display: flex; flex-direction: row; align-items:center; justify-content:space-between; ">
          <div style="display: flex; flex-direction: column;">
            <h1 style="font-size: 1.125rem; font-weight: 600; letter-spacing: -0.028rem; margin:0 0 6px 0; padding:0; line-height:1.125rem;">
              <img
                src="https://amplifin.co.za/wp-content/uploads/2022/09/Amplifin-Logo.png"
                alt="Amplifin"
                width="140"
                height="25"
                style="
                  display:block;
                  width:140px !important;
                  height:25px !important;
                  max-width:none !important;
                  max-height:none !important;
                  object-fit:contain;
                  border:0;
                ">
            </h1>
            <p style="font-size: 0.875rem; margin:0; padding:0;">
              How can we Amplify your day?
            </p>
          </div>
          <svg id="closeBtn" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              width="30" height="30"
              role="img" aria-label="Circle with X">
            <!-- circle -->
            <circle cx="50" cy="50" r="45" fill="none" stroke="#FBC100" stroke-width="4"/>
            <!-- X (cross) -->
            <g stroke="#FBC100" stroke-width="6" stroke-linecap="round">
              <line x1="30" y1="30" x2="70" y2="70"/>
              <line x1="70" y1="30" x2="30" y2="70"/>
            </g>
          </svg>

        </div>
      </div>

      <div id="${ID("chatMessages")}"
           style="padding: 20px; height: 500px; overflow-y: auto; overflow-x:hidden; font-size: 14px; box-sizing:border-box;">

        <!-- Give the first block an ID so we can demonstrate scrolling by ID -->
        <div id="firstMsg" style="display:flex; flex-direction:row; align-items:flex-start;">
          <img
            src="https://chat-widget-test.onrender.com/public/Amplifin_N.jpg"
            width="25"
            height="50"
            alt=""
            style="
              margin: 5px;
              display:block;
              width:25px !important;
              height:25px !important;
              max-width:none !important;
              max-height:none !important;
              object-fit:contain;
              flex-shrink:0;
              border:0;
            ">
<div style="
  color:#555;
  background:#f5f5f5;
  padding:10px;
  border-radius:20px;
  max-width:220px;
  box-sizing:border-box;

  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  font-size:14px;
  line-height:1.35;
  letter-spacing:0;
  -webkit-text-size-adjust:100%;
  text-rendering:optimizeLegibility;

  overflow-wrap:anywhere;
  word-break:break-word;
">
  Whether you’re looking for the right collection solution or need quick support, we’re here to help.<br><br>
  Click here to speak with our Support or Sales Team on WhatsApp.<br>
</div>
        </div>

        <div id="${ID("ctaRow")}" style="display:flex; flex-direction:row; justify-content:center; gap:6px; margin:10px 0;">
          <button id="${ID("support")}" type="button" style="outline:none; box-shadow:none; border:1px solid #FBC100;
              background:#fff; border-radius:15px; padding:10px; color:#FBC100; cursor:pointer; font-size:14px;">
            Support Team
          </button>
          <button id="${ID("sales")}" type="button" style="outline:none; box-shadow:none; border:1px solid #FBC100;
              background:#fff; border-radius:15px; padding:10px; color:#FBC100; cursor:pointer; margin:0 5px; font-size:14px;">
            Sales Team
          </button>
        </div>

      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML("beforeend", widgetHTML);

  // Select ONLY inside our widget to avoid WP collisions
  const root = document.getElementById(ROOT_ID);
  const chatToggle = root.querySelector(`#${CSS.escape(ID("chatToggle"))}`);
  const chatBox = root.querySelector(`#${CSS.escape(ID("chatBox"))}`);
  const chatMessages = root.querySelector(`#${CSS.escape(ID("chatMessages"))}`);
  const sales = root.querySelector(`#${CSS.escape(ID("sales"))}`);
  const support = root.querySelector(`#${CSS.escape(ID("support"))}`);
  const popup = root.querySelector(`#${CSS.escape(ID("popup"))}`);
  const popupText = root.querySelector(`#${CSS.escape(ID("popupText"))}`);
  const closeBtn = document.getElementById("closeBtn");
  // Use root.querySelector to find the X inside the widget (safer in constrained contexts)
  const closePopupX = root.querySelector("#closePopupX");

  if (closeBtn) closeBtn.style.cursor = "pointer";
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      chatToggle.click();
    });
  }

  chatBox.style.transition = "transform 260ms ease, opacity 260ms ease";
  chatBox.style.willChange = "transform, opacity";
  chatBox.style.transform = "translateY(14px)";
  chatBox.style.opacity = "0";
  chatBox.style.pointerEvents = "none";

  function go(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // ---- POPUP (works + message changes after first time) ----
  popup.style.transition = "transform 220ms ease, opacity 220ms ease";

  function hidePopup() {
    // disable pointer events while hiding
    popup.style.pointerEvents = "none";
    popup.style.opacity = "0";
    popup.style.transform = "translateY(10px)";
    window.setTimeout(function () {
      popup.style.display = "none";
    }, 220);
  }

  var hidePopupState = true;

  let popupIntervalId = null;
  let popupFirstTimeoutId = null;
  let popupStopped = false;

  // --- FIXED: attach the click handler to the close 'x' reliably ---
  if (closePopupX) {
    closePopupX.style.cursor = "pointer";
    closePopupX.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      stopPopupsCompletely();
      document.cookie = "popupDismissed=true";
    });
  }

  function stopPopupsCompletely() {
    popupStopped = true;

    if (popupFirstTimeoutId) {
      clearTimeout(popupFirstTimeoutId);
      popupFirstTimeoutId = null;
    }

    if (popupIntervalId) {
      clearInterval(popupIntervalId);
      popupIntervalId = null;
    }

    hidePopup();
  }

  function showPopup() {
    if (popupStopped) return;
    if (chatBox.style.display === "block") return; // don't show when chat is open

    const isFirst = !popup.dataset.firstShown;

    // enable pointer events when visible so clicks reach children (important!)
    popup.style.display = "block";
    popup.style.pointerEvents = "auto"; // <-- critical so closePopupX receives clicks
    popup.offsetHeight; // reflow for transition

    popup.addEventListener("click",()=>{
      chatToggle.click()
    })

    if (isFirst) {
      popupText.textContent =
        "Hi, I’m Jessica, I am here to assist with any product questions you may have.";
      popup.dataset.firstShown = "1";

      // show transition
      popup.style.opacity = "1";
      popup.style.transform = "translateY(0)";
      window.setTimeout(hidePopup, 8000);
    } else {
      // LAST iteration message
      popupText.textContent =
        "Selecting the correct collection and payment solution is essential to your business success, I am happy to answer any questions you may have and guide you through our solutions, or alternatively make contact with you telephonically.";

      // show it, then hide after 10s and stop forever
      popup.style.opacity = "1";
      popup.style.transform = "translateY(0)";

      window.setTimeout(hidePopup, 10000); // hide after 10 sec

      popupStopped = true; // prevent future popups
      if (popupIntervalId) clearInterval(popupIntervalId);
      return;
    }
  }
  const dismissed = getCookie("popupDismissed");

  if (!dismissed) {
      popupFirstTimeoutId = window.setTimeout(showPopup, 10000);
      popupIntervalId = window.setInterval(showPopup, 20000);
  }


  chatToggle.style.transition = "transform 180ms ease";

  // small “jump” every 3 seconds
  setInterval(function () {
    // don’t jump while chat is open
    if (chatBox.style.display === "block") return;

    chatToggle.style.transform = "translateY(-6px)";
    setTimeout(function () {
      chatToggle.style.transform = "translateY(0)";
    }, 180);
  }, 3000);

  chatToggle.addEventListener(
    "click",
    function (e) {
      hidePopup();
      e.preventDefault();
      e.stopPropagation();
      stopPopupsCompletely();

      const opening = chatBox.style.display === "none";
      if (opening) {
        chatBox.style.display = "block";
        // force reflow so the transition runs
        chatBox.offsetHeight;
        chatBox.style.pointerEvents = "auto";
        chatBox.style.transform = "translateY(0)";
        chatBox.style.opacity = "1";
      } else {
        chatBox.style.pointerEvents = "none";
        chatBox.style.transform = "translateY(14px)";
        chatBox.style.opacity = "0";
        window.setTimeout(function () {
          chatBox.style.display = "none";
        }, 260);
      }
    },
    true
  );

  support.addEventListener(
    "click",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      go("https://api.whatsapp.com/send/?phone=27675974601");
    },
    true
  );

  sales.addEventListener(
    "click",
    function (e) {
      e.preventDefault();
      e.stopPropagation();

      // ✅ FIX: spinner replaces the SALES button, then both spinner+sales are gone after response
      // (Support button remains as the only CTA in that row)
      const salesBtn = sales;
      const parent = salesBtn.parentNode;

      const spinner = document.createElement("div");
      spinner.id = "afcw-spinner";
      spinner.style.cssText = `
        width: 42px;
        height: 42px;
        display:flex;
        justify-content:center;
        align-items:center;
        margin:0 5px;
      `;
      spinner.innerHTML = `
        <div style="
          width:24px;
          height:24px;
          border:3px solid #FBC100;
          border-top-color: transparent;
          border-radius:50%;
          animation: afcw-spin 0.9s linear infinite;
        "></div>
      `;

      // replace the sales button with spinner
      parent.replaceChild(spinner, salesBtn);

      function cleanupSpinnerOnly() {
        const spinnerEl = root.querySelector("#afcw-spinner");
        if (spinnerEl) spinnerEl.remove();
      }

      fetch("https://chat-widget-test.onrender.com/", { cache: "no-store" })
        .then(function (response) {
          cleanupSpinnerOnly(); // leaves ONLY the support button in the row
          console.log(response)
          if (response.ok) {
            go("https://api.whatsapp.com/send/?phone=27716025710");
            console.log("Jessica is online")
            return;
          }

          // ---- NEW CONTENT (this is what we will scroll to by ID) ----
          const secondMsg = document.createElement("div");
          secondMsg.id = "secondMsg"; // <-- scroll target ID
          secondMsg.innerHTML = `
            <div style="display:flex;flex-direction:row; align-items:flex-start;">
              <img src="https://amplifin.zendesk.com/embeddable/avatars/20322948535964"
                   width="25" height="25" alt="Sales"
                   style="
                     border-radius:20px; margin-top:10px;
                     display:block;
                     width:25px !important; height:25px !important;
                     max-width:none !important; max-height:none !important;
                     object-fit:contain; flex-shrink:0; border:0;
                   ">
              <div style="
                color:#555;
                background:#f5f5f5;
                padding:10px;
                border-radius:20px;
                max-width:220px;
                box-sizing:border-box;

                font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
                font-size:14px;
                line-height:1.35;
                letter-spacing:0;
                -webkit-text-size-adjust:100%;
                text-rendering:optimizeLegibility;

                overflow-wrap:anywhere;
                word-break:break-word;
              ">
                Hello! This is Jessica from the Sales Team.<br><br>
                I am currently unavailable.<br><br>
                You can chat with our Support Team, who will assist you and ensure that a Sales Consultant
                contacts you as soon as possible.<br><br>
                Alternatively, please click on the button below to schedule a meeting with me.
              </div>
            </div>
          `;

          const meetingBtn = document.createElement("button");
          meetingBtn.type = "button";
          meetingBtn.textContent = "Schedule a meeting with me";
          meetingBtn.style.cssText = `
            margin-top:10px; border:1px solid #FBC100; border-radius:15px;
            padding:10px; background:#fff; color:#FBC100; cursor:pointer; width:100%; font-size:14px;
          `;
          meetingBtn.addEventListener(
            "click",
            function (ev) {
              ev.preventDefault();
              ev.stopPropagation();
              go("https://outlook.office.com/bookwithme/user/aea7a9c95b7a47668988fc5da0f9e845@amplifin.co.za?anonymous");
            },
            true
          );

          const supportBtn = document.createElement("button");
          supportBtn.type = "button";
          supportBtn.textContent = "Chat with Support";
          supportBtn.style.cssText = `
            margin-top:10px; border:1px solid #FBC100; border-radius:15px;
            padding:10px; background:#fff; color:#FBC100; cursor:pointer; width:100%; font-size:14px;
          `;
          supportBtn.addEventListener(
            "click",
            function (ev) {
              ev.preventDefault();
              ev.stopPropagation();
              go("https://api.whatsapp.com/send/?phone=27675974601");
            },
            true
          );

          const wrapper = document.createElement("div");
          wrapper.style.cssText =
            "width:auto; display:flex; flex-direction:column; box-sizing:border-box;";
          wrapper.append(meetingBtn, supportBtn);

          // Append new content
          chatMessages.append(secondMsg, wrapper);

          // ✅ THE IMPORTANT PART: scroll to a specific ID inside the chat container
          scrollToMessageId(chatMessages, "secondMsg");
        })
        .catch(function () {
          cleanupSpinnerOnly(); // leaves ONLY the support button in the row
          go("https://api.whatsapp.com/send/?phone=27675974601");
        });
    },
    true
  );
})();

function getCookie(name) {
  const match = document.cookie.match(
    new RegExp('(^| )' + name + '=([^;]+)')
  );
  return match ? decodeURIComponent(match[2]) : null;
}
