document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS animations
  AOS.init({
    once: false,
    mirror: true,
    duration: 1000,
    offset: 50,
  })

  // Preloader
  const preloader = document.querySelector(".preloader")
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("hidden")
      // Start reveal text animations after preloader is hidden
      document.querySelectorAll(".reveal-text").forEach((text, index) => {
        text.style.animationDelay = `${index * 0.2}s`
      })
    }, 500)
  })

  // Custom cursor
  const cursorDot = document.querySelector(".cursor-dot")
  const cursorOutline = document.querySelector(".cursor-dot-outline")

  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      const posX = e.clientX
      const posY = e.clientY

      cursorDot.style.transform = `translate3d(${posX}px, ${posY}px, 0)`
      cursorOutline.style.transform = `translate3d(${posX}px, ${posY}px, 0)`
    })

    // Cursor hover effect
    const cursorTargets = document.querySelectorAll("a, button, .btn, .service-card, .portfolio-item, .social-link")

    cursorTargets.forEach((target) => {
      target.addEventListener("mouseenter", () => {
        cursorDot.style.transform += " scale(0.5)"
        cursorOutline.style.transform += " scale(1.5)"
      })

      target.addEventListener("mouseleave", () => {
        cursorDot.style.transform = cursorDot.style.transform.replace(" scale(0.5)", "")
        cursorOutline.style.transform = cursorOutline.style.transform.replace(" scale(1.5)", "")
      })
    })
  } else {
    // Hide custom cursor on touch devices
    cursorDot.style.display = "none"
    cursorOutline.style.display = "none"
  }

  // Set current year in footer
  document.getElementById("currentYear").textContent = new Date().getFullYear()

  // Header scroll effect
  const header = document.querySelector(".header")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle")
  const closeMenu = document.querySelector(".close-menu")
  const mobileMenu = document.querySelector(".mobile-menu")

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.add("active")
    document.body.style.overflow = "hidden"
  })

  closeMenu.addEventListener("click", () => {
    mobileMenu.classList.remove("active")
    document.body.style.overflow = ""
  })

  // Theme toggle
  const themeToggles = document.querySelectorAll(".theme-toggle")
  const htmlElement = document.documentElement

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark" || (savedTheme === null && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    htmlElement.classList.add("dark")
  }

  themeToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      htmlElement.classList.toggle("dark")

      const isDark = htmlElement.classList.contains("dark")
      localStorage.setItem("theme", isDark ? "dark" : "light")
    })
  })

  // Smooth scrolling for navigation
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const sectionId = this.getAttribute("data-section")
      const section = document.getElementById(sectionId)

      if (section) {
        // Close mobile menu if open
        mobileMenu.classList.remove("active")
        document.body.style.overflow = ""

        // Update active link
        navLinks.forEach((l) => l.classList.remove("active"))
        document.querySelectorAll(`[data-section="${sectionId}"]`).forEach((l) => l.classList.add("active"))

        // Scroll to section
        const headerHeight = document.querySelector(".header").offsetHeight
        const sectionTop = section.offsetTop - headerHeight

        window.scrollTo({
          top: sectionTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Testimonial slider
  const testimonialDots = document.querySelectorAll(".testimonial-dots .dot")
  const testimonialSlides = document.querySelectorAll(".testimonial-slide")
  const testimonialTrack = document.querySelector(".testimonial-track")
  const prevTestimonial = document.querySelector(".prev-testimonial")
  const nextTestimonial = document.querySelector(".next-testimonial")
  let currentTestimonial = 0

  function updateTestimonial(index) {
    // Update active dot
    testimonialDots.forEach((d) => d.classList.remove("active"))
    testimonialDots[index].classList.add("active")

    // Update active slide
    testimonialSlides.forEach((slide) => slide.classList.remove("active"))
    testimonialSlides[index].classList.add("active")
  }

  testimonialDots.forEach((dot) => {
    dot.addEventListener("click", function () {
      const index = Number.parseInt(this.getAttribute("data-index"))
      currentTestimonial = index
      updateTestimonial(index)
    })
  })

  // Previous and next buttons
  prevTestimonial.addEventListener("click", () => {
    currentTestimonial = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length
    updateTestimonial(currentTestimonial)
  })

  nextTestimonial.addEventListener("click", () => {
    currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length
    updateTestimonial(currentTestimonial)
  })

  // Auto-advance testimonials
  let testimonialInterval = setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length
    updateTestimonial(currentTestimonial)
  }, 5000)

  // Pause auto-advance on hover
  const testimonialSlider = document.querySelector(".testimonials-slider")
  testimonialSlider.addEventListener("mouseenter", () => {
    clearInterval(testimonialInterval)
  })

  // Resume auto-advance on mouse leave
  testimonialSlider.addEventListener("mouseleave", () => {
    clearInterval(testimonialInterval)
    testimonialInterval = setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length
      updateTestimonial(currentTestimonial)
    }, 5000)
  })

  // Contact form validation and submission
  const contactForm = document.getElementById("contactForm")
  const formSuccess = document.getElementById("formSuccess")
  const submitButton = document.getElementById("submitButton")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Reset error messages
      document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""))

      // Get form values
      const firstName = document.getElementById("firstName").value.trim()
      const lastName = document.getElementById("lastName").value.trim()
      const email = document.getElementById("email").value.trim()
      const message = document.getElementById("message").value.trim()

      // Validate form
      let isValid = true

      if (!firstName) {
        document.getElementById("firstNameError").textContent = "First name is required"
        isValid = false
      }

      if (!lastName) {
        document.getElementById("lastNameError").textContent = "Last name is required"
        isValid = false
      }

      if (!email) {
        document.getElementById("emailError").textContent = "Email is required"
        isValid = false
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        document.getElementById("emailError").textContent = "Email is invalid"
        isValid = false
      }

      if (!message) {
        document.getElementById("messageError").textContent = "Message is required"
        isValid = false
      }

      if (isValid) {
        // Show loading state
        submitButton.disabled = true
        submitButton.querySelector(".btn-text").style.display = "none"
        submitButton.querySelector(".btn-loading").style.display = "flex"

        // Simulate form submission
        setTimeout(() => {
          // Hide form, show success message
          contactForm.style.display = "none"
          formSuccess.style.display = "flex"

          // Reset form
          contactForm.reset()

          // Reset button state
          submitButton.disabled = false
          submitButton.querySelector(".btn-text").style.display = "block"
          submitButton.querySelector(".btn-loading").style.display = "none"

          // Hide success message after 5 seconds
          setTimeout(() => {
            formSuccess.style.display = "none"
            contactForm.style.display = "block"
          }, 5000)
        }, 1500)
      }
    })
  }

  // Scroll spy for active navigation
  function updateActiveSection() {
    const scrollPosition = window.scrollY + 100

    // Find all sections
    const sections = document.querySelectorAll("section[id]")

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Update active nav link
        navLinks.forEach((link) => link.classList.remove("active"))
        document.querySelectorAll(`[data-section="${sectionId}"]`).forEach((link) => link.classList.add("active"))
      }
    })
  }

  window.addEventListener("scroll", updateActiveSection)

  // Animated counters
  const counters = document.querySelectorAll(".counter")
  let counterObserver

  if ("IntersectionObserver" in window) {
    counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target
            const target = Number.parseInt(counter.getAttribute("data-target"))
            let count = 0
            const updateCounter = () => {
              const increment = target / 100
              if (count < target) {
                count += increment
                counter.textContent = Math.ceil(count)
                setTimeout(updateCounter, 20)
              } else {
                counter.textContent = target
              }
            }
            updateCounter()
            observer.unobserve(counter)
          }
        })
      },
      { threshold: 0.5 },
    )

    counters.forEach((counter) => {
      counterObserver.observe(counter)
    })
  }

  // Parallax effect on scroll
  const parallaxElements = document.querySelectorAll(".hero-image, .about-image")

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY

    parallaxElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top + scrollY
      const elementHeight = element.offsetHeight
      const viewportHeight = window.innerHeight

      if (scrollY + viewportHeight > elementTop && scrollY < elementTop + elementHeight) {
        const distance = (scrollY + viewportHeight - elementTop) * 0.1
        element.style.transform = `translateY(${distance}px)`
      }
    })
  })

  // Initial call to set active section
  updateActiveSection()
})

// Add a simple rate limiter (one submission per 30 seconds)
let lastSubmissionTime = 0;
const SUBMISSION_DELAY = 30000; // 30 seconds in milliseconds

function sendEmail() {
  // Check rate limit first
  const currentTime = Date.now();
  if (currentTime - lastSubmissionTime < SUBMISSION_DELAY) {
    alert("Please wait 30 seconds before sending another message.");
    return;
  }

  // Get form values
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const company = document.getElementById("company").value.trim();
  const message = document.getElementById("message").value.trim();

  // Validate all fields are filled
  if (!firstName || !lastName || !email || !company || !message) {
    alert("Please fill in all required fields.");
    return;
  }

  // Email format validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Additional spam prevention: check for suspicious content
  const suspiciousPatterns = [
    /http[s]?:\/\//i,        // Links
    /<[^>]+>/i,             // HTML tags
    /(viagra|cialis|porn)/i // Common spam keywords
  ];
  
  const allContent = `${firstName} ${lastName} ${company} ${message}`;
  if (suspiciousPatterns.some(pattern => pattern.test(allContent))) {
    alert("Your message contains suspicious content and cannot be sent.");
    return;
  }

  // Prepare email parameters
  const templateParams = {
    name: `${firstName} ${lastName}`,
    email: email,
    company: company,
    message: message
  };

  // Send email
  emailjs.send("service_8y4xrei", "template_lcmfixx", templateParams, "0AV5JViJGlh1s0AJT")
    .then(response => {
      console.log("Email sent!", response);
      lastSubmissionTime = Date.now(); // Update last submission time
      alert("Email sent successfully!");
      // Clear form
      document.getElementById("firstName").value = "";
      document.getElementById("lastName").value = "";
      document.getElementById("email").value = "";
      document.getElementById("company").value = "";
      document.getElementById("message").value = "";
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Failed to send email. Please try again later.");
    });
}
