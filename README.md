# Startup Instructions

Download maven here: https://maven.apache.org/download.cgi (version: Apache Maven 3.9.6)
Make sure its downloaded and installed properly by running `mvn --version` from any terminal
If its not a recognized command, it might need to be added to your system's environment variables (https://stackoverflow.com/questions/19090928/mvn-command-is-not-recognized-as-an-internal-or-external-command)

Next, download java 21:
https://course.ccs.neu.edu/cs3500/labs_ide_setup_lab.html

## Setting Up and Starting up the backend

First, make a new project in intelij using file->open->\backend\
Then in any terminal, navigate to the /backend/ folder and from there, run these two commands:
`mvn clean install`
`mvn spring-boot:run`
The spring boot server should produce a final message in the log like this: [XXX...XXX Started DashboardApplication in 2.545 seconds (process running for 2.737)]
Its available at: http://localhost:8080

## Setting Up and Starting up the backedn

From inside \frontend\ run:
`npm install`
`npm run dev`
Its available at: http://localhost:5173

## Accessing the dashboard

Upon making an account, please put password123 for the edit password. I put this here to act as the organization key so that if this site was hosted online, only those who are told the key (at club meetings for example) can join.

# Application Overview

I really wanted experiment with this project by adding account storage/authentication in the backend.

The project utilizes a database to store partner info and user account info. This let me add support for creating/signing in with unique accounts. This was done to prevent random people from accessing the site and also to add a list of who is working on it. I added a private key field which is intended to only be shared with members at club meetings or slack/discord/group chats etc. This would help ensure that anyone adding, updating, or deleting partner information was truly apart of the club, and not someone who just made an account who wanted to mess with the information. Additionally, I wanted to add some complexity to the overall system design. I did this by including a line in the partner tile which displays the last time the project's github repo was updated. More on this below. Lastly, I made sure that any information entered by other users would be synced across all pages by calling the back end every 15 seconds with updated information.

# Design decisions

I used the github api's to do this initially having the front end call the api directly. This wasn't a good idea since multiple tabs calling the github api for multiple projects would easily max out the 5000 call limit. To fix this, I called and cached the api data from the backend to centralize the calls where the partner info was updated. The front end would request this newly updated information at least every 15 seconds, with the ability to manfully sync the dashboard to the back end. This meant that even with a million tabs open, the github api calls would never get overused, since theres only one source calling that api.

# Project Post-Mortem

I learned a lot from this project, especially when it came to user authentication across sign up/ login/ and passing credentials to API calls. 

Issues:
I think my java and back end skills are more developed compared to my typescript react and front end skills. This lead to an asymmetric amount of time spent on the front end relative to the features I was implementing. If I had to start over based on what I knew now, I would spend more time thinking about what possible additional features I could add for the back end. At first I didn't think I would support sign up/ log in, and that added a ton of complexity to the existing set up in both the back end and front end. A specific issue that I ran into was trying to have the users working on each project be displayed in a specific way(user@email.com (username)) without changing the way data was stored. I had access to the email and user name, but I wanted the front end to call a singular API which sent that info exactly like the format previously described without having access to the individual fields or by manipulating the way the information was stored in the database. This lead to me creating custom map functions to apply over each user associated with each project, which spat out the correct string when called by the API. I added sign up/ log in support because I wanted this project to not just demonstrate what I knew, but apply something I've never learned before. I know theres more room to improve my current implementation and its definitely not going to stop a bad actor from messing with the website. 

