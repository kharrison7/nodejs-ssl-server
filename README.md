

AWS Project - CI CD Pipeline to AWS ECS for Docker App + CodeCommit + CodeBuild + CodeDeploy
Here's the [YouTube Video](https://youtu.be/knFabwOn1JE).

## Installation

Follow next steps in order to install nodejs app and create a dockerimage

### Step 1 - Git clone 

```
git clone [https://github.com/saasscaleup/nodejs-ssl-server.git](https://github.com/kharrison7/nodejs-ssl-server.git)
```

```
cd nodejs-ssl-server
```

```
git checkout nodejs-docker-aws-ecs
```

### Step 2 - Build and run docker container

```
docker build -t nodejs-server-demo .
```

```
docker run -dp 3000:3000 nodejs-server-demo
```
  

Repository Review: (PR)

Back End:
https://github.com/kharrison7/nodejs-ssl-server/pull/1


Impact

This work:

1: Runs through all the work needed to setup an ECS instance with a docker image manually.

2: Generates a Template yml file that can be used to deploy an EC2 Cluster with ECS instances running images from a specific ECR repo.

3: Compares the EC2/ECS setup vs Lambda setup.

Abstract:

HOW TO GET THE DOCKER IMAGE IN ECR THEN ECS:

Overview:
I. create the ECR using the following tutorial:
https://faun.pub/deploying-docker-images-to-ecs-b43058dc0456 
II. Then TAG the docker image name to match the exact name as the ECR repo URI
III. Then login in terminal with aws cli:
aws ecr get-login-password | docker login --username AWS --password-stdin 1<ECR repo uri #>.dkr.ecr.us-east-1.amazonaws.com
IV. Then push up:
docker push <amazon-user-id-from-profile>.dkr.ecr.us-east-1.amazonaws.com/<ecr-repo-name>

HOW TO GET THE DOCKER IMAGE FROM ECR INTO ECS:

Manually:

I. Create a new task definition:
https://us-east-1.console.aws.amazon.com/ecs/v2/create-task-definition?region=us-east-1
https://faun.pub/deploying-docker-images-to-ecs-b43058dc0456 
II. For Container Image URI, use the URI from the ECR Instance
III. Hit Create and the cluster should deploy in a bit (typically 1 hour, range 45 min to 2 hours on create).

Template (automated):

I. Create a new stack using the template in CloudFormation:

CloudFormation (amazon.com)

Template:

Understanding ECS:

ECS: Amazon Elastic Container Service is a fully managed container orchestration service used to deploy, manage, and scale containerized applications. For our purposes the container images are stored in ECR.

What is Amazon Elastic Container Service? - Amazon Elastic Container Service

ECR: Amazon Elastic Container Registry is an AWS managed container image registry service. This is similar to a github repository but for docker images.

What is Amazon Elastic Container Registry? - Amazon ECR

EC2: Amazon Elastic Compute Cloud is a virtual cloud space that can host instances as a set or cluster. (called EC2 because of the 2 'C’s).

What is Amazon EC2? - Amazon Elastic Compute Cloud

The key takeaway is that a dev works locally on a docker image. That image is then pushed to ECR (the image repository). From there, the image in the ECR can be used as the application in an ECS instance (a fully running version of that image in the cloud). The ECR instance can be hosted in a EC2 cluster for scalability (to run multiple instances in parallel, updates, etc).

Docker Setup:

1: To get working with docker, run the docker application and use the following commands as needed, to build, tag, and push to the ECR.

docker build -t <app-name> .

docker tag <app-name> <amazon-user-id-from-profile>.dkr.ecr.us-east-1.amazonaws.com/<ecr-repo-name> // ← the user account number is accessible in the top right menu

docker push <amazon-user-id-from-profile>.dkr.ecr.us-east-1.amazonaws.com/<ecr-repo-name>

2: Additional helpful docker commands include:

docker run -d -p 3000:3000 <amazon-user-id-from-profile>.dkr.ecr.us-east-1.amazonaws.com/<ecr-repo-name>

docker images

docker ps -a // ← docker process status, identical to docker container ls

3: Once the docker image is pushed up from step one, the ECR repository should show the updated docker image.

4: To run the container locally, build the docker file and run: (note the host/name/repo can be changed)

docker run -d -p 3000:3000 <amazon-user-id-from-profile>.dkr.ecr.us-east-1.amazonaws.com/<ecr-repo-name>:latest

Running locally and hitting the local endpoint



VPC Inbound rule security setup - not mentioned in the demos online → This is an important step for TROUBLESHOOTING! If everything else is green check the VPC settings

II. Template Setup

1: To create a new Cluster: Go to CloudFormation:

CloudFormation (amazon.com)

 a: create stack

 b: upload template

Base Template: (YAML file): v8 - current version

Base Template (Original Version):

**Note: for the example template search for -v and then update to a new number if deploying a cluster where an existing cluster exists (ex. -v8 to -v9). This prevents issues with name spaces.

c: continue hitting ‘next’ until the cloud formation:

Creating a new cluster based on the ECR repo

CloudFormation Composer Overview based on the Template

2: To edit the Cluster: Go to CloudFormation:
https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks?filteringText=&filteringStatus=active&viewNested=true

 a: select stack action
 b: create changes set for current stack
 c: replace existing template
 d: upload template
 e: upload ecs-2.yml file (or desired template)
 f: Hit next (can change params as needed)
 g: Hit next

3: This Implements a change set, CloudFormation computes what changes will be made:

Execute Change Set and defaults to deploy in region you are in unless otherwise specified

At this point the endpoint should be accessible.

Template Cluster Setup using existing ECR Repository

Deployed cluster with endpoint generated from the template

To see the output go to: (see above screencapture)
1: ECS
2: Cluster
3: <Cluster Name Link>
4: Services
5: 'View Load Balancer' button
6: Select link below DNS name and paste in URL (be sure to use HTTP not HTTPS for the demo).

To see changes to your ECS instances (use the commands from the Docker Setup):

1: Commit the changes to your branch (normal git commands)

2: The following commands are needed, to build, tag, and push to the ECR.

docker build -t <app-name> .

docker tag <app-name> <amazon-user-id-from-profile>.dkr.ecr.us-east-1.amazonaws.com/<ecr-repo-name> // ← the user account number is accessible in the top right menu

docker push <amazon-user-id-from-profile>.dkr.ecr.us-east-1.amazonaws.com/<ecr-repo-name>

3: Wait and… that is it. (Deployment took around 10-15 minutes)


---

Note: Pricing

More details below, but in general ECS/EC2 is more expensive the Lambda functions. 

Price Optimization: Cost Management Console (amazon.com)

EC2 Pricing: https://docs.aws.amazon.com/whitepapers/latest/how-aws-pricing-works/amazon-ec2.html  


Note: EC2 Key Links:

EC2 Intro Docs:
https://docs.aws.amazon.com/ec2/latest/devguide/ec2-api-intro.html 

Instance types
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html 

EC2 Pricing:
https://docs.aws.amazon.com/whitepapers/latest/how-aws-pricing-works/amazon-ec2.html 

VPC:
Amazon Virtual Private Cloud (Amazon VPC) is a service that allows you to define a logically isolated virtual network within the AWS cloud1234. With VPC, you can create your own network space and control how your network and Amazon EC2 resources are exposed to the Internet.


Key Links:

AMZN LINKS:
EC2 Instances:
https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#Instances:instanceState=running
Amazon Elastic Container Service (with Task Definitions):
https://us-east-1.console.aws.amazon.com/ecs/v2/clusters/nodejs-server-demo-cluster-setup/infrastructure?region=us-east-1
Amazon Elastic Container Registry:
https://us-east-1.console.aws.amazon.com/ecr/private-registry/repositories?region=us-east-1

ECS Repos:
https://us-east-1.console.aws.amazon.com/ecr/private-registry/repositories?region=us-east-1

ECS Clusters:
https://us-east-1.console.aws.amazon.com/ecs/v2/clusters?region=us-east-1

EC2 Instances:
https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#Instances:instanceState=running

VPC Security Groups:
https://us-east-1.console.aws.amazon.com/vpcconsole/home?region=us-east-1#SecurityGroups:

IAM Dashboard: (for setting up the ecsTaskExecutionRole in Roles)
https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/home

AWS Guide:
https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-container-image.html 

ECS Memory Provisioning Fix:
https://stackoverflow.com/questions/63032953/aws-ecs-deployment-insufficient-memory 

--

Tutorials:

ECS Tutorial (Basic):

Gentle Introduction to How AWS ECS Works with Example Tutorial | by Tung Nguyen | BoltOps | Medium


Docker to Localhost (Tutorial):



https://github.com/saasscaleup/nodejs-ssl-server/tree/nodejs-docker-aws-ecs 

Node JS Docker to Localhost:


Key Commands from the tutorials:

npm install -g ts-node@latest

npm install -g ts-node@latest
npm i --save-dev ts-node-dev@latest
npm install cors

npm run dev
curl localhost:3000
{"message":"<message here"}

to run with docker:
docker compose up
[+] Building 53.9s (10/10) FINISHED
express-typescript-docker  | Connected successfully on port 3000

turn on docker
docker build -t nodejs-server-demo .
docker run -dp 3000:3000 nodejs-server-demo 



to build the value return with cors from src index.ts
docker build . -t express-typescript-docker
docker run -p 3000:3000 -d express-typescript-docker:latest

Screenshots (see above)

---

---

# nodejs-docker-aws-ecs

AWS Project - CI CD Pipeline to AWS ECS for Docker App + CodeCommit + CodeBuild + CodeDeploy
Here's the [YouTube Video](https://youtu.be/knFabwOn1JE).

## Installation

Follow next steps in order to install nodejs app and create a dockerimage

### Step 1 - Git clone 

```
git clone https://github.com/saasscaleup/nodejs-ssl-server.git
```

```
cd nodejs-ssl-server
```

```
git checkout nodejs-docker-aws-ecs
```

### Step 2 - Build and run docker container

```
docker build -t nodejs-server-demo .
```

```
docker run -dp 3000:3000 nodejs-server-demo
```
 

Thanks for your support :)

<a href="https://www.buymeacoffee.com/scaleupsaas"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=scaleupsaas&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>

