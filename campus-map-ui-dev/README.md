| Master Branch | Dev Branch |
| ---- | ---- |
| ![CI Checks](https://github.com/byu-oit/campus-map-ui/workflows/CI%20Checks/badge.svg?branch=master) | ![CI Checks](https://github.com/byu-oit/campus-map-ui/workflows/CI%20Checks/badge.svg?branch=dev) |
| ![CD Pipeline](https://github.com/byu-oit/campus-map-ui/workflows/CD%20Pipeline/badge.svg?branch=master) | ![CD Pipeline](https://github.com/byu-oit/campus-map-ui/workflows/CD%20Pipeline/badge.svg?branch=dev) |

# BYU Campus Map

The front end of the campus map for BYU. More information about the "back end" and where the data comes from can be 
found in the [Data Flow](#data-flow) section of this README.

## Deployment Instructions

### Initial Deployment

1. Login to the appropriate AWS account with `awslogin`.
2. Run `terraform apply` in the `terraform/ENV/setup`. Be sure to validate the SES email identity that created by 
clicking on the link in the email sent to the created address.
3. Go into the AWS Route53 console. Use the link in the 
[Frontend Template README](https://github.com/byu-oit/frontend-template-nuxt) to request the network team setup the 
DNS records for both URLs to point to AWS.
4. Wait for the network team to complete both requests.
6. Push the code to the appropriate branch for deployment.

## Development

### Site Architecture

Due to the simplicity of this project, we decided to create this project as vanilla HTML, CSS, and JavaScript. The only 
exception to that is that the JavaScript files are compiled from the TypeScript files. Additionally, the code for the 
"Send Feedback" Lambda is written in NodeJS.

#### Directory Structure

- `lambda`: Contains one file titled `sendEmail.js` which is the code for the "Send Feedback" lambda
- `public`: The code for the site that gets deposited into an S3 bucket on deployment.
   - `images`: Static image files.
   - `scripts`: Compiled JavaScript files. *Do not edit these files directly.*
   - `styles`: CSS files.
   - `typescript`: TypeScript files that get compiled to JavaScript.
   
### Compiling

To view the site, simply open `index.html` in a web browser. A couple things to note: 

- Submitting the feedback form doesn't work locally (because it calls a Lambda based on a relative URL and you won't 
have that Lambda running locally).
- If you edit the TypeScript files, be sure to run `npm run build` before loading the page to compile your changes. If 
you're going to make lots of changes to the TypeScript, you can run `npm run dev` to have the TypeScript compiler 
automatically compile the TypeScript to JavaScript on changes.
- If you need to add a new script file to the `index.html` page, add it as you normally would (putting a script tag on 
the HTML file referencing a file in the `scripts` directory). However, to create the actual script file you need to 
just create a TypeScript file with the same name as the JavaScript file you referenced in `index.html`, compile 
TypeScript, and it will be created automatically.

### Linting

This project contains a linter and it is expected that all code pass this project's linting standards before being 
merged. It is configured to lint any JavaScript and TypeScript files in the project with the exception of compiled 
JavaScript files in `public/scripts`. To run it, simply run `npm run lint`. That command is also ran automatically on 
commit. If you have a lot of linting errors you want ot fix at one time, you can run `npm run lint -- --fix` to automatically 
fix them.

## AWS Infrastructure

### Environments

This project has two environments: production and development. Infrastructure for each environment can be found in the 
`terraform/prd` and `terraform/dev` files respectively. The infrastructure created in those two environments are 
exactly the same with two exceptions:

1) They each use a different Terraform remote state.
2) They each have a different URL.

### Accounts

This project is deployed into the following accounts:

- *Development environment*: byu-oit-campusmapswayfinding-dev
- *Production environment*: byu-oit-campusmapswayfinding-prd

### Resources

The following resources are required for this project:

- ACM certificate for the URL in the `us-east-1` region
- Regional API Gateway with:
   - A deployment stage
   - An endpoint and integration fronting the Lambda that will be created (`/rest/sendEmail`)
   - A CloudWatch log group
- CloudFront distribution with:
   - An origin to the S3 bucket for the website and API Gateway for the API
   - Behaviors to distribute traffic to the S3 bucket or API Gateway depending on the URL
- Lambda and IAM policies/roles for the Lambda to send email and do logging.
- CodePipeline with Source, Build, and Deploy stages
- CodeBuild for the CodePipeline Build phases as well as a S3 bucket for its cache
- Route 53 Hosted Zone for CloudFront distribution and ACM certificate validation
- S3 bucket for the website
- S3 bucket and CloudFront distribution redirecting maps.byu.edu to map.byu.edu

Given the uniqueness of the application, all Terraform has been hand written. No modules were used.
   
## API Documentation

This API has one simple endpoint: https://{url}/rest/sendEmail. Sending a POST request to that endpoint with the 
following JSON body, will trigger the Lambda:

```json
{
    "email": "email of sender",
    "name": "name of sender",
    "location": "location of the problem",
    "reason": "reason for the feedback",
    "message": "feedback message"
}
```

If you recieve a 200 response code, then your email will have sent successfuly.

## Data Flow

Data for this map comes from the [GIS team](https://gis.byu.edu) in the HBLL. They get their data from different data 
stewards across campus (e.g. building data comes from Physical Facilities and parking data comes from the BYU Police). 
We do not need to worry about managing the data or the visual appearance of the data on the map. We only need to make 
sure the data they provide us (usually in the form of URL's) is available on the map.
