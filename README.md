# GraphQL API on Google Cloud Run

## What's included

- [x] Build + Deploy to Cloud RUN with yaml file
- [x] GraphQL Configuration
- [x] Babel Configuration
- [x] Verify token using Firebase Admin
- [x] PostgreSQL client configuration
- [x] Migration + Seeding with knex
- [x] Linting, formatting, testing on pre-commit
- [x] Autocorrect/format code on save (VSCode editor config)

## How to Use

#### Step-1. Create New Project

1. Go to [GCP console](https://console.cloud.google.com/) and ***create new project***
2. Go to [Firebase console](https://console.firebase.google.com/u/0/) and ***create new project***. Select the GCP project you created at 1
3. Install Cloud SDK ([guide](https://cloud.google.com/sdk/docs/quickstart)) ※ skip if you already installed
4. Open the terminal. Type command `gcloud init` to set the project you created in step 1
5. `gcloud config set project ${your-project-id}` to set project id

#### Step-2. Get keys

1. Go to [Firebase console](https://console.firebase.google.com/u/0/) again and ***generate service account keys***: ([guide](https://firebase.google.com/docs/admin/setup#initialize-sdk)).
2. Go to [GCP console](https://console.cloud.google.com/) and select SQL. ***Create a new postgreSQL instance***. For testing purpose, small machine (1 vCPU、3.75 GB) type with 10GB storage capacity preferable. In the networking section, you can register your [public IP](https://www.tunnelbear.com/whats-my-ip) to enable database access from your network. Once you have done all settings, submit and wait until the instance ready. ***PLEASE NOTE***: Please stop/shut down your instance once you have done testing. You will be charged the database instance fee if you are not in the free trial period.

#### Step-3. Development Setup

1. Click ***Use Template*** to start or download the boilerplate from ***Download Zip*** button
2. Open the project in the editor
3. Run `npm install` in the project root directory
4. (Optional) For VSCode users, rename "node-gcp-graphql-boilerplate" to your project name in launch.json under .vscode. Also please remove "editor.formatOnSave": true option if you are not willing to format code on save
5. Go to [knexfile.js]() and ***replace postgres keys*** to yours. ***Run knex file for migration/seeding*** with `npm run knex:dev`
6. ***Add .env file*** in the project root directory and paste and ***replace {{???}} to your key***

```
# GCP
NODE_ENV=development
PORT=8080

# POSTGRES
POSTGRES_HOST={{host}}
POSTGRES_DATABASE=postgres
POSTGRES_PORT=5432
POSTGRES_USER={{user}}
POSTGRES_PASSWORD={{password}}

# FIREBASE
FIREBASE_TYPE={{type}}
FIREBASE_PROJECT_ID={{project_id}}
FIREBASE_PRIVATE_KEY_ID={{private_key_id}}
FIREBASE_CLIENT_EMAIL={{private_key}}
FIREBASE_CLIENT_ID={{client_id}}
FIREBASE_AUTH_URI={{auth_uri}}
FIREBASE_TOKEN_URI={{token_uri}}
FIREBASE_AUTH_PROVIDER_X509_CERT_URL={{auth_provider_x509_cert_url}}
FIREBASE_CLIENT_X509_CERT_URL={{client_x509_cert_url}}
```

7. Run `npm start` to start API. It will start with http://localhost:8080
8. To test the graphql query, please visit http://localhost:8080/graphql. Paste the following query and execute the query by pressing ▷

```
query demo {
  demo {
    id
    name
    email
  }
}
```

It should return demo user info.
Then you can try the next query...

```
query me {
  me {
    id
    name
    email
  }
}
```

You will see "Not authenticated" error. This is because of the endpoint is protected by directive. You will need to include token in the request header but for testing purpose, you can remove @authenticated from [schema.graphql]() for now. Once you remove the directive, it should succeed to fetch user data from database.

#### Step-4. Build and Deploy

1. Go to [cloudbuild.yaml]() and ***replace {{???}} to your keys***

```
_GOOGLE_PROJECT_ID: '{{project-id}}'
_CLOUD_RUN_SERVICE: '{{croud-run-ervice-id]}'
_REGION: '{{region}}'
_CLOUD_SQL_INSTANCE_NAME: '{{sql-instance-name}}'
```

2. Go to [GCP console](https://console.cloud.google.com/) and select ***Cloud Build***. Select ***Setting*** from menu and ***Enable Cloud RUN***. Select ***Add all permissions*** option
3. Go to the project root directory and run `gcloud builds submit --config cloudbuild.yaml`

### Step-5. Setup VPN Network connector to connect PostgreSQL from Cloud Run

1. Go to [GCP console](https://console.cloud.google.com/) and select ***SQL***. Select SQL instance and ***start editing***
2. Turn on ***private IP***. Enable ***Service Networking***
3. Select ***default*** VPC and select ***Automatically assigned IP range***. Once you submit, you will see private ip address assigned
4. Go to VPC Network. Select ***Serverless VPC Access*** from side menu. Press ***Create connector*** and complete the form. Set IP range is ***10.8.0.0***
5. Go back to ***Cloud Run***. Select instance and edit again
6. Select ***connection*** tab. Set ***VPC connector*** you created then ***deploy***
7. After deploy completed, Go to ***Cloud Run*** -> Select instance -> Edit -> Environment and secret -> ***put the following environmental variables***. Please note: ***{{host}} should be private ip address***. Not public address.

```
POSTGRES_HOST={{host}}
POSTGRES_DATABASE=postgres
POSTGRES_PORT=5432
POSTGRES_USER={{user}}
POSTGRES_PASSWORD={{password}}

# FIREBASE
FIREBASE_TYPE={{type}}
FIREBASE_PROJECT_ID={{project_id}}
FIREBASE_PRIVATE_KEY_ID={{private_key_id}}
FIREBASE_CLIENT_EMAIL={{private_key}}
FIREBASE_CLIENT_ID={{client_id}}
FIREBASE_AUTH_URI={{auth_uri}}
FIREBASE_TOKEN_URI={{token_uri}}
FIREBASE_AUTH_PROVIDER_X509_CERT_URL={{auth_provider_x509_cert_url}}
FIREBASE_CLIENT_X509_CERT_URL={{client_x509_cert_url}}
```

### Step-6. Connect API from FE

FE configuration is done in [react-firebase-boilerplate
](https://github.com/WataruMaeda/react-firebase-boilerplate/tree/feat/graphql). If you prefer to setup by yourself, please follow the bellow instruction
