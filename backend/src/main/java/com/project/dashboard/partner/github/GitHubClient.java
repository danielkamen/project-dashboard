package com.project.dashboard.partner.github;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class GitHubClient {

    private final RestTemplate restTemplate;

    public GitHubClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getLastCommitDate(String repoUrl) {
        if (!isValidGitHubUrl(repoUrl)) {
            throw new IllegalArgumentException("Invalid GitHub repository URL");
        }

        // Extract owner and repo name from the repoUrl
        String[] parts = repoUrl.split("/");
        String owner = parts[parts.length - 2];
        String repo = parts[parts.length - 1];

        // GitHub API endpoint for the last commit
        String apiUrl = String.format("https://api.github.com/repos/%s/%s/commits", owner, repo);

        try {
            // Fetch the list of commits
            GitHubCommit[] commits = restTemplate.getForObject(apiUrl, GitHubCommit[].class);

            // Return the date of the last commit
            if (commits != null && commits.length > 0) {
                return commits[0].getCommit().getAuthor().getDate();
            } else {
                return null;
            }
        } catch (Exception e) {
            // Handle exceptions
            e.printStackTrace();
            return null;
        }
    }

    private boolean isValidGitHubUrl(String url) {
        return url != null && url.startsWith("https://github.com/");
    }
}

class GitHubCommit {
    private Commit commit;

    public Commit getCommit() {
        return commit;
    }

    public void setCommit(Commit commit) {
        this.commit = commit;
    }

    static class Commit {
        private Author author;

        public Author getAuthor() {
            return author;
        }

        public void setAuthor(Author author) {
            this.author = author;
        }

        static class Author {
            private String date;

            public String getDate() {
                return date;
            }

            public void setDate(String date) {
                this.date = date;
            }
        }
    }
}
