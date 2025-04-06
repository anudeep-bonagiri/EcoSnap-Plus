document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
  
    // Save to localStorage
    localStorage.setItem("cleanupName", name);
    localStorage.setItem("cleanupEmail", email);
  
    window.location.href = "thankyou.html";
  });
  