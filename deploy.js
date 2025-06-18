// deploy.js (ES module or CommonJS)
import shell from 'shelljs';
import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const git = simpleGit();

const REPO_URL = process.env.REPO_URL;
const CLONE_DIR = './project'; // or any temp directory

export default async function deploy() {
  try {
    // Check if repo is already cloned
    if (!fs.existsSync(path.join(CLONE_DIR, '.git'))) {
      console.log("📥 Cloning Git repository...");
      shell.exec(`git clone ${REPO_URL} ${CLONE_DIR}`);
    }

    // Change directory to the project
    shell.cd(CLONE_DIR);
 
    console.log("📦 Pulling latest code...");
    shell.exec('git pull origin main');

    console.log("🔧 Installing dependencies...");
    shell.exec('npm install');

    console.log("🏗️ Building Docker image...");
    const imageName = process.env.IMAGE_NAME;
 shell.exec(`docker build -t ${imageName} .`);

    console.log("📤 Pushing image to Docker Hub...");
    shell.exec(`docker push ${imageName}`);

    console.log("🐳 Deploying container...");
    shell.exec(`docker run -d -p 3000:3000 ${imageName}`);

    console.log("✅ Deployment completed!");
  } catch (error) {
    console.error("❌ Deployment failed:", error);
  }
}
