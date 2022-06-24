let issueContainerEl = document.querySelector("#issues-container");
let limitWarningEl = document.querySelector("#limit-warning");
let repoNameEl = document.querySelector("#repo-name");

let getRepoName = function() {
    // Grab repo name from URL Query String
    let queryString = document.location.search;
    let repoName = queryString.split("=")[1];

    if (repoName) {
        // Display repo name on Page
        repoNameEl.textContent = repoName;

        getRepoIssues(repoName);
    } else {
        // If no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
};

let displayWarning = function(repo) {
    // Add Text to Warning Container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    // Create Link Element
    let linkEl = document.createElement("a");
    linkEl.textContent = "GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // Append to Warning Container
    limitWarningEl.appendChild(linkEl);
};

let displayIssues = function (issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!"
        return;
    }
    for (let i = 0; i < issues.length; i++) {
        // Create a Link Element to Take Users to the Issue on GitHub
        let issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // Create span to Hold Issue Title
        let titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // Append to Container
        issueEl.appendChild(titleEl);

        // Create a Type Element
        let typeEl = document.createElement("span");

        // Check if Issue is Actually an Issue or a Pull Request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // Append to Container
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
};

let getRepoIssues = function (repo) {
    let apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        // Request was Successful
        if (response.ok) {
            response.json().then(function(data) {
                // Pass Response data to DOM Function
                displayIssues(data);

                // Check if API has Paginated Issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        } else {
            // If not successful redirect to homepage
            document.location.replace("./index.html");
        }
    });
};

getRepoName();