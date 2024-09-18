

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

5: From here, either the manual or template setup can be used to deploy the image to an endpoint:

(If you are reading this, I suggest skipping to the Template setup. The Manual setup is included for reference as it describes the steps needed for the template setup).

**Note: amazon-user-id-from-profile is found here as Account ID:

I. Manual Setup: 

How to setup ECS Instance to use and run ECR Repo of Docker Image:

Go to EC2 Instances: (this is region specific, check dropdown if an instance is missing)
https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#Instances:

Click 'Launch Instance'

Enter a name, assign/generate key pair, select 'Allow HTTP'

Go to Advanced Details: User Data -> enter bin/bash code for docker:

#!/bin/bash

sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker

https://aws.plainenglish.io/deploy-docker-image-to-aws-ec2-in-5-minutes-4cd7518feacc  (Alternative method for troubleshooting image issues)
5. Launch Instance
6. Go to Instances, select Instance Check box, Select Security, Click link under security group
7. Inbound rules > Edit Inbound Rules
8. Add Rule > Custom TCP. 3000. Anywhere (do this twice for ip4 and ip6), then Save Rules
9. Back to Instances > Connect > Connect (Click the connection link then button)
10. In the black console with the bird, put in the commands to install, pull, and run the image from ECR.

Cloud Console - Commands in the black connect Amazon Linux console from batch:
https://github.com/NBBI-JRS/jrs-devops/blob/master/ecr/batch-common/base_image_bootstrap.sh

1: Input the commands:

**Sets the user to root:

sudo su

**Installs yum and docker:

yum install -y yum-utils

yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

yum install docker --disablerepo=docker-ce-stable -y

systemctl start docker

**AWS login for ECR Access:

aws ecr get-login-password | docker login --username AWS --password-stdin <amazon-user-id-from-profile>.dkr.ecr.us-east-1.amazonaws.com

aws configure



**Note: Generating AWS IAM Keys:

To generate AWS IAM > User > <user>
Go to Security credentials > Access Keys
https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/users/details/nodejs-user?section=security_credentials

docker pull <amazon-user-id-from-profile>.dkr.ecr.us-east-1.amazonaws.com/<ecr-repo-name>

2: Then run the docker file:
docker --version
docker run -d -p 3000:3000 <amazon-user-id-from-profile>.dkr.ecr.us-east-1.amazonaws.com/<ecr-repo-name>

Manual Setup working to generate the instance

3: Then go to the Instances, select the instance and use the URL to hit the endpoint
Note:  for the demo, http must be used ex. http://18.204.196.252:3000

4: This working instance can be assigned to a cluster via a task and setup to run via a service in the cluster:
https://us-east-1.console.aws.amazon.com/ecs/v2/clusters?region=us-east-1

**Note: setup also includes RSA key generation for ssh, Security Inbound Routing setup, VPC setup, AWS configuration setup (These are often overlooked in online demos).

Fully deployed clusters, with and without services

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

In this example I edit the base endpoint and add the /items endpoint

Note: [JRS-10050] ECS-based API research - JRS Jira (atlassian.net) <Mention Template Specifics per Architecture) <------------------!

Note: Pricing

More details below, but in general ECS/EC2 is more expensive the Lambda functions. 

Price Optimization: Cost Management Console (amazon.com)

EC2 Pricing: https://docs.aws.amazon.com/whitepapers/latest/how-aws-pricing-works/amazon-ec2.html  

Note: Set up for mongo database access via EC2 is the same as what we currently user for Lambdas on JRS-Inspect. The database exists in its own container and is accessible for read/write via a peer setup.

Per Marc, “The setup can be the same if the ECS cluster is going to be deployed into an existing network, it will share the peering connection with the API so no new setup will be needed. Otherwise, if we put it in a new network (not sure if that would be needed) then we would create a new peering connection and manual setup.”

Set Up a Network Peering Connection - MongoDB Atlas

Install MongoDB on AWS EC2 Instance - Complete 10-step guide. | by Ayoub | Medium

Note: Concerning User Pools → the template sets up the ECSTaskExecutionRole with permissions to create the user pool. However, there are some considerations: If we need to spin this down, the user pool will BE DELETED as well. This can be mitigated with backups and copies.

Note: EC2 Key Links:

EC2 Intro Docs:
https://docs.aws.amazon.com/ec2/latest/devguide/ec2-api-intro.html 

Instance types
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html 

EC2 Pricing:
https://docs.aws.amazon.com/whitepapers/latest/how-aws-pricing-works/amazon-ec2.html 

VPC:
Amazon Virtual Private Cloud (Amazon VPC) is a service that allows you to define a logically isolated virtual network within the AWS cloud1234. With VPC, you can create your own network space and control how your network and Amazon EC2 resources are exposed to the Internet.

The ECR Registry contains the Repos:
https://us-east-1.console.aws.amazon.com/ecr/private-registry/repositories?region=us-east-1
The EC2 container instance is the container
https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#Instances:v=3;$case=tags:true\,client:false;$regex=tags:false\,client:false
The instance needs to be registered to the EC2 cluster to run
https://us-east-1.console.aws.amazon.com/ecs/v2/clusters?region=us-east-1





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

Nodejs-server584 in nodejs-server-demo-9-11-2024-v1 cluster
https://us-east-1.console.aws.amazon.com/ecs/v2/clusters/nodejs-server-demo-9-11-2024-v1/services/nodejs-server584/health?region=us-east-1
CloudWatch:
https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/events?stackId=arn%3Aaws%3Acloudformation%3Aus-east-1%3A145023109387%3Astack%2FECS-Console-V2-Service-nodejs-server584-nodejs-server-demo-9-11-2024-v1-109538b2%2Ff1dd3740-7061-11ef-9041-0afff6a7f7eb&viewNested=true&filteringStatus=active

Pricing ECS vs Lambda: 

Amazon EC2 Clusters with ECS (Elastic Container Service):

When running ECS on EC2, you are essentially managing EC2 instances to host your containers. Costs include:

1: EC2 Instance Costs:

EC2 instances are billed by the hour or second (depending on the pricing model).

The cost depends on the instance type, region, and whether you are using On-Demand, Reserved Instances, or Spot Instances.

You also pay for the storage attached to the EC2 instances (like EBS volumes).

For highly available setups, you may also have costs for Load Balancers (e.g., ALB or ELB) to distribute traffic across ECS tasks.

ECS Cluster Management Costs:

ECS itself doesn’t incur additional charges; it is a free service when used with EC2.

You pay for the underlying EC2 instances and any associated services (e.g., networking and storage).

Data Transfer:

You also pay for data transfer costs between regions, Availability Zones, and the internet.

Example Pricing:

A t3.medium EC2 instance in us-east-1 is approximately $0.0416/hour.

If running 3 instances 24/7 for a month, this results in approximately $90/month for EC2 alone (without considering load balancers or additional costs).

Adding storage (e.g., EBS), networking, and Load Balancers can easily push the monthly cost for a basic setup to $150-$200/month.

AWS Lambda Functions:

Lambda is serverless, and you are charged based on the number of requests and the duration your code runs, with pricing based on memory allocated.

Invocation Costs:

$0.20 per 1 million requests.

$0.00001667 per GB-second of compute time (billed in milliseconds).

Memory Allocation:

The cost of Lambda is directly tied to the memory you allocate to the function and the time it takes to execute. You can allocate between 128 MB and 10 GB of memory.

Example Pricing:

A Lambda function with 512 MB of memory running 100,000 invocations per month, each taking 500 ms, costs about $0.30 for compute and $0.02 for requests, for a total of around $0.32/month.

For higher invocations and longer runtimes, costs increase, but the pricing model remains pay-per-use.

In General, ECS costs more:

EC2-based ECS clusters tend to be more expensive, especially when running 24/7. You pay for the EC2 instances, storage, networking, and any other associated resources regardless of whether they're fully utilized or idle.

Lambda functions are often much cheaper for low-to-moderate workloads since you only pay for what you use. Lambda is highly cost-effective when the workload has irregular traffic or low utilization.

However, Lambda costs can increase with high-frequency invocations, long-running tasks, or large memory requirements. For constant high-demand workloads, EC2-based ECS can sometimes be more cost-efficient.

Cost Optimization Strategies

For EC2 Clusters with ECS:

Use Spot Instances:

Spot Instances are significantly cheaper than On-Demand (up to 90% discount), but they come with the risk of interruptions. You can use them for non-critical, fault-tolerant workloads.

Use Reserved Instances or Savings Plans:

If you have predictable, steady-state usage, purchasing Reserved Instances or Savings Plans can reduce EC2 costs by up to 75%.

Right-sizing EC2 Instances:

Analyze your EC2 instances to ensure they match the workload requirements. Downsizing or switching to more efficient instance types (e.g., burstable instances like t3) can cut costs.

Use Auto Scaling:

Enable ECS Service Auto Scaling to dynamically adjust the number of running instances based on CPU, memory, or custom CloudWatch metrics.

This ensures you're not over-provisioning resources during low traffic periods.

Optimize Load Balancer Use:

Load balancers incur charges, so limit the number of load balancers used in your ECS setup.

Make sure your load balancers are not over-provisioned for the amount of traffic they receive.

Our Lambda setup for Inspect: (may be more expensive than the average Lambda setup)

Our Inspect setup is using a degree of 'Provisioned Concurrency. 

For the average user, you pay around 10$/month (for a 1GB Lambda) per instance that you want to keep 'warm'. amazon web services - Is it possible to keep an AWS Lambda function warm? - Stack Overflow

That said we are using the on a service basis (one per service, equipment, location, etc).

New – Provisioned Concurrency for Lambda Functions | AWS News Blog (amazon.com)

Pricing Summary:

EC2 + ECS tends to be more expensive due to continuous EC2 instance costs, even if not fully utilized.

Lambda is typically more cost-effective for low-to-medium traffic workloads with varying usage patterns, but costs can increase with high invocation frequency and longer execution times.

Optimize EC2 + ECS by using Spot Instances, auto-scaling, and right-sizing your EC2 instances.

Optimize Lambda by tuning memory allocation, reducing execution time, and monitoring usage patterns.

Troubleshooting:

Be sure to check the VPC, Policy, and AWI setup.

Amazon Q errors and analysis:

GPU Overuse: (reduce memory in task definition)
https://repost.aws/knowledge-center/ecs-container-instance-requirement-error 

Solution for: unable to place a task because no container instance met all of its requirements. The closest matching container-instance c48416e2f1e64ccf85f15be3909dd3d2 has insufficient GPU resource available. For more information, see the Troubleshooting section of the Amazon ECS Developer Guide.

Troubleshooting the load balancer: 

Troubleshoot service auto scaling issues in Amazon ECS | AWS re:Post (repost.aws)



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
  
## Support 🙏😃
  
 If you Like the tutorial and you want to support my channel so I will keep releasing amazing content that will turn you to a desirable Developer with Amazing Cloud skills... I will realy appricite if you:
 
 1. Subscribe to My youtube channel and leave a comment: http://www.youtube.com/@ScaleUpSaaS?sub_confirmation=1
 2. Buy me A coffee ❤️ : https://www.buymeacoffee.com/scaleupsaas

Thanks for your support :)

<a href="https://www.buymeacoffee.com/scaleupsaas"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=scaleupsaas&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>

