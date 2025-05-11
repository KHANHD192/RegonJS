/**
 * 
 * step1.js: Crawl và tải file JS về

step2.js: Format với prettier

step3.js: Gọi LinkFinder (qua child_process)

step4.js: Gọi trufflehog (qua child_process)

step5.js: Gọi semgrep
 * 
*/
const fs = require('fs');
const path = require('path');
const axios = require('axios');   
const { exec } = require('child_process'); 
const { HttpsProxyAgent } = require('https-proxy-agent')
require('dotenv').config()
let projectName = '';
// const agent = new HttpsProxyAgent('http://127.0.0.1:8080');
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let axiosInstance = axios.create({
    // httpsAgent: agent,
    headers: {

        'Cookie': process.env.COOKIE
    }
});


// STEP 1 
async function crawlAndDownloadJS(url) {
    try {
        const response = await axiosInstance.get(url);
        const jsContent = response.data;
        
        const url_object = new URL(url);
        projectName = url_object.host;
        if(!fs.existsSync('./results/'+url_object.host)){
            fs.mkdirSync('./results/'+url_object.host, { recursive: true });
        }else if(!fs.existsSync('./results/'+url_object.host+'/raw')){
            fs.mkdirSync('./results/'+url_object.host+'/raw', { recursive: true });     
        }
          // save raw js file
        const extension = url_object.pathname.includes('.js') ? 'js' : 'html';
        const rawFileName = './results/'+url_object.host+'/raw/'+url_object.pathname.replace(/\//g, '^')+'.'+extension;  
        fs.writeFileSync(rawFileName, jsContent, 'utf8');
        console.log(`Downloaded ${url}`);
    } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
    }
}

async function delay(ms) {
    //handle in case app using rate lime request per second
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function crawlAndDownloadJS_list(urls) {
    const data  =  await fs.promises.readFile(urls, 'utf-8');
    const urls_list = data.split('\n').filter(line => line.trim() !== '');
    for (const url of urls_list) {
            crawlAndDownloadJS(url);
            await delay(1000);
    }
}


// STEP 2 beautify js file
async function formatJSFile(filePath) {
    return new Promise((resolve, reject) => {
        exec(`prettier --write '${filePath}'`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error formatting file ${filePath}:`, error);
                reject(error);
            } else {
                console.log(`Formatted file: ${filePath}`);
                resolve();
            }
        });
    });
}
async function formatJSFilesInDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const filePath = path.join(directory, file);
        if (fs.statSync(filePath).isDirectory()) {
            await formatJSFilesInDirectory(filePath);
        } else if (true) {
            await formatJSFile(filePath);
        }   
    }
}

// STEP 3 execute LinkFinder
async function executeLinkFinder(filePath) {
    return new Promise((resolve, reject) => {
        // Check if the file exists
        if (!fs.existsSync('./results/'+projectName+'/endpoint')) {
            fs.mkdirSync('./results/'+projectName+'/endpoint', { recursive: true });
        }
        exec(`python3 ./LinkFinder/linkfinder.py -i "file://${filePath}" -o cli > ./results/${projectName}/endpoint/${path.basename(filePath)}.txt`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing LinkFinder on file ${filePath}:`, error);
                reject(error);
            } else {
                console.log(`LinkFinder on ${filePath}`)
		resolve(stdout);
            }
        });
    });
}

async function executeLinkFinderOnDirectory(directory) {
    const files = fs.readdirSync(directory);
    const absolutePath = path.resolve(directory);
    for (const file of files) {
        const filePath = path.join(absolutePath, file);      
        if (fs.statSync(filePath).isDirectory()) {
            await executeLinkFinderOnDirectory(filePath);
        } else if (true) {
            await executeLinkFinder(filePath);
        }   
    }
}   

// STEP 4 execute trufflehog
async function executeTruffleHog(filePath) {
    return new Promise((resolve, reject) => {
        // Check if the file exists
        if (!fs.existsSync('./results/'+projectName+'/trufflehog')) {
            fs.mkdirSync('./results/'+projectName+'/secret', { recursive: true });
        }
        exec(`trufflehog filesystem "${filePath}" --config=./generic.yml  --no-verification --include-detectors="all"   >> ./results/${projectName}/secret/secret.txt`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing trufflehog on file ${filePath}:`, error);
                reject(error);
            } else {
                console.log(`TruffleHog on ${filePath}`);
		resolve(stdout);
            }
        });
    });
}
async function executeTruffleHogOnDirectory(directory) {    
    const files = fs.readdirSync(directory);
    const absolutePath = path.resolve(directory);
    for (const file of files) {
        const filePath = path.join(absolutePath, file);      
        if (fs.statSync(filePath).isDirectory()) {
            await executeTruffleHogOnDirectory(filePath);
        } else if (true) {
            await executeTruffleHog(filePath);
        }   
    }
}
// STEP 5 execute semgrep
async function executeSemgrep(filePath) {
    return new Promise((resolve, reject) => {
        // Check if the file exists
        if (!fs.existsSync('./results/'+projectName+'/semgrep')) {
            fs.mkdirSync('./results/'+projectName+'/semgrep', { recursive: true });
        }
        exec(`semgrep --config=auto  --output ./results/${projectName}/semgrep/semgrep.txt ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing semgrep on file ${filePath}:`, error);
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}       

async function main(){
    const urls = process.argv[2];
    if(!urls){
        console.log('Please input file url');
        return;
    }
    await crawlAndDownloadJS_list(urls);
    await formatJSFilesInDirectory('./results/'+projectName+'/raw');
    await executeLinkFinderOnDirectory('./results/'+projectName+'/raw');
    await executeTruffleHogOnDirectory('./results/'+projectName+'/raw');
    await executeSemgrep('./results/'+projectName+'/raw/');
    console.log('Crawl and download JS files completed.');
}
main();
