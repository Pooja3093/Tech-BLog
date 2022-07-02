const loginFormHandler = async function(event) {
  event.preventDefault();

  const usernameEl = document.querySelector("#username-input-login");
  const passwordEl = document.querySelector("#password-input-login");
  const response = await fetch("/api/user/login", {
    method: "post",
    body: JSON.stringify({
      username: usernameEl.value,
      password: passwordEl.value
    }),
    headers: { "Content-Type": "application/json" }
  })
  if (response.ok) {
      console.log("you're logged in.");
      document.location.replace("/"); 
    } else {
      alert(response.statusText);
    }
};

document
  .querySelector("#login-form")
  .addEventListener("submit", loginFormHandler);