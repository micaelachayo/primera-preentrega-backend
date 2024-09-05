const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('error')) {
    alert("Login failed!");
}