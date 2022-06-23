let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#username");
let repoContainerEl = document.querySelector("#repos-container");
let repoSearchTerm = document.querySelector("#repo-search-term");

let displayRepos = function (repos, searchTerm) {
    // Check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    console.log(repos);
    console.log(searchTerm);

    // Clear Old Content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // Loop Over Repos
    for (let i = 0; i < repos.length; i++) {
        // Format Repo Name
        let repoName = repos[i].owner.login + "/" + repos[i].name;

        // Create a Container for each repo
        let repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // Create a span Element to Hold Repository Name
        let titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // Append to Container
        repoEl.appendChild(titleEl);

        // Create a Status Element
        let statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // Check if Current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + "issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // Append Container to the DOM
        repoContainerEl.appendChild(repoEl);
    }
};

let getUserRepos = function (user) {
    // Format the GitHub API URL
    let apiUrl = "https://api.github.com/users/" + user + "/repos";
    
    // Make a Request to the URL
    fetch(apiUrl)
        .then(function(response) {
            // Request Was Successful
            if (response.ok) {
                response.json().then(function(data) {
                    displayRepos(data, user);
                });
            } else {
                alert("Error: GitHub User Not Found");
            }
        })
        .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to GitHub");
        });
    };

let formSubmitHandler = function(event) {
    event.preventDefault();
    // Get Value from Input Element
    let username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username.");
    }
};

getUserRepos("AlexStandfield");

userFormEl.addEventListener("submit", formSubmitHandler);