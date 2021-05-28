# Node-GCP-GraphQL-Boilerplate

## 1. How to Use

#### Step-1. Create new project

1. Go to [GCP console](https://console.cloud.google.com/) and create new project
2. Go to [Firebase console](https://console.firebase.google.com/u/0/) and create new project -> Select the GCP project you created at 1 (You need to enable Blaze plan to connect with GCP project)
   3, Install Cloud SDK by following the [guide](https://cloud.google.com/sdk/docs/quickstart) (skip if you already installed)
3. Open the terminal. Type command `gcloud init` to set the project you created in step 1
4. `gcloud config set project ${your-project-id}` to set project id

#### Step-2. Get keys

1. Go to [Firebase console](https://console.firebase.google.com/u/0/) again and generate service account keys by following the [instruction](https://firebase.google.com/docs/admin/setup#initialize-sdk).
2. Go to [GCP console](https://console.cloud.google.com/) and select SQL, then create a new postgreSQL instance. For testing purpose, I recommend using small machine (1 vCPU、3.75 GB) type with 10GB storage capacity. About Networking section, you need to register your [public IP address](https://www.tunnelbear.com/whats-my-ip) to make it easier to test database connection. Once you done all settings, submit and wait until the instance ready. PLEASE NOTE: I If you are not using the SQL instance, it's better to stop/delete the instance otherwise you will be charged if you are not in the free trial period.

#### Step-3. Setup the Boilerplate Project

1. Click **_Use Template_** to start or download the boilerplate from **_Download Zip_** button
2. Open the project in the editor
3. run `npm install` in the root directory of the project to install packages
4. (Optional) For VSCode user, rename "node-gcp-graphql-boilerplate" to your project name in launch.json under .vscode. Also please remove "editor.formatOnSave": true option if you are not willing to format code on save
5. Go to [knexfile.js]() and replace all postgres keys to yours. Run knex file for migration/seeding with `npm run knex:dev`
6. Add .env file in the project root directory and paste and replace {{???}} to your key

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

7. run `npm start` to start api. It will start with http://localhost:8080
8. To test graphql query, please visit http://localhost:8080/graphql. Paste the following query and execute by pressing ▷

```
query me {
  me {
    id
    name
  }
}
```

You will see "Not authenticated" error. This is because of the endpoint is not available unless bear token is included in the header. You can remove @authenticated [schema.graphql]() for now. Once you remove the directive, try it again.

#### Step-4. Build and Deploy

1. Go to [cloudbuild.yaml]() and replace {{???}} to your keys

```
_GOOGLE_PROJECT_ID: '{{project-id}}'
_CLOUD_RUN_SERVICE: '{{croud-run-ervice-id]}'
_REGION: '{{region}}'
_CLOUD_SQL_INSTANCE_NAME: '{{sql-instance-name}}'
```

2. Go to [GCP console](https://console.cloud.google.com/) and select Cloud Build. Setting -> enable Cloud RUN -> add all permissions
3. Go to root directory of the project and run`gcloud builds submit --config cloudbuild.yaml`

### Step-5. Setup VPN Network connector to connect PostgreSQL from Cloud Run

1. Go to [GCP console](https://console.cloud.google.com/) and select SQL. Select SQL instance and start editing
2. Turn on private IP. Enable Service Networking (You will prompted if you have not)
3. Select "default" VPC and check "Automatically assigned IP range" -> Submit -> private ip address assigned
4. Go to VPC Network -> Serverless VPC Access -> Create connector -> Complete the form. Set IP range is 10.8.0.0 -> Create
5. Go back to Cloud Run. Select instance and edit again
6. Select connection tab. Set VPC connector you created -> deploy
7. After complete deploy, Go to Cloud Run in the console -> Select instance -> Edit -> Environment and secret -> put the following environmental variables. Please note: {{host}} should be private ip address. Not public address.

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

### Step-6. Connect from FE

1. Please setup firebase authentication and graphql to your FE project.
2. Once you logged in, firebase return idToken.
3. Please include the token in apollo client
4. last step is trigger me query
