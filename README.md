# pocketcollege
SPCS 2017 Web Tech Project
Frontend Contributor: Siyuan(Kevin) Peng
Backend Contributor: Junchen(Alex) Zhao


Initialization Instruction:
step1:
mongod -dbpath /users/apple/NodeJSMongoDB/pocketcollege/data

step2(optional, only to access the database from the backend):
mongo

step3:
cd /Users/apple/NodeJSMongoDB/pocketcollege
npm start

step4(optional, get a temporary and unstable url accessible through Internet):
lt --port 3000

step5(optional, get a temporary but stable url accessible through LAN):
ifconfig
suppose en0:inet 172.31.51.15
visit 172.31.51.15:3000









Website Description:

1. No account:
	1.1 CollegeInfo page available:
		1.1.1 sort colleges according to the times searched
		1.1.2 Advanced search:
			1.1.2.1 case-insensitive keyword-match search
			1.1.2.2 record the colleges that has been searched
	1.2 sample timeline available
	1.3 sign up available
		1.3.1 email confirmation and password confirmation offered
		1.3.2 all the info boxes must be filled in order to submit
		1.3.3 password bcrypted(hashed) thus protected at backend
		1.3.4 users are able to set their prifile and timeline private or public
	1.4 search other users by their email; profile and timeline will only show up if set public

2. Normal users
	2.1 edit profile
		2.1.1 everything except email will be displayed and can be modified; leave password box blank if you don't want to change it
	2.2 manage timeline
		2.2.1 view all of the events
		2.2.2 add events
		2.2.3 modify/delete existing events
		2.2.4 timeline is sorted by year and month automatically

3. admin
	3.1 view all the users' accounts
	3.2 manage colleges
		3.2.1 view all of the colleges
		3.2.2 add colleges
		3.2.3 modify/delete colleges









Further Development:

1. sign up confirmation:
	1.1 real email confirmation: send email with confirmation code to the email address offered
	1.2 user cannot register with an existing username

2. BBS with search bar
	2.1 Normal users
		2.1.1 users can post with: 											  {"title":"","tags":["","",...],"content":""}
		2.1.2 users can add comment in posts
		2.1.3 users can receive notification of comments other users made on his/her post or comment, and can comment back
	2.2 No account
		2.2.1 search by tags
	2.3 admin
		all the same as normal users but can delete posts and comments

3. CollegeInfo:
	3.1 instead of official page, college icon link to detail info page in our website
	3.2 every 16 colleges on one page
	3.3 users can submit college info to admin; admin can accept or decline

4. icon on webpage tags(lapchat)

5. Contact us:
	5.1 direct to a new page with a form that can send email to admin(Josh)

6. detail page of About us & Acknowledgement & Our goal

7. admin can view more info on userslist page; if they are public, admin can be redirected to their profile and timeline page







