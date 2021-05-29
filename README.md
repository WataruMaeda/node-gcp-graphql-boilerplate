# Node-GCP-GraphQL-Boilerplate

## 1. How to Use

#### Step-1. Create New Project

1. Go to [GCP console](https://console.cloud.google.com/) and **_create new project_**
2. Go to [Firebase console](https://console.firebase.google.com/u/0/) and **_create new project_**. Select the GCP project you created at 1
3. Install Cloud SDK ([guide](https://cloud.google.com/sdk/docs/quickstart)) ※ skip if you already installed
4. Open the terminal. Type command `gcloud init` to set the project you created in step 1
5. `gcloud config set project ${your-project-id}` to set project id

#### Step-2. Get keys

1. Go to [Firebase console](https://console.firebase.google.com/u/0/) again and **_generate service account keys_**: ([guide](https://firebase.google.com/docs/admin/setup#initialize-sdk)).
2. Go to [GCP console](https://console.cloud.google.com/) and select SQL. **_Create a new postgreSQL instance_**. For testing purpose, small machine (1 vCPU、3.75 GB) type with 10GB storage capacity preferable. In the networking section, you can register your [public IP](https://www.tunnelbear.com/whats-my-ip) to enable database access from your network. Once you done all settings, submit and wait until the instance ready. \***\*PLEASE NOTE\*\***: Please stop/shutdown your instance once you done testing. You will be charged the database instance fee if you are not in the free trial period.

#### Step-3. Development Setup

1. Click **_Use Template_** to start or download the boilerplate from **Download Zip\*** button
2. Open the project in the editor
3. Run `npm install` in the project root directory
4. (Optional) For VSCode user, rename "node-gcp-graphql-boilerplate" to your project name in launch.json under .vscode. Also please remove "editor.formatOnSave": true option if you are not willing to format code on save
5. Go to [knexfile.js]() and **_replace postgres keys_** to yours. **_Run knex file for migration/seeding_** with `npm run knex:dev`
6. **_Add .env file_** in the project root directory and paste and **_replace {{???}} to your key_**

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

7. Run `npm start` to start api. It will start with http://localhost:8080
8. To test graphql query, please visit http://localhost:8080/graphql. Paste the following query and execute query by pressing ▷

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

1. Go to [cloudbuild.yaml]() and **_replace {{???}} to your keys_**

```
_GOOGLE_PROJECT_ID: '{{project-id}}'
_CLOUD_RUN_SERVICE: '{{croud-run-ervice-id]}'
_REGION: '{{region}}'
_CLOUD_SQL_INSTANCE_NAME: '{{sql-instance-name}}'
```

2. Go to [GCP console](https://console.cloud.google.com/) and select **_Cloud Build_**. Select **_Setting_** from menu and **_Enable Cloud RUN_**. Select **_Add all permissions_** option
3. Go to the project root directory and run `gcloud builds submit --config cloudbuild.yaml`

### Step-5. Setup VPN Network connector to connect PostgreSQL from Cloud Run

1. Go to [GCP console](https://console.cloud.google.com/) and select **_SQL_**. Select SQL instance and **_start editing_**
2. Turn on **_private IP_**. Enable **_Service Networking_**
3. Select **_default_** VPC and select **_Automatically assigned IP range_**. Once you submit, you will see private ip address assigned
4. Go to VPC Network. Select **_Serverless VPC Access_** from side menu. Press **_Create connector_** and complete the form. Set IP range is **_10.8.0.0_**
5. Go back to **_Cloud Run_**. Select instance and edit again
6. Select **_connection_** tab. Set **_VPC connector_** you created then **_deploy_**
7. After deploy completed, Go to **_Cloud Run_** -> Select instance -> Edit -> Environment and secret -> **_put the following environmental variables_**. Please note: **_{{host}} should be private ip address_**. Not public address.

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

1. Please setup **_firebase authentication_** ([guide](https://www.apollographql.com/docs/react/get-started/)) and **_graphql_** ([guide](https://www.apollographql.com/docs/react/get-started/)) to your FE project.
2. Once you logged in, firebase will return **_idToken_**
3. Include the **_idToken_** in apollo client and trigger me query
