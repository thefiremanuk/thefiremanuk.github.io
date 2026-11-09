(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    var nodes = document.querySelectorAll("main .hero, main .section, main .reviews, main .page-hero, main .layout, .reviews-strip");
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    nodes.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.92) return;
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Add real Google reviews here, up to three. Each item needs the customer's own words.
  // { quote: "What they wrote.", name: "Their name", stars: 5 }
  // Leave this array empty until those reviews are copied in. Do not invent quotes, names or star ratings.
  var REVIEWS = [
  ];

  var reviewCards = document.getElementById("review-cards");
  if (reviewCards) {
    var reviews = REVIEWS.filter(function (item) {
      return item && String(item.quote || "").trim() && String(item.name || "").trim() && Number(item.stars) >= 1;
    }).slice(0, 3);
    reviews.forEach(function (item) {
      var card = document.createElement("blockquote");
      card.className = "review-card";
      var quote = document.createElement("p");
      quote.textContent = String(item.quote).trim();
      var stars = document.createElement("p");
      stars.className = "review-stars";
      var count = Math.max(1, Math.min(5, Math.round(Number(item.stars))));
      stars.textContent = "★★★★★".slice(0, count);
      stars.setAttribute("aria-label", count + " out of 5");
      var who = document.createElement("footer");
      who.textContent = String(item.name).trim();
      card.append(quote, stars, who);
      reviewCards.append(card);
    });
    if (reviews.length) reviewCards.hidden = false;
  }

  var form = document.getElementById("enquiry-form");
  if (form) form.addEventListener("submit", function (event) {
    if (form.getAttribute("action").indexOf("YOUR_FORM_ID") === -1) return;
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var data = new FormData(form);
    var trap = data.get("_gotcha") || data.get("website") || "";
    if (String(trap).trim() !== "") return;
    var lines = [
      "Name: " + data.get("name"),
      "Phone: " + data.get("phone"),
      "Email: " + data.get("email"),
      "Town: " + (data.get("town") || ""),
      "Service: " + data.get("service"),
      "",
      String(data.get("message") || "")
    ];
    var href = "mailto:info@thefireman.co.uk?subject=" +
      encodeURIComponent("Enquiry from thefireman.co.uk") +
      "&body=" + encodeURIComponent(lines.join("\n"));
    var status = document.getElementById("form-status");
    if (status) {
      status.classList.add("is-on");
      status.focus();
    }
    window.location.href = href;
  });
})();
