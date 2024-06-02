Setup:
I made new spring boot project with spring intialzer
used maven, java 21

Dependencies:
spring web
spring data jpa
SQLLite (added via pom.xml with org.xerial:sqlite-jdbc)
Spring Security (for user auth)
Lombok (annotations and less boilerplate code)



# Startup Instructions
Download maven here: https://maven.apache.org/download.cgi (version: Apache Maven 3.9.6)
Make sure its downloaded and installed properlly by running ```mvn --version``` from any terminal
If its not a recognized command, it might need to be added to your system's enviroment variables (https://stackoverflow.com/questions/19090928/mvn-command-is-not-recognized-as-an-internal-or-external-command)

Next, download java 21:
https://course.ccs.neu.edu/cs3500/labs_ide_setup_lab.html



## Setting Up and Starting up the backend
First, make a new project in intelij using file->open->\backend\
Then in any terminal, navigate to the /backend/ folder and from there, run these two commands:
```mvn clean install```
```mvn spring-boot:run```
The spring boot server should produce a final message in the log like this: [XXX...XXX Started DashboardApplication in 2.545 seconds (process running for 2.737)]
Its available at: http://localhost:8080

## Setting Up and Starting up the backedn
From inside \frontend\ run:
```npm install```
```npm run dev```
Its available at: http://localhost:5173

## Accessing the dashboard
Upon making an account, please put password123 for the edit password. I put this here to act as the organization key so that if this site was hosted online, only those who are told the key (at club meetings for example) can join.

# Application Overview
I really wanted experiment with this project by adding account storage/authentification in the backend. 

The project utilzies a database to store partner info and user account info. This let me add support for creating/signing in with unique accounts. This was done to prevent random people from accessing the site and also to add a list of who is working on it. I added a private key feild which is intended to only be shared with members at club meetings or slack/discord/group chats etc. This would help ensure that anyone adding, updating, or deleting partner information was truly apart of the club, and not someone who just made an account who wanted to mess with the information. Additionally, I wanted to add some complexity to the overall system design. I did this by including a line in the partner tile which displays the last time the project's github repo was updated. More on this below. Lastly, I made sure that any information entered by other users would be synced across all pages by calling the back end every 15 seconds with updated information.


# Design decisions
I used the github api's to do this intially having the front end call the api directly. This wasn't a good idea since multiple tabs calling the github api for multiple projects would easily max out the 5000 call limit. To fix this, I called and cached the api data from the backend to centralize the calls where the partner info was updated. The front end would request this newly updated information at least every 15 seconds, with the ability to manully sync the dashboard to the back end. This meant that even with a million tabs open, the github api calls would never get overused, since theres only one source calling that api. 



# Project Post-Mortem
I learned a lot from this project, espcailly with 

