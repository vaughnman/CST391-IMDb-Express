# 📀 IMDb (Express)

The Internet Music Database, "IMDb" is a music reveiwing platform. This project is a Node.js backend service that uses an Azure-hosted MySql database. 

**📓 For common tasks such as testing or running the app in dev mode, use the npm scripts in package.json via `npm run`.**

## 🔧 Setup

### Getting started

1) Clone the repo: `git clone https://github.com/vaughnman/CST391-IMDb-Express.git`
2) Install node modules: `npm install`

### Host App Locally

Run the `dev` script via the `npm run dev` command. The console should output "Using Stub Database", meaning the server is running off an in-memory database.

### Use Live Database

To use the live database, first add your ip to the firewall whitelist at [this page](
https://portal.azure.com/#@mygcuedu6961.onmicrosoft.com/resource/subscriptions/2eeb0447-ad23-40ef-9ab1-dc2772eff1fb/resourceGroups/IMDb/providers/Microsoft.DBforMySQL/flexibleServers/imdb-database/networking).

Next, add the mysql server's databse connection string to your .env file in the project's root.

```env
DATABASE_CONNECTION_STRING="server=imdb-database.mysql.database.azure.com;uid=VBauer1;database=imdb;password=<PASSWORD HERE>;"
```

Run `npm run dev` again, and you should see that the console now outputs "Using Live Database".

## 👩‍🔬 Testing

### ✔️ Unit

Run the test script `npm test`

**The AlbumDatabase and ReviewDatabase reach out directly to the live database. The tests will be skipped if there is no connection string configured.**

### 👨‍🚀 Postman

Since this express app has matching functionality with the IMDb enterprise backend we can use the enterprise Postman suite. 

The enterprise backend can be found at this link:

https://github.com/vaughnman/CST391-IMDb

The enterprise backend's README file explains how to set up Postman. To test this repo, you will follow the same steps, but using `localhost:8000` as the url.