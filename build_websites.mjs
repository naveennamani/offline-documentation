import { execAsync, readJson, writeJson, getBuildCommands, createArchive } from "./utils.js";
import { getBucket, uploadFile } from "./firebase-storage.mjs";

const getBuildInfo = async () => {
    // await execAsync("git clone --depth=1 -b gh-pages https://github.com/random-programming-stuff/offline-documentation");
    // return readJson("offline-documentation/build_info.json");
    return readJson("build_info.json");
};

const buildWebsite = async (website) => {
    console.log(website);
    let { name, output_dir } = website;
    let build_info = website_build_info[name] || {};
    try {
        let { stdout, stderr } = await execAsync(getBuildCommands(website, "cli"));
        if (stderr) {
            build_info.last_stderr = stderr;
            build_info.last_failure = +new Date();
        }
        console.log(stdout);
        console.log(stderr);
        const archive_path = `archives/${name}.tar.gz`;
        const remote_file_path = `${name}-${+new Date()}.tar.gz`
        await createArchive(output_dir, archive_path);
        let uploaded_file = await uploadFile(archive_path, remote_file_path);
        console.log(uploaded_file);
        build_info.last_build = +new Date();
    } catch (ex) {
        console.log(ex);
        build_info.last_error = ex;
        build_info.last_failure = +new Date();
    } finally {
        website_build_info[name] = build_info;
    }
};

const websites_data = readJson("websites.json");
let website_build_info = await getBuildInfo();

await Promise.allSettled(websites_data.map(buildWebsite));
writeJson("build_info.json", website_build_info);
